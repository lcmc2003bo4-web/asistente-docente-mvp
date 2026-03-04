'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { sesionService, type SesionWithRelations, type ValidationResult } from '@/lib/services/SesionService'
import DownloadPdfButton from '@/components/pdf/DownloadPdfButton'
import SesionPreviewTables from '@/components/sesiones/SesionPreviewTables'

// ── Íconos SVG (sin emojis) ───────────────────────────────────────────
const TargetIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
)
const StarIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)
const BookOpenIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const RocketIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    </svg>
)
const RefreshIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
)
const CheckCircleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const XCircleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)
const WarningIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)
const PencilIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)
const TrashIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
)
const SparklesIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 1.5M5 3l-1.5 1.5M5 3v2.5M19 3l1.5 1.5M19 3l-1.5 1.5M19 3v2.5M12 19l1.5 1.5M12 19l-1.5 1.5M12 19v2.5M3 12l-1.5 1.5M3 12l1.5 1.5M3 12H5.5M21 12l-1.5 1.5M21 12l1.5 1.5M21 12h-2.5M12 5l1.5 1.5M12 5l-1.5 1.5M12 5V2.5M9 9l6 6M15 9l-6 6" />
    </svg>
)
const PaperclipIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
)
const ClockMetaIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const CalendarMetaIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

// ── Skeleton loader ───────────────────────────────────────────────────
function SkeletonDetail() {
    return (
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                    <div className="h-8 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-28 bg-slate-100 rounded-xl" />
                    <div className="h-9 w-28 bg-slate-100 rounded-xl" />
                </div>
            </div>
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
            </div>
            <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
    )
}

