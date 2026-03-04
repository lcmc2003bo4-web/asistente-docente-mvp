'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { unidadService, type UnidadWithRelations, type ValidationResult } from '@/lib/services/UnidadService'
import { sesionService, type SesionWithRelations } from '@/lib/services/SesionService'
import Link from 'next/link'
import DownloadPdfButton from '@/components/pdf/DownloadPdfButton'

// ── Íconos SVG ─────────────────────────────────────────────────────────
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
const WarningIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)
const PencilIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)
const TrashIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
)
const RefreshIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
)
const PlusIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const ClockIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const CalendarSmIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const BookOpenIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)

// ── Skeleton ─────────────────────────────────────────────────────────
function SkeletonDetail() {
    return (
        <div className="max-w-4xl mx-auto animate-pulse space-y-6 px-4 py-8">
            <div className="h-4 bg-slate-200 rounded w-28" />
            <div className="flex justify-between">
                <div className="space-y-2 flex-1"><div className="h-8 bg-slate-200 rounded w-2/3" /><div className="h-4 bg-slate-100 rounded w-1/3" /></div>
                <div className="flex gap-2"><div className="h-9 w-24 bg-slate-100 rounded-xl" /><div className="h-9 w-20 bg-slate-100 rounded-xl" /></div>
            </div>
            <div className="h-20 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-2 gap-4"><div className="h-48 bg-slate-100 rounded-xl" /><div className="h-48 bg-slate-100 rounded-xl" /></div>
            <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
    )
}

// ── RichContentBlock — convierte texto plano generado por IA en bloques legibles ──
function RichContentBlock({ text }: { text: string }) {
    if (!text) return null

    // Detecta secciones marcadas con MAYÚSCULAS: al inicio de línea
    const lines = text.split('\n')
    const sections: { heading?: string; body: string[] }[] = []
    let current: { heading?: string; body: string[] } = { body: [] }

    for (const line of lines) {
        const headingMatch = line.match(/^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s,\/]{2,}):(.*)/)
        if (headingMatch) {
            if (current.body.length > 0 || current.heading) sections.push(current)
            current = { heading: headingMatch[1].trim(), body: headingMatch[2].trim() ? [headingMatch[2].trim()] : [] }
        } else if (line.trim()) {
            current.body.push(line.trim())
        }
    }
    if (current.body.length > 0 || current.heading) sections.push(current)

    // Si no detectó secciones, renderiza como párrafo con mejor espaciado
    if (sections.length <= 1 && !sections[0]?.heading) {
        return (
            <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap">{text}</p>
        )
    }

    return (
        <div className="space-y-4">
            {sections.map((sec, i) => (
                <div key={i}>
                    {sec.heading && (
                        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1.5">{sec.heading}</p>
                    )}
                    <p className="text-sm text-slate-700 leading-7">{sec.body.join(' ')}</p>
                </div>
            ))}
        </div>
    )
}

