'use client'

interface ValidationBadgeProps {
    status: 'pending' | 'valid' | 'invalid'
    errorCount?: number
}

export default function ValidationBadge({ status, errorCount }: ValidationBadgeProps) {
    const config = {
        pending: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            icon: '⏳',
            label: 'Pendiente'
        },
        valid: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: '✓',
            label: 'Validado'
        },
        invalid: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: '⚠️',
            label: 'Con errores'
        }
    }

    const { bg, text, icon, label } = config[status]

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
            {icon} {label}
            {status === 'invalid' && errorCount && errorCount > 0 && (
                <span className="ml-1">({errorCount})</span>
            )}
        </span>
    )
}
