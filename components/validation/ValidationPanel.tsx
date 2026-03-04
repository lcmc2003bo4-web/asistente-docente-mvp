'use client'

import { useState } from 'react'
import type { ValidationResult } from '@/lib/services/ValidationService'

interface ValidationPanelProps {
    validation: ValidationResult | null
    onRevalidate?: () => Promise<void>
    loading?: boolean
    title?: string
    showSummary?: boolean
}

// ── Íconos SVG accesibles (reemplazan emojis ✅ ⚠️ ⏳ 🔄 📚) ──────────
const CheckCircleIcon = ({ className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const XCircleIcon = ({ className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)
const WarningIcon = ({ className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)
const RefreshIcon = ({ className = '' }) => (
    <svg className={`w-3.5 h-3.5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
)
const BookIcon = ({ className = '' }) => (
    <svg className={`w-3 h-3 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)
const SpinnerIcon = () => (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
)

export default function ValidationPanel({
    validation,
    onRevalidate,
    loading = false,
    title = 'Estado de Validación',
    showSummary = false
}: ValidationPanelProps) {
    const [warningsOpen, setWarningsOpen] = useState(false)
    const [revalidating, setRevalidating] = useState(false)

    if (!validation && !loading) return null

    const handleRevalidate = async () => {
        if (!onRevalidate) return
        setRevalidating(true)
        try {
            await onRevalidate()
        } finally {
            setRevalidating(false)
        }
    }

    // ── Estado de carga con skeleton ──────────────────────────────
    if (loading) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-5 h-5 bg-slate-200 rounded-full" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
                <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
        )
    }

    if (!validation) return null

    const isValid = validation.valid
    const hasErrors = validation.errors.length > 0
    const hasWarnings = validation.warnings.length > 0

    // Panel styling según estado
    const panelStyle = isValid
        ? { wrapper: 'border-emerald-200 bg-emerald-50', header: 'text-emerald-900', sub: 'text-emerald-700' }
        : hasErrors
            ? { wrapper: 'border-red-200 bg-red-50', header: 'text-red-900', sub: 'text-red-700' }
            : { wrapper: 'border-amber-200 bg-amber-50', header: 'text-amber-900', sub: 'text-amber-700' }

    const StatusIcon = isValid ? CheckCircleIcon : hasErrors ? XCircleIcon : WarningIcon
    const iconColor = isValid ? 'text-emerald-500' : hasErrors ? 'text-red-500' : 'text-amber-500'

    return (
        <div className={`border-2 rounded-xl p-5 mb-6 ${panelStyle.wrapper}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
                        <StatusIcon />
                    </span>
                    <div>
                        <h3 className={`font-semibold text-sm ${panelStyle.header}`}>{title}</h3>
                        <p className={`text-xs mt-0.5 ${panelStyle.sub}`}>
                            {isValid
                                ? 'El documento cumple con todas las validaciones normativas'
                                : `Se encontraron ${validation.errors.length} error(es) que deben corregirse`
                            }
                        </p>
                    </div>
                </div>

                {onRevalidate && (
                    <button
                        onClick={handleRevalidate}
                        disabled={revalidating}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {revalidating ? <SpinnerIcon /> : <RefreshIcon />}
                        {revalidating ? 'Validando...' : 'Revalidar'}
                    </button>
                )}
            </div>

            {/* Lista de errores */}
            {hasErrors && (
                <div className="space-y-2 mb-3">
                    {validation.errors.map((error, index) => (
                        <div key={index} className="flex items-start gap-2 bg-red-100 border border-red-200 rounded-lg p-3">
                            <span className="text-red-500 mt-0.5 flex-shrink-0">
                                <XCircleIcon className="w-4 h-4" />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-red-900">{error.message}</p>
                                {error.reference && (
                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <BookIcon className="flex-shrink-0" />
                                        {error.reference}
                                    </p>
                                )}
                            </div>
                            {error.code && (
                                <span className="text-xs text-red-400 font-mono bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0 border border-red-200">
                                    {error.code}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Advertencias (colapsable) */}
            {hasWarnings && (
                <div>
                    <button
                        onClick={() => setWarningsOpen(!warningsOpen)}
                        className="flex items-center gap-2 text-xs font-medium text-amber-800 hover:text-amber-900 transition mb-2"
                        aria-expanded={warningsOpen}
                    >
                        <ChevronIcon open={warningsOpen} />
                        <span>
                            {validation.warnings.length} advertencia{validation.warnings.length !== 1 ? 's' : ''}
                            {!warningsOpen && ' — click para ver'}
                        </span>
                    </button>

                    {warningsOpen && (
                        <div className="space-y-2">
                            {validation.warnings.map((warning, index) => (
                                <div key={index} className="flex items-start gap-2 bg-amber-100 border border-amber-200 rounded-lg p-3">
                                    <span className="text-amber-500 mt-0.5 flex-shrink-0">
                                        <WarningIcon className="w-4 h-4" />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-amber-900">{warning.message}</p>
                                        {warning.reference && (
                                            <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                                                <BookIcon className="flex-shrink-0" />
                                                {warning.reference}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Summary (opcional) */}
            {showSummary && validation.summary && (
                <div className="mt-4 pt-4 border-t border-white/60 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(validation.summary).map(([key, value]) => {
                        const labels: Record<string, string> = {
                            total_unidades: 'Unidades',
                            duracion_total: 'Duración Total',
                            duracion_esperada: 'Esperada',
                            total_competencias: 'Competencias',
                            competencias_sin_usar: 'Sin Usar',
                        }
                        return (
                            <div key={key} className="text-center">
                                <div className="text-lg font-bold text-slate-900">{String(value)}</div>
                                <div className="text-xs text-slate-500">{labels[key] || key}</div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Timestamp */}
            {validation.validated_at && (
                <p className="text-xs text-slate-400 mt-3">
                    Última validación: {new Date(validation.validated_at).toLocaleString('es-PE')}
                </p>
            )}
        </div>
    )
}
