'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sesionService, type DesempenoDisponible, type SecuenciaData } from '@/lib/services/SesionService'
import { generarSecuenciaSesion } from '@/lib/services/AIService'
import { getUserUsage, checkAiGenerationLimit, incrementAiGeneration } from '@/lib/services/UsageService'
import SecuenciaBuilder from './SecuenciaBuilder'
import SesionPreviewTables from './SesionPreviewTables'
import EditableSesionTables from './EditableSesionTables'
import UpgradeModal from '@/components/ui/UpgradeModal'

interface SesionWizardProps {
    unidadId?: string
    initialData?: any
    onSubmit: (data: SesionFormData) => Promise<void>
    onSaveDraft?: (data: SesionFormData) => Promise<void>
    onCancel: () => void
}

export interface SesionFormData {
    titulo: string
    unidad_id: string
    duracion_minutos: number
    fecha: string
    proposito: string
    desempenos_ids: string[]
    secuencias: SecuenciaData[]
    contenido_ia?: any
    recursos_extra?: string
    contexto_extra?: string
    // Per-section dates (populated when programacion has secciones)
    fechas_seccion?: Record<string, string>
}

const StepIconBasic = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)
const StepIconSecuencia = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const StepIconRevision = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const ALL_STEPS = [
    { id: 1, title: 'Información Básica', icon: <StepIconBasic /> },
    { id: 2, title: 'Secuencia Didáctica', icon: <StepIconSecuencia /> },
    { id: 3, title: 'Revisión', icon: <StepIconRevision /> }
]