export default function SesionDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [sesion, setSesion] = useState<SesionWithRelations | null>(null)
    const [validation, setValidation] = useState<ValidationResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [validating, setValidating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => { loadSesion() }, [params.id])

    async function loadSesion() {
        try {
            const data = await sesionService.get(params.id as string)
            setSesion(data)
            const validationResult = await sesionService.validate(params.id as string)
            setValidation(validationResult)
        } catch (error) {
            console.error('Error loading sesion:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleRevalidate() {
        setValidating(true)
        try {
            const validationResult = await sesionService.validate(params.id as string)
            setValidation(validationResult)
            await loadSesion()
        } catch (error) {
            console.error('Error validating:', error)
        } finally {
            setValidating(false)
        }
    }

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar esta sesión? Esta acción no se puede deshacer.')) return
        setDeleting(true)
        try {
            await sesionService.delete(params.id as string)
            router.push('/dashboard/sesiones')
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Error al eliminar la sesión')
            setDeleting(false)
        }
    }

    if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><SkeletonDetail /></div>

    if (!sesion) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center">
                <h2 className="text-xl font-semibold text-slate-900">Sesión no encontrada</h2>
                <Link href="/dashboard/sesiones" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block text-sm">
                    ← Volver a sesiones
                </Link>
            </div>
        )
    }

    const secuenciasInicio = sesion.secuencias_sesion?.filter(s => s.momento === 'Inicio') || []
    const secuenciasDesarrollo = sesion.secuencias_sesion?.filter(s => s.momento === 'Desarrollo') || []
    const secuenciasCierre = sesion.secuencias_sesion?.filter(s => s.momento === 'Cierre') || []

    const momentos = [
        { label: 'Inicio', items: secuenciasInicio, color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-900', dotColor: 'bg-blue-500', icon: <RocketIcon /> },
        { label: 'Desarrollo', items: secuenciasDesarrollo, color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-900', dotColor: 'bg-emerald-500', icon: <BookOpenIcon /> },
        { label: 'Cierre', items: secuenciasCierre, color: 'bg-violet-50 border-violet-200', textColor: 'text-violet-900', dotColor: 'bg-violet-500', icon: <CheckCircleIcon /> },
    ]

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <Link
                href={`/dashboard/unidades/${sesion.unidad_id}`}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Volver a la unidad
            </Link>

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{sesion.titulo}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {sesion.unidades?.programaciones?.areas?.nombre} · {sesion.unidades?.programaciones?.grados?.nombre}
                    </p>
                </div>

                {/* Acciones estandarizadas */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    <DownloadPdfButton documentId={params.id as string} documentType="sesion" />

                    {(!sesion.secuencias_sesion || sesion.secuencias_sesion.length === 0) && (
                        <Link
                            href={`/dashboard/sesiones/${params.id}/asistente`}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm"
                        >
                            <SparklesIcon />
                            Asistente IA
                        </Link>
                    )}

                    {/* Editar — secondary */}
                    <Link
                        href={`/dashboard/sesiones/${params.id}/editar`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <PencilIcon />
                        Editar
                    </Link>

                    {/* Eliminar — danger outline */}
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

            {/* ── Estado de Validación ── */}
            {validation && (
                <div className={`rounded-2xl border p-5 mb-8 ${validation.valid
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <span className={validation.valid ? 'text-emerald-500' : 'text-red-500'}>
                                {validation.valid ? <CheckCircleIcon /> : <XCircleIcon />}
                            </span>
                            <div className="flex-1">
                                <h3 className={`text-sm font-semibold mb-1 ${validation.valid ? 'text-emerald-900' : 'text-red-900'}`}>
                                    {validation.valid ? 'Sesión Válida' : 'Sesión con Errores'}
                                </h3>
                                <p className={`text-xs ${validation.valid ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {validation.valid
                                        ? 'Cumple con todas las validaciones normativas MINEDU'
                                        : 'Corrige los errores para que la sesión sea válida'}
                                </p>

                                {/* Errores */}
                                {validation.errors.length > 0 && (
                                    <div className="mt-3 space-y-1.5">
                                        {validation.errors.map((error, index) => (
                                            <div key={index} className="flex items-start gap-2 text-xs text-red-700">
                                                <span className="flex-shrink-0 mt-0.5"><WarningIcon /></span>
                                                <span>{error.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Advertencias */}
                                {validation.warnings.length > 0 && (
                                    <div className="mt-3 space-y-1.5">
                                        {validation.warnings.map((warning, index) => (
                                            <div key={index} className="flex items-start gap-2 text-xs text-amber-700">
                                                <span className="flex-shrink-0 mt-0.5"><WarningIcon /></span>
                                                <span>{warning.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleRevalidate}
                            disabled={validating}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition disabled:opacity-50 flex-shrink-0"
                        >
                            <RefreshIcon />
                            {validating ? 'Validando…' : 'Revalidar'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Metadatos — barra horizontal 3 tarjetas ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Unidad Didáctica', value: sesion.unidades?.titulo ?? '—', icon: <BookOpenIcon /> },
                    { label: 'Duración', value: `${sesion.duracion_minutos} minutos`, icon: <ClockMetaIcon /> },
                    {
                        label: 'Fecha Programada',
                        value: sesion.fecha_tentativa
                            ? new Date(sesion.fecha_tentativa).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })
                            : 'Por definir',
                        icon: <CalendarMetaIcon />
                    },
                ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 px-5 py-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                        <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                            {icon}
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-400 font-medium">{label}</p>
                            <p className="text-sm font-semibold text-slate-900 leading-snug truncate">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Propósito — ancho completo ── */}
            {sesion.proposito_aprendizaje && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <TargetIcon />
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900">Propósito</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed pl-9">{sesion.proposito_aprendizaje}</p>

                    {sesion.evidencias_aprendizaje && (
                        <div className="mt-4 pt-4 border-t border-slate-100 pl-9">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-5 h-5 bg-amber-50 rounded flex items-center justify-center text-amber-500 flex-shrink-0">
                                    <StarIcon />
                                </span>
                                <h4 className="text-xs font-semibold text-slate-700">Experiencia de Aprendizaje</h4>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{sesion.evidencias_aprendizaje}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Contenido principal — ANCHO COMPLETO ── */}
            {sesion.contenido_ia ? (
                <SesionPreviewTables data={sesion.contenido_ia} />
            ) : (
                <>
                    {/* CTA: sin secuencia */}
                    {(!sesion.secuencias_sesion || sesion.secuencias_sesion.length === 0) && (
                        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 p-10 text-center">
                            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-violet-600"><SparklesIcon /></span>
                            </div>
                            <h3 className="text-base font-bold text-violet-900 mb-2">Secuencia aún no generada</h3>
                            <p className="text-sm text-violet-700 mb-6 max-w-sm mx-auto">
                                La IA construye la secuencia completa alineada a los estándares MINEDU en segundos.
                            </p>
                            <Link
                                href={`/dashboard/sesiones/${params.id}/asistente`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:from-violet-700 hover:to-indigo-700 transition-all"
                            >
                                <SparklesIcon /> Completar con IA
                            </Link>
                        </div>
                    )}

                    {/* Propósitos manuales */}
                    {!sesion.contenido_ia && sesion.detalles_sesion && sesion.detalles_sesion.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 flex-shrink-0">
                                    <TargetIcon />
                                </span>
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Propósitos ({sesion.detalles_sesion.length})
                                </h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 pl-9">
                                {sesion.detalles_sesion.map((detalle, index) => (
                                    <div key={index} className="border-l-2 border-indigo-400 pl-3">
                                        <p className="text-xs font-semibold text-indigo-700 mb-0.5">
                                            {detalle.desempenos.competencias?.nombre}
                                        </p>
                                        <p className="text-xs text-slate-700 leading-relaxed">{detalle.desempenos.descripcion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Secuencia Manual — ancho completo */}
                    {sesion.secuencias_sesion && sesion.secuencias_sesion.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
                                    <BookOpenIcon />
                                </span>
                                <h3 className="text-sm font-semibold text-slate-900">Secuencia Didáctica</h3>
                                <span className="ml-auto text-xs text-slate-400">
                                    {sesion.secuencias_sesion.length} actividades · {sesion.duracion_minutos} min total
                                </span>
                            </div>
                            <div className="space-y-7">
                                {momentos.map(({ label, items, color, textColor, dotColor, icon }) => items.length > 0 && (
                                    <div key={label}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`w-1 h-5 rounded-full ${dotColor}`} />
                                            <span className={`text-xs font-bold uppercase tracking-wider ${textColor} flex items-center gap-1.5`}>
                                                {icon} {label}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-auto">
                                                {items.reduce((sum, s) => sum + s.tiempo_minutos, 0)} min
                                            </span>
                                        </div>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4 border-l-2 border-slate-200">
                                            {items.map((sec, index) => (
                                                <div key={index} className={`rounded-xl p-3.5 border ${color}`}>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p className="text-sm text-slate-900 flex-1 leading-relaxed">{sec.actividad}</p>
                                                        <span className={`text-xs font-semibold flex-shrink-0 whitespace-nowrap ${textColor} bg-white bg-opacity-60 px-2 py-0.5 rounded-lg`}>
                                                            {sec.tiempo_minutos} min
                                                        </span>
                                                    </div>
                                                    {sec.recursos && (
                                                        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                                                            <PaperclipIcon /> {sec.recursos}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}



