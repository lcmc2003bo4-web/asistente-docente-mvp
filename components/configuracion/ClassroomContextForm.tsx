'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { contextoInstitucionalService } from '@/lib/services/ContextoInstitucionalService'
import TagInputField from '@/components/ui/TagInputField'
import type { NivelSocioeconomico } from '@/types/database.types'

const SUGERENCIAS_INTERESES = [
    'Fútbol', 'Música urbana', 'TikTok', 'Videojuegos', 'Voleibol',
    'Danzas folklóricas', 'Arte', 'Tecnología', 'Redes sociales',
]
const SUGERENCIAS_RETOS = [
    'Bajo nivel lector', 'Dificultades en matemática', 'Ausentismo',
    'Desinterés académico', 'Problemas de conducta', 'Falta de materiales',
    'Conectividad limitada', 'Trabajo fuera del horario escolar',
]

interface ClassroomContextFormProps {
    institucionId: string
    anioEscolar: number
    gradoId?: string
    onSaved: () => void
    onCancel?: () => void
}

/**
 * Formulario rápido (modal) para capturar el contexto específico del aula del docente.
 * Se muestra al crear/editar una programación anual.
 */
export default function ClassroomContextForm({
    institucionId,
    anioEscolar,
    gradoId,
    onSaved,
    onCancel,
}: ClassroomContextFormProps) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        seccion: '',
        num_estudiantes: '' as string | number,
        intereses_comunes: [] as string[],
        retos_educativos: [] as string[],
        nivel_socioeconomico: '' as NivelSocioeconomico | '',
        caracteristicas_adicionales: '',
    })

    const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No autenticado')

            await contextoInstitucionalService.upsertContextoAula({
                userId: user.id,
                institucionId,
                anioEscolar,
                gradoId: gradoId ?? null,
                payload: {
                    seccion: form.seccion || null,
                    num_estudiantes: form.num_estudiantes ? Number(form.num_estudiantes) : null,
                    intereses_comunes: form.intereses_comunes,
                    retos_educativos: form.retos_educativos,
                    nivel_socioeconomico: (form.nivel_socioeconomico as NivelSocioeconomico) || null,
                    caracteristicas_adicionales: form.caracteristicas_adicionales || null,
                },
            })
            onSaved()
        } catch (err: any) {
            setError(err?.message || 'Error al guardar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
                    Contexto de tu Aula
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Esta información ayuda a la IA a generar situaciones significativas más cercanas a tus estudiantes.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Sección</label>
                    <input
                        type="text"
                        value={form.seccion}
                        onChange={e => setForm(f => ({ ...f, seccion: e.target.value }))}
                        placeholder="Ej. A, B, Única"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>N° de estudiantes</label>
                    <input
                        type="number"
                        min={1}
                        max={60}
                        value={form.num_estudiantes}
                        onChange={e => setForm(f => ({ ...f, num_estudiantes: e.target.value }))}
                        placeholder="Ej. 28"
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Nivel socioeconómico del aula (opcional)</label>
                <select
                    value={form.nivel_socioeconomico}
                    onChange={e => setForm(f => ({ ...f, nivel_socioeconomico: e.target.value as any }))}
                    className={inputClass}
                >
                    <option value="">Sin especificar</option>
                    {['Bajo', 'Medio-bajo', 'Medio', 'Medio-alto', 'Alto'].map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>

            <TagInputField
                label="Intereses comunes de los estudiantes"
                value={form.intereses_comunes}
                onChange={v => setForm(f => ({ ...f, intereses_comunes: v }))}
                suggestions={SUGERENCIAS_INTERESES}
                placeholder="Ej. Fútbol, Música…"
            />

            <TagInputField
                label="Retos educativos del grupo"
                value={form.retos_educativos}
                onChange={v => setForm(f => ({ ...f, retos_educativos: v }))}
                suggestions={SUGERENCIAS_RETOS}
                placeholder="Ej. Bajo nivel lector…"
            />

            <div>
                <label className={labelClass}>Características adicionales (opcional)</label>
                <textarea
                    rows={2}
                    value={form.caracteristicas_adicionales}
                    onChange={e => setForm(f => ({ ...f, caracteristicas_adicionales: e.target.value }))}
                    placeholder="Cualquier información adicional relevante sobre el grupo"
                    className={`${inputClass} resize-none`}
                />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        Omitir
                    </button>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {saving ? 'Guardando…' : 'Guardar contexto'}
                </button>
            </div>
        </form>
    )
}
