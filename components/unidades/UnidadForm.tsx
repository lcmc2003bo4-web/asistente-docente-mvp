'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SparklesIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import { generarUnidadAprendizaje, UnidadIAResult } from '@/lib/services/AIService'
import { getUserUsage, checkAiGenerationLimit, incrementAiGeneration } from '@/lib/services/UsageService'
import UpgradeModal from '@/components/ui/UpgradeModal'
import { useContextoInstitucional } from '@/hooks/useContextoInstitucional'

type Programacion = Database['public']['Tables']['programaciones']['Row']

export interface UnidadFormData {
    titulo: string
    programacion_id: string
    duracion_semanas: number
    orden: number
    fecha_inicio?: string
    fecha_fin?: string
    competencias_seleccionadas?: Array<{ id: string; codigo: string; nombre: string; descripcion?: string }>
    ia_data?: UnidadIAResult
}

interface UnidadFormProps {
    initialData?: Partial<UnidadFormData>
    onSubmit: (data: UnidadFormData) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
    programacionId?: string
}

export default function UnidadForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    programacionId
}: UnidadFormProps) {
    const supabase = createClient()
    const router = useRouter()

    const [formData, setFormData] = useState<UnidadFormData>({
        titulo: '',
        programacion_id: programacionId || '',
        duracion_semanas: 4,
        orden: 1,
        fecha_inicio: '',
        fecha_fin: '',
    })

    const [sesionesList, setSesionesList] = useState<{ id: string, titulo: string }[]>([
        { id: '1', titulo: '' },
        { id: '2', titulo: '' }
    ])

    const [programaciones, setProgramaciones] = useState<Programacion[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [areaNombre, setAreaNombre] = useState<string>('')
    const [gradoNombre, setGradoNombre] = useState<string>('')
    const [areaId, setAreaId] = useState<string | null>(null)

    // Competencias
    const [competenciasDisponibles, setCompetenciasDisponibles] = useState<Array<{ id: string; codigo: string; nombre: string; descripcion?: string }>>([]
    )
    const [selectedCompetenciaIds, setSelectedCompetenciaIds] = useState<string[]>([])
    const [loadingCompetencias, setLoadingCompetencias] = useState(false)

    const [isGenerating, setIsGenerating] = useState(false)
    const [previewData, setPreviewData] = useState<UnidadIAResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [upgradeReason, setUpgradeReason] = useState<string | undefined>()

    // Contexto institucional para mejorar la generación de IA
    const { contextoInstitucional, contextoAula, loadContexto } = useContextoInstitucional()

    // Cargar programaciones del usuario
    useEffect(() => {
        async function loadProgramaciones() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('programaciones')
                .select('*, areas(nombre), grados(nombre, nivel, id), institucion_id, anio_escolar')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) {
                setProgramaciones(data as any)

                // Si hay programacionId preseleccionado, obtener su grado, área y nombre
                if (programacionId) {
                    const prog = data.find(p => p.id === programacionId)
                    if (prog && (prog as any).grados) {
                        setAreaNombre((prog as any).areas?.nombre || '')
                        setGradoNombre((prog as any).grados?.nombre || '')
                        const aid = (prog as any).area_id
                        setAreaId(aid)
                        if (aid) loadCompetencias(aid)

                        // Cargar contexto institucional para la programación pre-seleccionada
                        const instId = (prog as any).institucion_id
                        const anio = (prog as any).anio_escolar ?? new Date().getFullYear()
                        const gradoId = (prog as any).grados?.id

                        if (instId) {
                            loadContexto(instId, anio, gradoId)
                        } else {
                            // Fallback: programación sin institución vinculada → usar la predeterminada del usuario
                            const { data: instDefault } = await supabase
                                .from('instituciones')
                                .select('id')
                                .eq('user_id', user.id)
                                .eq('es_predeterminada', true)
                                .single()
                            if (instDefault) loadContexto(instDefault.id, anio, gradoId)
                        }
                    }
                }
            }
            setLoadingData(false)
        }
        loadProgramaciones()
    }, [programacionId, router, supabase, loadContexto])

    const loadCompetencias = async (aid: string) => {
        setLoadingCompetencias(true)
        const { data } = await supabase
            .from('competencias')
            .select('id, codigo, nombre, descripcion')
            .eq('area_id', aid)
            .order('codigo')
        setCompetenciasDisponibles((data as any) || [])
        setLoadingCompetencias(false)
    }

    const handleProgramacionChange = async (progId: string) => {
        const selectedProg = programaciones.find(p => p.id === progId)
        if (selectedProg) {
            setAreaNombre((selectedProg as any).areas?.nombre || '')
            setGradoNombre((selectedProg as any).grados?.nombre || '')
            const aid = (selectedProg as any).area_id
            setAreaId(aid)
            if (aid) loadCompetencias(aid)

            // Cargar contexto institucional
            const instId = (selectedProg as any).institucion_id
            const anio = (selectedProg as any).anio_escolar ?? new Date().getFullYear()
            const gradoId = (selectedProg as any).grados?.id

            if (instId) {
                loadContexto(instId, anio, gradoId)
            } else {
                // Fallback: programación sin institución → usar la predeterminada del usuario
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: instDefault } = await supabase
                        .from('instituciones')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('es_predeterminada', true)
                        .single()
                    if (instDefault) loadContexto(instDefault.id, anio, gradoId)
                }
            }
        } else {
            setAreaNombre('')
            setGradoNombre('')
            setAreaId(null)
            setCompetenciasDisponibles([])
        }
        setSelectedCompetenciaIds([])
        setFormData({ ...formData, programacion_id: progId })
        setPreviewData(null)
    }

    const toggleCompetencia = (id: string) => {
        setSelectedCompetenciaIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
        setPreviewData(null)
    }

    const addSesion = () => setSesionesList([...sesionesList, { id: Date.now().toString(), titulo: '' }])

    const removeSesion = (id: string) => {
        if (sesionesList.length > 1) {
            setSesionesList(sesionesList.filter(s => s.id !== id))
        }
    }

    const updateSesion = (id: string, titulo: string) => {
        setSesionesList(sesionesList.map(s => s.id === id ? { ...s, titulo } : s))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!previewData) {
            setError('Debes generar la unidad con IA antes de crearla.')
            return
        }
        await onSubmit({ ...formData, ia_data: previewData })
    }

    const handleGenerarConIA = async () => {
        if (!formData.titulo.trim()) {
            setError('Por favor ingresa un título de la unidad.')
            return
        }

        if (!gradoNombre || !areaNombre) {
            setError('Por favor selecciona primero una programación para identificar el Grado y Área.')
            return
        }

        if (selectedCompetenciaIds.length === 0) {
            setError('Por favor selecciona al menos una competencia a trabajar en esta unidad.')
            return
        }

        const sesionesNombres = sesionesList.map(s => s.titulo.trim()).filter(Boolean)
        if (sesionesNombres.length === 0) {
            setError('Por favor ingresa al menos un tema de sesión de aprendizaje.')
            return
        }

        try {
            setIsGenerating(true)
            setError(null)

            const usage = await getUserUsage()
            const limitCheck = checkAiGenerationLimit(usage)

            if (!limitCheck.allowed) {
                setUpgradeReason(limitCheck.reason)
                setUpgradeOpen(true)
                setIsGenerating(false)
                return
            }

            const competenciasParaIA = competenciasDisponibles
                .filter(c => selectedCompetenciaIds.includes(c.id))
                .map(c => `${c.codigo}: ${c.nombre}`)

            const result = await generarUnidadAprendizaje({
                titulo: formData.titulo,
                grado_nombre: gradoNombre,
                area_nombre: areaNombre,
                duracion_semanas: formData.duracion_semanas || 4,
                sesiones_list: sesionesNombres,
                competencias_seleccionadas: competenciasParaIA,
                // Contexto institucional — mejora la situación significativa
                contexto_institucional: contextoInstitucional ?? undefined,
                contexto_aula: contextoAula ?? undefined,
            })

            // Corregir posible reordenamiento de la IA
            const orderedSecuencias = sesionesNombres.map((originalTitle, index) => {
                const normalizedOriginal = originalTitle.toLowerCase().trim()

                // Buscar coincidencia parcial
                let match = result.secuencia_sesiones.find(
                    (s) => s.titulo.toLowerCase().trim().includes(normalizedOriginal) ||
                        normalizedOriginal.includes(s.titulo.toLowerCase().trim())
                )

                // Fallback por índice si la IA cambió totalmente el título
                if (!match && result.secuencia_sesiones[index]) {
                    match = result.secuencia_sesiones[index];
                }

                return match ? { ...match, titulo: originalTitle } : {
                    titulo: originalTitle,
                    desempeno_precisado: 'Desempeño inferido por contexto original.',
                    experiencia_aprendizaje: 'Actividades sugeridas para el tema indicado.'
                }
            })

            result.secuencia_sesiones = orderedSecuencias;

            setPreviewData(result)

            try {
                await incrementAiGeneration()
            } catch (err) {
                console.warn('Non-blocking error incrementing AI usage:', err)
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Error al generar la unidad con IA')
        } finally {
            setIsGenerating(false)
        }
    }

    if (loadingData) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mensaje de error general */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-md">
                        {error}
                    </div>
                )}

                {/* 1. Información Básica */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paso 1: Estructura de la Unidad</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Programación Anual *
                            </label>
                            <select
                                required
                                value={formData.programacion_id}
                                onChange={(e) => handleProgramacionChange(e.target.value)}
                                disabled={!!programacionId || !!previewData}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                            >
                                <option value="">Seleccione una programación</option>
                                {programaciones.map(prog => (
                                    <option key={prog.id} value={prog.id}>
                                        {prog.titulo} {(prog as any).curso_nombre ? `(${(prog as any).curso_nombre})` : ''} - {(prog as any).areas?.nombre} - {(prog as any).grados?.nivel}
                                    </option>
                                ))}
                            </select>
                            {programacionId && (
                                <p className="text-xs text-gray-500 mt-1">Programación preseleccionada</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título de la Unidad *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.titulo}
                                onChange={(e) => {
                                    setFormData({ ...formData, titulo: e.target.value })
                                    setPreviewData(null)
                                }}
                                disabled={!!previewData}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                placeholder="Ej: Descubriendo ecuaciones lineales en nuestra comunidad"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración (semanas) *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="16"
                                value={formData.duracion_semanas}
                                onChange={(e) => {
                                    setFormData({ ...formData, duracion_semanas: parseInt(e.target.value) || 0 })
                                    setPreviewData(null)
                                }}
                                disabled={!!previewData}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Orden *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.orden}
                                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_inicio || ''}
                                onChange={(e) => {
                                    const inicio = e.target.value
                                    const fin = formData.fecha_fin || ''
                                    let semanas = formData.duracion_semanas
                                    if (inicio && fin && inicio < fin) {
                                        const diff = Math.ceil((new Date(fin).getTime() - new Date(inicio).getTime()) / (7 * 24 * 3600 * 1000))
                                        semanas = Math.max(1, diff)
                                    }
                                    setFormData({ ...formData, fecha_inicio: inicio, duracion_semanas: semanas })
                                    setPreviewData(null)
                                }}
                                disabled={!!previewData}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Finalización
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_fin || ''}
                                onChange={(e) => {
                                    const fin = e.target.value
                                    const inicio = formData.fecha_inicio || ''
                                    let semanas = formData.duracion_semanas
                                    if (inicio && fin && inicio < fin) {
                                        const diff = Math.ceil((new Date(fin).getTime() - new Date(inicio).getTime()) / (7 * 24 * 3600 * 1000))
                                        semanas = Math.max(1, diff)
                                    }
                                    setFormData({ ...formData, fecha_fin: fin, duracion_semanas: semanas })
                                    setPreviewData(null)
                                }}
                                disabled={!!previewData}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Competencias a Trabajar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Paso 2: Competencia(s) a Trabajar</h3>
                        {selectedCompetenciaIds.length > 0 && (
                            <span className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                                {selectedCompetenciaIds.length} seleccionada{selectedCompetenciaIds.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Selecciona la(s) competencia(s) del CNEB que se trabajarán en esta unidad. La IA las usará como eje obligatorio para estructurar la Matriz, los Desempeños y la Evaluación.
                    </p>

                    {!formData.programacion_id ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <p className="text-sm text-gray-400">Selecciona una Programación Anual en el Paso 1 para ver las competencias disponibles.</p>
                        </div>
                    ) : loadingCompetencias ? (
                        <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                            <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cargando competencias...
                        </div>
                    ) : competenciasDisponibles.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <p className="text-sm text-gray-400">No se encontraron competencias para esta programación.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {competenciasDisponibles.map((comp) => {
                                const isSelected = selectedCompetenciaIds.includes(comp.id)
                                return (
                                    <button
                                        key={comp.id}
                                        type="button"
                                        onClick={() => !previewData && toggleCompetencia(comp.id)}
                                        disabled={!!previewData}
                                        className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                                    >
                                        <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {comp.codigo}
                                                </span>
                                                <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-800'
                                                    }`}>
                                                    {comp.nombre}
                                                </span>
                                            </div>
                                            {comp.descripcion && (
                                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                                    {comp.descripcion}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* 3. Sesiones Constructor */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Paso 3: Temáticas de las Sesiones</h3>
                        <div className="text-sm text-gray-500 bg-indigo-50 px-3 py-1 rounded-full">
                            {sesionesList.length} sesiones
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Lista el título o tema principal que abarcará cada sesión. La Inteligencia Artificial determinará el desempeño específico, propósito y construirá la secuencia.
                    </p>

                    <div className="space-y-3 mb-4">
                        {sesionesList.map((sesion, index) => (
                            <div key={sesion.id} className="flex gap-2">
                                <div className="flex-none bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center w-10 font-bold">
                                    {index + 1}
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={sesion.titulo}
                                    onChange={(e) => {
                                        updateSesion(sesion.id, e.target.value)
                                        setPreviewData(null)
                                    }}
                                    disabled={!!previewData}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                    placeholder="..."
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSesion(sesion.id)}
                                    disabled={sesionesList.length <= 1 || !!previewData}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {!previewData && (
                        <button
                            type="button"
                            onClick={addSesion}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Añadir sesión
                        </button>
                    )}
                </div>

                {/* Botón de Generación */}
                {!previewData && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 text-center">
                        <h4 className="font-semibold text-indigo-900 mb-2">¡Magia de la IA!</h4>
                        <p className="text-sm text-indigo-700 mb-4 max-w-2xl mx-auto">
                            Al hacer clic, la IA relacionará los títulos de las sesiones, seleccionará las competencias correspondientes del diseño curricular nacional (MINEDU), y redactará toda la estructura pedagógica invertida en segundos.
                        </p>
                        {/* Estado del contexto institucional */}
                        {(() => {
                            if (contextoInstitucional) {
                                const lugar = contextoInstitucional.distrito || contextoInstitucional.region || contextoInstitucional.nombre_institucion
                                return (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-3">
                                        <span>✓</span>
                                        Contexto de {lugar} activo — la situación será específica a tu comunidad
                                    </div>
                                )
                            }
                            if (formData.programacion_id) {
                                // Programación seleccionada pero sin contexto cargado → advertencia suave
                                return (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium mb-3">
                                        <span>⚠</span>
                                        Sin contexto institucional — la unidad será genérica. Completa el perfil en Configuración → Mis Instituciones.
                                    </div>
                                )
                            }
                            return null
                        })()}
                        <button
                            type="button"
                            onClick={handleGenerarConIA}
                            disabled={isGenerating || !formData.programacion_id || !formData.titulo}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Construyendo Estructura...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="-ml-1 mr-2 h-6 w-6" aria-hidden="true" />
                                    Estructurar Unidad Completa con IA
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Vista Previa generada */}
                {previewData && (
                    <div className="bg-emerald-50/50 rounded-xl border-2 border-emerald-200 overflow-hidden">
                        {/* Preview header */}
                        <div className="bg-emerald-700 px-6 py-3 text-white flex justify-between items-center">
                            <h3 className="font-semibold flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5" />
                                Vista Previa de la Unidad Generada
                            </h3>
                            <button
                                type="button"
                                onClick={() => setPreviewData(null)}
                                className="text-xs bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md transition-colors"
                            >
                                Editar Parámetros
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* I. Situación Significativa */}
                            <div>
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">I. Situación Significativa</h4>
                                <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-3">
                                    {(() => {
                                        const raw = previewData.situacion_significativa || ''
                                        const bloques = [
                                            { label: 'CONTEXTO', pattern: /CONTEXTO/ },
                                            { label: 'EXPLORACIÓN', pattern: /EXPLORACI[OÓ]N/ },
                                            { label: 'RETO', pattern: /RETO/ },
                                            { label: 'PROPÓSITO', pattern: /PROP[OÓ]SITO/ },
                                        ]
                                        const parsed: { label: string; content: string }[] = []
                                        for (let i = 0; i < bloques.length; i++) {
                                            const current = bloques[i].pattern
                                            const next = i + 1 < bloques.length ? bloques[i + 1].pattern : null
                                            const rex = new RegExp(
                                                `${current.source}[:\\s]*([\\s\\S]*?)${next ? `(?=${next.source})` : '$'}`,
                                                'i'
                                            )
                                            const m = raw.match(rex)
                                            if (m && m[1].trim()) {
                                                parsed.push({ label: bloques[i].label, content: m[1].trim() })
                                            }
                                        }
                                        if (parsed.length === 0) {
                                            return <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{raw}</p>
                                        }
                                        return parsed.map(({ label, content }) => (
                                            <div key={label}>
                                                <p className="text-xs font-bold text-emerald-700 mb-1">{label}</p>
                                                <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
                                            </div>
                                        ))
                                    })()}
                                </div>
                            </div>

                            {/* II. Propósitos de Aprendizaje */}
                            <div>
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">II. Propósitos de Aprendizaje</h4>
                                <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-emerald-100 leading-relaxed">
                                    {previewData.proposito_aprendizaje}
                                </p>
                            </div>

                            {/* II. Matriz CNEB — paired rows */}
                            <div>
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">II. Propósitos — Matriz CNEB</h4>
                                <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                                    <table className="min-w-full text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-emerald-700 text-white">
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[22%] border-r border-emerald-600">Competencia</th>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[28%] border-r border-emerald-600">Capacidades</th>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[50%]">Desempeños Contextualizados</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(previewData.matrices_ia ?? (previewData.matriz_ia ? [previewData.matriz_ia] : [])).map((m, idx) => {
                                                const caps: string[] = m.capacidades || []
                                                const dess: string[] = m.desempenos_contextualizados || []
                                                const maxRows = Math.max(caps.length, dess.length, 1)
                                                const bgGroup = idx % 2 === 0 ? '' : 'bg-emerald-50/40'
                                                return (
                                                    <tr key={idx} className={`border-b-2 border-emerald-200 ${bgGroup}`}>
                                                        <td className={`px-4 py-3 font-semibold text-emerald-800 text-center align-middle border-r border-emerald-100 ${bgGroup}`}
                                                            style={{ verticalAlign: 'middle' }}>
                                                            {m.competencia}
                                                        </td>
                                                        <td className="p-0 align-top" colSpan={2}>
                                                            <table className="min-w-full">
                                                                <tbody>
                                                                    {Array.from({ length: maxRows }).map((_, i) => (
                                                                        <tr key={i} className={i < maxRows - 1 ? 'border-b border-emerald-50' : ''}>
                                                                            <td className="px-4 py-2 align-top w-[36%] border-r border-emerald-50 text-slate-700">
                                                                                {caps[i] && (
                                                                                    <span className="flex items-start gap-1.5">
                                                                                        <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                                                        {caps[i]}
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-2 align-top w-[64%] text-slate-600 leading-relaxed">
                                                                                {dess[i] && (
                                                                                    <span className="flex items-start gap-1.5">
                                                                                        <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                                                                                        {dess[i]}
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* III. Secuencia de Sesiones */}
                            <div>
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">III. Secuencia de Sesiones</h4>
                                <div className="space-y-2">
                                    {previewData.secuencia_sesiones?.map((s, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl border border-emerald-100 flex gap-4">
                                            <div className="bg-emerald-100 text-emerald-800 rounded-lg w-9 h-9 flex flex-shrink-0 items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-sm mb-1">{s.titulo}</p>
                                                <p className="text-xs text-slate-600 mb-1"><span className="font-semibold text-slate-700">Desempeño: </span>{s.desempeno_precisado}</p>
                                                <p className="text-xs text-slate-500"><span className="font-semibold text-slate-600">Experiencia: </span>{s.experiencia_aprendizaje}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* IV. Enfoques Transversales */}
                            <div>
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">IV. Enfoques Transversales</h4>
                                <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                                    <table className="min-w-full text-xs">
                                        <thead className="bg-emerald-700 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[22%]">Enfoque</th>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[22%]">Valor</th>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[56%]">Actitudes Observables</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-50">
                                            {previewData.enfoques_transversales?.map((enf, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'}>
                                                    <td className="px-4 py-3 font-medium text-emerald-800 align-top">{enf.enfoque}</td>
                                                    <td className="px-4 py-3 italic text-slate-500 align-top">{enf.valor}</td>
                                                    <td className="px-4 py-3 text-slate-700 align-top leading-relaxed">{enf.actitudes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* V. Evaluación */}
                            <div>
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">V. Evaluación de la Unidad</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Evidencia Principal</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">{previewData.evaluacion?.evidencias}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Criterios de Éxito</p>
                                        <ul className="space-y-1">
                                            {previewData.evaluacion?.criterios?.map((c, i) => (
                                                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Instrumento</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">{previewData.evaluacion?.instrumento}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones de Acción Finales */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !previewData}
                        className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                        {isLoading ? 'Guardando toda la Estructura...' : 'Guardar Unidad y Sesiones'}
                    </button>
                </div>
            </form>

            <UpgradeModal
                isOpen={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
                reason={upgradeReason}
            />
        </>
    )
}

