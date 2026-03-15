'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SparklesIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import { generarUnidadAprendizaje, UnidadIAResult, ActividadSecuencia } from '@/lib/services/AIService'
import { getUserUsage, checkAiGenerationLimit, incrementAiGeneration } from '@/lib/services/UsageService'
import UpgradeModal from '@/components/ui/UpgradeModal'
import { useContextoInstitucional } from '@/hooks/useContextoInstitucional'
import { institucionService } from '@/lib/services/InstitucionService'
import { unidadesInstitucionalesService, UnidadInstitucional } from '@/lib/services/UnidadesInstitucionalesService'

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

    // Estado para colegios públicos — Paso 3: Secuencia de Actividades
    const makeActividad = (): ActividadSecuencia => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        titulo: '',
        campo_tematico: '',
        desempeno_precisado: '',
        tiempo_estimado: '90'
    })
    const [actividadesList, setActividadesList] = useState<ActividadSecuencia[]>([
        makeActividad(), makeActividad()
    ])


    const [programaciones, setProgramaciones] = useState<Programacion[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [areaNombre, setAreaNombre] = useState<string>('')
    const [gradoNombre, setGradoNombre] = useState<string>('')
    const [areaId, setAreaId] = useState<string | null>(null)

    // Competencias
    const [competenciasDisponibles, setCompetenciasDisponibles] = useState<Array<{ id: string; codigo: string; nombre: string; descripcion?: string; isTransversal?: boolean }>>([]
    )
    const [selectedCompetenciaIds, setSelectedCompetenciaIds] = useState<string[]>([])
    const [loadingCompetencias, setLoadingCompetencias] = useState(false)

    const [isGenerating, setIsGenerating] = useState(false)
    const [previewData, setPreviewData] = useState<UnidadIAResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [upgradeReason, setUpgradeReason] = useState<string | undefined>()

    // Contexto institucional para mejorar la generación de IA
    const { contextoInstitucional, contextoAula, isPrivado, tipoGestion, loadContexto } = useContextoInstitucional()
    const [unidadesInstitucionales, setUnidadesInstitucionales] = useState<UnidadInstitucional[]>([])
    const [usarPlanInstitucional, setUsarPlanInstitucional] = useState(false)
    const [selectedUnidadInstitucionalId, setSelectedUnidadInstitucionalId] = useState('')

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
                .select('*, areas(nombre), grados(nombre, nivel, id, ciclo), institucion_id, anio_escolar')
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
                        const gid = (prog as any).grados?.id
                        setAreaId(aid)
                        if (aid) loadCompetencias(aid, gid)


                        // Cargar contexto institucional para la programación pre-seleccionada
                        const instId = (prog as any).institucion_id
                        const anio = (prog as any).anio_escolar ?? new Date().getFullYear()
                        const gradoId = (prog as any).grados?.id

                        if (instId) {
                            loadContexto(instId, anio, gradoId)
                            unidadesInstitucionalesService.listByInstitucionAndGrado(instId, gradoId).then(uds => {
                                setUnidadesInstitucionales(uds)
                                // Si la institución es privada y tiene plan, activar automáticamente
                                // (se detectará en el render con isPrivado)
                            })
                        } else {
                            // Fallback: programación sin institución vinculada → usar la predeterminada del usuario (propios o globales)
                            const all = await institucionService.listAll(user.id)
                            const def = all.find(i => i.es_predeterminada)
                            if (def) {
                                loadContexto(def.id, anio, gradoId)
                                unidadesInstitucionalesService.listByInstitucionAndGrado(def.id, gradoId).then(setUnidadesInstitucionales)
                            }
                        }
                    }
                }
            }
            setLoadingData(false)
        }
        loadProgramaciones()
    }, [programacionId, router, supabase, loadContexto])


    const loadCompetencias = async (aid: string, gradoId?: string) => {
        setLoadingCompetencias(true)
        
        let areaData: any[] = []
        
        if (gradoId) {
            const { data } = await supabase
                .from('competencias')
                .select(`
                    id, codigo, nombre, descripcion,
                    capacidades!inner(
                        desempenos!inner(id)
                    )
                `)
                .eq('area_id', aid)
                .eq('capacidades.desempenos.grado_id', gradoId)
                
            if (data) {
                // Deduplicate and sort
                const unique = Array.from(new Map((data as any[]).map(item => [item.id, item])).values());
                unique.sort((a: any, b: any) => (a.codigo || '').localeCompare(b.codigo || ''));
                areaData = unique;
            }
        } else {
            const { data } = await supabase
                .from('competencias')
                .select('id, codigo, nombre, descripcion')
                .eq('area_id', aid)
                .order('codigo')
            areaData = data || []
        }
            
        const { data: transArea } = await supabase
            .from('areas')
            .select('id')
            .eq('nombre', 'Competencias Transversales')
            .single()
            
        let transData: any[] = []
        if (transArea) {
            const { data } = await supabase
                .from('competencias')
                .select('id, codigo, nombre, descripcion')
                .eq('area_id', transArea.id)
                .order('codigo')
            transData = data || []
        }
        
        const formattedArea = areaData.map((c: any) => ({ 
            id: c.id, 
            codigo: c.codigo, 
            nombre: c.nombre, 
            descripcion: c.descripcion, 
            isTransversal: false 
        }))
        const formattedTrans = transData.map((c: any) => ({ ...c, isTransversal: true }))
        
        setCompetenciasDisponibles([...formattedArea, ...formattedTrans] as any)
        setLoadingCompetencias(false)
    }

    const handleProgramacionChange = async (progId: string) => {
        const selectedProg = programaciones.find(p => p.id === progId)
        if (selectedProg) {
            setAreaNombre((selectedProg as any).areas?.nombre || '')
            setGradoNombre((selectedProg as any).grados?.nombre || '')
            const aid = (selectedProg as any).area_id
            const gid = (selectedProg as any).grados?.id
            setAreaId(aid)
            if (aid) loadCompetencias(aid, gid)


            // Cargar contexto institucional
            const instId = (selectedProg as any).institucion_id
            const anio = (selectedProg as any).anio_escolar ?? new Date().getFullYear()
            const gradoId = (selectedProg as any).grados?.id

            if (instId) {
                loadContexto(instId, anio, gradoId)
                unidadesInstitucionalesService.listByInstitucionAndGrado(instId, gradoId).then(setUnidadesInstitucionales)
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
                    if (instDefault) {
                        loadContexto(instDefault.id, anio, gradoId)
                        unidadesInstitucionalesService.listByInstitucionAndGrado(instDefault.id, gradoId).then(setUnidadesInstitucionales)
                    }
                }
            }
        } else {
            setAreaNombre('')
            setGradoNombre('')
            setAreaId(null)
            setCompetenciasDisponibles([])
            setUnidadesInstitucionales([])
        }
        setSelectedCompetenciaIds([])
        setFormData({ ...formData, programacion_id: progId })
        setPreviewData(null)
        setUsarPlanInstitucional(false)
        setSelectedUnidadInstitucionalId('')
    }

    const handleUnidadInstitucionalSelect = (uid: string) => {
        setSelectedUnidadInstitucionalId(uid)
        if (uid) {
            const ui = unidadesInstitucionales.find(u => u.id === uid)
            if (ui) {
                setFormData(prev => ({ ...prev, titulo: ui.titulo }))
                setPreviewData(null)
            }
        } else {
            // Si es privado no permitimos desmarcar el plan
            if (!isPrivado) {
                setPreviewData(null)
            }
        }
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

    // ─── CRUD Actividades (colegios públicos) ────────────────────────────────
    const addActividad = () => setActividadesList(prev => [...prev, makeActividad()])
    const removeActividad = (id: string) => setActividadesList(prev => prev.filter(a => a.id !== id))
    const updateActividad = (id: string, field: keyof ActividadSecuencia, value: string) =>
        setActividadesList(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))

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

        // ── Validación bifurcada según tipo de institución ──────────────────
        let sesionesNombres: string[] = []
        let actividadesParaIA: ActividadSecuencia[] = []

        if (!isPrivado) {
            // Colegio PÚBLICO → valida actividades de la secuencia
            actividadesParaIA = actividadesList.filter(
                a => a.titulo.trim() && a.campo_tematico.trim()
            )
            if (actividadesParaIA.length === 0) {
                setError('Por favor ingresa al menos una actividad con título y campo temático.')
                return
            }
        } else {
            // Colegio PRIVADO → valida temáticas de sesiones
            sesionesNombres = sesionesList.map(s => s.titulo.trim()).filter(Boolean)
            if (sesionesNombres.length === 0) {
                setError('Por favor ingresa al menos un tema de sesión de aprendizaje.')
                return
            }
            // Si tiene plan anual, obligar a seleccionar unidad institucional
            if (unidadesInstitucionales.length > 0 && !selectedUnidadInstitucionalId) {
                setError('Tu institución tiene un Plan Anual Institucional definido. Por favor selecciona la unidad del plan que corresponde a esta programación.')
                return
            }
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

            const getPlanInstitucionalOption = () => {
                if (!usarPlanInstitucional || !selectedUnidadInstitucionalId) return undefined
                const ui = unidadesInstitucionales.find(u => u.id === selectedUnidadInstitucionalId)
                if (!ui) return undefined
                return {
                    situacion_significativa: ui.situacion_significativa,
                    enfoques_transversales: ui.enfoques_transversales,
                    actitudes: ui.actitudes
                }
            }

            const result = await generarUnidadAprendizaje({
                titulo: formData.titulo,
                grado_nombre: gradoNombre,
                area_nombre: areaNombre,
                duracion_semanas: formData.duracion_semanas || 4,
                competencias_seleccionadas: competenciasParaIA,
                contexto_institucional: contextoInstitucional ?? undefined,
                contexto_aula: contextoAula ?? undefined,
                // Modo bifurcado
                ...(isPrivado
                    ? {
                        sesiones_list: sesionesNombres,
                        plan_institucional: getPlanInstitucionalOption()
                    }
                    : {
                        actividades_secuencia: actividadesParaIA
                    }
                )
            })

            // Para colegios privados: reordenar en caso de que la IA reordene sesiones
            if (isPrivado && result.secuencia_sesiones?.length) {
                const orderedSecuencias = sesionesNombres.map((originalTitle, index) => {
                    const normalizedOriginal = originalTitle.toLowerCase().trim()
                    let match = result.secuencia_sesiones.find(
                        (s) => s.titulo.toLowerCase().trim().includes(normalizedOriginal) ||
                            normalizedOriginal.includes(s.titulo.toLowerCase().trim())
                    )
                    if (!match && result.secuencia_sesiones[index]) {
                        match = result.secuencia_sesiones[index]
                    }
                    return match ? { ...match, titulo: originalTitle } : {
                        titulo: originalTitle,
                        desempenos: 'Desempeño inferido por contexto original.',
                        experiencia_aprendizaje: 'Actividades sugeridas para el tema indicado.'
                    }
                })
                result.secuencia_sesiones = orderedSecuencias
            }

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

                        {/* ── Plan Anual Institucional ── */}
                        {unidadesInstitucionales.length > 0 && (
                            isPrivado ? (
                                // COLEGIO PRIVADO: el plan es obligatorio, no opcional
                                <div className="md:col-span-2 mt-2">
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-purple-700 text-base">🏛️</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-purple-900">Plan Anual Institucional — {tipoGestion}</h4>
                                                <p className="text-xs text-purple-700 mt-0.5">Tu institución tiene unidades predefinidas. Selecciona la que corresponde a esta programación.</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-purple-900 mb-1.5">
                                                Unidad del Plan Institucional <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={selectedUnidadInstitucionalId}
                                                onChange={(e) => handleUnidadInstitucionalSelect(e.target.value)}
                                                disabled={!!previewData}
                                                className="w-full px-3 py-2.5 border border-purple-300 bg-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-purple-50 text-sm font-medium text-gray-900"
                                            >
                                                <option value="">— Selecciona la unidad del plan anual —</option>
                                                {unidadesInstitucionales.map(ui => (
                                                    <option key={ui.id} value={ui.id}>
                                                        Unidad {ui.orden}: {ui.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                            {selectedUnidadInstitucionalId && (() => {
                                                const ui = unidadesInstitucionales.find(u => u.id === selectedUnidadInstitucionalId)
                                                return ui?.situacion_significativa ? (
                                                    <p className="mt-2 text-xs text-purple-700 bg-purple-100 p-2 rounded-lg line-clamp-2">
                                                        📌 {ui.situacion_significativa}
                                                    </p>
                                                ) : null
                                            })()}
                                        </div>
                                        {!selectedUnidadInstitucionalId && (
                                            <p className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                                ⚠️ Debes seleccionar una unidad institucional para generar con IA en un colegio privado.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // COLEGIO PÚBLICO/OTRO: es opcional con toggle
                                <div className="md:col-span-2 mt-2 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="text-sm font-semibold text-indigo-900">Plan Anual Institucional</h4>
                                            <p className="text-xs text-indigo-700">Utilizar una unidad predefinida por el colegio</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={usarPlanInstitucional}
                                                onChange={(e) => setUsarPlanInstitucional(e.target.checked)}
                                                disabled={!!previewData}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    {usarPlanInstitucional && (
                                        <div>
                                            <label className="block text-sm font-medium text-indigo-900 mb-1">
                                                Seleccionar Unidad del Plan Institucional *
                                            </label>
                                            <select
                                                value={selectedUnidadInstitucionalId}
                                                onChange={(e) => handleUnidadInstitucionalSelect(e.target.value)}
                                                disabled={!!previewData}
                                                className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-indigo-100/50"
                                            >
                                                <option value="">Seleccione una unidad institucional...</option>
                                                {unidadesInstitucionales.map(ui => (
                                                    <option key={ui.id} value={ui.id}>
                                                        Unidad {ui.orden}: {ui.titulo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )
                        )}

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
                            {competenciasDisponibles.filter(c => !c.isTransversal).map((comp) => {
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

                            {competenciasDisponibles.filter(c => c.isTransversal).length > 0 && (
                                <>
                                    <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Competencias Transversales (Opcionales)</h4>
                                    {competenciasDisponibles.filter(c => c.isTransversal).map((comp) => {
                                        const isSelected = selectedCompetenciaIds.includes(comp.id)
                                        return (
                                            <button
                                                key={comp.id}
                                                type="button"
                                                onClick={() => !previewData && toggleCompetencia(comp.id)}
                                                disabled={!!previewData}
                                                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                                                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                                            >
                                                <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && (
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {comp.codigo}
                                                        </span>
                                                        <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-900' : 'text-gray-800'
                                                            }`}>
                                                            {comp.nombre}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Paso 3 — bifurcado según tipo de institución */}
                {isPrivado ? (
                    /* ── PRIVADO: Temáticas de las Sesiones (sin cambios) ── */
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
                                        onChange={(e) => { updateSesion(sesion.id, e.target.value); setPreviewData(null) }}
                                        disabled={!!previewData}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                        placeholder="Ej: Fracciones en la vida cotidiana..."
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
                            <button type="button" onClick={addSesion}
                                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                <PlusIcon className="h-4 w-4 mr-1" /> Añadir sesión
                            </button>
                        )}
                    </div>
                ) : (
                    /* ── PÚBLICO: Secuencia de Actividades ── */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Paso 3: Secuencia de Actividades</h3>
                            <div className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                                {actividadesList.length} {actividadesList.length === 1 ? 'actividad' : 'actividades'}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Define las actividades que estructuran esta unidad. La IA generará o perfeccionará el desempeño precisado de cada una según el contexto institucional.
                        </p>

                        <div className="space-y-4 mb-4">
                            {actividadesList.map((act, index) => (
                                <div key={act.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    {/* Header de la actividad */}
                                    <div className="flex items-center justify-between bg-emerald-50 px-4 py-2.5 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-emerald-900">
                                                Actividad {index + 1}
                                                {act.titulo && <span className="text-emerald-600 font-normal ml-1">— {act.titulo}</span>}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { removeActividad(act.id); setPreviewData(null) }}
                                            disabled={actividadesList.length <= 1 || !!previewData}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40 transition-colors"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Campos de la actividad */}
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Título */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Título de la actividad <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={act.titulo}
                                                onChange={(e) => { updateActividad(act.id, 'titulo', e.target.value); setPreviewData(null) }}
                                                disabled={!!previewData}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                                placeholder="Ej: Identificamos problemas ambientales en nuestra comunidad"
                                            />
                                        </div>

                                        {/* Campo temático */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Campo temático <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={act.campo_tematico}
                                                onChange={(e) => { updateActividad(act.id, 'campo_tematico', e.target.value); setPreviewData(null) }}
                                                disabled={!!previewData}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                                placeholder="Ej: Ecosistemas y biodiversidad"
                                            />
                                        </div>

                                        {/* Tiempo estimado */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Tiempo estimado (minutos) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="15"
                                                max="480"
                                                value={act.tiempo_estimado}
                                                onChange={(e) => { updateActividad(act.id, 'tiempo_estimado', e.target.value); setPreviewData(null) }}
                                                disabled={!!previewData}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                                            />
                                        </div>

                                        {/* Desempeño precisado (opcional) */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Desempeño precisado{' '}
                                                <span className="text-gray-400 font-normal">(opcional — la IA lo generará si lo dejas vacío)</span>
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={act.desempeno_precisado || ''}
                                                onChange={(e) => { updateActividad(act.id, 'desempeno_precisado', e.target.value); setPreviewData(null) }}
                                                disabled={!!previewData}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 resize-none"
                                                placeholder="Ej: Describe las características de los ecosistemas locales relacionándolos con problemas ambientales..."
                                            />
                                            {act.desempeno_precisado?.trim() ? (
                                                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                                    ✓ La IA optimizará y alineará este desempeño con el contexto de la unidad
                                                </p>
                                            ) : (
                                                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                                    ✦ La IA generará el desempeño basándose en el campo temático y el contexto institucional
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!previewData && (
                            <button type="button" onClick={addActividad}
                                className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors">
                                <PlusIcon className="h-4 w-4 mr-1.5" /> Añadir actividad
                            </button>
                        )}

                        {/* Tabla resumen de actividades */}
                        {actividadesList.some(a => a.titulo.trim()) && (
                            <div className="mt-6 overflow-x-auto">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Vista previa de la secuencia</p>
                                <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-emerald-700 text-white">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold">#</th>
                                            <th className="px-3 py-2 text-left font-semibold">Actividad</th>
                                            <th className="px-3 py-2 text-left font-semibold">Campo Temático</th>
                                            <th className="px-3 py-2 text-left font-semibold">Desempeño Precisado</th>
                                            <th className="px-3 py-2 text-left font-semibold">Tiempo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {actividadesList.filter(a => a.titulo.trim()).map((act, i) => (
                                            <tr key={act.id} className={i % 2 === 0 ? 'bg-white' : 'bg-emerald-50/40'}>
                                                <td className="px-3 py-2 font-bold text-emerald-700">{i + 1}</td>
                                                <td className="px-3 py-2 font-medium text-gray-800">{act.titulo || '—'}</td>
                                                <td className="px-3 py-2 text-gray-600">{act.campo_tematico || '—'}</td>
                                                <td className="px-3 py-2 text-gray-500 italic">
                                                    {act.desempeno_precisado?.trim()
                                                        ? <span className="not-italic text-gray-700">{act.desempeno_precisado}</span>
                                                        : <span className="text-amber-600">✦ IA lo generará</span>}
                                                </td>
                                                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{act.tiempo_estimado} min</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}


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
                                        const sitSignif = previewData.situacion_significativa || ''
                                        if (typeof sitSignif !== 'string') {
                                            const obj = sitSignif as any;
                                            const labelsMap: Record<string, string> = {
                                                'contexto': 'CONTEXTO',
                                                'exploracion': 'EXPLORACIÓN',
                                                'reto': 'RETO',
                                                'proposito': 'PROPÓSITO',
                                                'propositos': 'PROPÓSITO'
                                            };
                                            return Object.entries(obj).map(([k, v]) => {
                                                if (!v) return null;
                                                const label = labelsMap[k] || k.toUpperCase();
                                                return (
                                                    <div key={label}>
                                                        <p className="text-xs font-bold text-emerald-700 mb-1">{label}</p>
                                                        <p className="text-sm text-slate-700 leading-relaxed">{v as string}</p>
                                                    </div>
                                                );
                                            }).filter(Boolean);
                                        }

                                        const raw = sitSignif
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
                                <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-emerald-100 leading-relaxed mb-4">
                                    {previewData.proposito_aprendizaje}
                                </p>

                                {previewData.aprendizajes_esperados && previewData.aprendizajes_esperados.length > 0 && (
                                    <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden mb-6">
                                        <div className="bg-emerald-600 px-4 py-2 text-white text-[10px] font-bold uppercase tracking-wider">
                                            Matriz de Aprendizajes Esperados (CNEB)
                                        </div>
                                        <table className="min-w-full text-xs">
                                            <thead className="bg-emerald-50 text-emerald-800">
                                                <tr className="border-b border-emerald-100">
                                                    <th className="px-4 py-2 text-left font-bold w-[30%]">Competencia / Capacidades</th>
                                                    <th className="px-4 py-2 text-left font-bold w-[45%] border-l border-emerald-100">Desempeños Precisados</th>
                                                    <th className="px-4 py-2 text-left font-bold w-[25%] border-l border-emerald-100">Contenidos (Campos Temáticos)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-emerald-50">
                                                {previewData.aprendizajes_esperados.map((ae, i) => (
                                                    <tr key={i} className="align-top">
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-emerald-900 mb-1">{ae.competencia}</p>
                                                            <ul className="space-y-1">
                                                                {ae.capacidades.map((cap, ci) => (
                                                                    <li key={ci} className="text-[11px] text-emerald-700 flex gap-1.5 items-start">
                                                                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                                                        {cap}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td className="px-4 py-3 border-l border-emerald-50 italic text-slate-600 leading-relaxed">
                                                            <ul className="space-y-2">
                                                                {ae.desempenos_precisados.map((des, di) => (
                                                                    <li key={di} className="flex gap-1.5 items-start">
                                                                        <span className="text-emerald-500 mt-0.5">•</span>
                                                                        {des}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td className="px-4 py-3 border-l border-emerald-50 text-slate-800">
                                                            <div className="flex flex-wrap gap-1">
                                                                {ae.contenidos.map((cont, coi) => (
                                                                    <span key={coi} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                                                                        {cont}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
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

                            {/* III. Matriz de Evaluación */}
                            {previewData.criterios_evaluacion_matriz && previewData.criterios_evaluacion_matriz.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">III. Evaluación — Matriz de Criterios</h4>
                                    <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                                        <table className="min-w-full text-xs">
                                            <thead className="bg-emerald-700 text-white font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-4 py-3 text-left w-[10%]">Act.</th>
                                                    <th className="px-4 py-3 text-left w-[30%]">Competencia</th>
                                                    <th className="px-4 py-3 text-left w-[40%]">Criterios de Evaluación</th>
                                                    <th className="px-4 py-3 text-left w-[20%]">Instrumento</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-emerald-50">
                                                {previewData.criterios_evaluacion_matriz.map((crit, ci) => (
                                                    <tr key={ci} className={ci % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}>
                                                        <td className="px-4 py-3 text-center font-bold text-emerald-700">SES {crit.sesion_numero}</td>
                                                        <td className="px-4 py-3 font-medium text-slate-800">{crit.competencia}</td>
                                                        <td className="px-4 py-3 text-slate-600 italic leading-relaxed">{crit.criterio}</td>
                                                        <td className="px-4 py-3 text-slate-700 font-semibold">{crit.instrumento}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* IV. Secuencia de Actividades / Sesiones */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">
                                    {previewData.secuencia_sesiones?.[0]?.desempeno_precisado ? 'IV. Secuencia de Actividades' : 'IV. Secuencia de Sesiones'}
                                </h4>
                                <div className="space-y-3">
                                    {previewData.secuencia_sesiones?.map((s, index) => (
                                        <div key={index} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex gap-5">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-emerald-600 text-white rounded-xl w-10 h-10 flex flex-shrink-0 items-center justify-center font-bold text-lg shadow-lg shadow-emerald-200">
                                                        {index + 1}
                                                    </div>
                                                    {s.horas && (
                                                        <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                            {s.horas}h
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <p className="font-extrabold text-slate-900 text-base leading-tight">{s.titulo}</p>
                                                    </div>
                                                    
                                                    {/* Layout público: con campos precisados */}
                                                    {s.desempeno_precisado ? (
                                                        <div className="grid grid-cols-1 gap-3 mt-3 border-t border-emerald-50 pt-3">
                                                            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                                                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1">Desempeño Precisado</p>
                                                                <p className="text-xs text-emerald-700 leading-relaxed italic">{s.desempeno_precisado}</p>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Campo Temático</p>
                                                                    <p className="text-xs text-slate-700 font-medium">{s.campo_tematico}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Evidencia / Producto</p>
                                                                    <p className="text-xs text-slate-700 font-medium">{s.evidencia}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Layout privado: original */
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2 items-start">
                                                                <span className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">Desempeño:</span>
                                                                <p className="text-xs text-slate-600 leading-relaxed">{s.desempenos}</p>
                                                            </div>
                                                            <div className="flex gap-2 items-start">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Experiencia:</span>
                                                                <p className="text-xs text-slate-500 leading-relaxed">{s.experiencia_aprendizaje}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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

