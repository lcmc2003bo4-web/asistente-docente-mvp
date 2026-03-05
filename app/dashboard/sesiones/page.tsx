'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import LimitedCreateButton from '@/components/ui/LimitedCreateButton'
import type { SesionWithRelations } from '@/lib/services/SesionService'

// ── Íconos SVG ──────────────────────────────────────────────────────
const BookOpenIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const CheckCircleIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const AlertTriangleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)
const SearchIcon = () => (
    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const FilterIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
)
const SortIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
)
const TargetIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
)
const ActivityIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
)
const ClockIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const CalendarIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const PlusIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const XCircleIcon = ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)

// ── Badge de estado ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    if (status === 'valid') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 rounded-full whitespace-nowrap">
            <CheckCircleIcon className="w-3 h-3" /> Válida
        </span>
    )
    if (status === 'invalid') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 rounded-full whitespace-nowrap">
            <XCircleIcon /> Errores
        </span>
    )
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 rounded-full whitespace-nowrap">
            <ClockIcon className="w-3 h-3" /> Pendiente
        </span>
    )
}

// ── Skeleton ─────────────────────────────────────────────────────────
function SkeletonList() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-2"><div className="h-7 bg-slate-200 rounded w-64" /><div className="h-4 bg-slate-100 rounded w-48" /></div>
                <div className="h-10 bg-slate-100 rounded-xl w-36" />
            </div>
            <div className="grid grid-cols-3 gap-5 mb-6">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}</div>
            <div className="h-10 bg-slate-100 rounded-xl mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-slate-100 rounded-2xl" />)}</div>
        </div>
    )
}

type SortKey = 'fecha' | 'titulo' | 'duracion'
type FilterStatus = 'all' | 'valid' | 'invalid' | 'pending'

