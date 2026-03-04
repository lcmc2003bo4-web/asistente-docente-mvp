import React from 'react'
import Button from './Button'

interface EmptyStateProps {
    title: string
    description?: string
    icon?: React.ReactNode
    action?: {
        label: string
        onClick?: () => void
        href?: string
    }
    className?: string
}

const DefaultIcon = () => (
    <svg
        className="w-12 h-12 text-slate-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
)

export default function EmptyState({
    title,
    description,
    icon,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 text-center px-6 ${className}`}>
            {/* Icon */}
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                {icon ?? <DefaultIcon />}
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>

            {/* Description */}
            {description && (
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">{description}</p>
            )}

            {/* CTA */}
            {action && (
                action.href ? (
                    <a href={action.href}>
                        <Button variant="primary" size="md">
                            {action.label}
                        </Button>
                    </a>
                ) : (
                    <Button variant="primary" size="md" onClick={action.onClick}>
                        {action.label}
                    </Button>
                )
            )}
        </div>
    )
}
