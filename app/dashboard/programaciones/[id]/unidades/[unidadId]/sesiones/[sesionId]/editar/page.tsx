'use client'

import { use, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/types/database.types'

type Desempeno = Database['public']['Tables']['desempenos']['Row'] & {
    capacidades: {
        competencia_id: string
    }
}

type Competencia = Database['public']['Tables']['competencias']['Row']

type Secuencia = {
    orden: number
    momento: 'Inicio' | 'Desarrollo' | 'Cierre'
    actividad: string
    tiempo_minutos: number
    recursos: string
}

export default function EditarSesionPage({
    params,
}: {
    params: Promise<{ id: string; unidadId: string; sesionId: string }>
}) {
    const resolvedParams = use(params)
    const router = useRouter()
    const supabase = createClient()

    // Wizard state
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 5

    // Form data
    const [orden, setOrden] = useState(1)
    const [titulo, setTitulo] = useState('')
    const [fechaTentativa, setFechaTentativa] = useState('')
    const [duracionMinutos, setDuracionMinutos] = useState(90)
    const [propositoAprendizaje, setPropositoAprendizaje] = useState('')
    const [evidenciasAprendizaje, setEvidenciasAprendizaje] = useState('')
    const [criteriosEvaluacion, setCriteriosEvaluacion] = useState('')
    const [selectedDesempenos, setSelectedDesempenos] = useState<string[]>([])
    const [secuencias, setSecuencias] = useState<Secuencia[]>([])

    // Data from DB
    const [desempenos, setDesempenos] = useState<Desempeno[]>([])
    const [competencias, setCompetencias] = useState<Competencia[]>([])
    const [filtroCompetencia, setFiltroCompetencia] = useState<string>('')

    // UI state
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            // Get existing sesion data
            const { data: sesion } = await supabase
                .from('sesiones')
                .select(`
          *,
          detalles_sesion (desempeno_id),
          secuencias_sesion (*)
        `)
                .eq('id', resolvedParams.sesionId)
                .eq('user_id', user!.id)
                .single()

            if (!sesion) {
                alert('Sesión no encontrada')
                router.push(`/dashboard/programaciones/${resolvedParams.id}/unidades/${resolvedParams.unidadId}/sesiones`)
                return
            }

            // Populate form with existing data
            setOrden(sesion.orden)
            setTitulo(sesion.titulo)
            setFechaTentativa(sesion.fecha_tentativa || '')
            setDuracionMinutos(sesion.duracion_minutos)
            setPropositoAprendizaje(sesion.proposito_aprendizaje || '')
            setEvidenciasAprendizaje(sesion.evidencias_aprendizaje || '')
            setCriteriosEvaluacion(sesion.criterios_evaluacion || '')
            setSelectedDesempenos(sesion.detalles_sesion?.map((d: any) => d.desempeno_id) || [])

            // Sort and set secuencias
            const sortedSecuencias = (sesion.secuencias_sesion || [])
                .sort((a: any, b: any) => a.orden - b.orden)
                .map((s: any) => ({
                    orden: s.orden,
                    momento: s.momento,
                    actividad: s.actividad,
                    tiempo_minutos: s.tiempo_minutos,
                    recursos: s.recursos || '',
                }))

            setSecuencias(sortedSecuencias.length > 0 ? sortedSecuencias : [
                { orden: 1, momento: 'Inicio', actividad: '', tiempo_minutos: 15, recursos: '' },
            ])

            // Get unidad's desempeños (only these can be selected)
            const { data: detallesUnidad } = await supabase
                .from('detalles_unidad')
                .select(`
          desempenos (
            id,
            descripcion,
            capacidades!inner(competencia_id)
          )
        `)
                .eq('unidad_id', resolvedParams.unidadId)

            const desempenosList = detallesUnidad?.map((d: any) => d.desempenos) || []
            setDesempenos(desempenosList)

            // Get unique competencias from these desempeños
            const competenciaIds = [...new Set(desempenosList.map((d: any) => d.capacidades.competencia_id))]

            const { data: competenciasList } = await supabase
                .from('competencias')
                .select('*')
                .in('id', competenciaIds)

            setCompetencias(competenciasList || [])
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    function nextStep() {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    function goToStep(step: number) {
        setCurrentStep(step)
    }

    function addSecuencia() {
        setSecuencias([
            ...secuencias,
            {
                orden: secuencias.length + 1,
                momento: 'Desarrollo',
                actividad: '',
                tiempo_minutos: 20,
                recursos: '',
            },
        ])
    }

    function removeSecuencia(index: number) {
        const newSecuencias = secuencias.filter((_, i) => i !== index)
        // Reorder
        newSecuencias.forEach((sec, i) => {
            sec.orden = i + 1
        })
        setSecuencias(newSecuencias)
    }

    function updateSecuencia(index: number, field: keyof Secuencia, value: any) {
        const newSecuencias = [...secuencias]
        newSecuencias[index] = { ...newSecuencias[index], [field]: value }
        setSecuencias(newSecuencias)
    }

    function toggleDesempeno(id: string) {
        if (selectedDesempenos.includes(id)) {
            setSelectedDesempenos(selectedDesempenos.filter((d) => d !== id))
        } else {
            setSelectedDesempenos([...selectedDesempenos, id])
        }
    }

    async function handleSubmit() {
        if (selectedDesempenos.length === 0) {
            alert('Debes seleccionar al menos un desempeño')
            return
        }

        if (secuencias.length === 0 || secuencias.some((s) => !s.actividad.trim())) {
            alert('Debes agregar al menos una secuencia con actividad')
            return
        }

        setSubmitting(true)

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            // Update sesion
            const { error: sesionError } = await supabase
                .from('sesiones')
                .update({
                    orden,
                    titulo,
                    fecha_tentativa: fechaTentativa || null,
                    duracion_minutos: duracionMinutos,
                    proposito_aprendizaje: propositoAprendizaje || null,
                    evidencias_aprendizaje: evidenciasAprendizaje || null,
                    criterios_evaluacion: criteriosEvaluacion || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', resolvedParams.sesionId)

            if (sesionError) throw sesionError

            // Delete old detalles_sesion
            await supabase
                .from('detalles_sesion')
                .delete()
                .eq('sesion_id', resolvedParams.sesionId)

            // Insert new detalles_sesion
            const detalles = selectedDesempenos.map((desempeno_id) => ({
                sesion_id: resolvedParams.sesionId,
                desempeno_id,
            }))

            const { error: detallesError } = await supabase
                .from('detalles_sesion')
                .insert(detalles)

            if (detallesError) throw detallesError

            // Delete old secuencias
            await supabase
                .from('secuencias_sesion')
                .delete()
                .eq('sesion_id', resolvedParams.sesionId)

            // Insert new secuencias
            const secuenciasData = secuencias.map((sec) => ({
                sesion_id: resolvedParams.sesionId,
                orden: sec.orden,
                momento: sec.momento,
                actividad: sec.actividad,
                tiempo_minutos: sec.tiempo_minutos,
                recursos: sec.recursos || null,
            }))

            const { error: secuenciasError } = await supabase
                .from('secuencias_sesion')
                .insert(secuenciasData)

            if (secuenciasError) throw secuenciasError

            // Redirect to sesion detail
            router.push(
                `/dashboard/programaciones/${resolvedParams.id}/unidades/${resolvedParams.unidadId}/sesiones/${resolvedParams.sesionId}`
            )
        } catch (error: any) {
            console.error('Error updating sesion:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            const errorMessage = error?.message || error?.error_description || 'Error desconocido al actualizar la sesión'
            alert(`Error al actualizar la sesión: ${errorMessage}`)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-600">Cargando...</div>
            </div>
        )
    }

    const totalTiempo = secuencias.reduce((sum, sec) => sum + sec.tiempo_minutos, 0)
    const tiempoExcedido = totalTiempo > duracionMinutos

    const desempenosFiltrados = filtroCompetencia
        ? desempenos.filter((d) => d.capacidades.competencia_id === filtroCompetencia)
        : desempenos

    // Group desempeños by competencia for display
    const desempenosPorCompetencia: Record<string, any> = {}
    desempenosFiltrados.forEach((desempeno) => {
        const competenciaId = desempeno.capacidades.competencia_id
        const competencia = competencias.find((c) => c.id === competenciaId)

        if (!desempenosPorCompetencia[competenciaId]) {
            desempenosPorCompetencia[competenciaId] = {
                competencia,
                desempenos: [],
            }
        }

        desempenosPorCompetencia[competenciaId].desempenos.push(desempeno)
    })

    const grupos = Object.values(desempenosPorCompetencia)

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/dashboard/programaciones/${resolvedParams.id}/unidades/${resolvedParams.unidadId}/sesiones/${resolvedParams.sesionId}`}
                    className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                >
                    ← Volver a Sesión
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                    Editar Sesión de Aprendizaje
                </h1>
                <p className="text-gray-600 mt-2">Paso {currentStep} de {totalSteps}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`flex-1 h-2 mx-1 rounded-full ${step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                    <span>Básica</span>
                    <span>Propósito</span>
                    <span>Desempeños</span>
                    <span>Secuencia</span>
                    <span>Revisión</span>
                </div>
            </div>

            {/* Step Content - Same as nueva/page.tsx but with pre-populated data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {/* Step 1: Información Básica */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Información Básica
                        </h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Orden
                            </label>
                            <input
                                type="number"
                                value={isNaN(orden) ? '' : orden}
                                onChange={(e) => setOrden(parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ej: Conocemos los números del 1 al 10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha Tentativa
                            </label>
                            <input
                                type="date"
                                value={fechaTentativa}
                                onChange={(e) => setFechaTentativa(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duración (minutos) *
                            </label>
                            <input
                                type="number"
                                value={isNaN(duracionMinutos) ? '' : duracionMinutos}
                                onChange={(e) => setDuracionMinutos(parseInt(e.target.value) || 90)}
                                min="30"
                                step="15"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Duración típica: 45-90 minutos
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Propósito y Evaluación */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Propósito y Evaluación
                        </h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Propósito de Aprendizaje
                            </label>
                            <textarea
                                value={propositoAprendizaje}
                                onChange={(e) => setPropositoAprendizaje(e.target.value)}
                                rows={4}
                                placeholder="¿Qué aprenderán los estudiantes en esta sesión?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Evidencias de Aprendizaje
                            </label>
                            <textarea
                                value={evidenciasAprendizaje}
                                onChange={(e) => setEvidenciasAprendizaje(e.target.value)}
                                rows={4}
                                placeholder="¿Qué productos o acciones demostrarán el aprendizaje?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Criterios de Evaluación
                            </label>
                            <textarea
                                value={criteriosEvaluacion}
                                onChange={(e) => setCriteriosEvaluacion(e.target.value)}
                                rows={4}
                                placeholder="¿Cómo evaluarás el logro de los aprendizajes?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Seleccionar Desempeños */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Seleccionar Desempeños
                            </h2>
                            <span className="text-sm text-gray-600">
                                {selectedDesempenos.length} seleccionados
                            </span>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                ℹ️ Solo puedes seleccionar desempeños que están en la unidad didáctica
                            </p>
                        </div>

                        {/* Filter by Competencia */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Filtrar por Competencia
                            </label>
                            <select
                                value={filtroCompetencia}
                                onChange={(e) => setFiltroCompetencia(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Todas las competencias</option>
                                {competencias.map((comp) => (
                                    <option key={comp.id} value={comp.id}>
                                        {comp.codigo} - {comp.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Desempeños List */}
                        <div className="space-y-4">
                            {grupos.map((grupo: any) => (
                                <div
                                    key={grupo.competencia.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">
                                            {grupo.competencia.codigo.split('-')[1] || '?'}
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                {grupo.competencia.codigo}
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                {grupo.competencia.nombre}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 ml-13">
                                        {grupo.desempenos.map((desempeno: any) => (
                                            <label
                                                key={desempeno.id}
                                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDesempenos.includes(desempeno.id)}
                                                    onChange={() => toggleDesempeno(desempeno.id)}
                                                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {desempeno.descripcion}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {desempenos.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No hay desempeños disponibles en esta unidad
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Secuencia Didáctica */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Secuencia Didáctica
                            </h2>
                            <div className="text-sm">
                                <span className={tiempoExcedido ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                                    Total: {totalTiempo} min
                                </span>
                                <span className="text-gray-400"> / {duracionMinutos} min</span>
                            </div>
                        </div>

                        {tiempoExcedido && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ El tiempo total de las secuencias excede la duración planificada
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {secuencias.map((secuencia, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">
                                            Secuencia {secuencia.orden}
                                        </h3>
                                        {secuencias.length > 1 && (
                                            <button
                                                onClick={() => removeSecuencia(index)}
                                                className="text-red-600 hover:text-red-700 text-sm"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Momento *
                                            </label>
                                            <select
                                                value={secuencia.momento}
                                                onChange={(e) =>
                                                    updateSecuencia(index, 'momento', e.target.value)
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="Inicio">Inicio</option>
                                                <option value="Desarrollo">Desarrollo</option>
                                                <option value="Cierre">Cierre</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tiempo (min) *
                                            </label>
                                            <input
                                                type="number"
                                                value={isNaN(secuencia.tiempo_minutos) ? '' : secuencia.tiempo_minutos}
                                                onChange={(e) =>
                                                    updateSecuencia(
                                                        index,
                                                        'tiempo_minutos',
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                                min="1"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Actividad *
                                        </label>
                                        <textarea
                                            value={secuencia.actividad}
                                            onChange={(e) =>
                                                updateSecuencia(index, 'actividad', e.target.value)
                                            }
                                            rows={3}
                                            placeholder="Describe la actividad de aprendizaje..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Recursos
                                        </label>
                                        <input
                                            type="text"
                                            value={secuencia.recursos}
                                            onChange={(e) =>
                                                updateSecuencia(index, 'recursos', e.target.value)
                                            }
                                            placeholder="Ej: Papelotes, plumones, fichas..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addSecuencia}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition"
                        >
                            ➕ Agregar Secuencia
                        </button>
                    </div>
                )}

                {/* Step 5: Revisión */}
                {currentStep === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Revisión Final
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Información Básica
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            <strong>Título:</strong> {titulo}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong>Orden:</strong> {orden}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong>Duración:</strong> {duracionMinutos} minutos
                                        </p>
                                        {fechaTentativa && (
                                            <p className="text-sm text-gray-700">
                                                <strong>Fecha:</strong>{' '}
                                                {new Date(fechaTentativa).toLocaleDateString('es-PE')}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => goToStep(1)}
                                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                        ✏️ Editar
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Propósito y Evaluación
                                        </h3>
                                        {propositoAprendizaje && (
                                            <p className="text-sm text-gray-700 mb-2">
                                                <strong>Propósito:</strong> {propositoAprendizaje}
                                            </p>
                                        )}
                                        {evidenciasAprendizaje && (
                                            <p className="text-sm text-gray-700 mb-2">
                                                <strong>Evidencias:</strong> {evidenciasAprendizaje}
                                            </p>
                                        )}
                                        {criteriosEvaluacion && (
                                            <p className="text-sm text-gray-700">
                                                <strong>Criterios:</strong> {criteriosEvaluacion}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => goToStep(2)}
                                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                        ✏️ Editar
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Desempeños Seleccionados
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            {selectedDesempenos.length} desempeños
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => goToStep(3)}
                                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                        ✏️ Editar
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Secuencia Didáctica
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            {secuencias.length} secuencias - Total: {totalTiempo} min
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            {secuencias.map((sec) => (
                                                <div key={sec.orden} className="text-xs text-gray-600">
                                                    {sec.orden}. {sec.momento} ({sec.tiempo_minutos} min)
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => goToStep(4)}
                                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                        ✏️ Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Anterior
                </button>

                {currentStep < totalSteps ? (
                    <button
                        onClick={nextStep}
                        disabled={
                            (currentStep === 1 && !titulo.trim()) ||
                            (currentStep === 3 && selectedDesempenos.length === 0)
                        }
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || selectedDesempenos.length === 0}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Guardando...' : '✓ Guardar Cambios'}
                    </button>
                )}
            </div>
        </div>
    )
}