export default function SesionWizard({
    unidadId,
    initialData,
    onSubmit,
    onSaveDraft,
    onCancel
}: SesionWizardProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState<SesionFormData>({
        titulo: initialData?.titulo || '',
        unidad_id: initialData?.unidad_id || unidadId || '',
        duracion_minutos: initialData?.duracion_minutos || 90,
        fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
        proposito: initialData?.proposito || initialData?.proposito_aprendizaje || '',
        desempenos_ids: initialData?.desempenos_ids || [],
        secuencias: initialData?.secuencias || [],
        contenido_ia: initialData?.contenido_ia || initialData?.contenido_ia || null,
        recursos_extra: '',
        contexto_extra: '',
        fechas_seccion: initialData?.fechas_seccion || {}
    })

    const activeSteps = ALL_STEPS

    const [unidades, setUnidades] = useState<any[]>([])
    const [secciones, setSecciones] = useState<string[]>([])
    const [loadingSecciones, setLoadingSecciones] = useState(false)
    const [desempenosDisponibles, setDesempenosDisponibles] = useState<DesempenoDisponible[]>([])
    const [loadingDesempenos, setLoadingDesempenos] = useState(false)
    const [loadingIA, setLoadingIA] = useState(false)
    const [iaError, setIaError] = useState<string | null>(null)
    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [upgradeReason, setUpgradeReason] = useState<string | undefined>()

    const supabase = createClient()

    // Cargar unidades
    useEffect(() => {
        async function loadUnidades() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('unidades')
                .select(`
          *,
          programaciones(
            id,
            titulo,
            areas(nombre),
            grados(nombre, nivel)
          )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            setUnidades(data || [])
        }
        loadUnidades()
    }, [])

    // Cargar desempeños cuando cambia la unidad
    useEffect(() => {
        async function loadDesempenos() {
            if (!formData.unidad_id) {
                setDesempenosDisponibles([])
                return
            }

            setLoadingDesempenos(true)
            try {
                const desempenos = await sesionService.getAvailableDesempenos(formData.unidad_id)
                setDesempenosDisponibles(desempenos)
            } catch (error) {
                console.error('Error loading desempeños:', error)
            } finally {
                setLoadingDesempenos(false)
            }
        }
        loadDesempenos()
    }, [formData.unidad_id])

    // Cargar secciones de la programación cuando cambia la unidad
    useEffect(() => {
        async function loadSecciones() {
            if (!formData.unidad_id) { setSecciones([]); return }
            setLoadingSecciones(true)
            try {
                const unidad = unidades.find(u => u.id === formData.unidad_id)
                const progId = unidad?.programaciones?.id
                if (!progId) { setSecciones([]); return }
                const { data } = await supabase
                    .from('programaciones')
                    .select('secciones')
                    .eq('id', progId)
                    .single()
                const sec: string[] = (data as any)?.secciones || []
                setSecciones(sec)
                // Pre-fill dates map with empty strings for new sections
                if (sec.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        fechas_seccion: sec.reduce((acc, s) => ({
                            ...acc,
                            [s]: prev.fechas_seccion?.[s] || ''
                        }), {} as Record<string, string>)
                    }))
                }
            } catch (err) {
                console.error('Error loading secciones:', err)
            } finally {
                setLoadingSecciones(false)
            }
        }
        if (unidades.length > 0) loadSecciones()
    }, [formData.unidad_id, unidades])

    // Validación por paso
    const canProceed = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(formData.titulo && formData.unidad_id && formData.duracion_minutos >= 30)
            case 2:
                const hasInicio = formData.secuencias.some(s => s.momento === 'Inicio')
                const hasDesarrollo = formData.secuencias.some(s => s.momento === 'Desarrollo')
                const hasCierre = formData.secuencias.some(s => s.momento === 'Cierre')
                const tiempoTotal = formData.secuencias.reduce((sum, s) => sum + s.tiempo_minutos, 0)
                return hasInicio && hasDesarrollo && hasCierre && tiempoTotal === formData.duracion_minutos
            case 3:
                return true
            default:
                return false
        }
    }

    const handleNext = () => {
        if (canProceed(currentStep)) {
            const currentIndex = activeSteps.findIndex(s => s.id === currentStep)
            if (currentIndex < activeSteps.length - 1) {
                setCurrentStep(activeSteps[currentIndex + 1].id)
            }
        }
    }

    const handleBack = () => {
        const currentIndex = activeSteps.findIndex(s => s.id === currentStep)
        if (currentIndex > 0) {
            setCurrentStep(activeSteps[currentIndex - 1].id)
        }
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            await onSubmit(formData)
        } catch (error) {
            console.error('Error submitting:', error)
            alert('Error al guardar la sesión')
        } finally {
            setSubmitting(false)
        }
    }

    const selectedUnidad = unidades.find(u => u.id === formData.unidad_id)

    // Generar secuencia didáctica con Gemini
    const handleGenerarConIA = async () => {
        if (!formData.titulo || !formData.unidad_id) {
            setIaError('Completa el título y selecciona unidad (Paso 1) antes de generar con IA.')
            return
        }
        // ── Check AI generation limit ──
        try {
            const usage = await getUserUsage()
            const limitCheck = checkAiGenerationLimit(usage)
            if (!limitCheck.allowed) {
                setUpgradeReason(limitCheck.reason)
                setUpgradeOpen(true)
                return
            }
        } catch {
            // If limit check fails, allow the generation to proceed
        }
        setIaError(null)
        setLoadingIA(true)
        try {
            const prog = selectedUnidad?.programaciones
            const matrizData = selectedUnidad?.matriz_ia
            const fallbackDesempenos = Array.isArray(matrizData)
                ? (matrizData as any[]).flatMap((m: any) => m.desempenos_contextualizados ?? []).join(' | ')
                : (matrizData as any)?.desempenos_contextualizados?.join(' | ') || ''
            const finalDesempeno = formData.proposito || fallbackDesempenos || 'Desempeños propios del área y grado'

            const result = await generarSecuenciaSesion({
                titulo_sesion: formData.titulo,
                desempenos: finalDesempeno,
                experiencia_aprendizaje: initialData?.evidencias_aprendizaje || '',
                unidad_titulo: selectedUnidad?.titulo || 'Desconocida',
                situacion_significativa: selectedUnidad?.situacion_significativa,
                matriz_ia: selectedUnidad?.matriz_ia,
                enfoques_transversales: selectedUnidad?.enfoques_transversales,
                area_nombre: prog?.areas?.nombre ?? 'General',
                grado_nombre: prog?.grados?.nombre ?? '',
                nivel: prog?.grados?.nivel ?? '',
                duracion_minutos: formData.duracion_minutos,
                recursos_extra: formData.recursos_extra,
                contexto_extra: formData.contexto_extra
            })

            // Mapear respuesta Gemini → SecuenciaData
            const secuencias: SecuenciaData[] = result.secuencia_didactica.map((s, idx) => ({
                momento: s.fase,
                actividad: s.actividades.map((a: any) => `**${a.titulo}** (${a.tiempo_sugerido}):\n${a.descripcion}`).join('\n\n'),
                tiempo_minutos: s.tiempo_total,
                recursos: s.recursos?.join(', ') ?? '',
                orden: idx + 1,
            }))

            if (result.evaluacion) {
                let evalText = ''
                if (result.evaluacion.aprendizajes?.length > 0) {
                    evalText += '🎯 EVALUACIÓN DE APRENDIZAJES:\n' + result.evaluacion.aprendizajes.map(e => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                }
                if (result.evaluacion.actitudes?.length > 0) {
                    evalText += '🌟 ACTITUDES:\n' + result.evaluacion.actitudes.map(e => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                }

                const evalSummary = evalText.trim()

                const cierreIndex = secuencias.findIndex(s => s.momento === 'Cierre')
                if (cierreIndex !== -1 && evalSummary) {
                    secuencias[cierreIndex].actividad += `\n\n${evalSummary}`
                }
            }

            setFormData(prev => ({
                ...prev,
                secuencias,
                contenido_ia: result
            }))
            // Increment AI generation usage counter
            try { await incrementAiGeneration() } catch { /* non-blocking */ }
        } catch (err: any) {
            setIaError(err.message ?? 'Error al conectar con la IA')
        } finally {
            setLoadingIA(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Upgrade modal for AI limit */}
            <UpgradeModal
                isOpen={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
                reason={upgradeReason}
            />
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {activeSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold transition ${currentStep >= step.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {currentStep > step.id ? '✓' : step.icon}
                                </div>
                                <div className="mt-2 text-center">
                                    <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </div>
                                </div>
                            </div>
                            {index < activeSteps.length - 1 && (
                                <div
                                    className={`h-1 flex-1 mx-2 transition ${currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {/* Step 1: Información Básica */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Información Básica
                            </h2>
                            <p className="text-gray-600">
                                Define los datos generales de la sesión de aprendizaje
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unidad Didáctica *
                            </label>
                            <select
                                required
                                value={formData.unidad_id}
                                onChange={(e) => setFormData({ ...formData, unidad_id: e.target.value, desempenos_ids: [] })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Selecciona una unidad...</option>
                                {unidades.map((unidad) => (
                                    <option key={unidad.id} value={unidad.id}>
                                        {unidad.titulo} - {unidad.programaciones?.areas?.nombre} - {unidad.programaciones?.grados?.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de la Sesión *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ej: Conocemos las fracciones equivalentes"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duración (minutos) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="30"
                                    max="180"
                                    value={formData.duracion_minutos || ''}
                                    onChange={(e) => setFormData({ ...formData, duracion_minutos: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Mínimo 30 minutos</p>
                            </div>

                            {/* Single date (only shown when no secciones) */}
                            {secciones.length === 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.fecha}
                                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Per-section dates (shown when programacion has secciones) */}
                        {secciones.length > 0 && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-semibold text-indigo-800">Fechas por Sección</span>
                                    <span className="text-xs text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
                                        {secciones.length} {secciones.length === 1 ? 'sección' : 'secciones'}
                                    </span>
                                </div>
                                {loadingSecciones ? (
                                    <div className="space-y-2">
                                        {[1, 2].map(i => <div key={i} className="h-10 bg-indigo-100 rounded-lg animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {secciones.map(sec => (
                                            <div key={sec} className="flex items-center gap-2">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                                                    bg-indigo-600 text-white text-sm font-bold flex-shrink-0">
                                                    {sec}
                                                </span>
                                                <div className="flex-1">
                                                    <label className="text-xs text-indigo-700 font-medium block mb-0.5">
                                                        Sección {sec}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.fechas_seccion?.[sec] || ''}
                                                        onChange={e => setFormData(prev => ({
                                                            ...prev,
                                                            fechas_seccion: { ...prev.fechas_seccion, [sec]: e.target.value }
                                                        }))}
                                                        className="w-full px-2 py-1.5 border border-indigo-200 rounded-lg bg-white
                                                            text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-indigo-500 mt-2">
                                    Cada sección aparecerá como fila separada en el Planificador Mensual.
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Propósito de la Sesión
                            </label>

                            {desempenosDisponibles.length > 0 && (
                                <div className="mb-3 space-y-2">
                                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Desempeños Seleccionados en la Unidad:</span>
                                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {desempenosDisponibles.map(dp => (
                                            <button
                                                key={dp.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, proposito: prev.proposito ? `${prev.proposito}\n${dp.descripcion}` : dp.descripcion }))}
                                                className="text-left text-sm p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors text-indigo-900"
                                            >
                                                {dp.descripcion}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Haz clic en un desempeño para agregarlo al propósito.</p>
                                </div>
                            )}

                            <textarea
                                value={formData.proposito}
                                onChange={(e) => setFormData({ ...formData, proposito: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Describe el propósito de aprendizaje de esta sesión..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                            <div className="md:col-span-2">
                                <h3 className="text-sm font-bold text-indigo-900 mb-1"> Contextualización para la IA (Opcional)</h3>
                                <p className="text-xs text-indigo-700 mb-3">La sesión heredará el propósito, la situación significativa y enfoques de la Unidad Didáctica.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recursos Particulares
                                </label>
                                <textarea
                                    value={formData.recursos_extra || ''}
                                    onChange={(e) => setFormData({ ...formData, recursos_extra: e.target.value })}
                                    rows={2}
                                    placeholder="Ej: Uso de regletas, visita al patio..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contexto Especial
                                </label>
                                <textarea
                                    value={formData.contexto_extra || ''}
                                    onChange={(e) => setFormData({ ...formData, contexto_extra: e.target.value })}
                                    rows={2}
                                    placeholder="Ej: Los niños vienen de un simulacro..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Secuencia Didáctica */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Secuencia Didáctica
                                </h2>
                                <p className="text-gray-600">
                                    Diseña la secuencia de actividades: Inicio, Desarrollo y Cierre
                                </p>
                            </div>
                            {/* Botón IA */}
                            <button
                                type="button"
                                onClick={handleGenerarConIA}
                                disabled={loadingIA}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loadingIA ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Generando...
                                    </>
                                ) : (
                                    <>✨ Generar con IA</>
                                )}
                            </button>
                        </div>

                        {/* Error IA */}
                        {iaError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                ⚠️ {iaError}
                            </div>
                        )}

                        {/* Aviso si se generó con IA */}
                        {formData.secuencias.length > 0 && !loadingIA && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-sm text-emerald-800">
                                <span className="text-base">✨</span>
                                <span>
                                    <span className="font-semibold">Asistente Normativo Docente</span>
                                    {' '}ha estructurado la secuencia según los lineamientos del CNEB.
                                </span>
                            </div>
                        )}

                        {formData.contenido_ia ? (
                            <div className="mt-8 relative">
                                <EditableSesionTables
                                    data={formData.contenido_ia}
                                    onChange={(newData) => {
                                        const secuencias: SecuenciaData[] = newData.secuencia_didactica.map((s: any, idx: number) => ({
                                            momento: s.fase,
                                            actividad: s.actividades.map((a: any) => `**${a.titulo}** (${a.tiempo_sugerido}):\n${a.descripcion}`).join('\n\n'),
                                            tiempo_minutos: s.tiempo_total,
                                            recursos: s.recursos?.join(', ') ?? '',
                                            orden: idx + 1,
                                        }))

                                        if (newData.evaluacion) {
                                            let evalText = ''
                                            if (newData.evaluacion.aprendizajes?.length > 0) {
                                                evalText += '🎯 EVALUACIÓN DE APRENDIZAJES:\n' + newData.evaluacion.aprendizajes.map((e: any) => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                                            }
                                            if (newData.evaluacion.actitudes?.length > 0) {
                                                evalText += '🌟 ACTITUDES:\n' + newData.evaluacion.actitudes.map((e: any) => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                                            }
                                            const evalSummary = evalText.trim()
                                            const cierreIndex = secuencias.findIndex(s => s.momento === 'Cierre')
                                            if (cierreIndex !== -1 && evalSummary) {
                                                secuencias[cierreIndex].actividad += `\n\n${evalSummary}`
                                            }
                                        }

                                        setFormData(prev => ({
                                            ...prev,
                                            secuencias,
                                            contenido_ia: newData
                                        }))
                                    }}
                                />
                            </div>
                        ) : (
                            <SecuenciaBuilder
                                duracionTotal={formData.duracion_minutos}
                                onChange={(secuencias) => setFormData({ ...formData, secuencias })}
                                initialSecuencias={formData.secuencias}
                            />
                        )}
                    </div>
                )}

                {/* Step 3: Revisión */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Revisión Final
                            </h2>
                            <p className="text-gray-600">
                                Revisa todos los datos antes de guardar
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Información Básica */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">📝 Información Básica</h3>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Título:</strong> {formData.titulo}</div>
                                    <div><strong>Unidad:</strong> {selectedUnidad?.titulo}</div>
                                    <div><strong>Duración:</strong> {formData.duracion_minutos} minutos</div>
                                    <div><strong>Fecha:</strong> {new Date(formData.fecha).toLocaleDateString('es-PE')}</div>
                                    {formData.proposito && (
                                        <div><strong>Propósito:</strong> {formData.proposito}</div>
                                    )}
                                </div>
                            </div>

                            {/* Secuencia y Evaluacion */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    📚 Contenido de la Sesión
                                </h3>
                                {formData.contenido_ia ? (
                                    <div className="pointer-events-none">
                                        <SesionPreviewTables data={formData.contenido_ia} />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {['Inicio', 'Desarrollo', 'Cierre'].map(momento => {
                                            const secs = formData.secuencias.filter(s => s.momento === momento)
                                            const tiempo = secs.reduce((sum, s) => sum + s.tiempo_minutos, 0)
                                            return (
                                                <div key={momento}>
                                                    <div className="font-medium text-sm text-gray-700 mb-1">
                                                        {momento} ({tiempo} min)
                                                    </div>
                                                    <div className="space-y-1 pl-4">
                                                        {secs.map((s, i) => (
                                                            <div key={i} className="text-sm text-gray-600">
                                                                • {s.actividad} ({s.tiempo_minutos} min)
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <div>
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                ← Anterior
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>

                        {onSaveDraft && (
                            <button
                                onClick={async () => {
                                    setSubmitting(true)
                                    try {
                                        await onSaveDraft(formData)
                                    } catch (error) {
                                        console.error(error)
                                    } finally {
                                        setSubmitting(false)
                                    }
                                }}
                                disabled={submitting}
                                className="px-6 py-2 text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-100 transition disabled:opacity-50"
                            >
                                Guardar Avance
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed(currentStep)}
                                className={`px-6 py-2 rounded-lg font-medium transition ${canProceed(currentStep)
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Siguiente →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Guardando...' : '✓ Guardar Sesión'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
