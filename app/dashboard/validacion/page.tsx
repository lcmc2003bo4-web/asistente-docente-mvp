'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { validationService, type ValidationSummary } from '@/lib/services/ValidationService'
import ValidationBadge from '@/components/validation/ValidationBadge'
import EmptyState from '@/components/ui/EmptyState'

// ── Íconos SVG inline ─────────────────────────────────────────────────
const FileIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
)
const CheckCircleIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const XCircleIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)
const TargetIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
)
const CalendarIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const BookOpenIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const FileTextIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)
const ShieldCheckIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
)
const DocumentBigIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
)

export default function ValidacionDashboardPage() {
    const [summary, setSummary] = useState<ValidationSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSummary()
    }, [])

    async function loadSummary() {
        try {
            const data = await validationService.getValidationSummary()
            setSummary(data)
        } catch (error) {
            console.error('Error loading validation summary:', error)
        } finally {
            setLoading(false)
        }
    }

    const typeConfig: Record<string, { label: string; icon: React.ReactNode; href: string }> = {
        programacion: { label: 'Programación', icon: <CalendarIcon className="w-6 h-6" />, href: '/dashboard/programaciones' },
        unidad: { label: 'Unidad Didáctica', icon: <BookOpenIcon className="w-6 h-6" />, href: '/dashboard/unidades' },
        sesion: { label: 'Sesión', icon: <FileTextIcon className="w-6 h-6" />, href: '/dashboard/sesiones' }
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 rounded w-1/3" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
                    ))}
                </div>
                <div className="h-24 bg-slate-100 rounded-2xl" />
            </div>
        )
    }

    const validPercent = summary && summary.total_documents > 0
        ? Math.round((summary.valid / summary.total_documents) * 100)
        : 0

    const barColor = validPercent >= 80 ? 'bg-emerald-500' : validPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
    const pctColor = validPercent >= 80 ? 'text-emerald-600' : validPercent >= 50 ? 'text-amber-600' : 'text-red-600'

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Motor de Validación Normativa</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Estado de cumplimiento normativo de todos tus documentos pedagógicos
                </p>
            </div>

            {/* Stats Cards — 4 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: 'Total Documentos', value: summary?.total_documents || 0,
                        icon: <FileIcon />, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200',
                    },
                    {
                        label: 'Válidos', value: summary?.valid || 0,
                        icon: <CheckCircleIcon />, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200',
                    },
                    {
                        label: 'Con Errores', value: summary?.invalid || 0,
                        icon: <XCircleIcon />, color: 'text-red-500', bg: 'bg-red-50 border-red-200',
                    },
                    {
                        label: 'Cumplimiento', value: `${validPercent}%`,
                        icon: <TargetIcon />, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200',
                    },
                ].map(({ label, value, icon, color, bg }) => (
                    <div key={label} className={`rounded-2xl border p-5 ${bg}`} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500">{label}</p>
                                <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                            </div>
                            <span className={color} aria-hidden="true">{icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barra de progreso */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 text-sm">Índice de Cumplimiento Normativo</h3>
                    <span className={`text-lg font-bold ${pctColor}`}>{validPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${validPercent}%` }}
                        role="progressbar"
                        aria-valuenow={validPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>0% · Crítico</span>
                    <span>50% · Aceptable</span>
                    <span>80% · Bueno</span>
                    <span>100% · Excelente</span>
                </div>
            </div>

            {/* Por tipo de documento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {summary && Object.entries(summary.by_type).map(([type, counts]) => {
                    const typeKey = type === 'programaciones' ? 'programacion' : type === 'unidades' ? 'unidad' : 'sesion'
                    const config = typeConfig[typeKey]
                    const pct = counts.total > 0 ? Math.round((counts.valid / counts.total) * 100) : 0
                    const barPctColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'

                    return (
                        <div key={type} className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500" aria-hidden="true">
                                    {config.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm capitalize">{type}</h3>
                                    <p className="text-xs text-slate-500">{counts.total} documentos</p>
                                </div>
                            </div>

                            <div className="space-y-1.5 mb-4 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-emerald-700 flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3" /> Válidos
                                    </span>
                                    <span className="font-semibold text-emerald-700">{counts.valid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-700 flex items-center gap-1">
                                        <XCircleIcon className="w-3 h-3" /> Con errores
                                    </span>
                                    <span className="font-semibold text-red-700">{counts.invalid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-700">Pendientes</span>
                                    <span className="font-semibold text-amber-700">{counts.pending}</span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                                <div className={`h-2 rounded-full ${barPctColor}`} style={{ width: `${pct}%` }} />
                            </div>

                            <Link
                                href={config.href}
                                className="block text-center text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                Ver {type} →
                            </Link>
                        </div>
                    )
                })}
            </div>

            {/* Documentos con errores */}
            {summary && summary.documents_with_errors.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                        <span className="text-red-500"><XCircleIcon className="w-4 h-4" /></span>
                        Documentos con Errores ({summary.documents_with_errors.length})
                    </h3>
                    <div className="space-y-2.5">
                        {summary.documents_with_errors.map((doc) => {
                            const config = typeConfig[doc.type]
                            const href = doc.type === 'programacion'
                                ? `/dashboard/programaciones/${doc.id}`
                                : doc.type === 'unidad'
                                    ? `/dashboard/unidades/${doc.id}`
                                    : `/dashboard/sesiones/${doc.id}`

                            return (
                                <Link
                                    key={doc.id}
                                    href={href}
                                    className="flex items-start justify-between p-4 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-400 mt-0.5" aria-hidden="true">{config.icon}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {doc.titulo}
                                                </span>
                                                <ValidationBadge status="invalid" size="sm" />
                                            </div>
                                            <p className="text-xs text-red-700 mt-1">{doc.first_error}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
                                            {doc.error_count} error{doc.error_count !== 1 ? 'es' : ''}
                                        </span>
                                        <span className="text-slate-400 text-sm">→</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Estado: todos válidos */}
            {summary && summary.invalid === 0 && summary.total_documents > 0 && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-10 text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheckIcon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                        ¡Todos los documentos son válidos!
                    </h3>
                    <p className="text-emerald-700 text-sm">
                        Tu planificación curricular cumple con todas las validaciones normativas.
                    </p>
                </div>
            )}

            {/* Empty state */}
            {summary && summary.total_documents === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
                    <EmptyState
                        title="No hay documentos para validar"
                        description="Comienza creando tu primera programación anual"
                        icon={<DocumentBigIcon />}
                        action={{ label: 'Crear Programación', href: '/dashboard/programaciones/nueva' }}
                    />
                </div>
            )}

            {/* Marco Normativo */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mt-8">
                <h3 className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4 text-indigo-500" />
                    Marco Normativo de Referencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-indigo-800">
                    <div>
                        <a
                            href="https://www.minedu.gob.pe/curriculo/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold mb-1 underline decoration-dotted underline-offset-2 hover:text-indigo-900 transition-colors cursor-pointer"
                        >
                            CNEB 2024 ↗
                        </a>
                        <p className="text-indigo-600">Currículo Nacional de Educación Básica actualizado — Competencias y desempeños vigentes</p>
                    </div>
                    <div>
                        <div className="font-semibold mb-1">Norma Técnica MINEDU</div>
                        <p className="text-indigo-600">Orientaciones para la planificación curricular anual y de unidades</p>
                    </div>
                    <div>
                        <div className="font-semibold mb-1">Estructura Pedagógica</div>
                        <p className="text-indigo-600">Secuencia didáctica: Inicio, Desarrollo y Cierre en cada sesión</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
