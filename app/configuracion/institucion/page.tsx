'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import InstitutionProfileWizard from '@/components/configuracion/InstitutionProfileWizard'

/**
 * Página de configuración del perfil de contextualización institucional.
 * Ruta: /configuracion/institucion
 */
export default function ConfiguracionInstitucionPage() {
    const [institucionId, setInstitucionId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [completado, setCompletado] = useState(false)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return
            const { data } = await supabase
                .from('instituciones')
                .select('id, perfil_completado')
                .eq('user_id', user.id)
                .eq('es_predeterminada', true)
                .maybeSingle()
            if (data) {
                setInstitucionId(data.id)
                setCompletado((data as any).perfil_completado ?? false)
            }
            setLoading(false)
        })
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <a href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</a>
                        <span className="mx-2">›</span>
                        <a href="/configuracion" className="hover:text-indigo-600 transition-colors">Configuración</a>
                        <span className="mx-2">›</span>
                        <span className="text-gray-700 dark:text-gray-200">Perfil Institucional</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Perfil de Contextualización
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Completa la información de tu institución para que las Unidades de Aprendizaje generadas
                        sean relevantes y coherentes con la realidad de tu comunidad educativa.
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!loading && !institucionId && (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Primero registra tu institución educativa en la sección de Configuración.
                        </p>
                        <a
                            href="/configuracion"
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Ir a Configuración
                        </a>
                    </div>
                )}

                {!loading && institucionId && completado && (
                    <div className="rounded-xl border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/10 p-6 text-center">
                        <p className="text-green-700 dark:text-green-400 font-medium text-lg mb-2">
                            ✓ Perfil institucional completado
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500 mb-4">
                            La IA utilizará el contexto de tu institución al generar Unidades de Aprendizaje.
                        </p>
                        <button
                            onClick={() => setCompletado(false)}
                            className="px-4 py-2 text-sm text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                            Actualizar perfil
                        </button>
                    </div>
                )}

                {!loading && institucionId && !completado && (
                    <InstitutionProfileWizard
                        institucionId={institucionId}
                        onCompleted={() => setCompletado(true)}
                    />
                )}
            </div>
        </div>
    )
}
