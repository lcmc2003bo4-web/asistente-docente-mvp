'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'

type Area = {
    id: string
    nombre: string
}

type Grado = {
    id: string
    nombre: string
    nivel: string
    ciclo: string | null
}

type Competencia = {
    id: string
    codigo: string
    nombre: string
}

export default function NuevaProgramacionPage() {
    const router = useRouter()
    const supabase = createClient()
    const { profile } = useUserProfile()

    const [profileApplied, setProfileApplied] = useState(false)
    const [selectedNivel, setSelectedNivel] = useState<'Inicial-I' | 'Inicial-II' | 'Primaria' | 'Secundaria' | null>(null)
    const [loading, setLoading] = useState(false)
    const [areas, setAreas] = useState<Area[]>([])
    const [grados, setGrados] = useState<Grado[]>([])
    const [competencias, setCompetencias] = useState<Competencia[]>([])
    const [selectedCompetencias, setSelectedCompetencias] = useState<string[]>([])
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        titulo: '',
        curso_nombre: '',
        institucion: '',
        area_id: '',
        grado_id: '',
        anio_escolar: new Date().getFullYear(),
        periodo_tipo: 'Trimestral' as 'Bimestral' | 'Trimestral',
    })
    // Secciones (optional)
    const [secciones, setSecciones] = useState<string[]>([])
    const [seccionInput, setSeccionInput] = useState('')

    // Auto-fill from profile defaults (runs once when profile loads)
    useEffect(() => {
        if (profile && !profileApplied) {
            setProfileApplied(true)
            const inst = profile.institucionPredeterminada
            const prefs = profile.preferencias
            setFormData(prev => ({
                ...prev,
                institucion: inst?.nombre || prev.institucion,
                anio_escolar: prefs?.anio_escolar || prev.anio_escolar,
                periodo_tipo: prefs?.periodo_tipo || prev.periodo_tipo,
            }))
            // Auto-select nivel from preferences, mapping legacy 'Inicial' → 'Inicial-II'
            if (prefs?.nivel) {
                const nivelMap: Record<string, 'Inicial-I' | 'Inicial-II' | 'Primaria' | 'Secundaria'> = {
                    'Inicial': 'Inicial-II', 'Inicial-I': 'Inicial-I', 'Inicial-II': 'Inicial-II',
                    'Primaria': 'Primaria', 'Secundaria': 'Secundaria'
                }
                const mapped = nivelMap[prefs.nivel]
                if (mapped) setSelectedNivel(mapped)
            }
            // Keep the default logo in logoUrl state for the form to use
            if (inst?.logo_url) {
                setDefaultLogoUrl(inst.logo_url)
            }
        }
    }, [profile, profileApplied])

    const [defaultLogoUrl, setDefaultLogoUrl] = useState<string | null>(null)

    useEffect(() => {
        loadAreas()
        loadGrados()
    }, [])

    useEffect(() => {
        if (formData.area_id && formData.grado_id) {
            loadCompetencias(formData.area_id, formData.grado_id)
        } else {
            // Clear competencias if area or grado is not yet chosen
            setCompetencias([])
            setSelectedCompetencias([])
        }
    }, [formData.area_id, formData.grado_id])

    const loadAreas = async () => {
        const { data } = await supabase
            .from('areas')
            .select('id, nombre')
            .order('nombre')
        if (data) setAreas(data)
    }

    const loadGrados = async () => {
        const { data } = await supabase
            .from('grados')
            .select('id, nombre, nivel, ciclo')
            .order('nombre')
        if (data) setGrados(data)
    }

    const loadCompetencias = async (areaId: string, gradoId: string) => {
        // Step 1: Find which competencias have desempeños for this specific grado
        const { data: caps } = await supabase
            .from('desempenos')
            .select('capacidades!inner(competencia_id)')
            .eq('grado_id', gradoId)

        const competenciaIds = [...new Set(
            (caps || []).map((d: any) => d.capacidades?.competencia_id).filter(Boolean)
        )] as string[]

        if (competenciaIds.length === 0) {
            setCompetencias([])
            setSelectedCompetencias([])
            return
        }

        // Step 2: Fetch competencias that belong to this area AND have desempeños for the grado
        const { data } = await supabase
            .from('competencias')
            .select('id, codigo, nombre')
            .eq('area_id', areaId)
            .in('id', competenciaIds)
            .order('codigo')

        if (data) {
            setCompetencias(data)
            // Auto-select all valid competencias
            setSelectedCompetencias(data.map(c => c.id))
        }
    }

    const toggleCompetencia = (id: string) => {
        setSelectedCompetencias(prev =>
            prev.includes(id)
                ? prev.filter(cid => cid !== id)
                : [...prev, id]
        )
    }

    const addSeccion = () => {
        const v = seccionInput.trim().toUpperCase()
        if (v && !secciones.includes(v)) {
            setSecciones(prev => [...prev, v])
        }
        setSeccionInput('')
    }

    const removeSeccion = (s: string) => {
        setSecciones(prev => prev.filter(x => x !== s))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            let logo_url: string | null = defaultLogoUrl
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('logos')
                    .upload(filePath, logoFile, { upsert: true })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('logos')
                    .getPublicUrl(filePath)

                logo_url = publicUrl
            }

            // Create programacion
            const { data: programacion, error: progError } = await supabase
                .from('programaciones')
                .insert({
                    ...formData,
                    institucion: formData.institucion || null,
                    logo_url: logo_url,
                    curso_nombre: formData.curso_nombre || null,
                    secciones: secciones.length > 0 ? secciones : null,
                    user_id: user.id,
                })
                .select()
                .single()

            if (progError) throw progError

            // Insert selected competencias
            if (selectedCompetencias.length > 0) {
                const detalles = selectedCompetencias.map(comp_id => ({
                    programacion_id: programacion.id,
                    competencia_id: comp_id,
                }))

                const { error: detallesError } = await supabase
                    .from('detalles_programacion')
                    .insert(detalles)

                if (detallesError) throw detallesError
            }

            router.push('/dashboard/programaciones')
            router.refresh()
        } catch (error) {
            console.error('Error creating programacion:', error)
            alert('Error al crear la programación')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Nueva Programación Anual</h1>
                <p className="text-gray-600 mt-2">
                    Completa los datos para crear una nueva programación curricular
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Programación *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ej: Programación Anual de Matemática 2026"
                    />
                </div>

                {/* Curso / Especialidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curso / Especialidad (Opcional)
                    </label>
                    <input
                        type="text"
                        value={formData.curso_nombre}
                        onChange={(e) => setFormData({ ...formData, curso_nombre: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ej: Aritmética, Geometría, Álgebra..."
                    />
                </div>

                {/* Institución — selector desde perfil */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Institución Educativa
                        </label>
                        {profile?.instituciones && profile.instituciones.length > 0 && (
                            <a href="/dashboard/configuracion" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                + Gestionar instituciones
                            </a>
                        )}
                    </div>

                    {profile?.instituciones && profile.instituciones.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Option: none */}
                            <button
                                type="button"
                                onClick={() => { setFormData({ ...formData, institucion: '' }); setDefaultLogoUrl(null) }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition ${formData.institucion === ''
                                    ? 'border-gray-400 bg-gray-50 text-gray-700'
                                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                    }`}
                            >
                                <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">—</span>
                                <span className="text-sm font-medium">Sin institución</span>
                            </button>

                            {profile.instituciones.map(inst => (
                                <button
                                    key={inst.id}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, institucion: inst.nombre })
                                        setDefaultLogoUrl(inst.logo_url)
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition ${formData.institucion === inst.nombre
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {inst.logo_url
                                            ? <img src={inst.logo_url} alt={inst.nombre} className="w-full h-full object-contain p-0.5" />
                                            : <span className="text-lg">🏫</span>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${formData.institucion === inst.nombre ? 'text-indigo-800' : 'text-gray-800'}`}>
                                            {inst.nombre}
                                        </p>
                                        {inst.ugel && <p className="text-xs text-gray-400 truncate">{inst.ugel}</p>}
                                        {inst.es_predeterminada && (
                                            <span className="text-xs text-indigo-500 font-medium">✓ Predeterminada</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={formData.institucion}
                                onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ej: I.E. San Juan Bautista"
                            />
                            <p className="text-xs text-gray-400">
                                💡 Configura tus instituciones en{' '}
                                <a href="/dashboard/configuracion" className="text-indigo-600 hover:underline">Configuración → Mis Instituciones</a>{' '}
                                para seleccionarlas aquí con su logo.
                            </p>
                        </div>
                    )}

                    {/* Logo preview when institution selected */}
                    {defaultLogoUrl && (
                        <div className="mt-3 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <img src={defaultLogoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" />
                            <div className="flex-1">
                                <p className="text-xs font-medium text-green-800">Logo incluido automáticamente</p>
                                <p className="text-xs text-green-600">Aparecerá en el encabezado de tu programación</p>
                            </div>
                            <button type="button" onClick={() => setDefaultLogoUrl(null)} className="text-green-500 hover:text-green-700 text-xs">✕</button>
                        </div>
                    )}
                </div>

                {/* Área */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Área Curricular *
                    </label>
                    <select
                        required
                        value={formData.area_id}
                        onChange={(e) => setFormData({ ...formData, area_id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Selecciona un área</option>
                        {areas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Grado — selector visual por nivel */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Nivel y Grado *
                    </label>

                    {/* Step 1: nivel toggle — 4 opciones distinguiendo Ciclo I y Ciclo II en Inicial */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {([
                            { key: 'Inicial-I', label: 'Cuna (Ciclo I)', icon: '🍼', nivel: 'Inicial', ciclo: 'I', activeColor: 'border-orange-400 bg-orange-50 text-orange-800' },
                            { key: 'Inicial-II', label: 'Inicial (Ciclo II)', icon: '🌸', nivel: 'Inicial', ciclo: 'II', activeColor: 'border-amber-500 bg-amber-50 text-amber-800' },
                            { key: 'Primaria', label: 'Primaria', icon: '🌱', nivel: 'Primaria', ciclo: null, activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                            { key: 'Secundaria', label: 'Secundaria', icon: '📚', nivel: 'Secundaria', ciclo: null, activeColor: 'border-blue-500 bg-blue-50 text-blue-800' },
                        ] as const).map(({ key, label, icon, nivel, ciclo, activeColor }) => {
                            const gradosDelNivel = ciclo
                                ? grados.filter(g => g.nivel === nivel && g.ciclo === ciclo)
                                : grados.filter(g => g.nivel === nivel)
                            const isActive = selectedNivel === key
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        const currentGrado = grados.find(g => g.id === formData.grado_id)
                                        const matches = ciclo
                                            ? currentGrado?.nivel === nivel && currentGrado?.ciclo === ciclo
                                            : currentGrado?.nivel === nivel
                                        if (!matches) setFormData({ ...formData, grado_id: '' })
                                        setSelectedNivel(key)
                                    }}
                                    className={`flex-1 min-w-[120px] py-2.5 rounded-xl border-2 font-medium text-sm transition ${isActive ? activeColor : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {icon} {label}
                                    <span className="ml-1.5 text-xs opacity-60">({gradosDelNivel.length} grados)</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Step 2: grade buttons grid */}
                    {selectedNivel && (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {grados
                                .filter(g => {
                                    if (selectedNivel === 'Inicial-I') return g.nivel === 'Inicial' && g.ciclo === 'I'
                                    if (selectedNivel === 'Inicial-II') return g.nivel === 'Inicial' && g.ciclo === 'II'
                                    return g.nivel === selectedNivel
                                })
                                .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }))
                                .map(grado => {
                                    const activeColors: Record<string, string> = {
                                        'Inicial-I': 'border-orange-400 bg-orange-400 text-white shadow-sm',
                                        'Inicial-II': 'border-amber-500 bg-amber-500 text-white shadow-sm',
                                        Primaria: 'border-emerald-500 bg-emerald-500 text-white shadow-sm',
                                        Secundaria: 'border-blue-500 bg-blue-500 text-white shadow-sm',
                                    }
                                    return (
                                        <button
                                            key={grado.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, grado_id: grado.id })}
                                            className={`py-2.5 rounded-xl border-2 font-semibold text-sm transition ${formData.grado_id === grado.id
                                                ? activeColors[selectedNivel]
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {/* For Inicial: show full name ("3 años" / "Cuna grande"), for others: show just ordinal */}
                                            {(selectedNivel === 'Inicial-I' || selectedNivel === 'Inicial-II')
                                                ? grado.nombre
                                                : grado.nombre.replace(/\s*(Primaria|Secundaria).*/i, '').trim()
                                            }
                                        </button>
                                    )
                                })
                            }
                        </div>
                    )}


                    {/* Hidden required input for form validation */}
                    <input type="hidden" required value={formData.grado_id} onChange={() => { }} />
                    {!formData.grado_id && (
                        <p className="text-xs text-gray-400 mt-2">Selecciona el nivel y luego el grado correspondiente</p>
                    )}
                </div>


                {/* Secciones */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secciones del aula
                        <span className="ml-2 text-xs text-gray-400 font-normal">(Opcional — ej. A, B, C)</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={seccionInput}
                            onChange={e => setSeccionInput(e.target.value.toUpperCase())}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSeccion() } }}
                            maxLength={5}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm uppercase"
                            placeholder="A"
                        />
                        <button
                            type="button"
                            onClick={addSeccion}
                            className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                        >
                            + Agregar
                        </button>
                    </div>
                    {secciones.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {secciones.map(s => (
                                <span
                                    key={s}
                                    className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold"
                                >
                                    Sección {s}
                                    <button
                                        type="button"
                                        onClick={() => removeSeccion(s)}
                                        className="text-indigo-500 hover:text-indigo-700 leading-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Si el docente enseña a varias secciones del mismo grado, agrégalas aquí para poder asignar fechas distintas a cada una en las sesiones.
                    </p>
                </div>

                {/* Año Escolar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año Escolar *
                    </label>
                    <input
                        type="number"
                        required
                        min="2020"
                        max="2030"
                        value={formData.anio_escolar}
                        onChange={(e) => setFormData({ ...formData, anio_escolar: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Periodo Tipo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Periodo *
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="Bimestral"
                                checked={formData.periodo_tipo === 'Bimestral'}
                                onChange={(e) => setFormData({ ...formData, periodo_tipo: e.target.value as 'Bimestral' })}
                                className="mr-2"
                            />
                            Bimestral
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="Trimestral"
                                checked={formData.periodo_tipo === 'Trimestral'}
                                onChange={(e) => setFormData({ ...formData, periodo_tipo: e.target.value as 'Trimestral' })}
                                className="mr-2"
                            />
                            Trimestral
                        </label>
                    </div>
                </div>

                {/* Competencias */}
                {formData.area_id && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Competencias a Trabajar *
                        </label>

                        {!formData.grado_id ? (
                            /* No grado selected yet */
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                                <span className="text-amber-500 text-lg">⚠️</span>
                                <p className="text-sm text-amber-700">
                                    Selecciona el <strong>nivel y grado</strong> primero para ver las competencias disponibles para ese curso.
                                </p>
                            </div>
                        ) : competencias.length === 0 ? (
                            /* Grado selected but no competencias exist for this area+grado combo */
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <span className="text-gray-400 text-lg">ℹ️</span>
                                <p className="text-sm text-gray-500">
                                    No hay competencias registradas para esta combinación de área y grado.
                                </p>
                            </div>
                        ) : (
                            /* Show the filtered competencias list */
                            <>
                                <p className="text-sm text-gray-600 mb-3">
                                    Selecciona las competencias que trabajarás durante el año
                                </p>
                                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                    {competencias.map((comp) => (
                                        <label
                                            key={comp.id}
                                            className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCompetencias.includes(comp.id)}
                                                onChange={() => toggleCompetencia(comp.id)}
                                                className="mt-1 mr-3"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{comp.codigo}</div>
                                                <div className="text-sm text-gray-600">{comp.nombre}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {selectedCompetencias.length} competencia(s) seleccionada(s)
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || selectedCompetencias.length === 0}
                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creando...' : 'Crear Programación'}
                    </button>
                </div>
            </form>
        </div>
    )
}
