'use client'

import React from 'react'
import Link from 'next/link'

interface ContextoInstitucionalBannerProps {
    institucionNombre?: string
    className?: string
}

/**
 * Banner informativo que se muestra cuando la institución del docente
 * no tiene el perfil de contextualización completo.
 * NO bloquea ninguna funcionalidad — es solo informativo.
 */
export default function ContextoInstitucionalBanner({
    institucionNombre,
    className = '',
}: ContextoInstitucionalBannerProps) {
    return (
        <div
            className={`flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 px-4 py-3 ${className}`}
            role="status"
        >
            <span className="text-amber-500 text-lg mt-0.5 shrink-0" aria-hidden="true">⚡</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Mejora la calidad de tus Unidades de Aprendizaje
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    {institucionNombre
                        ? `Completa el perfil de "${institucionNombre}" para que la IA genere situaciones significativas contextualizadas a tu comunidad.`
                        : 'Completa el perfil de tu institución para que la IA genere situaciones significativas contextualizadas.'}
                </p>
            </div>
            <Link
                href="/configuracion/institucion"
                className="shrink-0 px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
                Completar perfil
            </Link>
        </div>
    )
}
