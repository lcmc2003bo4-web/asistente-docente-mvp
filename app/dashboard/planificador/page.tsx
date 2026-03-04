'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { planificadorService } from '@/lib/services/PlanificadorService'
import type {
    PlanificadorResult,
    PlanificadorWeekGroup,
    PlanificadorRow,
} from '@/lib/services/PlanificadorService'
import PlanificadorTable from '@/components/planificador/PlanificadorTable'
import PlanificadorCalendar from '@/components/planificador/PlanificadorCalendar'
import { pdfService } from '@/lib/services/PdfService'

const MONTH_NAMES = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const CURRENT_MONTH = now.getMonth() + 1
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1]

type ViewMode = 'tabla' | 'calendario'

export default function PlanificadorPage() {
    const [userId, setUserId] = useState<string | null>(null)
    const [instituciones, setInstituciones] = useState<string[]>([])
    const [loadingInstituciones, setLoadingInstituciones] = useState(true)

    // Filters
    const [institucion, setInstitucion] = useState<string>('')
    const [anio, setAnio] = useState<number>(CURRENT_YEAR)
    const [mes, setMes] = useState<number>(CURRENT_MONTH)

    // Results
    const [result, setResult] = useState<PlanificadorResult | null>(null)
    const [groups, setGroups] = useState<PlanificadorWeekGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // UI state
    const [viewMode, setViewMode] = useState<ViewMode>('tabla')
    const [activeSeccion, setActiveSeccion] = useState<string>('')
    const [pdfLoading, setPdfLoading] = useState(false)

    // Load user + instituciones on mount
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return
            setUserId(user.id)
            try {
                const list = await planificadorService.getInstituciones(user.id)
                setInstituciones(list)
                if (list.length === 1) setInstitucion(list[0])
            } finally {
                setLoadingInstituciones(false)
            }
        })
    }, [])

    // Unique secciones for chip filters (only when more than one section exists)
    const seccionesDisponibles = Array.from(
        new Set((result?.rows || []).map(r => r.seccion).filter(s => s !== '—'))
    ).sort()

    const handleGenerate = useCallback(async () => {
        if (!userId || !institucion) return
        setLoading(true)
        setErrorMsg(null)
        setResult(null)
        setGroups([])
        setActiveSeccion('')
        try {
            const res = await planificadorService.getByMes(userId, institucion, anio, mes)
            const grps = planificadorService.groupByWeek(res.rows)
            setResult(res)
            setGroups(grps)
        } catch (e: any) {
            setErrorMsg(e.message || 'Error al generar el planificador')
        } finally {
            setLoading(false)
        }
    }, [userId, institucion, anio, mes])

    const handleDownloadPDF = async () => {
        if (!result) return
        setPdfLoading(true)
        try {
            await pdfService.downloadPlanificadorPDF(result.rows, result.meta)
        } catch (e: any) {
            alert('Error al generar PDF: ' + e.message)
        } finally {
            setPdfLoading(false)
        }
    }

    const filteredRows = result?.rows.filter(r =>
        !activeSeccion || r.seccion === activeSeccion
    ) || []

    const filteredGroups = groups.map(g => ({
        ...g,
        rows: g.rows.filter(r => !activeSeccion || r.seccion === activeSeccion),
    })).filter(g => g.rows.length > 0)

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Planificador Mensual</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Consolida todas tus sesiones de aprendizaje por mes y colegio.
                    </p>
                </div>
                {result && result.rows.length > 0 && (
                    <button
                        onClick={handleDownloadPDF}
                        disabled={pdfLoading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
                            text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        {pdfLoading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                        Descargar PDF
                    </button>
                )}
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Filtros</h2>
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Colegio */}
                    <div className="flex-1 min-w-48">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Colegio / Institución</label>
                        {loadingInstituciones ? (
                            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                        ) : instituciones.length === 0 ? (
                            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                No hay colegios registrados. Crea una programación primero.
                            </div>
                        ) : (
                            <select
                                value={institucion}
                                onChange={e => setInstitucion(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800
                                    focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                            >
                                <option value="">Seleccionar colegio…</option>
                                {instituciones.map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Año */}
                    <div className="w-32">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Año</label>
                        <select
                            value={anio}
                            onChange={e => setAnio(Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                        >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    {/* Mes */}
                    <div className="w-44">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Mes</label>
                        <select
                            value={mes}
                            onChange={e => setMes(Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                        >
                            {MONTH_NAMES.slice(1).map((name, idx) => (
                                <option key={idx + 1} value={idx + 1}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Generate button */}
                    <button
                        onClick={handleGenerate}
                        disabled={!institucion || loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                            text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                        Generar Planificador
                    </button>
                </div>
            </div>

            {/* Error */}
            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {errorMsg}
                    </span>
                </div>
            )}

            {/* Results area */}
            {result && (
                <div className="space-y-4">
                    {/* Coverage badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="text-sm font-semibold text-indigo-700">
                                    {result.meta.total} {result.meta.total === 1 ? 'sesión' : 'sesiones'} planificadas
                                </span>
                            </div>
                            {result.sin_fecha_count > 0 && (
                                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-sm text-amber-700">
                                        {result.sin_fecha_count} sin fecha asignada
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                            {(['tabla', 'calendario'] as ViewMode[]).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition capitalize
                                        ${viewMode === mode
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {mode === 'tabla' ? '≡ Tabla' : '⊞ Calendario'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* No sessions warning */}
                    {result.warning === 'NO_SESSIONS' && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm">
                            <span className="inline-flex items-start gap-2">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>No hay sesiones con fecha asignada en <strong>{MONTH_NAMES[mes]} {anio}</strong> para este colegio.</span>
                            </span>
                        </div>
                    )}

                    {/* Sessions without date warning */}
                    {result.warning === 'SESSIONS_WITHOUT_DATE' && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm">
                            <span className="inline-flex items-start gap-2">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>{result.sin_fecha_count} {result.sin_fecha_count === 1 ? 'sesión no tiene' : 'sesiones no tienen'} fecha asignada y no {result.sin_fecha_count === 1 ? 'aparece' : 'aparecen'} en este planificador. Asígnales una fecha desde la edición de cada sesión.</span>
                            </span>
                        </div>
                    )}

                    {/* Section chip filters */}
                    {seccionesDisponibles.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Filtrar por sección:</span>
                            <button
                                onClick={() => setActiveSeccion('')}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition border
                                    ${!activeSeccion
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                Todas
                            </button>
                            {seccionesDisponibles.map(sec => (
                                <button
                                    key={sec}
                                    onClick={() => setActiveSeccion(sec === activeSeccion ? '' : sec)}
                                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full
                                        text-sm font-bold transition border-2
                                        ${activeSeccion === sec
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500'
                                        }`}
                                >
                                    {sec}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    {result.rows.length > 0 && (
                        viewMode === 'tabla'
                            ? <PlanificadorTable groups={filteredGroups} anio={anio} mes={mes} activeSeccion={activeSeccion} />
                            : <PlanificadorCalendar rows={filteredRows} anio={anio} mes={mes} />
                    )}
                </div>
            )}

            {/* Empty initial state */}
            {!result && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-5">
                        <svg className="w-10 h-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <circle cx="8" cy="15" r="1" fill="currentColor" />
                            <circle cx="12" cy="15" r="1" fill="currentColor" />
                            <circle cx="16" cy="15" r="1" fill="currentColor" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-slate-600 mb-1">Planificador Mensual</h3>
                    <p className="text-sm text-slate-400 max-w-xs">Selecciona un colegio y mes para generar el planificador de sesiones</p>
                </div>
            )}
        </div>
    )
}
