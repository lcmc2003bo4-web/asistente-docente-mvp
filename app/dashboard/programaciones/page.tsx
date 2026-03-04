import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// ── Íconos SVG (sin emojis) ───────────────────────────────────────────
const CalendarIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const CheckCircleIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const BookOpenIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const PlusIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const ArrowRightIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
)
const InstitutionIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)
const GradeIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
)
const LayersIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
)

// ── Area color map ────────────────────────────────────────────────────
function getAreaColor(area?: string): string {
    const name = area?.toLowerCase() || ''
    if (name.includes('matemá') || name.includes('matemati')) return 'bg-blue-50 text-blue-700 ring-blue-200'
    if (name.includes('comuni') || name.includes('lengua')) return 'bg-orange-50 text-orange-700 ring-orange-200'
    if (name.includes('ciencia') || name.includes('cta')) return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    if (name.includes('social') || name.includes('historia')) return 'bg-amber-50 text-amber-700 ring-amber-200'
    if (name.includes('inglés') || name.includes('ingles')) return 'bg-rose-50 text-rose-700 ring-rose-200'
    if (name.includes('arte') || name.includes('educación física')) return 'bg-violet-50 text-violet-700 ring-violet-200'
    return 'bg-indigo-50 text-indigo-700 ring-indigo-200'
}

export default async function ProgramacionesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: programaciones } = await supabase
        .from('programaciones')
        .select(`*, areas (nombre), grados (nombre, nivel)`)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    const total = programaciones?.length ?? 0
    const activas = programaciones?.filter(p => p.estado === 'Validado' || p.estado === 'Finalizado' || p.estado === 'Activo').length ?? 0
    const areas = new Set(programaciones?.map(p => p.areas?.nombre).filter(Boolean)).size

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-7">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Programaciones Anuales</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Planifica tu año escolar por área y grado según el CNEB</p>
                </div>
                <Link
                    href="/dashboard/programaciones/nueva"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex-shrink-0"
                >
                    <PlusIcon /> Nueva Programación
                </Link>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{total}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Activas</p>
                        <p className="text-2xl font-bold text-emerald-600">{activas}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-400">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Áreas</p>
                        <p className="text-2xl font-bold text-indigo-600">{areas}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400">
                        <BookOpenIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* ── Lista / empty state ── */}
            {!programaciones || programaciones.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-slate-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                        <CalendarIcon className="w-8 h-8 text-blue-200" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-1">Sin programaciones aún</h3>
                    <p className="text-sm text-slate-400 max-w-xs mb-6">Crea tu primera programación anual para comenzar a organizar tu año escolar</p>
                    <Link
                        href="/dashboard/programaciones/nueva"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all"
                    >
                        <PlusIcon /> Crear Primera Programación
                    </Link>
                </div>
            ) : (
                /* ── Card-row list (Stitch pattern) ── */
                <div className="space-y-3">
                    {programaciones.map((prog) => {
                        const isActive = prog.estado === 'Validado' || prog.estado === 'Finalizado' || prog.estado === 'Activo'
                        const dotColor = isActive ? 'bg-blue-500' : 'bg-amber-400'
                        const areaColor = getAreaColor(prog.areas?.nombre)

                        return (
                            <div
                                key={prog.id}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group overflow-hidden"
                                style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                            >
                                <div className="flex items-stretch">
                                    {/* Dot indicator lateral */}
                                    <div className={`w-1 flex-shrink-0 ${dotColor}`} />

                                    <div className="flex-1 px-5 py-4 min-w-0">
                                        {/* Fila 1: badges + estado */}
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            {/* Año escolar */}
                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 rounded-lg">
                                                {prog.anio_escolar}
                                            </span>

                                            {/* Área */}
                                            {prog.areas?.nombre && (
                                                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ring-1 ring-inset rounded-lg ${areaColor}`}>
                                                    {prog.areas.nombre}
                                                </span>
                                            )}

                                            {/* Grado */}
                                            {prog.grados?.nombre && (
                                                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg">
                                                    <GradeIcon /> {prog.grados.nombre}
                                                </span>
                                            )}

                                            {/* Estado */}
                                            <span className={`ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset rounded-full ${isActive
                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                                : 'bg-amber-50 text-amber-700 ring-amber-200'
                                                }`}>
                                                {prog.estado}
                                            </span>
                                        </div>

                                        {/* Fila 2: Título + unidades + CTA */}
                                        <div className="flex items-center gap-3 mb-2.5">
                                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 flex-1">
                                                {prog.titulo}
                                            </h3>
                                            <Link
                                                href={`/dashboard/programaciones/${prog.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-700 transition-colors whitespace-nowrap flex-shrink-0"
                                            >
                                                Ver detalle <ArrowRightIcon />
                                            </Link>
                                        </div>

                                        {/* Fila 3: Meta chips */}
                                        <div className="flex items-center flex-wrap gap-3 text-xs text-slate-400">
                                            {prog.periodo_tipo && (
                                                <span className="flex items-center gap-1"><LayersIcon /> {prog.periodo_tipo}</span>
                                            )}
                                            {prog.grados?.nivel && (
                                                <span>{prog.grados.nivel}</span>
                                            )}
                                            {prog.institucion && (
                                                <span className="flex items-center gap-1"><InstitutionIcon /> {prog.institucion}</span>
                                            )}
                                            <span className="ml-auto text-slate-300">
                                                Creada {new Date(prog.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
