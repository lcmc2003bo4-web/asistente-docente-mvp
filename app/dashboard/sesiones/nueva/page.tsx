'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import SesionWizard, { type SesionFormData } from '@/components/sesiones/SesionWizard'
import { sesionService } from '@/lib/services/SesionService'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NuevaSesionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const unidadId = searchParams.get('unidad')

    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: SesionFormData) => {
        try {
            setError(null)

            // Obtener usuario autenticado (requerido por RLS)
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No autenticado. Por favor inicia sesión.')

            // 1. Crear sesión
            const sesion = await sesionService.create({
                user_id: user.id,
                titulo: formData.titulo,
                unidad_id: formData.unidad_id,
                orden: 1,
                duracion_minutos: formData.duracion_minutos,
                fecha_tentativa: formData.fecha,
                proposito_aprendizaje: formData.proposito || null,
                contenido_ia: formData.contenido_ia || null,
                validation_status: 'pending'
            } as any)

            // 2. Agregar desempeños
            if (formData.desempenos_ids.length > 0) {
                await sesionService.addDesempenos(sesion.id, formData.desempenos_ids)
            }

            // 3. Agregar secuencias
            for (const secuencia of formData.secuencias) {
                await sesionService.addSecuencia(sesion.id, secuencia)
            }

            // 4. Validar
            await sesionService.validate(sesion.id)

            // 5. Redirigir al detalle
            router.push(`/dashboard/sesiones/${sesion.id}`)
        } catch (err: any) {
            console.error('Error creating sesion:', err)
            setError(err.message || 'Error al crear la sesión')
        }
    }

    const handleCancel = () => {
        if (unidadId) {
            router.push(`/dashboard/unidades/${unidadId}`)
        } else {
            router.push('/dashboard/sesiones')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={unidadId ? `/dashboard/unidades/${unidadId}` : '/dashboard/sesiones'}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-4 inline-block"
                    >
                        ← Volver
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Nueva Sesión de Aprendizaje
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Crea una nueva sesión siguiendo el asistente paso a paso
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

                {/* Wizard */}
                <SesionWizard
                    unidadId={unidadId || undefined}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
