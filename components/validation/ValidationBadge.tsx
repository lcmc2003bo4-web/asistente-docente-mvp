import React from 'react'

interface ValidationBadgeProps {
    status: 'valid' | 'invalid' | 'pending' | string | null | undefined
    size?: 'sm' | 'md'
    showLabel?: boolean
}

export default function ValidationBadge({
    status,
    size = 'md',
    showLabel = true
}: ValidationBadgeProps) {
    const config = {
        valid: {
            icon: '✓',
            label: 'Válida',
            className: 'bg-green-100 text-green-800 border-green-200'
        },
        invalid: {
            icon: '✗',
            label: 'Errores',
            className: 'bg-red-100 text-red-800 border-red-200'
        },
        pending: {
            icon: '⏳',
            label: 'Pendiente',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
    }

    const key = (status as string) in config ? (status as string) : 'pending'
    const { icon, label, className } = config[key as keyof typeof config]

    const sizeClass = size === 'sm'
        ? 'px-1.5 py-0.5 text-xs'
        : 'px-2 py-1 text-xs font-medium'

    return (
        <span className={`inline-flex items-center gap-1 rounded border ${sizeClass} ${className}`}>
            <span>{icon}</span>
            {showLabel && <span>{label}</span>}
        </span>
    )
}
