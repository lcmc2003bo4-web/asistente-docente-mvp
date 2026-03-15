'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { unidadService } from '@/lib/services/UnidadService'
import { sesionService } from '@/lib/services/SesionService'
import UnidadForm, { UnidadFormData } from '@/components/unidades/UnidadForm'

export default function NuevaUnidadPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const programacionId = searchParams.get('programacion')

    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: UnidadFormData) => {
        try {
            setIsLoading(true)
            setError(null)

            // Obtener usuario actual
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No autenticado')

            if (!formData.ia_data) {
                throw new Error('Faltan datos generados por IA')
            }

            // Manejar situacion_significativa (puede ser string u objeto)
            const ssContent = typeof formData.ia_data.situacion_significativa === 'string'
                ? formData.ia_data.situacion_significativa
                : formData.ia_data.situacion_significativa ? `**Contexto:**\n${(formData.ia_data.situacion_significativa as any).contexto}\n\n**Reto:**\n${(formData.ia_data.situacion_significativa as any).reto}\n\n**Propósito:**\n${(formData.ia_data.situacion_significativa as any).proposito}` : null;

            // Crear unidad (los campos adicionales Json los casteamos a any para simplificar)
            const secuenciaIA = formData.ia_data.secuencia_sesiones ?? (formData.ia_data as any).secuencia_actividades;

            const unidadToCreate: any = {
                titulo: formData.titulo,
                programacion_id: formData.programacion_id,
                situacion_significativa: ssContent,
                proposito_aprendizaje: formData.ia_data.proposito_aprendizaje,
                evaluacion_ia: formData.ia_data.evaluacion,
                enfoques_transversales: formData.ia_data.enfoques_transversales,
                matriz_ia: formData.ia_data.matrices_ia ?? formData.ia_data.matriz_ia,
                aprendizajes_esperados: formData.ia_data.aprendizajes_esperados,
                criterios_evaluacion: formData.ia_data.criterios_evaluacion_matriz,
                secuencia_sesiones_ia: secuenciaIA,
                duracion_semanas: formData.duracion_semanas,
                orden: formData.orden,
                fecha_inicio: formData.fecha_inicio || null,
                fecha_fin: formData.fecha_fin || null,
                user_id: user.id,
                estado: 'Borrador'
            }

            const unidad = await unidadService.create(unidadToCreate)

            // Crear sesiones basadas en la secuencia de la IA
            if (secuenciaIA && secuenciaIA.length > 0) {
                const sesionesToInsert = secuenciaIA.map((ses: any, idx: number) => ({
                    titulo: ses.titulo,
                    orden: idx + 1,
                    duracion_minutos: 90, // default
                    unidad_id: unidad.id,
                    user_id: user.id,
                    estado: 'Borrador',
                    // Mapeo flexible para campos privados vs públicos
                    proposito_aprendizaje: ses.desempenos || ses.desempeno_precisado || null,
                    evidencias_aprendizaje: ses.experiencia_aprendizaje || ses.evidencia || null
                }))
                await sesionService.createMany(sesionesToInsert as any)
            }

            // Validar la unidad para que verifique incoherencias generales si era parte de la lógica (opcional)
            try {
                await unidadService.validate(unidad.id)
            } catch (vErr) {
                // ignorar errores de validación duros por ahora
                console.warn("Validation warning", vErr)
            }

            // Redirigir
            if (programacionId) {
                router.push(`/dashboard/programaciones/${programacionId}`)
            } else {
                router.push('/dashboard/unidades')
            }
            router.refresh()
        } catch (err: any) {
            console.error('Error al crear unidad completa:', err)
            console.error('Detalles del error:', JSON.stringify(err))
            setError(err.message || err.details || err.hint || 'Error al crear la unidad y sus sesiones')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        if (programacionId) {
            router.push(`/dashboard/programaciones/${programacionId}`)
        } else {
            router.push('/dashboard/unidades')
        }
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
                        Generador Automático de Unidades Didácticas
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Nuestra IA estructurará todos los elementos pedagógicos alineados al CNEB
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

                {/* Form */}
                <UnidadForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                    programacionId={programacionId || undefined}
                />
            </div>
        </div>
    )
}
