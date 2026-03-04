import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import DownloadPdfButton from '@/components/pdf/DownloadPdfButton'

// ── Íconos SVG (cero emojis) ─────────────────────────────────────────
const ArrowLeftIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)
const PlusIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const PencilIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)
const CheckCircleIcon = ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const ClockIcon = ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const XCircleIcon = ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)
const ArrowRightIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
)
const BookOpenLgIcon = () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const CalendarIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const LayersIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
)
const WeeksIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)

// ── Status badge para unidades ────────────────────────────────────────
function ValidationBadge({ status }: { status: string | null }) {
    if (status === 'valid') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 rounded-full">
            <CheckCircleIcon /> Válida
        </span>
    )
    if (status === 'invalid') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 rounded-full">
            <XCircleIcon /> Errores
        </span>
    )
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 rounded-full">
            <ClockIcon /> Pendiente
        </span>
    )
}

export default async function ProgramacionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: programacion } = await supabase
        .from('programaciones')
        .select(`
      *,
      areas (id, nombre),
      grados (id, nombre, nivel, ciclo),
      detalles_programacion (
        id,
        competencias (id, codigo, nombre, descripcion)
      )
    `)
        .eq('id', id)
        .eq('user_id', user!.id)
        .single()

    if (!programacion) notFound()

    const { data: unidades } = await supabase
        .from('unidades')
        .select('*')
        .eq('programacion_id', id)
        .order('orden', { ascending: true })

    const isActive = ['Validado', 'Finalizado', 'Activo'].includes(programacion.estado ?? '')

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Breadcrumb ── */}
            <Link
                href="/dashboard/programaciones"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
            >
                <ArrowLeftIcon /> Programaciones Anuales
            </Link>

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 mb-7">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {/* Año badge */}
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 rounded-lg">
                            {programacion.anio_escolar}
                        </span>
                        {/* Área chip */}
                        {programacion.areas?.nombre && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 rounded-lg">
                                {programacion.areas.nombre}
                            </span>
                        )}
                        {/* Grado chip */}
                        {programacion.grados?.nombre && (
                            <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg">
                                {programacion.grados.nombre}
                            </span>
                        )}
                        {/* Estado pill */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold ring-1 ring-inset rounded-full ${isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-amber-50 text-amber-700 ring-amber-200'
                            }`}>
                            {isActive ? <CheckCircleIcon /> : <ClockIcon />}
                            {programacion.estado}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{programacion.titulo}</h1>
                    {(programacion.curso_nombre || programacion.grados?.nivel) && (
                        <p className="text-sm text-slate-400 mt-1">
                            {[programacion.curso_nombre, programacion.grados?.nivel].filter(Boolean).join(' · ')}
                        </p>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    <DownloadPdfButton documentId={id} documentType="programacion" />
                    <Link
                        href={`/dashboard/programaciones/${id}/editar`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <PencilIcon /> Editar
                    </Link>
                    <Link
                        href={`/dashboard/unidades/nueva?programacion=${id}`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <PlusIcon /> Nueva Unidad
                    </Link>
                    <DeleteButton programacionId={id} />
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-3 gap-4 mb-7">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                        <CalendarIcon />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Año Escolar</p>
                        <p className="text-lg font-bold text-slate-900">{programacion.anio_escolar}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center text-violet-400 flex-shrink-0">
                        <LayersIcon />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Tipo de Periodo</p>
                        <p className="text-sm font-bold text-slate-900">{programacion.periodo_tipo || '—'}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <WeeksIcon />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Ciclo</p>
                        <p className="text-lg font-bold text-slate-900">{programacion.grados?.ciclo || '—'}</p>
                    </div>
                </div>
            </div>

            {/* ── Unidades Didácticas ── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Unidades Didácticas <span className="ml-1 text-slate-400 font-normal text-sm">({unidades?.length || 0})</span>
                    </h2>
                    <Link
                        href={`/dashboard/unidades/nueva?programacion=${id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        <PlusIcon /> Agregar Unidad
                    </Link>
                </div>

                {unidades && unidades.length > 0 ? (
                    <div className="space-y-2.5">
                        {unidades.map((unidad: any) => {
                            const dotColor = unidad.validation_status === 'valid'
                                ? 'bg-emerald-400'
                                : unidad.validation_status === 'invalid'
                                    ? 'bg-red-400'
                                    : 'bg-amber-400'
                            return (
                                <Link
                                    key={unidad.id}
                                    href={`/dashboard/unidades/${unidad.id}`}
                                    className="flex items-center gap-0 overflow-hidden rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all group"
                                >
                                    {/* Dot lateral */}
                                    <div className={`w-1 self-stretch flex-shrink-0 ${dotColor}`} />
                                    <div className="flex-1 flex items-center gap-3 px-4 py-3">
                                        {/* Número */}
                                        <span className="w-7 h-7 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg flex items-center justify-center flex-shrink-0">
                                            #{unidad.orden}
                                        </span>
                                        {/* Título */}
                                        <p className="flex-1 text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                            {unidad.titulo}
                                        </p>
                                        {/* Meta */}
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {unidad.duracion_semanas} sem.
                                        </span>
                                        {/* Status */}
                                        <ValidationBadge status={unidad.validation_status} />
                                        {/* Arrow */}
                                        <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                                            <ArrowRightIcon />
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 text-center">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4 text-slate-300">
                            <BookOpenLgIcon />
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Sin unidades didácticas</p>
                        <p className="text-xs text-slate-400 mb-5">Crea la primera para comenzar a organizar esta programación</p>
                        <Link
                            href={`/dashboard/unidades/nueva?programacion=${id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all"
                        >
                            <PlusIcon /> Crear Primera Unidad
                        </Link>
                    </div>
                )}
            </div>

            {/* ── Competencias ── */}
            {programacion.detalles_programacion && programacion.detalles_programacion.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <h2 className="text-base font-semibold text-slate-900 mb-5">
                        Competencias Programadas <span className="ml-1 text-slate-400 font-normal text-sm">({programacion.detalles_programacion.length})</span>
                    </h2>
                    <div className="space-y-3">
                        {programacion.detalles_programacion.map((detalle: any) => (
                            <div
                                key={detalle.id}
                                className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                            >
                                {/* Código badge */}
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-indigo-600">
                                        {detalle.competencias?.codigo?.split('-')[1] || detalle.competencias?.codigo?.slice(-2) || '?'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                                            {detalle.competencias?.codigo}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{detalle.competencias?.nombre}</h3>
                                    {detalle.competencias?.descripcion && (
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{detalle.competencias.descripcion}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Metadata footer ── */}
            <p className="mt-6 text-xs text-slate-400 text-center">
                Creada el {new Date(programacion.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    )
}
