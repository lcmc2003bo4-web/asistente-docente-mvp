import React from 'react'

type BadgeVariant = 'programacion' | 'unidad' | 'sesion' | 'valid' | 'warning' | 'error' | 'info' | 'default'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
    variant?: BadgeVariant
    size?: BadgeSize
    children: React.ReactNode
    className?: string
    dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
    programacion: 'bg-blue-50 text-blue-700 ring-blue-200',
    unidad: 'bg-violet-50 text-violet-700 ring-violet-200',
    sesion: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    valid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    error: 'bg-red-50 text-red-700 ring-red-200',
    info: 'bg-blue-50 text-blue-700 ring-blue-200',
    default: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const dotColors: Record<BadgeVariant, string> = {
    programacion: 'bg-blue-500',
    unidad: 'bg-violet-500',
    sesion: 'bg-indigo-500',
    valid: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-slate-400',
}

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
}

export default function Badge({
    variant = 'default',
    size = 'sm',
    children,
    className = '',
    dot = false,
}: BadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center font-medium rounded-full ring-1 ring-inset',
                variantClasses[variant],
                sizeClasses[size],
                className,
            ].join(' ')}
        >
            {dot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    )
}
