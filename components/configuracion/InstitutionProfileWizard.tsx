'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { contextoInstitucionalService } from '@/lib/services/ContextoInstitucionalService'
import TagInputField from '@/components/ui/TagInputField'
import type {
    TipoGestion,
    ZonaGeografica,
    NivelSocioeconomico,
} from '@/types/database.types'

// ── Sugerencias para tags ──────────────────────────────────
const SUGERENCIAS_ACTIVIDADES = [
    'Agricultura', 'Ganadería', 'Pesca artesanal', 'Minería', 'Textilería',
    'Artesanía', 'Comercio', 'Turismo', 'Comercio informal', 'Agroindustria',
]

const SUGERENCIAS_PROBLEMATICAS = [
    'Deserción escolar', 'Trabajo infantil', 'Embarazo adolescente',
    'Violencia familiar', 'Pobreza extrema', 'Contaminación ambiental',
    'Bajo nivel lector', 'Ausentismo escolar', 'Acceso limitado a internet',
    'Migración familiar', 'Consumo de alcohol en adolescentes',
]

const SUGERENCIAS_FESTIVIDADES = [
    'Inti Raymi', 'Carnaval regional', 'Semana Santa', 'Fiestas Patrias',
    'Virgen del Carmen', 'Aniversario del distrito', 'Corpus Christi',
    'Cruz de Mayo', 'Navidad navideña escolar', 'Fiesta patronal',
]

const SUGERENCIAS_VALORES = [
    'Respeto', 'Solidaridad', 'Honestidad', 'Responsabilidad',
    'Identidad cultural', 'Fe', 'Justicia', 'Amor al prójimo',
    'Perseverancia', 'Puntualidad', 'Creatividad',
]

// ── Tipos de los pasos ─────────────────────────────────────
interface Step1Data {
    tipo_gestion: TipoGestion
    zona: ZonaGeografica
    region: string
    distrito: string
    contexto_socioeconomico: NivelSocioeconomico
}

interface Step2Data {
    actividades_economicas: string[]
    problematicas_locales: string[]
    festividades_regionales: string[]
    proyectos_comunitarios: string[]
    identidad_cultural: string
}

interface Step3Data {
    mision: string
    vision: string
    valores: string[]
    enfoque_religioso: string
}

interface InstitutionProfileWizardProps {
    institucionId: string
    onCompleted: () => void
    onSkip?: () => void
}

/**
 * Wizard de 3 pasos para completar el perfil de contextualización institucional.
 * Puede ser usado en la página /configuracion/institucion o en un modal de onboarding.
 */
