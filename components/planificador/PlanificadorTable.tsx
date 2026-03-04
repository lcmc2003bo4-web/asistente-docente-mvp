'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { PlanificadorWeekGroup, PlanificadorRow } from '@/lib/services/PlanificadorService'

interface Props {
    groups: PlanificadorWeekGroup[]
    anio: number
    mes: number
    activeSeccion?: string
}

export default function PlanificadorTable({ groups, anio, mes, activeSeccion }: Props) {
    const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

    const toggleWeek = (semana: number) => {
        setCollapsed(prev => {
            const next = new Set(prev)
            if (next.has(semana)) next.delete(semana)
            else next.add(semana)
            return next
        })
    }

    const filterRow = (row: PlanificadorRow) => {
        if (!activeSeccion) return true
        return row.seccion === activeSeccion
    }

    const formatDate = (iso: string) => {
        const [y, m, d] = iso.split('-')
        return `${d}/${m}/${y}`
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-lg font-medium text-gray-500">Sin sesiones para este mes</p>
                <p className="text-sm mt-1">Verifica que tus sesiones tengan fecha asignada.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {groups.map(group => {
                const visibleRows = group.rows.filter(filterRow)
                if (visibleRows.length === 0) return null
                const isCollapsed = collapsed.has(group.semana)

                return (
                    <div key={group.semana} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Week header */}
                        <button
                            onClick={() => toggleWeek(group.semana)}
                            className="w-full flex items-center justify-between px-5 py-3 bg-indigo-50 hover:bg-indigo-100 transition text-left"
                        >
                            <span className="font-semibold text-indigo-700 text-sm tracking-wide uppercase">
                                {group.label}
                            </span>
                            <span className="flex items-center gap-2 text-indigo-500">
                                <span className="text-xs bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">
                                    {visibleRows.length} {visibleRows.length === 1 ? 'sesión' : 'sesiones'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>

                        {!isCollapsed && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Fecha</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Día</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título de la Sesión</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Grado / Área</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Sección</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Estado</th>
                                            <th className="px-4 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {visibleRows.map((row, i) => (
                                            <tr key={`${row.id}-${row.seccion}`}
                                                className={`hover:bg-indigo-50/40 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                                                <td className="px-4 py-3 text-gray-700 font-mono text-xs">{formatDate(row.fecha)}</td>
                                                <td className="px-4 py-3 text-gray-600 text-xs">{row.dia_semana}</td>
                                                <td className="px-4 py-3 text-gray-800 font-medium">{row.titulo}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs text-gray-700">{row.grado_nombre}</span>
                                                        <span className="text-xs text-gray-400">{row.area_nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {row.seccion !== '—' ? (
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                            {row.seccion}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.estado === 'Validado'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {row.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link href={row.sesion_url} title="Ver sesión"
                                                        className="text-indigo-400 hover:text-indigo-600 transition">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
