import React from 'react'

interface SkeletonProps {
    className?: string
    height?: string
    width?: string
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
}

export default function Skeleton({
    className = '',
    height = 'h-4',
    width = 'w-full',
    rounded = 'md',
}: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={[
                'skeleton',          // clase en globals.css con la animación
                height,
                width,
                roundedClasses[rounded],
                className,
            ].join(' ')}
        />
    )
}

/* ── Variantes compuestas para casos comunes ── */

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <Skeleton height="h-5" width="w-1/2" />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} height="h-3" width={i === rows - 1 ? 'w-3/4' : 'w-full'} />
            ))}
        </div>
    )
}

export function SkeletonStatCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <div className="flex items-center justify-between mb-3">
                <Skeleton height="h-12" width="w-12" rounded="xl" />
                <Skeleton height="h-5" width="w-16" rounded="full" />
            </div>
            <Skeleton height="h-8" width="w-12" />
            <Skeleton height="h-4" width="w-32" />
        </div>
    )
}

export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
            <Skeleton height="h-8" width="w-8" rounded="lg" />
            <div className="flex-1 space-y-1.5">
                <Skeleton height="h-3.5" width="w-3/4" />
                <Skeleton height="h-3" width="w-1/3" />
            </div>
            <Skeleton height="h-5" width="w-16" rounded="full" />
        </div>
    )
}