export default function SesionesPage() {
    const [sesiones, setSesiones] = useState<SesionWithRelations[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [sortKey, setSortKey] = useState<SortKey>('fecha')
    const [showFilters, setShowFilters] = useState(false)
    const supabase = createClient()

    useEffect(() => { loadSesiones() }, [])

    async function loadSesiones() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data, error } = await supabase
                .from('sesiones')
                .select(`*, unidades(id, titulo, programaciones(id, titulo, areas(nombre), grados(nombre, nivel))), detalles_sesion(count), secuencias_sesion(count)`)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            setSesiones(data as any || [])
        } catch (error) {
            console.error('Error loading sesiones:', error)
        } finally {
            setLoading(false)
        }
    }

    const validCount = sesiones.filter(s => s.validation_status === 'valid').length
    const invalidCount = sesiones.filter(s => s.validation_status === 'invalid').length
    const validPct = sesiones.length ? Math.round((validCount / sesiones.length) * 100) : 0

    const filtered = useMemo(() => {
        let list = [...sesiones]
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(s =>
                s.titulo?.toLowerCase().includes(q) ||
                s.unidades?.titulo?.toLowerCase().includes(q) ||
                s.unidades?.programaciones?.areas?.nombre?.toLowerCase().includes(q)
            )
        }
        if (filterStatus !== 'all') {
            list = list.filter(s => (s.validation_status || 'pending') === filterStatus)
        }
        if (sortKey === 'titulo') list.sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''))
        if (sortKey === 'duracion') list.sort((a, b) => (b.duracion_minutos ?? 0) - (a.duracion_minutos ?? 0))
        if (sortKey === 'fecha') list.sort((a, b) => (b.fecha_tentativa ?? '').localeCompare(a.fecha_tentativa ?? ''))
        return list
    }, [sesiones, search, filterStatus, sortKey])

    if (loading) return <SkeletonList />

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-7">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sesiones de Aprendizaje</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Gestiona y valida tus sesiones de clase según normativa</p>
                </div>
                <LimitedCreateButton
                    href="/dashboard/sesiones/nueva"
                    limitType="sesion"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                >
                    <PlusIcon /> Nueva Sesión
                </LimitedCreateButton>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Total */}
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`text-left bg-white rounded-2xl border p-4 transition-all ${filterStatus === 'all' ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-200'}`}
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-400">Total Sesiones</p>
                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400">
                            <BookOpenIcon />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{sesiones.length}</p>
                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-1 bg-indigo-400 rounded-full" style={{ width: `${validPct}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{validPct}% válidas</p>
                </button>

                {/* Válidas */}
                <button
                    onClick={() => setFilterStatus(filterStatus === 'valid' ? 'all' : 'valid')}
                    className={`text-left bg-white rounded-2xl border p-4 transition-all ${filterStatus === 'valid' ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-200'}`}
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-400">Válidas</p>
                        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-400">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{validCount}</p>
                    <p className="text-xs text-slate-400 mt-3">Cumplen CNEB</p>
                </button>

                {/* Con errores */}
                <button
                    onClick={() => setFilterStatus(filterStatus === 'invalid' ? 'all' : 'invalid')}
                    className={`text-left bg-white rounded-2xl border p-4 transition-all ${filterStatus === 'invalid' ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 hover:border-red-200'}`}
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-400">Con Errores</p>
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-400">
                            <AlertTriangleIcon />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
                    <p className="text-xs text-slate-400 mt-3">Requieren corrección</p>
                </button>
            </div>

            {/* ── Barra de búsqueda + filtros (patrón Stitch) ── */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar sesión por nombre o grado..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(f => !f)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-xl border transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <FilterIcon /> Filtros
                    {filterStatus !== 'all' && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
                </button>
                <div className="relative">
                    <select
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value as SortKey)}
                        className="appearance-none pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                    >
                        <option value="fecha">Por fecha</option>
                        <option value="titulo">Por título</option>
                        <option value="duracion">Por duración</option>
                    </select>
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <SortIcon />
                    </div>
                </div>
            </div>

            {/* ── Chips de estado (cuando filtros abiertos) ── */}
            {showFilters && (
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <span className="text-xs font-medium text-slate-500">Estado:</span>
                    {[
                        { key: 'all', label: 'Todos' },
                        { key: 'valid', label: 'Válidas', color: 'emerald' },
                        { key: 'invalid', label: 'Con Errores', color: 'red' },
                        { key: 'pending', label: 'Pendientes', color: 'amber' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(key as FilterStatus)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterStatus === key
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Contador de resultados ── */}
            {(search || filterStatus !== 'all') && (
                <p className="text-xs text-slate-400 mb-4">
                    {filtered.length} {filtered.length === 1 ? 'sesión encontrada' : 'sesiones encontradas'}
                    {filterStatus !== 'all' && <span> · Filtro: <strong>{filterStatus}</strong></span>}
                </p>
            )}

            {/* ── Lista / Empty state ── */}
            {sesiones.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-slate-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4">
                        <BookOpenIcon />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-1">No hay sesiones creadas</h3>
                    <p className="text-sm text-slate-400 max-w-xs mb-6">Comienza creando tu primera sesión alineada al CNEB</p>
                    <LimitedCreateButton href="/dashboard/sesiones/nueva" limitType="sesion" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all">
                        <PlusIcon /> Crear Primera Sesión
                    </LimitedCreateButton>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 mb-3">
                        <SearchIcon />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-1">Sin resultados</h3>
                    <p className="text-xs text-slate-400">Intenta con otro término o limpia los filtros</p>
                    <button onClick={() => { setSearch(''); setFilterStatus('all') }} className="mt-4 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                        Limpiar búsqueda
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((sesion) => (
                        <Link
                            key={sesion.id}
                            href={`/dashboard/sesiones/${sesion.id}`}
                            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-md transition-all group"
                            style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                        >
                            {/* Badge + título */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1 leading-snug">
                                    {sesion.titulo}
                                </h3>
                                <StatusBadge status={sesion.validation_status || 'pending'} />
                            </div>

                            <p className="text-xs text-slate-500 mb-3">
                                {sesion.unidades?.programaciones?.areas?.nombre} · {sesion.unidades?.programaciones?.grados?.nombre}
                            </p>

                            {/* Unidad pill */}
                            <div className="mb-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 mb-0.5 font-medium uppercase tracking-wide" style={{ fontSize: '10px' }}>Unidad Didáctica</p>
                                <p className="text-xs font-medium text-slate-700 line-clamp-1">{sesion.unidades?.titulo ?? '—'}</p>
                            </div>

                            {/* Meta grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><ClockIcon /> Duración</p>
                                    <p className="text-xs font-semibold text-slate-700">{sesion.duracion_minutos} min</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><CalendarIcon /> Fecha</p>
                                    <p className="text-xs font-semibold text-slate-700">
                                        {sesion.fecha_tentativa
                                            ? new Date(sesion.fecha_tentativa).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
                                            : 'Por definir'}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><TargetIcon /> {(sesion.detalles_sesion as any)?.[0]?.count || 0} desempeños</span>
                                <span className="flex items-center gap-1"><ActivityIcon /> {(sesion.secuencias_sesion as any)?.[0]?.count || 0} actividades</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
