'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SesionWizard, { type SesionFormData } from '@/components/sesiones/SesionWizard'
import { sesionService } from '@/lib/services/SesionService'
import { planificadorService } from '@/lib/services/PlanificadorService'
import { createClient } from '@/lib/supabase/client'

export default function AsistenteSesionPage() {
    const params = useParams()
    const router = useRouter()
    const [initialData, setInitialData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadSesion()
    }, [params.id])

    async function loadSesion() {
        try {
            const data = await sesionService.get(params.id as string)

            // Obtener IDs de desempeños
            const desempenosIds = data.detalles_sesion?.map(d => d.desempenos.id) || []

            // Obtener secuencias ordenadas
            const secuencias = await sesionService.getSecuencias(params.id as string)

            setInitialData({
                titulo: data.titulo,
                unidad_id: data.unidad_id,
                duracion_minutos: data.duracion_minutos || 90,
                fecha: data.fecha_tentativa ?? new Date().toISOString().split('T')[0],
                proposito: data.proposito_aprendizaje || '',
                evidencias_aprendizaje: data.evidencias_aprendizaje || '',
                desempenos_ids: desempenosIds,
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
        } catch (err) {
            console.error('Error loading session:', err)
            setError('Error al cargar la sesión')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (formData: SesionFormData) => {
        try {
            setError(null)
            const sessionId = params.id as string

            // Determine fecha_tentativa: use earliest section date, or the plain fecha
            const fechasArr = Object.values(formData.fechas_seccion || {}).filter(Boolean)
            const fechaTentativa = fechasArr.length > 0
                ? fechasArr.sort()[0]
                : formData.fecha

            // 1. Update basic information
            await sesionService.update(sessionId, {
                titulo: formData.titulo,
                unidad_id: formData.unidad_id,
                duracion_minutos: formData.duracion_minutos,
                fecha_tentativa: fechaTentativa,
                proposito_aprendizaje: formData.proposito || null,
                contenido_ia: formData.contenido_ia || null
            } as any)

            // 2. Update learning objectives (desempeños)
            await sesionService.addDesempenos(sessionId, formData.desempenos_ids)

            // 3. Replace sequences
            const existingSecuencias = await sesionService.getSecuencias(sessionId)
            for (const sec of existingSecuencias) {
                await sesionService.deleteSecuencia(sec.id)
            }
            for (const secuencia of formData.secuencias) {
                await sesionService.addSecuencia(sessionId, secuencia)
            }

            // 4. Save per-section dates if any
            if (formData.fechas_seccion && Object.keys(formData.fechas_seccion).length > 0) {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const toSave = Object.entries(formData.fechas_seccion)
                        .filter(([, fecha]) => fecha)
                        .map(([seccion, fecha]) => ({ seccion, fecha }))
                    if (toSave.length > 0) {
                        await planificadorService.saveFechasPorSeccion(sessionId, user.id, toSave)
                    }
                }
            }

            // 5. Validate and redirect
            await sesionService.validate(sessionId)
            router.push(`/dashboard/sesiones/${sessionId}`)
            router.refresh()

        } catch (err: any) {
            console.error('Error updating session via wizard:', err)
            setError(err.message || 'Error al actualizar la sesión')
        }
    }

    const handleSaveDraft = async (formData: SesionFormData) => {
        try {
            setError(null)
            const sessionId = params.id as string

            // Determine fecha_tentativa
            const fechasArr = Object.values(formData.fechas_seccion || {}).filter(Boolean)
            const fechaTentativa = fechasArr.length > 0
                ? fechasArr.sort()[0]
                : formData.fecha

            // 1. Update basic information only
            await sesionService.update(sessionId, {
                titulo: formData.titulo,
                unidad_id: formData.unidad_id,
                duracion_minutos: formData.duracion_minutos,
                fecha_tentativa: fechaTentativa,
                proposito_aprendizaje: formData.proposito || null,
                contenido_ia: formData.contenido_ia || null
            } as any)

            // 2. Update learning objectives (desempeños)
            await sesionService.addDesempenos(sessionId, formData.desempenos_ids)

            // 3. Replace sequences
            const existingSecuencias = await sesionService.getSecuencias(sessionId)
            for (const sec of existingSecuencias) {
                await sesionService.deleteSecuencia(sec.id)
            }
            for (const secuencia of formData.secuencias) {
                await sesionService.addSecuencia(sessionId, secuencia)
            }

            // 4. Save per-section dates if any
            if (formData.fechas_seccion && Object.keys(formData.fechas_seccion).length > 0) {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const toSave = Object.entries(formData.fechas_seccion)
                        .filter(([, fecha]) => fecha)
                        .map(([seccion, fecha]) => ({ seccion, fecha }))
                    if (toSave.length > 0) {
                        await planificadorService.saveFechasPorSeccion(sessionId, user.id, toSave)
                    }
                }
            }

            // Skip validation and redirect back to detail view
            router.push(`/dashboard/sesiones/${sessionId}`)
            router.refresh()

        } catch (err: any) {
            console.error('Error saving draft via wizard:', err)
            setError(err.message || 'Error al guardar avance')
        }
    }

    const handleCancel = () => {
        router.push(`/dashboard/sesiones/${params.id}`)
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
                        <Link href={`/dashboard/sesiones/${params.id}`} className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
                            ← Volver al detalle
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
                        ✨ Completar con Asistente IA
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Completa los datos de esta sesión paso a paso usando nuestra inteligencia artificial.
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

                {/* Wizard Component */}
                <SesionWizard
                    unidadId={initialData.unidad_id}
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onSaveDraft={handleSaveDraft}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
