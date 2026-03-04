'use client'

import React, { useEffect } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    message: string
    type?: ToastType
    onClose: () => void
    duration?: number
}

const typeConfig: Record<ToastType, { bg: string; icon: React.ReactNode; title: string }> = {
    success: {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        title: 'Éxito',
        icon: (
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    error: {
        bg: 'bg-red-50 border-red-200 text-red-800',
        title: 'Error',
        icon: (
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
    warning: {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        title: 'Atención',
        icon: (
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    info: {
        bg: 'bg-blue-50 border-blue-200 text-blue-800',
        title: 'Información',
        icon: (
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
    },
}

export function Toast({ message, type = 'info', onClose, duration = 4000 }: ToastProps) {
    const config = typeConfig[type]

    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [onClose, duration])

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm shadow-md max-w-sm ${config.bg} animate-in slide-in-from-right-4 duration-300`}
        >
            {config.icon}
            <p className="flex-1 font-medium leading-snug">{message}</p>
            <button
                onClick={onClose}
                aria-label="Cerrar notificación"
                className="text-current opacity-50 hover:opacity-100 transition flex-shrink-0 mt-0.5"
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    )
}

/* ── Toast Container (posicionado fixed top-right) ── */
interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type: ToastType }>
    onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null
    return (
        <div
            aria-label="Notificaciones"
            className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        >
            {toasts.map(t => (
                <div key={t.id} className="pointer-events-auto">
                    <Toast message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
                </div>
            ))}
        </div>
    )
}
