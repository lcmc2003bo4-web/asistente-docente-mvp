'use client'

import Link from 'next/link'
import type { PlanificadorRow } from '@/lib/services/PlanificadorService'

const MONTH_NAMES = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

interface Props {
    rows: PlanificadorRow[]
    anio: number
    mes: number
}

export default function PlanificadorCalendar({ rows, anio, mes }: Props) {
    // Build a map date-string → rows
    const dayMap = new Map<number, PlanificadorRow[]>()
    for (const row of rows) {
        const day = new Date(row.fecha + 'T00:00:00').getDate()
        const existing = dayMap.get(day) || []
        existing.push(row)
        dayMap.set(day, existing)
    }

    const firstOfMonth = new Date(anio, mes - 1, 1)
    const daysInMonth = new Date(anio, mes, 0).getDate()
    // getDay() returns 0=Sun…6=Sat; convert to 0=Mon…6=Sun
    const startDow = (firstOfMonth.getDay() + 6) % 7

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    // Build grid cells: blanks + day numbers
    const cells: (number | null)[] = [
        ...Array(startDow).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    // Pad to full weeks
    while (cells.length % 7 !== 0) cells.push(null)

    const today = new Date()
    const isCurrentMonth = today.getMonth() + 1 === mes && today.getFullYear() === anio

    return (
        <div>
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    {MONTH_NAMES[mes]} {anio}
                </h3>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {dayNames.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, idx) => {
                    if (!day) return <div key={`blank-${idx}`} className="rounded-lg h-24" />

                    const sessions = dayMap.get(day) || []
                    const isToday = isCurrentMonth && today.getDate() === day

                    return (
                        <div
                            key={day}
                            className={`rounded-lg border h-24 p-1.5 flex flex-col text-xs overflow-hidden transition
                                ${isToday
                                    ? 'border-indigo-400 bg-indigo-50'
                                    : sessions.length > 0
                                        ? 'border-indigo-200 bg-white'
                                        : 'border-gray-100 bg-gray-50/60'
                                }`}
                        >
                            <span className={`font-bold mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                                {day}
                            </span>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                {sessions.slice(0, 2).map(s => (
                                    <Link
                                        key={s.id}
                                        href={s.sesion_url}
                                        title={s.titulo}
                                        className="block truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight
                                            bg-indigo-500 text-white hover:bg-indigo-600 transition"
                                    >
                                        {s.titulo}
                                    </Link>
                                ))}
                                {sessions.length > 2 && (
                                    <span className="text-[10px] text-indigo-400 pl-1">
                                        +{sessions.length - 2} más
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
