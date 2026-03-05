'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import LimitedCreateButton from '@/components/ui/LimitedCreateButton'
import type { Database } from '@/types/supabase'

type UnidadWithProgramacion = Database['public']['Tables']['unidades']['Row'] & {
    programaciones?: {
        titulo: string
        areas?: { nombre: string }
        grados?: { nombre: string; nivel: string }
    }
}

// ── Íconos SVG ──────────────────────────────────────────────────────
const BookOpenIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const CheckCircleIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const ClockIcon = ({ className = 'w-4.5 h-4.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const SearchIcon = () => (
    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const SortIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
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
const AreaIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
)
const CalendarWeeksIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const XCircleIcon = ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
)

// ── Status badge ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    if (status === 'valid') return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 rounded-full whitespace-nowrap">
            <CheckCircleIcon className="w-3 h-3" /> Validada
        </span>
    )
    if (status === 'invalid') return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 rounded-full whitespace-nowrap">
            <XCircleIcon /> Con errores
        </span>
    )
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 rounded-full whitespace-nowrap">
            <ClockIcon className="w-3 h-3" /> Pendiente
        </span>
    )
}

// ── Skeleton ─────────────────────────────────────────────────────────
function SkeletonList() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-2"><div className="h-7 bg-slate-200 rounded w-64" /><div className="h-4 bg-slate-100 rounded w-48" /></div>
                <div className="h-10 bg-slate-100 rounded-xl w-36" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}</div>
            <div className="h-10 bg-slate-100 rounded-xl mb-5" />
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}</div>
        </div>
    )
}

type SortKey = 'orden' | 'titulo' | 'duracion'

export default function UnidadesPage() {
    const supabase = createClient()
    const [unidades, setUnidades] = useState<UnidadWithProgramacion[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('orden')

    useEffect(() => { loadUnidades() }, [])

    const loadUnidades = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data, error } = await supabase
                .from('unidades')
                .select(`*, programaciones(titulo, areas(nombre), grados(nombre, nivel))`)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            setUnidades(data as UnidadWithProgramacion[])
        } catch (error) {
            console.error('Error loading unidades:', error)
        } finally {
            setLoading(false)
        }
    }

    const validCount = unidades.filter(u => u.validation_status === 'valid').length
    const pendingCount = unidades.filter(u => !u.validation_status || u.validation_status === 'pending').length

    const filtered = useMemo(() => {
        let list = [...unidades]
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(u =>
                u.titulo?.toLowerCase().includes(q) ||
                u.programaciones?.titulo?.toLowerCase().includes(q) ||
                u.programaciones?.areas?.nombre?.toLowerCase().includes(q)
            )
        }
        if (sortKey === 'titulo') list.sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''))
        if (sortKey === 'duracion') list.sort((a, b) => (b.duracion_semanas ?? 0) - (a.duracion_semanas ?? 0))
        if (sortKey === 'orden') list.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        return list
    }, [unidades, search, sortKey])

    if (loading) return <SkeletonList />

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-7">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Unidades Didácticas</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Organiza el contenido de tus programaciones anuales</p>
                </div>
                <LimitedCreateButton
                    href="/dashboard/unidades/nueva"
                    limitType="unidad"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                >
                    <PlusIcon /> Nueva Unidad
                </LimitedCreateButton>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{unidades.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-400">
                        <BookOpenIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Validadas</p>
                        <p className="text-2xl font-bold text-emerald-600">{validCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-400">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Por Revisar</p>
                        <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-400">
                        <ClockIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* ── Buscador + Ordenar (patrón Stitch) ── */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><SearchIcon /></div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar unidad por nombre, área o programación..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    />
                </div>
                <div className="relative">
                    <select
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value as SortKey)}
                        className="appearance-none pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                    >
                        <option value="orden">Por orden</option>
                        <option value="titulo">Por título</option>
                        <option value="duracion">Por duración</option>
                    </select>
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><SortIcon /></div>
                </div>
            </div>

            {/* ── Lista / Empty state ── */}
            {unidades.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-slate-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
                    <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
                        <BookOpenIcon className="w-8 h-8 text-violet-300" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700 mb-1">No hay unidades creadas</h3>
                    <p className="text-sm text-slate-400 max-w-xs mb-6">Crea tu primera unidad didáctica para comenzar a organizar tus sesiones</p>
                    <LimitedCreateButton href="/dashboard/unidades/nueva" limitType="unidad" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all">
                        <PlusIcon /> Nueva Unidad
                    </LimitedCreateButton>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center bg-white rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3"><SearchIcon /></div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-1">Sin resultados</h3>
                    <button onClick={() => setSearch('')} className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium">Limpiar búsqueda</button>
                </div>
            ) : (
                /* ── Card-row layout (Stitch inspired) ── */
                <div className="space-y-3">
                    {filtered.map((unidad) => {
                        const isValid = unidad.validation_status === 'valid'
                        const dotColor = isValid ? 'bg-emerald-400' : unidad.validation_status === 'invalid' ? 'bg-red-400' : 'bg-amber-400'

                        return (
                            <div
                                key={unidad.id}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-violet-200 hover:shadow-md transition-all group"
                                style={{ boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}
                            >
                                <div className="flex items-center gap-0 overflow-hidden rounded-2xl">
                                    {/* Dot indicator lateral */}
                                    <div className={`w-1 self-stretch flex-shrink-0 ${dotColor}`} />

                                    <div className="flex-1 px-5 py-4 flex items-center gap-4 min-w-0">
                                        {/* Número de orden */}
                                        <span className="w-8 h-8 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl flex items-center justify-center flex-shrink-0">
                                            #{unidad.orden ?? '?'}
                                        </span>

                                        {/* Título + meta chips */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-1 mb-1.5">
                                                {unidad.titulo}
                                            </h3>
                                            {/* Meta chips */}
                                            <div className="flex items-center flex-wrap gap-2">
                                                {unidad.programaciones?.areas?.nombre && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg">
                                                        <AreaIcon /> {unidad.programaciones.areas.nombre}
                                                    </span>
                                                )}
                                                {unidad.programaciones?.grados?.nombre && (
                                                    <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg">
                                                        {unidad.programaciones.grados.nombre}
                                                    </span>
                                                )}
                                                {unidad.duracion_semanas && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg">
                                                        <CalendarWeeksIcon /> {unidad.duracion_semanas} sem.
                                                    </span>
                                                )}
                                                {unidad.programaciones?.titulo && (
                                                    <span className="text-xs text-slate-400 max-w-[200px] truncate hidden sm:inline">
                                                        {unidad.programaciones.titulo}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Estado + CTA */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <StatusBadge status={unidad.validation_status || 'pending'} />
                                            <Link
                                                href={`/dashboard/unidades/${unidad.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-violet-700 transition-colors whitespace-nowrap"
                                            >
                                                Ver detalle <ArrowRightIcon />
                                            </Link>
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
