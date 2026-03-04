'use client'

import Link from 'next/link'
import { useState } from 'react'

type DocumentoReciente = {
    tipo: string
    id: string
    titulo: string
    subtitulo: string | null
    estado: string | null
    validation_status: string | null
    updated_at: string | null
    area_nombre: string | null
    grado_nombre: string | null
    url_ver: string
    url_editar: string
}

type Tab = 'todos' | 'programacion' | 'unidad' | 'sesion'

// ── Íconos SVG ───────────────────────────────────────────────────────
const CalendarIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const BookOpenIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const FileTextIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)
const CheckCircleIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const ClockIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const XCircleIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)
const ArrowRightIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
)
const EmptyFileIcon = () => (
    <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
)

// ── Config por tipo ───────────────────────────────────────────────────
const TIPO_CONFIG: Record<string, { label: string; icon: React.ReactNode; iconBg: string; badge: string }> = {
    programacion: { label: 'Programación', icon: <CalendarIcon />, iconBg: 'bg-blue-50 text-blue-500', badge: 'bg-blue-50 text-blue-700 ring-blue-200' },
    unidad: { label: 'Unidad', icon: <BookOpenIcon />, iconBg: 'bg-violet-50 text-violet-500', badge: 'bg-violet-50 text-violet-700 ring-violet-200' },
    sesion: { label: 'Sesión', icon: <FileTextIcon />, iconBg: 'bg-indigo-50 text-indigo-500', badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
}

// ── Badge de estado ───────────────────────────────────────────────────
function StatusBadge({ validation_status }: { tipo: string; estado: string | null; validation_status: string | null }) {
    if (validation_status === 'valid') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset bg-emerald-50 text-emerald-700 ring-emerald-200">
                <CheckCircleIcon /> Válida
            </span>
        )
    }
    if (validation_status === 'invalid') {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset bg-red-50 text-red-700 ring-red-200">
                <XCircleIcon /> Con error
            </span>
        )
    }
    // pending / null → Borrador
    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset bg-slate-100 text-slate-600 ring-slate-200">
            <ClockIcon /> Borrador
        </span>
    )
}

function relDate(d: string | null) {
    if (!d) return '—'
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
    if (diff === 0) return 'Hoy'
    if (diff === 1) return 'Ayer'
    if (diff < 7) return `Hace ${diff} días`
    if (diff < 30) return `Hace ${Math.floor(diff / 7)} sem.`
    return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

export default function RecentDocumentsList({ documentos }: { documentos: DocumentoReciente[] }) {
    const [tab, setTab] = useState<Tab>('todos')
    const filtered = tab === 'todos' ? documentos : documentos.filter(d => d.tipo === tab)

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'todos', label: 'Todos', count: documentos.length },
        { key: 'programacion', label: 'Programaciones', count: documentos.filter(d => d.tipo === 'programacion').length },
        { key: 'unidad', label: 'Unidades', count: documentos.filter(d => d.tipo === 'unidad').length },
        { key: 'sesion', label: 'Sesiones', count: documentos.filter(d => d.tipo === 'sesion').length },
    ]

    return (
        <div>
            {/* ── Tab bar ── */}
            <div className="flex gap-0.5 mb-5 border-b border-slate-100">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        aria-pressed={tab === t.key}
                        className={[
                            'px-3 py-2 text-xs font-medium rounded-t-md transition -mb-px border-b-2',
                            tab === t.key
                                ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                        ].join(' ')}
                    >
                        {t.label}
                        {t.count > 0 && (
                            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === t.key ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 mb-3">
                        <EmptyFileIcon />
                    </div>
                    <p className="text-sm text-slate-400">No hay documentos en esta categoría</p>
                </div>
            ) : (
                /* ── Tabla tipo Stitch (DOCUMENTO / ÁREA / GRADO / FECHA / ESTADO) ── */
                <div className="w-full">
                    {/* Header de tabla */}
                    <div className="grid grid-cols-[1fr_100px_90px_70px_90px] gap-2 px-2 mb-2">
                        {['Documento', 'Área', 'Grado', 'Fecha', 'Estado'].map(h => (
                            <p key={h} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</p>
                        ))}
                    </div>

                    {/* Filas */}
                    <div className="divide-y divide-slate-50">
                        {filtered.map(doc => {
                            const tc = TIPO_CONFIG[doc.tipo] || TIPO_CONFIG.sesion
                            return (
                                <div
                                    key={`${doc.tipo}-${doc.id}`}
                                    className="grid grid-cols-[1fr_100px_90px_70px_90px] gap-2 items-center px-2 py-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    {/* Documento */}
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${tc.iconBg}`}>
                                            {tc.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ring-1 ring-inset ${tc.badge}`}>
                                                    {tc.label}
                                                </span>
                                            </div>
                                            <Link
                                                href={doc.url_ver}
                                                className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate block leading-snug"
                                            >
                                                {doc.titulo}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Área */}
                                    <p className="text-xs text-slate-500 truncate">{doc.area_nombre || '—'}</p>

                                    {/* Grado */}
                                    <p className="text-xs text-slate-500 truncate">{doc.grado_nombre || '—'}</p>

                                    {/* Fecha */}
                                    <p className="text-xs text-slate-400">{relDate(doc.updated_at)}</p>

                                    {/* Estado + CTA */}
                                    <div className="flex items-center justify-between gap-1">
                                        <StatusBadge tipo={doc.tipo} estado={doc.estado} validation_status={doc.validation_status} />
                                        <Link
                                            href={doc.url_ver}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600"
                                            aria-label="Ver documento"
                                        >
                                            <ArrowRightIcon />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
