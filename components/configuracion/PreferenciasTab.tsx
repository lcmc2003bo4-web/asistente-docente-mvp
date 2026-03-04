'use client'

import { useState } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { institucionService } from '@/lib/services/InstitucionService'
import type { UserPreferencias } from '@/types/database.types'

export function PreferenciasTab() {
    const { profile, loading, refresh } = useUserProfile()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [prefs, setPrefs] = useState<UserPreferencias | null>(null)

    if (profile && !prefs) {
        setPrefs({ ...profile.preferencias })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile || !prefs) return
        setSaving(true)
        try {
            await institucionService.updatePreferencias(profile.id, prefs)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
            refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loading || !prefs) {
        return <div className="space-y-4 animate-pulse">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}</div>
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                <strong>💡 Auto-relleno inteligente:</strong> Estos valores se pre-cargarán automáticamente al crear nuevas programaciones y sesiones.
            </div>

            {/* Año escolar */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año Escolar Activo</label>
                <input
                    type="number"
                    min="2020" max="2035"
                    value={prefs.anio_escolar || new Date().getFullYear()}
                    onChange={e => setPrefs({ ...prefs, anio_escolar: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Se usará como año por defecto en las programaciones</p>
            </div>

            {/* Periodo */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Período por Defecto</label>
                <div className="flex gap-3">
                    {(['Bimestral', 'Trimestral'] as const).map(pt => (
                        <button
                            key={pt}
                            type="button"
                            onClick={() => setPrefs({ ...prefs, periodo_tipo: pt })}
                            className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition ${prefs.periodo_tipo === pt
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >
                            {pt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Duración sesión */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración Estándar de Sesión
                    <span className="ml-2 text-indigo-600 font-semibold">{prefs.duracion_sesion} min</span>
                </label>
                <input
                    type="range"
                    min="30" max="180" step="15"
                    value={prefs.duracion_sesion || 90}
                    onChange={e => setPrefs({ ...prefs, duracion_sesion: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>30 min</span><span>90 min</span><span>180 min</span>
                </div>
            </div>

            {/* Nivel preferido */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel Educativo por Defecto</label>
                <div className="flex gap-3">
                    {(['Inicial', 'Primaria', 'Secundaria'] as const).map(nv => (
                        <button
                            key={nv}
                            type="button"
                            onClick={() => setPrefs({ ...prefs, nivel: nv })}
                            className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition ${prefs.nivel === nv
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >
                            {nv}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar preferencias'}
                </button>
            </div>
        </form>
    )
}