export default function UnidadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [unidad, setUnidad] = useState<UnidadWithRelations | null>(null)
    const [validation, setValidation] = useState<ValidationResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [validating, setValidating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [sesiones, setSesiones] = useState<SesionWithRelations[]>([])

    useEffect(() => { loadUnidad() }, [resolvedParams.id])

    const loadUnidad = async () => {
        try {
            const data = await unidadService.get(resolvedParams.id)
            setUnidad(data)
            const validationResult = await unidadService.validate(resolvedParams.id)
            setValidation(validationResult)
            if (data) setUnidad({ ...data, estado: validationResult.valid ? 'Validado' : 'Borrador' })
            const sesionesData = await sesionService.listByUnidad(resolvedParams.id)
            setSesiones(sesionesData)
        } catch (error: any) {
            console.error('Error loading unidad:', error?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleValidate = async () => {
        try {
            setValidating(true)
            const result = await unidadService.validate(resolvedParams.id)
            setValidation(result)
            setUnidad(prev => prev ? { ...prev, estado: result.valid ? 'Validado' : 'Borrador' } : null)
        } catch (error) {
            console.error('Error validating:', error)
        } finally {
            setValidating(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('¿Está seguro de eliminar esta unidad? Esta acción no se puede deshacer.')) return
        try {
            setDeleting(true)
            await unidadService.delete(resolvedParams.id)
            router.push(unidad?.programaciones?.id ? `/dashboard/programaciones/${unidad.programaciones.id}` : '/dashboard/unidades')
            router.refresh()
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Error al eliminar la unidad')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <SkeletonDetail />

    if (!unidad) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Unidad no encontrada</h2>
                <Link href="/dashboard/unidades" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block text-sm">
                    Volver a Unidades
                </Link>
            </div>
        )
    }

    const desempenos = unidad.detalles_unidad?.map(d => d.desempenos) || []

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <Link
                href={unidad.programaciones?.id ? `/dashboard/programaciones/${unidad.programaciones.id}` : '/dashboard/unidades'}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Volver
            </Link>

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{unidad.titulo}</h1>
                    {unidad.programaciones && (
                        <p className="text-sm text-slate-500 mt-1">Programación: {unidad.programaciones.titulo}</p>
                    )}
                </div>

                {/* Acciones — jerarquía: PDF | Editar (primary) | Eliminar (danger-outline) */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    <DownloadPdfButton documentId={resolvedParams.id} documentType="unidad" />
                    <Link
                        href={`/dashboard/unidades/${resolvedParams.id}/editar`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <PencilIcon />
                        Editar
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-red-600 border border-red-200 bg-white text-sm font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <TrashIcon />
                        {deleting ? 'Eliminando…' : 'Eliminar'}
                    </button>
                </div>
            </div>

            {/* ── Validación ── */}
            {validation && (
                <div className={`rounded-2xl border p-5 mb-8 ${validation.valid
                    ? 'bg-emerald-50 border-emerald-200'
                    : validation.errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <span className={validation.valid ? 'text-emerald-500' : 'text-red-500'}>
                                {validation.valid ? <CheckCircleIcon /> : <XCircleIcon />}
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Estado de Validación</h3>
                                {validation.valid ? (
                                    <p className="text-xs text-emerald-700">Unidad válida y conforme al CNEB</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        {validation.errors.map((error, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-red-700">
                                                <WarningIcon className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                <span><strong>{error.code}:</strong> {error.message}</span>
                                            </div>
                                        ))}
                                        {validation.warnings.map((warning, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-amber-700">
                                                <WarningIcon className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                <span>{warning.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleValidate}
                            disabled={validating}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition disabled:opacity-50 flex-shrink-0"
                        >
                            <RefreshIcon />
                            {validating ? 'Validando…' : 'Revalidar'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Info General + Estadísticas ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Información General</h3>
                    <dl className="space-y-3">
                        {[
                            { label: 'Duración', value: `${unidad.duracion_semanas} semanas` },
                            { label: 'Orden', value: `Unidad #${unidad.orden}` },
                            { label: 'Estado', value: unidad.estado ?? '—' },
                            { label: 'Creado', value: unidad.created_at ? new Date(unidad.created_at).toLocaleDateString('es-PE') : '—' },
                            ...((unidad as any).fecha_inicio ? [{ label: 'Fecha Inicio', value: new Date((unidad as any).fecha_inicio + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) }] : []),
                            ...((unidad as any).fecha_fin ? [{ label: 'Fecha Fin', value: new Date((unidad as any).fecha_fin + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) }] : []),
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-3">
                                <dt className="text-xs font-medium text-slate-400">{label}</dt>
                                <dd className="text-xs font-semibold text-slate-800 text-right">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Estadísticas</h3>
                    <dl className="space-y-3">
                        <div className="flex justify-between gap-3">
                            <dt className="text-xs font-medium text-slate-400">Desempeños IA (Matriz)</dt>
                            <dd className="text-2xl font-bold text-indigo-600">
                                {Array.isArray(unidad.matriz_ia)
                                    ? (unidad.matriz_ia as any[]).reduce((acc: number, m: any) => acc + (m.desempenos_contextualizados?.length || 0), 0)
                                    : (unidad.matriz_ia as any)?.desempenos_contextualizados?.length ?? 0}
                            </dd>
                        </div>
                        {validation?.summary && (
                            <>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-xs font-medium text-slate-400">Duración Total (Prog.)</dt>
                                    <dd className="text-xs font-semibold text-slate-800">
                                        {validation.summary.duracion_total} / {validation.summary.duracion_esperada} sem
                                    </dd>
                                </div>
                                {validation.summary.desempenos_invalidos > 0 && (
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-xs font-medium text-red-500">Desempeños Inválidos</dt>
                                        <dd className="text-xs font-semibold text-red-700">{validation.summary.desempenos_invalidos}</dd>
                                    </div>
                                )}
                            </>
                        )}
                    </dl>
                </div>
            </div>

            {/* ── Bloques de Contenido IA (RichContentBlock para wall-of-text) ── */}
            <div className="space-y-5 mb-6">
                {unidad.situacion_significativa && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">I. Situación Significativa</h3>
                        <RichContentBlock text={unidad.situacion_significativa} />
                    </div>
                )}

                {unidad.proposito_aprendizaje && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">II. Propósitos de Aprendizaje</h3>
                        <RichContentBlock text={unidad.proposito_aprendizaje} />
                    </div>
                )}

                {unidad.matriz_ia && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4">II. Propósitos de Aprendizaje — Matriz CNEB</h4>
                        <div className="overflow-hidden rounded-xl border border-emerald-200">
                            <table className="min-w-full text-xs border-collapse">
                                <thead>
                                    <tr className="bg-emerald-700 text-white">
                                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[22%] border-r border-emerald-600">Competencia</th>
                                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[28%] border-r border-emerald-600">Capacidades</th>
                                        <th className="px-4 py-3 text-left font-bold uppercase tracking-wider w-[50%]">Desempeños Contextualizados</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(unidad.matriz_ia) ? unidad.matriz_ia as any[] : [unidad.matriz_ia as any]).map((mat: any, idx: number) => {
                                        const caps: string[] = mat.capacidades || []
                                        const dess: string[] = mat.desempenos_contextualizados || []
                                        const maxRows = Math.max(caps.length, dess.length, 1)
                                        const bgGroup = idx % 2 === 0 ? '' : 'bg-emerald-50/40'
                                        return (
                                            <tr key={idx} className={`border-b-2 border-emerald-200 ${bgGroup}`}>
                                                {/* Competencia — centered vertically over the paired rows */}
                                                <td className={`px-4 py-3 font-semibold text-emerald-800 text-center align-middle border-r border-emerald-100 ${bgGroup}`}
                                                    style={{ verticalAlign: 'middle' }}>
                                                    {mat.competencia}
                                                </td>
                                                {/* Paired sub-rows column wrapper */}
                                                <td className="p-0 align-top border-r border-emerald-100" colSpan={2}>
                                                    <table className="min-w-full">
                                                        <tbody>
                                                            {Array.from({ length: maxRows }).map((_, i) => (
                                                                <tr key={i} className={i < maxRows - 1 ? 'border-b border-emerald-50' : ''}>
                                                                    <td className="px-4 py-2 align-top w-[36%] border-r border-emerald-50 text-slate-700">
                                                                        {caps[i] && (
                                                                            <span className="flex items-start gap-1.5">
                                                                                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                                                {caps[i]}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-2 align-top w-[64%] text-slate-600 leading-relaxed">
                                                                        {dess[i] && (
                                                                            <span className="flex items-start gap-1.5">
                                                                                <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                                                                                {dess[i]}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {unidad.enfoques_transversales && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4">IV. Enfoques Transversales</h4>
                        <div className="overflow-hidden rounded-xl border border-emerald-100">
                            <table className="min-w-full divide-y divide-emerald-100 text-xs">
                                <thead className="bg-emerald-50">
                                    <tr>
                                        {['Enfoque', 'Valor', 'Actitudes Observables'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left font-bold text-emerald-800 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-emerald-50">
                                    {(unidad.enfoques_transversales as any[])?.map((enf, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'}>
                                            <td className="px-4 py-3 font-medium text-emerald-700 align-top">{enf.enfoque}</td>
                                            <td className="px-4 py-3 italic text-slate-500 align-top">{enf.valor}</td>
                                            <td className="px-4 py-3 text-slate-700 align-top leading-relaxed">{enf.actitudes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {unidad.evaluacion_ia && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4">V. Evaluación de la Unidad</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Evidencia Principal</p>
                                <p className="text-xs text-slate-600 leading-relaxed">{(unidad.evaluacion_ia as any).evidencias}</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Criterios de Éxito</p>
                                <ul className="space-y-1.5">
                                    {(unidad.evaluacion_ia as any).criterios?.map((c: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">Instrumento</p>
                                <p className="text-xs text-slate-600 leading-relaxed">{(unidad.evaluacion_ia as any).instrumento}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Desempeños ── */}
            {desempenos.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">
                        Desempeños del Currículo Nacional ({desempenos.length})
                    </h3>
                    <div className="space-y-2.5">
                        {desempenos.map((des, i) => (
                            <div key={i} className="p-3.5 border border-slate-100 rounded-xl">
                                <p className="text-xs text-slate-700 leading-relaxed">{des.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Sesiones ── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-slate-900">
                        Sesiones de Aprendizaje ({sesiones.length})
                    </h3>
                    <Link
                        href={`/dashboard/sesiones/nueva?unidad=${resolvedParams.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                    >
                        <PlusIcon className="w-3.5 h-3.5" />
                        Nueva Sesión
                    </Link>
                </div>

                {sesiones.length === 0 ? (
                    <div className="flex flex-col items-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 mb-3">
                            <BookOpenIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500 mb-3">No hay sesiones creadas para esta unidad</p>
                        <Link
                            href={`/dashboard/sesiones/nueva?unidad=${resolvedParams.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            Crear Primera Sesión
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {sesiones.map((sesion, index) => (
                            <Link
                                key={sesion.id}
                                href={`/dashboard/sesiones/${sesion.id}`}
                                className="flex items-start gap-3 p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                        {sesion.titulo}
                                    </h4>
                                    {sesion.proposito_aprendizaje && (
                                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                                            <span className="font-medium text-indigo-700">Desempeño: </span>
                                            {sesion.proposito_aprendizaje}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon />{sesion.duracion_minutos} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CalendarSmIcon />
                                            {sesion.fecha_tentativa ? new Date(sesion.fecha_tentativa).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : 'Por definir'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {sesion.validation_status === 'valid' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 rounded-full">
                                            <CheckCircleIcon className="w-3 h-3" /> Válida
                                        </span>
                                    )}
                                    {sesion.validation_status === 'invalid' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 rounded-full">
                                            <XCircleIcon className="w-3 h-3" /> Errores
                                        </span>
                                    )}
                                    {sesion.validation_status === 'pending' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 rounded-full">
                                            <ClockIcon className="w-3 h-3" /> Pendiente
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
