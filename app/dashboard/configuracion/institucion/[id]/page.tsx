'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { contextoInstitucionalService } from '@/lib/services/ContextoInstitucionalService'
import type { TipoGestion, ZonaGeografica, NivelSocioeconomico } from '@/types/database.types'
import UnidadesInstitucionalesList from '@/components/configuracion/UnidadesInstitucionalesList'

interface Props {
    params: Promise<{ id: string }>
}

/**
 * Página completa de edición de perfil contextual de una institución.
 * Ruta: /dashboard/configuracion/institucion/[id]
 *
 * Reemplaza el wizard inline — formulario amplio en una sola página.
 * Los campos de arrays se capturan como texto libre (una línea por ítem o coma-separados).
 */
export default function EditarContextoInstitucionPage({ params }: Props) {
    const router = useRouter()
    const { id: institucionId } = React.use(params)

    const [activeTab, setActiveTab] = useState<'perfil' | 'plan'>('perfil')

    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [institucionNombre, setInstitucionNombre] = useState('')

    // ── Campos del formulario ─────────────────────────────────────────
    const [tipo_gestion, setTipoGestion] = useState<TipoGestion>('Pública')
    const [zona, setZona] = useState<ZonaGeografica>('Urbana')
    const [region, setRegion] = useState('')
    const [distrito, setDistrito] = useState('')
    const [contexto_socioeconomico, setContextoSocioeconomico] = useState<NivelSocioeconomico>('Medio-bajo')

    // Texto libre — cada campo es un textarea; al guardar se parsea a array por líneas/comas
    const [actividades_economicas, setActividadesEconomicas] = useState('')
    const [problematicas_locales, setProblematicasLocales] = useState('')
    const [festividades_regionales, setFestividadesRegionales] = useState('')
    const [proyectos_comunitarios, setProyectosComunitarios] = useState('')
    const [identidad_cultural, setIdentidadCultural] = useState('')

    const [mision, setMision] = useState('')
    const [vision, setVision] = useState('')
    const [valores, setValores] = useState('')
    const [enfoque_religioso, setEnfoqueReligioso] = useState('')

    // ── Convertir texto ↔ array ───────────────────────────────────────
    const toArray = (text: string): string[] =>
        text.split(/[\n,]/).map(s => s.trim()).filter(Boolean)

    const fromArray = (arr: string[] | null | undefined): string =>
        (arr ?? []).join('\n')

    // ── Cargar datos existentes ───────────────────────────────────────
    useEffect(() => {
        async function load() {
            const supabase = createClient()

            // Nombre de la institución
            const { data: inst } = await supabase
                .from('instituciones')
                .select('nombre, tipo_gestion, zona, region, distrito, mision, vision, valores, enfoque_religioso, contexto_socioeconomico, actividades_economicas, identidad_cultural, problematicas_locales, festividades_regionales, proyectos_comunitarios')
                .eq('id', institucionId)
                .single()

            if (inst) {
                const tg = ((inst as any).tipo_gestion as TipoGestion) || 'Pública'
                setInstitucionNombre((inst as any).nombre || '')
                setTipoGestion(tg) // alimenta tanto tipo_gestion (formulario) como la detección de privado
                setZona(((inst as any).zona as ZonaGeografica) || 'Urbana')
                setRegion((inst as any).region || '')
                setDistrito((inst as any).distrito || '')
                setContextoSocioeconomico(((inst as any).contexto_socioeconomico as NivelSocioeconomico) || 'Medio-bajo')
                setActividadesEconomicas(fromArray((inst as any).actividades_economicas))
                setProblematicasLocales(fromArray((inst as any).problematicas_locales))
                setFestividadesRegionales(fromArray((inst as any).festividades_regionales))
                setProyectosComunitarios(fromArray((inst as any).proyectos_comunitarios))
                setIdentidadCultural((inst as any).identidad_cultural || '')
                setMision((inst as any).mision || '')
                setVision((inst as any).vision || '')
                setValores(fromArray((inst as any).valores))
                setEnfoqueReligioso((inst as any).enfoque_religioso || '')

                // Colegios privados empiezan en la pestaña del Plan Anual
                const esPrivado = ['Privada', 'Parroquial', 'Fe y Alegría'].includes(tg)
                if (esPrivado) setActiveTab('plan')
            }
            setLoading(false)
        }
        load()
    }, [institucionId])

    // ── Guardar ───────────────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No autenticado')

            await contextoInstitucionalService.updatePerfilContexto(institucionId, user.id, {
                tipo_gestion,
                zona,
                region,
                distrito,
                contexto_socioeconomico,
                actividades_economicas: toArray(actividades_economicas),
                problematicas_locales: toArray(problematicas_locales),
                festividades_regionales: toArray(festividades_regionales),
                proyectos_comunitarios: toArray(proyectos_comunitarios),
                identidad_cultural: identidad_cultural || null,
                mision: mision || null,
                vision: vision || null,
                valores: toArray(valores),
                enfoque_religioso: enfoque_religioso || null,
                perfil_completado: true,
            })
            setSaved(true)
        } catch (err: any) {
            setError(err?.message || 'Error al guardar')
        } finally {
            setSaving(false)
        }
    }

    // ── Estilos reutilizables ─────────────────────────────────────────
    const inputCls = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
    const selectCls = inputCls
    const textareaCls = `${inputCls} resize-none leading-relaxed`
    const labelCls = "block text-sm font-medium text-gray-700 mb-1"
    const hintCls = "text-xs text-gray-400 mt-1"
    const sectionCls = "bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (saved) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Perfil guardado</h2>
                <p className="text-gray-600 mb-6">La IA utilizará este contexto para generar Unidades de Aprendizaje específicas a tu comunidad.</p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => setSaved(false)}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Seguir editando
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/configuracion?tab=instituciones')}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Volver a Configuración
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Breadcrumb + título */}
            <div className="mb-6">
                <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                    <button onClick={() => router.push('/dashboard/configuracion?tab=instituciones')} className="hover:text-indigo-600 transition-colors">
                        Configuración
                    </button>
                    <span>›</span>
                    <span className="text-gray-400">Mis Instituciones</span>
                    <span>›</span>
                    <span className="text-gray-900 font-medium">{institucionNombre}</span>
                </nav>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">Configuración Institucional</h1>
                    {tipo_gestion && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            ['Privada', 'Parroquial', 'Fe y Alegría'].includes(tipo_gestion)
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {tipo_gestion}
                        </span>
                    )}
                </div>
                <p className="text-gray-500 mt-1 text-sm">
                    Administra el perfil de contexto y el plan anual de {institucionNombre}.
                </p>
            </div>

            {/* Banner guia para colegios privados */}
            {['Privada', 'Parroquial', 'Fe y Alegría'].includes(tipo_gestion) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700">🏛️</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-purple-900">Colegio {tipo_gestion} — Flujo de configuración recomendado</h3>
                        <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                            Como institución {tipo_gestion.toLowerCase()}, se recomienda configurar primero el
                            <strong> Plan Anual Institucional</strong> con las situaciones significativas, enfoques y títulos de cada unidad.
                            Los docentes de tu IE podrán seleccionar automáticamente la unidad que les corresponde al generar con IA.
                        </p>
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setActiveTab('plan')}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                    activeTab === 'plan'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                }`}
                            >
                                1️⃣ Configurar Plan Anual →
                            </button>
                            <button
                                onClick={() => setActiveTab('perfil')}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                    activeTab === 'perfil'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                }`}
                            >
                                2️⃣ Completar Perfil Contextual
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('perfil')}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'perfil'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Perfil Contextual
                </button>
                <button
                    onClick={() => setActiveTab('plan')}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'plan'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Plan Anual Institucional
                </button>
            </div>

            {/* Contenido de Tabs */}
            {activeTab === 'perfil' ? (
                <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
                    {/* ── Sección 1: Datos Geográficos ── */}
                    <div className={sectionCls}>
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            Ubicación y Tipo Institucional
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Tipo de gestión</label>
                                <select value={tipo_gestion} onChange={e => setTipoGestion(e.target.value as TipoGestion)} className={selectCls}>
                                    {['Pública', 'Privada', 'Parroquial', 'Fe y Alegría', 'Otro'].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Zona geográfica</label>
                                <select value={zona} onChange={e => setZona(e.target.value as ZonaGeografica)} className={selectCls}>
                                    {['Urbana', 'Rural', 'Urbano-marginal'].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Región</label>
                                <input type="text" value={region} onChange={e => setRegion(e.target.value)}
                                    placeholder="Ej: Cusco, Puno, Lima" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Distrito</label>
                                <input type="text" value={distrito} onChange={e => setDistrito(e.target.value)}
                                    placeholder="Ej: Pisac, Azángaro, Miraflores" className={inputCls} />
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>Nivel socioeconómico de la comunidad</label>
                            <select value={contexto_socioeconomico} onChange={e => setContextoSocioeconomico(e.target.value as NivelSocioeconomico)} className={selectCls}>
                                {['Bajo', 'Medio-bajo', 'Medio', 'Medio-alto', 'Alto'].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ── Sección 2: Contexto Sociocultural ── */}
                    <div className={sectionCls}>
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            Contexto Sociocultural
                        </h2>

                        <div>
                            <label className={labelCls}>Actividades económicas predominantes</label>
                            <textarea rows={3} value={actividades_economicas} onChange={e => setActividadesEconomicas(e.target.value)}
                                placeholder="Describe las principales actividades económicas de la comunidad. Ej: agricultura de subsistencia, comercio de artesanías textiles, ganadería alpaquera, turismo vivencial..."
                                className={textareaCls} />
                            <p className={hintCls}>Escribe con libertad — sé específico sobre las actividades reales de tu entorno.</p>
                        </div>

                        <div>
                            <label className={labelCls}>Problemáticas locales relevantes</label>
                            <textarea rows={3} value={problematicas_locales} onChange={e => setProblematicasLocales(e.target.value)}
                                placeholder="Describe los problemas sociales que afectan a los estudiantes y sus familias. Ej: alta tasa de deserción escolar por trabajo infantil estacional, migración de padres a la costa, acceso limitado a internet..."
                                className={textareaCls} />
                            <p className={hintCls}>Estos problemas aparecerán como eje del reto en la Situación Significativa.</p>
                        </div>

                        <div>
                            <label className={labelCls}>Festividades y eventos regionales</label>
                            <textarea rows={2} value={festividades_regionales} onChange={e => setFestividadesRegionales(e.target.value)}
                                placeholder="Ej: Inti Raymi (junio), Virgen del Carmen (julio), Carnaval regional (febrero), Aniversario del distrito..."
                                className={textareaCls} />
                        </div>

                        <div>
                            <label className={labelCls}>Proyectos comunitarios activos <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <textarea rows={2} value={proyectos_comunitarios} onChange={e => setProyectosComunitarios(e.target.value)}
                                placeholder="Ej: biohuerto escolar, proyecto de reciclaje comunitario, rescate de lengua quechua, feria agropecuaria anual..."
                                className={textareaCls} />
                        </div>

                        <div>
                            <label className={labelCls}>Identidad cultural <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <textarea rows={2} value={identidad_cultural} onChange={e => setIdentidadCultural(e.target.value)}
                                placeholder="Ej: comunidad quechua con fuerte tradición textil andina, con uso activo del quechua en el hogar y práctica de la chakra familiar..."
                                className={textareaCls} />
                        </div>
                    </div>

                    {/* ── Sección 3: Identidad Institucional ── */}
                    <div className={sectionCls}>
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            Identidad Institucional
                        </h2>

                        <div>
                            <label className={labelCls}>Misión <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <textarea rows={3} value={mision} onChange={e => setMision(e.target.value)}
                                placeholder="¿Cuál es la misión de tu institución? Puedes copiarla del PEI..."
                                className={textareaCls} />
                        </div>

                        <div>
                            <label className={labelCls}>Visión <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <textarea rows={3} value={vision} onChange={e => setVision(e.target.value)}
                                placeholder="¿Cuál es la visión de tu institución? Puedes copiarla del PEI..."
                                className={textareaCls} />
                        </div>

                        <div>
                            <label className={labelCls}>Valores institucionales</label>
                            <textarea rows={2} value={valores} onChange={e => setValores(e.target.value)}
                                placeholder="Ej: respeto, solidaridad, identidad cultural, fe, responsabilidad, amor al prójimo, perseverancia..."
                                className={textareaCls} />
                            <p className={hintCls}>Estos valores guiarán los Enfoques Transversales de la unidad.</p>
                        </div>

                        <div>
                            <label className={labelCls}>Enfoque o carácter institucional <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <input type="text" value={enfoque_religioso} onChange={e => setEnfoqueReligioso(e.target.value)}
                                placeholder="Ej: Estrictamente Católico, Laico, Adventista, Fe y Alegría, Marista..."
                                className={inputCls} />
                        </div>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* ── Botones ── */}
                    <div className="flex items-center justify-between pt-2 pb-8">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/configuracion?tab=instituciones')}
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            ← Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            {saving ? 'Guardando…' : '✓ Guardar perfil contextual'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="pb-8">
                    <UnidadesInstitucionalesList institucionId={institucionId} />
                </div>
            )}
        </div>
    )
}
