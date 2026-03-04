'use client'

import { use, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { ValidationError } from '@/types/validation.types'
import ValidationErrorsDisplay from '@/components/ValidationErrorsDisplay'

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

export default function NuevaSesionPage({
    params,
}: {
    params: Promise<{ id: string; unidadId: string }>
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
    const [secuencias, setSecuencias] = useState<Secuencia[]>([
        { orden: 1, momento: 'Inicio', actividad: '', tiempo_minutos: 15, recursos: '' },
    ])

    // Data from DB
    const [desempenos, setDesempenos] = useState<Desempeno[]>([])
    const [competencias, setCompetencias] = useState<Competencia[]>([])
    const [filtroCompetencia, setFiltroCompetencia] = useState<string>('')

    // UI state
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()

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

            // Get next orden number
            const { count } = await supabase
                .from('sesiones')
                .select('*', { count: 'exact', head: true })
                .eq('unidad_id', resolvedParams.unidadId)

            setOrden((count || 0) + 1)
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

    // Client-side validation
    function validateBeforeSubmit(): boolean {
        const errors: ValidationError[] = []

        // Validation 1: Required fields
        if (!titulo.trim()) {
            errors.push({
                code: 'REQUIRED_FIELD',
                field: 'titulo',
                message: 'El título es obligatorio',
                severity: 'error'
            })
        }

        // Validation 2: Duration range
        if (isNaN(duracionMinutos) || duracionMinutos < 30) {
            errors.push({
                code: 'DURATION_TOO_SHORT',
                field: 'duracion_minutos',
                message: 'La duración mínima es 30 minutos',
                severity: 'error',
                reference: 'Norma técnica MINEDU'
            })
        }

        if (duracionMinutos > 180) {
            errors.push({
                code: 'DURATION_TOO_LONG',
                field: 'duracion_minutos',
                message: 'La duración máxima recomendada es 180 minutos (3 horas pedagógicas)',
                severity: 'warning'
            })
        }

        // Validation 3: Must have desempeños
        if (selectedDesempenos.length === 0) {
            errors.push({
                code: 'NO_DESEMPENOS',
                field: 'desempenos',
                message: 'Debe seleccionar al menos un desempeño',
                severity: 'error'
            })
        }

        // Validation 4: Must have secuencias
        if (secuencias.length === 0) {
            errors.push({
                code: 'NO_SECUENCIAS',
                field: 'secuencias',
                message: 'Debe agregar al menos una secuencia didáctica',
                severity: 'error'
            })
        }

        // Validation 5: Secuencias must have content
        if (secuencias.some(s => !s.actividad.trim())) {
            errors.push({
                code: 'EMPTY_SECUENCIA',
                field: 'secuencias',
                message: 'Todas las secuencias deben tener una actividad descrita',
                severity: 'error'
            })
        }

        // Validation 6: Must have Desarrollo momento
        const hasInicio = secuencias.some(s => s.momento === 'Inicio')
        const hasDesarrollo = secuencias.some(s => s.momento === 'Desarrollo')
        const hasCierre = secuencias.some(s => s.momento === 'Cierre')

        if (!hasDesarrollo) {
            errors.push({
                code: 'MISSING_DESARROLLO',
                field: 'secuencias',
                message: 'Debe incluir al menos una secuencia de Desarrollo',
                severity: 'error'
            })
        }

        if (!hasInicio) {
            errors.push({
                code: 'MISSING_INICIO',
                field: 'secuencias',
                message: 'Se recomienda incluir al menos una secuencia de Inicio',
                severity: 'warning',
                reference: 'Estructura pedagógica recomendada'
            })
        }

        if (!hasCierre) {
            errors.push({
                code: 'MISSING_CIERRE',
                field: 'secuencias',
                message: 'Se recomienda incluir al menos una secuencia de Cierre',
                severity: 'warning',
                reference: 'Estructura pedagógica recomendada'
            })
        }

        // Validation 7: Time coherence
        const totalTiempo = secuencias.reduce((sum, s) => sum + (s.tiempo_minutos || 0), 0)
        if (totalTiempo > duracionMinutos + 10) {
            errors.push({
                code: 'TIME_EXCEEDED',
                field: 'secuencias',
                message: `El tiempo total de secuencias (${totalTiempo} min) excede la duración planificada (${duracionMinutos} min)`,
                severity: 'warning'
            })
        }

        setValidationErrors(errors)

        // Block submission if there are errors (not warnings)
        const hasErrors = errors.some(e => e.severity === 'error')
        return !hasErrors
    }

    async function handleSubmit() {
        // Run client-side validation first
        const isValid = validateBeforeSubmit()

        if (!isValid) {
            alert('Por favor corrija los errores antes de continuar')
            return
        }
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

            if (!user) {
                throw new Error('Usuario no autenticado')
            }

            // Validate data before insertion
            console.log('Submitting sesion with data:', {
                orden,
                titulo,
                duracionMinutos,
                selectedDesempenos: selectedDesempenos.length,
                secuencias: secuencias.length,
            })

            // Validate numeric fields
            if (isNaN(orden) || orden < 1) {
                throw new Error('Orden debe ser un número válido mayor a 0')
            }
            if (isNaN(duracionMinutos) || duracionMinutos < 30) {
                throw new Error('Duración debe ser al menos 30 minutos')
            }
            if (secuencias.some(s => isNaN(s.tiempo_minutos) || s.tiempo_minutos < 1)) {
                throw new Error('Todas las secuencias deben tener un tiempo válido')
            }

            // Insert sesion
            const { data: sesion, error: sesionError } = await supabase
                .from('sesiones')
                .insert({
                    user_id: user!.id,
                    unidad_id: resolvedParams.unidadId,
                    orden,
                    titulo,
                    fecha_tentativa: fechaTentativa || null,
                    duracion_minutos: duracionMinutos,
                    proposito_aprendizaje: propositoAprendizaje || null,
                    evidencias_aprendizaje: evidenciasAprendizaje || null,
                    criterios_evaluacion: criteriosEvaluacion || null,
                })
                .select()
                .single()

            if (sesionError) throw sesionError

            // Insert detalles_sesion (only if there are selected desempeños)
            if (selectedDesempenos.length > 0) {
                const detalles = selectedDesempenos.map((desempeno_id) => ({
                    sesion_id: sesion.id,
                    desempeno_id,
                }))

                console.log('Inserting detalles:', detalles)

                const { error: detallesError } = await supabase
                    .from('detalles_sesion')
                    .insert(detalles)

                if (detallesError) throw detallesError
            }

            // Insert secuencias
            const secuenciasData = secuencias.map((sec) => ({
                sesion_id: sesion.id,
                orden: sec.orden,
                momento: sec.momento,
                actividad: sec.actividad,
                tiempo_minutos: sec.tiempo_minutos,
                recursos: sec.recursos || null,
            }))

            console.log('Inserting secuencias:', secuenciasData)

            const { error: secuenciasError } = await supabase
                .from('secuencias_sesion')
                .insert(secuenciasData)

            if (secuenciasError) throw secuenciasError

            // Redirect to sesion detail
            router.push(
                `/dashboard/programaciones/${resolvedParams.id}/unidades/${resolvedParams.unidadId}/sesiones/${sesion.id}`
            )
        } catch (error: any) {
            console.error('Error creating sesion:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            const errorMessage = error?.message || error?.error_description || 'Error desconocido al crear la sesión'
            alert(`Error al crear la sesión: ${errorMessage}`)
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
                    href={`/dashboard/programaciones/${resolvedParams.id}/unidades/${resolvedParams.unidadId}/sesiones`}
                    className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                >
                    ← Volver a Sesiones
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                    Nueva Sesión de Aprendizaje
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

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="mb-6">
                    <ValidationErrorsDisplay errors={validationErrors} />
                </div>
            )}

            {/* Step Content */}
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
                        {submitting ? 'Guardando...' : '✓ Crear Sesión'}
                    </button>
                )}
            </div>
        </div>
    )
}
