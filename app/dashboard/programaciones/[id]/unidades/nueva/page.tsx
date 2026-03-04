'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'

type Competencia = {
    id: string
    codigo: string
    nombre: string
}

type DesempenoFlat = {
    id: string
    descripcion: string
    capacidad_id: string
    competencia_id: string
}

export default function NuevaUnidadPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = use(params)
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [programacionId, setProgramacionId] = useState('')
    const [programacionTitulo, setProgramacionTitulo] = useState('')
    const [maxOrden, setMaxOrden] = useState(0)

    const [competencias, setCompetencias] = useState<Competencia[]>([])
    const [desempenos, setDesempenos] = useState<DesempenoFlat[]>([])
    const [selectedDesempenos, setSelectedDesempenos] = useState<string[]>([])
    const [filterCompetencia, setFilterCompetencia] = useState<string>('')

    // Form fields
    const [orden, setOrden] = useState(1)
    const [titulo, setTitulo] = useState('')
    const [duracionSemanas, setDuracionSemanas] = useState(4)
    const [situacionSignificativa, setSituacionSignificativa] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            // 1. Obtener datos de la programación
            const { data: prog, error: progError } = await supabase
                .from('programaciones')
                .select('id, titulo, grado_id')
                .eq('id', resolvedParams.id)
                .single()

            if (progError || !prog) {
                router.push('/dashboard/programaciones')
                return
            }

            setProgramacionId(prog.id)
            setProgramacionTitulo(prog.titulo)

            // 2. Max orden de unidades existentes
            const { data: unidades } = await supabase
                .from('unidades')
                .select('orden')
                .eq('programacion_id', prog.id)
                .order('orden', { ascending: false })
                .limit(1)

            const nextOrden = unidades && unidades.length > 0 ? unidades[0].orden + 1 : 1
            setMaxOrden(nextOrden - 1)
            setOrden(nextOrden)

            // 3. Obtener competencias de la programación
            const { data: comps } = await supabase
                .from('detalles_programacion')
                .select('competencias(id, codigo, nombre)')
                .eq('programacion_id', prog.id)

            const competenciasList: Competencia[] = (comps || [])
                .map((c: any) => c.competencias)
                .filter(Boolean)
            setCompetencias(competenciasList)

            if (competenciasList.length === 0) {
                setLoading(false)
                return
            }

            const competenciaIds = competenciasList.map((c) => c.id)

            // 4. Obtener capacidades (query plana — sin join anidado para evitar el bug objeto vs array de PostgREST)
            const { data: capacidadesList } = await supabase
                .from('capacidades')
                .select('id, competencia_id')
                .in('competencia_id', competenciaIds)

            if (!capacidadesList || capacidadesList.length === 0) {
                setLoading(false)
                return
            }

            // Mapa local: capacidad_id → competencia_id
            const capToComp: Record<string, string> = {}
            capacidadesList.forEach((cap) => {
                capToComp[cap.id] = cap.competencia_id
            })
            const capacidadIds = capacidadesList.map((c) => c.id)

            // 5. Obtener desempeños para esas capacidades en el grado correcto
            const { data: desemps, error: desempsError } = await supabase
                .from('desempenos')
                .select('id, descripcion, capacidad_id')
                .eq('grado_id', prog.grado_id)
                .in('capacidad_id', capacidadIds)
                .order('capacidad_id')

            if (desempsError) throw desempsError

            // Enriquecer con competencia_id usando el mapa local
            const desempenosEnriquecidos: DesempenoFlat[] = (desemps || []).map((d) => ({
                id: d.id,
                descripcion: d.descripcion,
                capacidad_id: d.capacidad_id,
                competencia_id: capToComp[d.capacidad_id] ?? '',
            }))

            setDesempenos(desempenosEnriquecidos)
        } catch (err) {
            console.error('Error loading data:', err)
            setError('Error al cargar el formulario. Por favor recarga la página.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (selectedDesempenos.length === 0) {
            setError('Debes seleccionar al menos un desempeño')
            return
        }

        setSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            // Insertar unidad
            const { data: unidad, error: unidadError } = await supabase
                .from('unidades')
                .insert({
                    user_id: user!.id,
                    programacion_id: programacionId,
                    orden,
                    titulo,
                    duracion_semanas: duracionSemanas,
                    situacion_significativa: situacionSignificativa || null,
                    estado: 'Borrador',
                })
                .select()
                .single()

            if (unidadError) throw unidadError

            // Insertar detalles_unidad
            const detalles = selectedDesempenos.map((desempeno_id) => ({
                unidad_id: unidad.id,
                desempeno_id,
            }))

            const { error: detallesError } = await supabase
                .from('detalles_unidad')
                .insert(detalles)

            if (detallesError) throw detallesError

            router.push(`/dashboard/programaciones/${programacionId}/unidades`)
            router.refresh()
        } catch (err: any) {
            console.error('Error creating unidad:', err)
            setError(err.message || 'Error al crear la unidad. Intenta nuevamente.')
            setSubmitting(false)
        }
    }

    const toggleDesempeno = (id: string) => {
        setSelectedDesempenos((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        )
    }

    // Agrupar por competencia usando competencia_id resuelto localmente
    const groupedDesempenos = competencias.map((comp) => ({
        competencia: comp,
        desempenos: desempenos.filter((d) => d.competencia_id === comp.id),
    }))

    const filteredGroups = filterCompetencia
        ? groupedDesempenos.filter((g) => g.competencia.id === filterCompetencia)
        : groupedDesempenos

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando formulario...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl">
            <Link
                href={`/dashboard/programaciones/${programacionId}/unidades`}
                className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block"
            >
                ← Volver a Unidades
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Unidad Didáctica</h1>
            <p className="text-gray-600 mb-8">{programacionTitulo}</p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Básica */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Número de Unidad *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={orden}
                                onChange={(e) => setOrden(parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Sugerido: {maxOrden + 1}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duración (semanas) *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={duracionSemanas}
                                onChange={(e) => setDuracionSemanas(parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Título de la Unidad *
                        </label>
                        <input
                            type="text"
                            required
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej: Números y Operaciones Básicas"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Situación Significativa
                        </label>
                        <textarea
                            value={situacionSignificativa}
                            onChange={(e) => setSituacionSignificativa(e.target.value)}
                            rows={4}
                            placeholder="Describe el contexto y la problemática que abordará esta unidad..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Selector de Desempeños */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Seleccionar Desempeños *
                        </h2>
                        <span className="text-sm text-gray-600">
                            {selectedDesempenos.length} seleccionados
                        </span>
                    </div>

                    {desempenos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="font-medium">No se encontraron desempeños</p>
                            <p className="text-sm mt-1">
                                Verifica que la programación tenga competencias asignadas y que haya desempeños para este grado.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Filtro por competencia (solo si hay más de una) */}
                            {competencias.length > 1 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Filtrar por Competencia
                                    </label>
                                    <select
                                        value={filterCompetencia}
                                        onChange={(e) => setFilterCompetencia(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Todas las competencias ({desempenos.length} desempeños)</option>
                                        {competencias.map((comp) => (
                                            <option key={comp.id} value={comp.id}>
                                                {comp.codigo} - {comp.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Botones de selección masiva */}
                            <div className="flex gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedDesempenos(
                                            filteredGroups.flatMap((g) => g.desempenos.map((d) => d.id))
                                        )
                                    }
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    ✓ Seleccionar todos
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDesempenos([])}
                                    className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    ✗ Deseleccionar todos
                                </button>
                            </div>

                            {/* Desempeños agrupados por competencia */}
                            <div className="space-y-6">
                                {filteredGroups.map((group) => (
                                    <div
                                        key={group.competencia.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            {group.competencia.codigo} — {group.competencia.nombre}
                                            <span className="ml-2 text-sm font-normal text-gray-500">
                                                ({group.desempenos.length} desempeños)
                                            </span>
                                        </h3>

                                        {group.desempenos.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic">
                                                Sin desempeños para este grado
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {group.desempenos.map((desempeno) => (
                                                    <label
                                                        key={desempeno.id}
                                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 cursor-pointer transition"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDesempenos.includes(desempeno.id)}
                                                            onChange={() => toggleDesempeno(desempeno.id)}
                                                            className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {desempeno.descripcion}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting || selectedDesempenos.length === 0}
                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting
                            ? 'Creando...'
                            : `Crear Unidad${selectedDesempenos.length > 0 ? ` (${selectedDesempenos.length} desempeños)` : ''}`}
                    </button>
                    <Link
                        href={`/dashboard/programaciones/${programacionId}/unidades`}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}
