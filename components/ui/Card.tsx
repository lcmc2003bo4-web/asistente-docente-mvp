import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'flat' | 'interactive'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    as?: React.ElementType
    onClick?: () => void
}

const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-xs',
    flat: 'bg-slate-50 border border-transparent',
    interactive: 'bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200',
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
}

export default function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    as: Component = 'div',
    onClick,
}: CardProps) {
    return (
        <Component
            onClick={onClick}
            className={[
                'rounded-2xl',
                variantClasses[variant],
                paddingClasses[padding],
                className,
            ].join(' ')}
        >
            {children}
        </Component>
    )
}
