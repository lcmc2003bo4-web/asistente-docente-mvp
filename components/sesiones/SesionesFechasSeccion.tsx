'use client'

import { useEffect, useState } from 'react'
import { planificadorService } from '@/lib/services/PlanificadorService'
import type { SesionFechaSeccion } from '@/lib/services/PlanificadorService'

interface Props {
    sesionId: string
    userId: string
    secciones: string[]         // from programacion (e.g. ['A', 'B', 'C'])
    onSaved?: () => void
}

export default function SesionesFechasSeccion({ sesionId, userId, secciones, onSaved }: Props) {
    // Map seccion → fecha (ISO string)
    const [fechas, setFechas] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Load existing dates
    useEffect(() => {
        if (!sesionId || secciones.length === 0) { setLoading(false); return }
        planificadorService.getFechasPorSeccion(sesionId).then(rows => {
            const map: Record<string, string> = {}
            rows.forEach(r => { map[r.seccion] = r.fecha })
            // Pre-fill all known secciones (may be empty)
            secciones.forEach(s => { if (!map[s]) map[s] = '' })
            setFechas(map)
        }).finally(() => setLoading(false))
    }, [sesionId, secciones])

    const handleChange = (seccion: string, value: string) => {
        setFechas(prev => ({ ...prev, [seccion]: value }))
        setSaved(false)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const toSave = Object.entries(fechas)
                .filter(([, fecha]) => fecha)
                .map(([seccion, fecha]) => ({ seccion, fecha }))
            await planificadorService.saveFechasPorSeccion(sesionId, userId, toSave)
            setSaved(true)
            onSaved?.()
        } catch (e: any) {
            alert('Error al guardar fechas: ' + e.message)
        } finally {
            setSaving(false)
        }
    }

    if (secciones.length === 0) return null

    return (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-sm font-semibold text-indigo-800">Fechas por Sección</h3>
                <span className="text-xs text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {secciones.length} {secciones.length === 1 ? 'sección' : 'secciones'}
                </span>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {secciones.map(s => (
                        <div key={s} className="h-10 bg-indigo-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {secciones.map(seccion => (
                        <div key={seccion} className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full
                                bg-indigo-600 text-white text-sm font-bold flex-shrink-0">
                                {seccion}
                            </span>
                            <div className="flex-1">
                                <label className="text-xs text-indigo-700 font-medium block mb-1">
                                    Sección {seccion}
                                </label>
                                <input
                                    type="date"
                                    value={fechas[seccion] || ''}
                                    onChange={e => handleChange(seccion, e.target.value)}
                                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg bg-white
                                        text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            {fechas[seccion] && (
                                <button
                                    type="button"
                                    onClick={() => handleChange(seccion, '')}
                                    className="text-indigo-300 hover:text-indigo-600 transition mt-4"
                                    title="Limpiar fecha"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                        {saved && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Fechas guardadas
                            </span>
                        )}
                        <div className="ml-auto">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700
                                    disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                {saving ? (
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Guardar fechas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-xs text-indigo-500 mt-3 pt-3 border-t border-indigo-200">
                Cada sección tendrá su propia fila en el Planificador Mensual con la fecha asignada.
                Las secciones sin fecha no aparecerán en el planificador.
            </p>
        </div>
    )
}
