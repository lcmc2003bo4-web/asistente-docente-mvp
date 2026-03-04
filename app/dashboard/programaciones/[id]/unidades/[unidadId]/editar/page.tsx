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

export default function EditarUnidadPage({
    params,
}: {
    params: Promise<{ id: string; unidadId: string }>
}) {
    const resolvedParams = use(params)
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [programacionId, setProgramacionId] = useState('')
    const [gradoId, setGradoId] = useState('')
    const [programacionTitulo, setProgramacionTitulo] = useState('')

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
            // Get unidad data
            const { data: unidad } = await supabase
                .from('unidades')
                .select(`
          *,
          detalles_unidad (desempeno_id)
        `)
                .eq('id', resolvedParams.unidadId)
                .single()

            if (!unidad) {
                router.push('/dashboard/programaciones')
                return
            }

            // Set form fields
            setOrden(unidad.orden)
            setTitulo(unidad.titulo)
            setDuracionSemanas(unidad.duracion_semanas)
            setSituacionSignificativa(unidad.situacion_significativa || '')
            setSelectedDesempenos(unidad.detalles_unidad?.map((d: any) => d.desempeno_id) || [])

            // Get programacion details
            const { data: prog } = await supabase
                .from('programaciones')
                .select('id, titulo, grado_id')
                .eq('id', resolvedParams.id)
                .single()

            if (!prog) {
                router.push('/dashboard/programaciones')
                return
            }

            setProgramacionId(prog.id)
            setGradoId(prog.grado_id)
            setProgramacionTitulo(prog.titulo)

            // Get competencias from programacion
            const { data: comps } = await supabase
                .from('detalles_programacion')
                .select('competencias(id, codigo, nombre)')
                .eq('programacion_id', prog.id)

            const competenciasList = comps?.map((c: any) => c.competencias).filter(Boolean) || []
            setCompetencias(competenciasList)

            // Get desempenos for these competencias and grado
            const competenciaIds = competenciasList.map((c: Competencia) => c.id)

            // Obtener capacidades (query plana — sin join anidado para evitar bug objeto vs array de PostgREST)
            const { data: capacidadesList } = await supabase
                .from('capacidades')
                .select('id, competencia_id')
                .in('competencia_id', competenciaIds)

            const capToComp: Record<string, string> = {}
            capacidadesList?.forEach((cap) => {
                capToComp[cap.id] = cap.competencia_id
            })
            const capacidadIds = capacidadesList?.map(cap => cap.id) || []

            // Obtener desempeños para esas capacidades en el grado correcto
            const { data: desemps } = await supabase
                .from('desempenos')
                .select('id, descripcion, capacidad_id')
                .eq('grado_id', prog.grado_id)
                .in('capacidad_id', capacidadIds)
                .order('capacidad_id')

            // Enriquecer con competencia_id usando mapa local
            const desempenosEnriquecidos: DesempenoFlat[] = (desemps || []).map((d) => ({
                id: d.id,
                descripcion: d.descripcion,
                capacidad_id: d.capacidad_id,
                competencia_id: capToComp[d.capacidad_id] ?? '',
            }))
            setDesempenos(desempenosEnriquecidos)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedDesempenos.length === 0) {
            alert('Debes seleccionar al menos un desempeño')
            return
        }

        setSubmitting(true)

        try {
            // Update unidad
            const { error: unidadError } = await supabase
                .from('unidades')
                .update({
                    orden,
                    titulo,
                    duracion_semanas: duracionSemanas,
                    situacion_significativa: situacionSignificativa || null,
                })
                .eq('id', resolvedParams.unidadId)

            if (unidadError) throw unidadError

            // Delete existing detalles
            await supabase.from('detalles_unidad').delete().eq('unidad_id', resolvedParams.unidadId)

            // Insert new detalles
            const detalles = selectedDesempenos.map((desempeno_id) => ({
                unidad_id: resolvedParams.unidadId,
                desempeno_id,
            }))

            const { error: detallesError } = await supabase
                .from('detalles_unidad')
                .insert(detalles)

            if (detallesError) throw detallesError

            router.push(`/dashboard/programaciones/${programacionId}/unidades/${resolvedParams.unidadId}`)
            router.refresh()
        } catch (error) {
            console.error('Error updating unidad:', error)
            alert('Error al actualizar la unidad')
            setSubmitting(false)
        }
    }

    const toggleDesempeno = (id: string) => {
        setSelectedDesempenos((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        )
    }

    const groupedDesempenos = competencias.map((comp) => ({
        competencia: comp,
        desempenos: desempenos.filter((d) => d.competencia_id === comp.id),
    }))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Cargando formulario...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl">
            <Link
                href={`/dashboard/programaciones/${programacionId}/unidades/${resolvedParams.unidadId}`}
                className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block"
            >
                ← Volver a Detalle
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Unidad Didáctica</h1>
            <p className="text-gray-600 mb-8">{programacionTitulo}</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
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
                            placeholder="Ej: Unidad 1: Números hasta 100"
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

                {/* Desempeños Selector */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Seleccionar Desempeños *
                        </h2>
                        <span className="text-sm text-gray-600">
                            {selectedDesempenos.length} seleccionados
                        </span>
                    </div>

                    {/* Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Filtrar por Competencia
                        </label>
                        <select
                            value={filterCompetencia}
                            onChange={(e) => setFilterCompetencia(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">Todas las competencias</option>
                            {competencias.map((comp) => (
                                <option key={comp.id} value={comp.id}>
                                    {comp.codigo} - {comp.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grouped Desempeños */}
                    <div className="space-y-6">
                        {groupedDesempenos
                            .filter((group) => !filterCompetencia || group.competencia.id === filterCompetencia)
                            .map((group) => (
                                <div key={group.competencia.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        {group.competencia.codigo} - {group.competencia.nombre}
                                    </h3>
                                    <div className="space-y-2">
                                        {group.desempenos.map((desempeno) => (
                                            <label
                                                key={desempeno.id}
                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDesempenos.includes(desempeno.id)}
                                                    onChange={() => toggleDesempeno(desempeno.id)}
                                                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">{desempeno.descripcion}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting || selectedDesempenos.length === 0}
                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <Link
                        href={`/dashboard/programaciones/${programacionId}/unidades/${resolvedParams.unidadId}`}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}
