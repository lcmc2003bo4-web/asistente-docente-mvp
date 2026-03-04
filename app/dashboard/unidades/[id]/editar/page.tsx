'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { unidadService } from '@/lib/services/UnidadService'
import UnidadForm from '@/components/unidades/UnidadForm'

export default function EditarUnidadPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [initialData, setInitialData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadUnidad()
    }, [resolvedParams.id])

    const loadUnidad = async () => {
        try {
            const data = await unidadService.get(resolvedParams.id)

            // Extraer IDs de desempeños
            const desempenosIds = data.detalles_unidad?.map(d => d.desempenos.id) || []

            setInitialData({
                titulo: (data as any).titulo,
                programacion_id: (data as any).programacion_id,
                situacion_significativa: (data as any).situacion_significativa || '',
                proposito_aprendizaje: (data as any).proposito_aprendizaje || '',
                matriz_ia: (data as any).matriz_ia || { competencia: '', capacidades: [], desempenos_contextualizados: [] },
                evaluacion_ia: (data as any).evaluacion_ia || { evidencias: '', instrumento: '', criterios: [] },
                enfoques_transversales: (data as any).enfoques_transversales || [],
                duracion_semanas: (data as any).duracion_semanas,
                orden: (data as any).orden,
                desempenos_ids: desempenosIds
            })
        } catch (err) {
            console.error('Error loading unidad:', err)
            setError('Error al cargar la unidad')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (formData: any) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Actualizar unidad
            await unidadService.update(resolvedParams.id, {
                titulo: formData.titulo,
                situacion_significativa: formData.situacion_significativa,
                proposito_aprendizaje: formData.proposito_aprendizaje,
                duracion_semanas: formData.duracion_semanas,
                orden: formData.orden,
                matriz_ia: formData.matriz_ia,
                evaluacion_ia: formData.evaluacion_ia,
                enfoques_transversales: formData.enfoques_transversales
            })

            // Actualizar desempeños
            await unidadService.addDesempenos(resolvedParams.id, formData.desempenos_ids)

            // Validar
            await unidadService.validate(resolvedParams.id)

            // Redirigir
            router.push(`/dashboard/unidades/${resolvedParams.id}`)
            router.refresh()
        } catch (err: any) {
            console.error('Error al actualizar unidad:', err)
            setError(err.message || 'Error al actualizar la unidad')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        router.push(`/dashboard/unidades/${resolvedParams.id}`)
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
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Unidad no encontrada</h2>
                    <button
                        onClick={() => router.push('/dashboard/unidades')}
                        className="text-indigo-600 hover:text-indigo-700 mt-4"
                    >
                        Volver a Unidades
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Editar Unidad Didáctica
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Modifica la información de la unidad
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-3 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit(initialData)
                    }}
                    className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título de la Unidad *
                            </label>
                            <input
                                type="text"
                                required
                                value={initialData.titulo}
                                onChange={(e) => setInitialData({ ...initialData, titulo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                value={initialData.duracion_semanas}
                                onChange={(e) => setInitialData({ ...initialData, duracion_semanas: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                value={initialData.orden}
                                onChange={(e) => setInitialData({ ...initialData, orden: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Situación Significativa *
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={initialData.situacion_significativa}
                                onChange={(e) => setInitialData({ ...initialData, situacion_significativa: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Propósito de Aprendizaje *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={initialData.proposito_aprendizaje}
                                onChange={(e) => setInitialData({ ...initialData, proposito_aprendizaje: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-xl font-bold border-b pb-2 mb-4 text-indigo-900 border-indigo-200">1. Matriz CNEB Autodetectada</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Competencia</label>
                                    <input
                                        type="text"
                                        value={initialData.matriz_ia?.competencia || ''}
                                        onChange={(e) => setInitialData({
                                            ...initialData,
                                            matriz_ia: { ...initialData.matriz_ia, competencia: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Capacidades</label>
                                    {initialData.matriz_ia?.capacidades?.map((cap: string, index: number) => (
                                        <div key={`cap-${index}`} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={cap}
                                                onChange={(e) => {
                                                    const newCaps = [...initialData.matriz_ia.capacidades];
                                                    newCaps[index] = e.target.value;
                                                    setInitialData({ ...initialData, matriz_ia: { ...initialData.matriz_ia, capacidades: newCaps } });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Desempeños Precisados</label>
                                    {initialData.matriz_ia?.desempenos_contextualizados?.map((des: string, index: number) => (
                                        <div key={`des-${index}`} className="flex gap-2 mb-2">
                                            <textarea
                                                rows={2}
                                                value={des}
                                                onChange={(e) => {
                                                    const newDes = [...initialData.matriz_ia.desempenos_contextualizados];
                                                    newDes[index] = e.target.value;
                                                    setInitialData({ ...initialData, matriz_ia: { ...initialData.matriz_ia, desempenos_contextualizados: newDes } });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-xl font-bold border-b pb-2 mb-4 text-emerald-900 border-emerald-200">2. Evaluación de la Unidad</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Evidencia Principal</label>
                                        <textarea
                                            rows={2}
                                            value={initialData.evaluacion_ia?.evidencias || ''}
                                            onChange={(e) => setInitialData({
                                                ...initialData,
                                                evaluacion_ia: { ...initialData.evaluacion_ia, evidencias: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Instrumento de Evaluación</label>
                                        <input
                                            type="text"
                                            value={initialData.evaluacion_ia?.instrumento || ''}
                                            onChange={(e) => setInitialData({
                                                ...initialData,
                                                evaluacion_ia: { ...initialData.evaluacion_ia, instrumento: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 h-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Criterios de Evaluación</label>
                                    {initialData.evaluacion_ia?.criterios?.map((crit: string, index: number) => (
                                        <div key={`crit-${index}`} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={crit}
                                                onChange={(e) => {
                                                    const newCrits = [...initialData.evaluacion_ia.criterios];
                                                    newCrits[index] = e.target.value;
                                                    setInitialData({ ...initialData, evaluacion_ia: { ...initialData.evaluacion_ia, criterios: newCrits } });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-xl font-bold border-b pb-2 mb-4 text-purple-900 border-purple-200">3. Enfoques Transversales</h3>
                            <div className="space-y-4">
                                {initialData.enfoques_transversales?.map((enfoque: any, index: number) => (
                                    <div key={`enf-${index}`} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase">Enfoque</label>
                                                <input
                                                    type="text"
                                                    value={enfoque.enfoque}
                                                    onChange={(e) => {
                                                        const newEnf = [...initialData.enfoques_transversales];
                                                        newEnf[index] = { ...newEnf[index], enfoque: e.target.value };
                                                        setInitialData({ ...initialData, enfoques_transversales: newEnf });
                                                    }}
                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase">Valor</label>
                                                <input
                                                    type="text"
                                                    value={enfoque.valor}
                                                    onChange={(e) => {
                                                        const newEnf = [...initialData.enfoques_transversales];
                                                        newEnf[index] = { ...newEnf[index], valor: e.target.value };
                                                        setInitialData({ ...initialData, enfoques_transversales: newEnf });
                                                    }}
                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase">Actitudes observables</label>
                                                <textarea
                                                    rows={2}
                                                    value={enfoque.actitudes}
                                                    onChange={(e) => {
                                                        const newEnf = [...initialData.enfoques_transversales];
                                                        newEnf[index] = { ...newEnf[index], actitudes: e.target.value };
                                                        setInitialData({ ...initialData, enfoques_transversales: newEnf });
                                                    }}
                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
