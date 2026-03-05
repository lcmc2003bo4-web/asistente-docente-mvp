'use client'

import { UserUsage } from '@/lib/services/UsageService'

interface UsageBannerProps {
    usage: UserUsage
    onUpgradeClick: () => void
}

function UsageBar({
    used,
    limit,
    label,
    color = 'indigo',
}: {
    used: number
    limit: number
    label: string
    color?: 'indigo' | 'violet' | 'blue' | 'amber'
}) {
    const isPro = limit >= 999
    const pct = isPro ? 0 : Math.min((used / limit) * 100, 100)
    const isAtLimit = !isPro && pct >= 100
    const isNear = !isPro && pct >= 80 && !isAtLimit

    const barColor = isAtLimit
        ? 'bg-red-500'
        : isNear
            ? 'bg-amber-400'
            : color === 'violet'
                ? 'bg-violet-500'
                : color === 'blue'
                    ? 'bg-blue-500'
                    : color === 'amber'
                        ? 'bg-amber-400'
                        : 'bg-indigo-500'

    const countColor = isAtLimit
        ? 'text-red-600 font-bold'
        : isNear
            ? 'text-amber-600 font-semibold'
            : 'text-slate-400'

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">{label}</span>
                <span className={`text-[11px] tabular-nums ${countColor}`}>
                    {isPro ? `${used} / ∞` : `${used} / ${limit}`}
                </span>
            </div>
            {!isPro && (
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            )}
        </div>
    )
}

// Íconos inline
const ZapIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
)
const CrownIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2 20h20v2H2v-2zm2-3l3-9 5 5 5-5 3 9H4z" />
    </svg>
)

export default function UsageBanner({ usage, onUpgradeClick }: UsageBannerProps) {
    const isPro = usage.plan_tier === 'pro'

    if (isPro) {
        return (
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-3">
                <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                        <CrownIcon />
                    </div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Plan PRO</span>
                </div>
                <div className="space-y-2">
                    <UsageBar used={usage.programaciones_count} limit={usage.prog_limit} label="Programaciones" color="blue" />
                    <UsageBar used={usage.unidades_count} limit={usage.unidades_limit} label="Unidades" color="violet" />
                    <UsageBar used={usage.sesiones_count} limit={usage.sesiones_limit} label="Sesiones" color="indigo" />
                    <UsageBar used={usage.ai_generations_used} limit={usage.ai_generations_limit} label="IA este mes" color="amber" />
                </div>
            </div>
        )
    }

    // ── Plan Free ──────────────────────────────────────
    const progPct = Math.min((usage.programaciones_count / usage.prog_limit) * 100, 100)
    const sesionPct = Math.min((usage.sesiones_count / usage.sesiones_limit) * 100, 100)
    const aiPct = Math.min((usage.ai_generations_used / usage.ai_generations_limit) * 100, 100)
    const isAnyAtLimit = progPct >= 100 || sesionPct >= 100 || aiPct >= 100
    const isAnyNear = progPct >= 80 || sesionPct >= 80 || aiPct >= 80

    return (
        <div className={`rounded-xl border p-3 ${isAnyAtLimit ? 'border-red-100 bg-red-50/60' : isAnyNear ? 'border-amber-100 bg-amber-50/60' : 'border-slate-100 bg-slate-50'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${isAnyAtLimit ? 'bg-red-500' : 'bg-slate-400'}`}>
                        <ZapIcon />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isAnyAtLimit ? 'text-red-700' : 'text-slate-500'}`}>
                        Plan Gratuito
                    </span>
                </div>
                <button
                    onClick={onUpgradeClick}
                    className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-opacity shadow-sm"
                >
                    PRO ↑
                </button>
            </div>

            {/* Barras de uso */}
            <div className="space-y-2">
                <UsageBar used={usage.programaciones_count} limit={usage.prog_limit} label="Programaciones" color="blue" />
                <UsageBar used={usage.unidades_count} limit={usage.unidades_limit} label="Unidades" color="violet" />
                <UsageBar used={usage.sesiones_count} limit={usage.sesiones_limit} label="Sesiones" color="indigo" />
                <UsageBar used={usage.ai_generations_used} limit={usage.ai_generations_limit} label="IA este mes" color="amber" />
            </div>

            {/* Mensaje contextual */}
            {isAnyAtLimit && (
                <button
                    onClick={onUpgradeClick}
                    className="mt-3 w-full text-xs text-center text-red-600 font-semibold hover:text-red-700 transition-colors py-1.5 rounded-lg hover:bg-red-100"
                >
                    ⚠ Límite alcanzado — Mejorar plan
                </button>
            )}
            {!isAnyAtLimit && isAnyNear && (
                <button
                    onClick={onUpgradeClick}
                    className="mt-3 w-full text-xs text-center text-amber-700 font-semibold hover:text-amber-800 transition-colors py-1.5 rounded-lg hover:bg-amber-100"
                >
                    Estás llegando al límite — Ver PRO
                </button>
            )}
        </div>
    )
}
