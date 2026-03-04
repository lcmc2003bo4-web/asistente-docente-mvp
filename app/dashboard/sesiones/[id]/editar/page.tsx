'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { sesionService } from '@/lib/services/SesionService'
import Link from 'next/link'
import SecuenciaBuilder from '@/components/sesiones/SecuenciaBuilder'
import EditableSesionTables from '@/components/sesiones/EditableSesionTables'
import SesionesFechasSeccion from '@/components/sesiones/SesionesFechasSeccion'
import type { SecuenciaData } from '@/lib/services/SesionService'
import { createClient } from '@/lib/supabase/client'
import { generarSecuenciaSesion } from '@/lib/services/AIService'

export default function EditarSesionPage() {
    const params = useParams()
    const router = useRouter()
    const [initialData, setInitialData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingIA, setLoadingIA] = useState(false)
    const [iaError, setIaError] = useState<string | null>(null)
    // Secciones from the parent programacion
    const [secciones, setSecciones] = useState<string[]>([])
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        loadSesion()
    }, [params.id])

    async function loadSesion() {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)

            const data = await sesionService.get(params.id as string)

            // Obtener IDs de desempeños
            const desempenosIds = data.detalles_sesion?.map(d => d.desempenos.id) || []

            // Obtener secuencias ordenadas
            const secuencias = await sesionService.getSecuencias(params.id as string)

            // Fetch secciones from the parent programacion
            const { data: unidadData } = await supabase
                .from('unidades')
                .select('programacion_id')
                .eq('id', data.unidad_id)
                .single()

            if (unidadData?.programacion_id) {
                const { data: progData } = await supabase
                    .from('programaciones')
                    .select('secciones')
                    .eq('id', unidadData.programacion_id)
                    .single()
                setSecciones((progData as any)?.secciones || [])
            }

            setInitialData({
                titulo: data.titulo,
                unidad_id: data.unidad_id,
                duracion_minutos: data.duracion_minutos,
                fecha: data.fecha_tentativa ?? new Date().toISOString().split('T')[0],
                proposito: data.proposito_aprendizaje || '',
                evidencias_aprendizaje: data.evidencias_aprendizaje || '',
                desempenos_ids: desempenosIds,
                contenido_ia: data.contenido_ia,
                recursos_extra: '',
                contexto_extra: '',
                secuencias: secuencias.map(s => ({
                    momento: s.momento as 'Inicio' | 'Desarrollo' | 'Cierre',
                    actividad: s.actividad,
                    tiempo_minutos: s.tiempo_minutos,
                    recursos: s.recursos || '',
                    orden: s.orden
                }))
            })

        } catch (error) {
            console.error('Error loading sesion:', error)
            setError('Error al cargar la sesión')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            setError(null)

            // 1. Actualizar sesión
            await sesionService.update(params.id as string, {
                titulo: initialData.titulo,
                unidad_id: initialData.unidad_id,
                duracion_minutos: initialData.duracion_minutos,
                fecha_tentativa: initialData.fecha,
                proposito_aprendizaje: initialData.proposito || null,
                evidencias_aprendizaje: initialData.evidencias_aprendizaje || null,
                contenido_ia: initialData.contenido_ia || null
            } as any)

            // 2. Actualizar desempeños
            await sesionService.addDesempenos(params.id as string, initialData.desempenos_ids)

            // 3. Eliminar secuencias existentes
            const existingSecuencias = await sesionService.getSecuencias(params.id as string)
            for (const sec of existingSecuencias) {
                await sesionService.deleteSecuencia(sec.id)
            }

            // 4. Agregar nuevas secuencias
            for (const secuencia of initialData.secuencias) {
                await sesionService.addSecuencia(params.id as string, secuencia)
            }

            // 5. Revalidar
            await sesionService.validate(params.id as string)

            // 6. Redirigir al detalle
            router.push(`/dashboard/sesiones/${params.id}`)
            router.refresh()
        } catch (err: any) {
            console.error('Error updating sesion:', err)
            setError(err.message || 'Error al actualizar la sesión')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        router.push(`/dashboard/sesiones/${params.id}`)
    }

    const handleGenerarConIA = async () => {
        if (!initialData.titulo) {
            setIaError('Completa el título antes de generar con IA.')
            return
        }
        setIaError(null)
        setLoadingIA(true)
        try {
            const supabase = createClient()
            const { data: unidad } = await supabase
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
                .eq('id', initialData.unidad_id)
                .single()

            const prog = unidad?.programaciones

            const matrizData = unidad?.matriz_ia
            const fallbackDesempenos = Array.isArray(matrizData)
                ? (matrizData as any[]).flatMap((m: any) => m.desempenos_contextualizados ?? []).join(' | ')
                : (matrizData as any)?.desempenos_contextualizados?.join(' | ') || ''
            const finalDesempeno = initialData.proposito || fallbackDesempenos || 'Desempeños propios del área y grado'

            const result = await generarSecuenciaSesion({
                titulo_sesion: initialData.titulo,
                desempeno_precisado: finalDesempeno,
                experiencia_aprendizaje: initialData?.evidencias_aprendizaje || '',
                unidad_titulo: unidad?.titulo || 'Desconocida',
                situacion_significativa: unidad?.situacion_significativa,
                matriz_ia: unidad?.matriz_ia,
                enfoques_transversales: unidad?.enfoques_transversales,
                area_nombre: prog?.areas?.nombre ?? 'General',
                grado_nombre: prog?.grados?.nombre ?? '',
                nivel: prog?.grados?.nivel ?? '',
                duracion_minutos: initialData.duracion_minutos,
                recursos_extra: initialData.recursos_extra,
                contexto_extra: initialData.contexto_extra
            })

            // Mapear respuesta Gemini → SecuenciaData
            const secuencias = result.secuencia_didactica.map((s: any, idx: number) => ({
                momento: s.fase,
                actividad: s.actividades.map((a: any) => `**${a.titulo}** (${a.tiempo_sugerido}):\n${a.descripcion}`).join('\n\n'),
                tiempo_minutos: s.tiempo_total,
                recursos: s.recursos?.join(', ') ?? '',
                orden: idx + 1,
            })) as SecuenciaData[]

            if (result.evaluacion) {
                let evalText = ''
                if (result.evaluacion.aprendizajes?.length > 0) {
                    evalText += '🎯 EVALUACIÓN DE APRENDIZAJES:\n' + result.evaluacion.aprendizajes.map((e: any) => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                }
                if (result.evaluacion.actitudes?.length > 0) {
                    evalText += '🌟 ACTITUDES:\n' + result.evaluacion.actitudes.map((e: any) => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                }

                const evalSummary = evalText.trim()

                const cierreIndex = secuencias.findIndex(s => s.momento === 'Cierre')
                if (cierreIndex !== -1 && evalSummary) {
                    secuencias[cierreIndex].actividad += `\n\n${evalSummary}`
                }
            }

            setInitialData({
                ...initialData,
                secuencias,
                contenido_ia: result
            })
        } catch (err: any) {
            setIaError(err.message ?? 'Error al conectar con la IA')
        } finally {
            setLoadingIA(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!initialData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">Sesión no encontrada</h2>
                        <Link href="/dashboard/sesiones" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
                            ← Volver a sesiones
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-4 inline-flex items-center"
                    >
                        ← Volver al detalle
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Editar Sesión de Aprendizaje
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Modifica los datos de manera directa
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-red-600 text-xl">⚠️</span>
                            <div>
                                <h4 className="font-semibold text-red-900">Error</h4>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información Básica */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">1. Información Básica</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Sesión *</label>
                                <input
                                    type="text"
                                    required
                                    value={initialData.titulo}
                                    onChange={(e) => setInitialData({ ...initialData, titulo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="30"
                                        value={initialData.duracion_minutos}
                                        onChange={(e) => setInitialData({ ...initialData, duracion_minutos: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                                    <input
                                        type="date"
                                        required
                                        value={initialData.fecha}
                                        onChange={(e) => setInitialData({ ...initialData, fecha: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Propósito de la Sesión</label>
                                <textarea
                                    value={initialData.proposito}
                                    onChange={(e) => setInitialData({ ...initialData, proposito: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia de Aprendizaje (Evidencias)</label>
                                <textarea
                                    value={initialData.evidencias_aprendizaje}
                                    onChange={(e) => setInitialData({ ...initialData, evidencias_aprendizaje: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-bold text-indigo-900 mb-1"> Contextualización para la IA (Opcional)</h3>
                                    <p className="text-xs text-indigo-700 mb-3">Útil si vas a pedirle a la IA que genere o regenere la secuencia.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Recursos Particulares
                                    </label>
                                    <textarea
                                        value={initialData.recursos_extra || ''}
                                        onChange={(e) => setInitialData({ ...initialData, recursos_extra: e.target.value })}
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
                                        value={initialData.contexto_extra || ''}
                                        onChange={(e) => setInitialData({ ...initialData, contexto_extra: e.target.value })}
                                        rows={2}
                                        placeholder="Ej: Los niños vienen de un simulacro..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fechas por Sección */}
                    {secciones.length > 0 && userId && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Fechas por Sección</h2>
                            <SesionesFechasSeccion
                                sesionId={params.id as string}
                                userId={userId}
                                secciones={secciones}
                            />
                        </div>
                    )}

                    {/* Secuencia Didáctica */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{secciones.length > 0 ? '3' : '2'}. Secuencia Didáctica</h2>
                                <p className="text-sm text-gray-600">
                                    Ajusta libremente los momentos de la sesión.
                                </p>
                            </div>
                            {/* Botón IA */}
                            <button
                                type="button"
                                onClick={handleGenerarConIA}
                                disabled={loadingIA}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 mt-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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
                                    <>✨ Re-generar con IA</>
                                )}
                            </button>
                        </div>

                        {iaError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                ⚠️ {iaError}
                            </div>
                        )}

                        {initialData.contenido_ia ? (
                            <EditableSesionTables
                                data={initialData.contenido_ia}
                                onChange={(newData) => {
                                    // Update ia content
                                    const updatedData = { ...initialData, contenido_ia: newData };

                                    // Also sync sequences from the edited IA data
                                    if (newData.secuencia_didactica) {
                                        const mappedSecuencias: SecuenciaData[] = newData.secuencia_didactica.map((s: any, idx: number) => ({
                                            momento: s.fase as any,
                                            actividad: s.actividades.map((a: any) => `**${a.titulo}** (${a.tiempo_sugerido}):\n${a.descripcion}`).join('\n\n'),
                                            tiempo_minutos: s.tiempo_total,
                                            recursos: s.recursos?.join(', ') ?? '',
                                            orden: idx + 1,
                                        }))

                                        // add evaluation info if any to cierre
                                        if (newData.evaluacion) {
                                            let evalText = ''
                                            if (newData.evaluacion.aprendizajes?.length > 0) {
                                                evalText += '🎯 EVALUACIÓN DE APRENDIZAJES:\n' + newData.evaluacion.aprendizajes.map((e: any) => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                                            }
                                            if (newData.evaluacion.actitudes?.length > 0) {
                                                evalText += '🌟 ACTITUDES:\n' + newData.evaluacion.actitudes.map((e: any) => `- ${e.criterio} (${e.instrumento})`).join('\n') + '\n\n'
                                            }

                                            const evalSummary = evalText.trim()
                                            const cierreIndex = mappedSecuencias.findIndex((s: any) => s.momento === 'Cierre')
                                            if (cierreIndex !== -1 && evalSummary) {
                                                mappedSecuencias[cierreIndex].actividad += `\n\n${evalSummary}`
                                            }
                                        }

                                        updatedData.secuencias = mappedSecuencias;
                                    }
                                    setInitialData(updatedData);
                                }}
                            />
                        ) : (
                            <SecuenciaBuilder
                                duracionTotal={initialData.duracion_minutos}
                                initialSecuencias={initialData.secuencias}
                                onChange={(secuencias) => setInitialData({ ...initialData, secuencias })}
                            />
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