export default function InstitutionProfileWizard({
    institucionId,
    onCompleted,
    onSkip,
}: InstitutionProfileWizardProps) {
    const [step, setStep] = useState(1)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [step1, setStep1] = useState<Step1Data>({
        tipo_gestion: 'Pública',
        zona: 'Urbana',
        region: '',
        distrito: '',
        contexto_socioeconomico: 'Medio-bajo',
    })

    const [step2, setStep2] = useState<Step2Data>({
        actividades_economicas: [],
        problematicas_locales: [],
        festividades_regionales: [],
        proyectos_comunitarios: [],
        identidad_cultural: '',
    })

    const [step3, setStep3] = useState<Step3Data>({
        mision: '',
        vision: '',
        valores: [],
        enfoque_religioso: '',
    })

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No autenticado')

            await contextoInstitucionalService.updatePerfilContexto(institucionId, user.id, {
                tipo_gestion: step1.tipo_gestion,
                zona: step1.zona,
                region: step1.region,
                distrito: step1.distrito,
                contexto_socioeconomico: step1.contexto_socioeconomico,
                actividades_economicas: step2.actividades_economicas,
                problematicas_locales: step2.problematicas_locales,
                festividades_regionales: step2.festividades_regionales,
                proyectos_comunitarios: step2.proyectos_comunitarios,
                identidad_cultural: step2.identidad_cultural || null,
                mision: step3.mision || null,
                vision: step3.vision || null,
                valores: step3.valores,
                enfoque_religioso: step3.enfoque_religioso || null,
                perfil_completado: true,
            })
            onCompleted()
        } catch (err: any) {
            setError(err?.message || 'Error al guardar el perfil')
        } finally {
            setSaving(false)
        }
    }

    const selectClass = "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
    const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Perfil de Contextualización Institucional
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Esta información permitirá que la IA genere Unidades de Aprendizaje adaptadas a la realidad de tu colegio.
                </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map(n => (
                    <React.Fragment key={n}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${step === n
                                ? 'bg-indigo-600 text-white'
                                : step > n
                                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}>
                            {step > n ? '✓' : n}
                        </div>
                        {n < 3 && <div className={`flex-1 h-1 rounded ${step > n ? 'bg-indigo-300 dark:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Paso 1: Datos Generales ── */}
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Paso 1: Datos Generales</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Tipo de gestión</label>
                            <select
                                value={step1.tipo_gestion}
                                onChange={e => setStep1(s => ({ ...s, tipo_gestion: e.target.value as TipoGestion }))}
                                className={selectClass}
                            >
                                {['Pública', 'Privada', 'Parroquial', 'Fe y Alegría', 'Otro'].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Zona</label>
                            <select
                                value={step1.zona}
                                onChange={e => setStep1(s => ({ ...s, zona: e.target.value as ZonaGeografica }))}
                                className={selectClass}
                            >
                                {['Urbana', 'Rural', 'Urbano-marginal'].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Región</label>
                            <input
                                type="text"
                                value={step1.region}
                                onChange={e => setStep1(s => ({ ...s, region: e.target.value }))}
                                placeholder="Ej. Cusco, Puno, Lima"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Distrito</label>
                            <input
                                type="text"
                                value={step1.distrito}
                                onChange={e => setStep1(s => ({ ...s, distrito: e.target.value }))}
                                placeholder="Ej. Pisac, Azángaro"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Nivel socioeconómico de la comunidad</label>
                        <select
                            value={step1.contexto_socioeconomico}
                            onChange={e => setStep1(s => ({ ...s, contexto_socioeconomico: e.target.value as NivelSocioeconomico }))}
                            className={selectClass}
                        >
                            {['Bajo', 'Medio-bajo', 'Medio', 'Medio-alto', 'Alto'].map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* ── Paso 2: Contexto Sociocultural ── */}
            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Paso 2: Contexto Sociocultural</h3>

                    <TagInputField
                        label="Actividades económicas predominantes"
                        value={step2.actividades_economicas}
                        onChange={v => setStep2(s => ({ ...s, actividades_economicas: v }))}
                        suggestions={SUGERENCIAS_ACTIVIDADES}
                        placeholder="Ej. Agricultura, Artesanía…"
                    />

                    <TagInputField
                        label="Problemáticas locales relevantes"
                        value={step2.problematicas_locales}
                        onChange={v => setStep2(s => ({ ...s, problematicas_locales: v }))}
                        suggestions={SUGERENCIAS_PROBLEMATICAS}
                        placeholder="Ej. Deserción escolar…"
                    />

                    <TagInputField
                        label="Festividades y eventos regionales"
                        value={step2.festividades_regionales}
                        onChange={v => setStep2(s => ({ ...s, festividades_regionales: v }))}
                        suggestions={SUGERENCIAS_FESTIVIDADES}
                        placeholder="Ej. Inti Raymi, Carnaval…"
                    />

                    <TagInputField
                        label="Proyectos comunitarios activos (opcional)"
                        value={step2.proyectos_comunitarios}
                        onChange={v => setStep2(s => ({ ...s, proyectos_comunitarios: v }))}
                        placeholder="Ej. Biohuerto, Reciclaje…"
                    />

                    <div>
                        <label className={labelClass}>Identidad cultural (opcional)</label>
                        <textarea
                            rows={2}
                            value={step2.identidad_cultural}
                            onChange={e => setStep2(s => ({ ...s, identidad_cultural: e.target.value }))}
                            placeholder="Ej. Comunidad quechua con tradición textil andina"
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>
            )}

            {/* ── Paso 3: Identidad Institucional ── */}
            {step === 3 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Paso 3: Identidad Institucional</h3>

                    <div>
                        <label className={labelClass}>Misión (opcional)</label>
                        <textarea
                            rows={2}
                            value={step3.mision}
                            onChange={e => setStep3(s => ({ ...s, mision: e.target.value }))}
                            placeholder="¿Cuál es la misión de tu institución?"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Visión (opcional)</label>
                        <textarea
                            rows={2}
                            value={step3.vision}
                            onChange={e => setStep3(s => ({ ...s, vision: e.target.value }))}
                            placeholder="¿Cuál es la visión de tu institución?"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <TagInputField
                        label="Valores institucionales"
                        value={step3.valores}
                        onChange={v => setStep3(s => ({ ...s, valores: v }))}
                        suggestions={SUGERENCIAS_VALORES}
                        placeholder="Ej. Respeto, Solidaridad…"
                    />

                    <div>
                        <label className={labelClass}>Enfoque institucional (opcional)</label>
                        <input
                            type="text"
                            value={step3.enfoque_religioso}
                            onChange={e => setStep3(s => ({ ...s, enfoque_religioso: e.target.value }))}
                            placeholder="Ej. Fe y Alegría, Laico, Adventista, Parroquial"
                            className={inputClass}
                        />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(s => s - 1)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            ← Atrás
                        </button>
                    )}
                    {onSkip && step === 1 && (
                        <button
                            type="button"
                            onClick={onSkip}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Completar después
                        </button>
                    )}
                </div>

                <div>
                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={() => setStep(s => s + 1)}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Siguiente →
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {saving ? 'Guardando…' : '✓ Guardar perfil'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
