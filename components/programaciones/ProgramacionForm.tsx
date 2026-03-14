'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Area = Database['public']['Tables']['areas']['Row']
type Grado = Database['public']['Tables']['grados']['Row']
type Competencia = Database['public']['Tables']['competencias']['Row']

interface ProgramacionFormData {
    titulo: string
    curso_nombre?: string
    area_id: string
    grado_id: string
    anio_escolar: number
    periodo_tipo: 'bimestral' | 'trimestral'
    descripcion?: string
    competencias_ids: string[]
}

interface ProgramacionFormProps {
    initialData?: Partial<ProgramacionFormData>
    onSubmit: (data: ProgramacionFormData) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export default function ProgramacionForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}: ProgramacionFormProps) {
    const supabase = createClient()

    const [formData, setFormData] = useState<ProgramacionFormData>({
        titulo: initialData?.titulo || '',
        curso_nombre: initialData?.curso_nombre || '',
        area_id: initialData?.area_id || '',
        grado_id: initialData?.grado_id || '',
        anio_escolar: initialData?.anio_escolar || new Date().getFullYear(),
        periodo_tipo: initialData?.periodo_tipo || 'bimestral',
        descripcion: initialData?.descripcion || '',
        competencias_ids: initialData?.competencias_ids || []
    })

    const [areas, setAreas] = useState<Area[]>([])
    const [grados, setGrados] = useState<Grado[]>([])
    const [competencias, setCompetencias] = useState<Competencia[]>([])
    const [loadingData, setLoadingData] = useState(true)

    // Cargar áreas y grados
    useEffect(() => {
        async function loadData() {
            const [areasRes, gradosRes] = await Promise.all([
                supabase.from('areas').select('*').order('nombre'),
                supabase.from('grados').select('*').order('nivel, nombre')
            ])

            if (areasRes.data) setAreas(areasRes.data)
            if (gradosRes.data) setGrados(gradosRes.data)
            setLoadingData(false)
        }
        loadData()
    }, [])

    // Cargar competencias cuando cambia el área o grado
    useEffect(() => {
        async function loadCompetencias() {
            if (!formData.area_id) {
                setCompetencias([])
                return
            }

            let query = supabase
                .from('competencias')
                .select(`
                    id, 
                    nombre, 
                    descripcion, 
                    area_id, 
                    orden,
                    capacidades!inner(
                        id,
                        desempenos!inner(id)
                    )
                `)
                .eq('area_id', formData.area_id)
                .order('orden')

            if (formData.grado_id) {
                query = query.eq('capacidades.desempenos.grado_id', formData.grado_id)
            }

            const { data, error } = await query

            if (error) {
                console.error("Error al cargar competencias:", error)
                return
            }

            if (data) {
                const uniqueCompetencias = Array.from(new Map(data.map(c => [c.id, c])).values())
                setCompetencias(uniqueCompetencias.map(c => ({
                    id: c.id,
                    nombre: c.nombre,
                    descripcion: c.descripcion,
                    area_id: c.area_id,
                    orden: c.orden
                } as unknown as Competencia)))
            }
        }
        loadCompetencias()
    }, [formData.area_id, formData.grado_id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData)
    }

    const toggleCompetencia = (competenciaId: string) => {
        setFormData(prev => ({
            ...prev,
            competencias_ids: prev.competencias_ids.includes(competenciaId)
                ? prev.competencias_ids.filter(id => id !== competenciaId)
                : [...prev.competencias_ids, competenciaId]
        }))
    }

    const selectAllCompetencias = () => {
        setFormData(prev => ({
            ...prev,
            competencias_ids: competencias.map(c => c.id)
        }))
    }

    const deselectAllCompetencias = () => {
        setFormData(prev => ({
            ...prev,
            competencias_ids: []
        }))
    }

    if (loadingData) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título de la Programación *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ej: Programación Anual de Matemática 2026"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Curso / Especialidad (Opcional)
                        </label>
                        <input
                            type="text"
                            value={formData.curso_nombre || ''}
                            onChange={(e) => setFormData({ ...formData, curso_nombre: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ej: Aritmética, Álgebra, Geometría..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Área Curricular *
                        </label>
                        <select
                            required
                            value={formData.area_id}
                            onChange={(e) => setFormData({ ...formData, area_id: e.target.value, competencias_ids: [] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">Seleccione un área</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>{area.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grado *
                        </label>
                        <select
                            required
                            value={formData.grado_id}
                            onChange={(e) => setFormData({ ...formData, grado_id: e.target.value, competencias_ids: [] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">Seleccione un grado</option>
                            {grados.map(grado => (
                                <option key={grado.id} value={grado.id}>
                                    {grado.nivel} - {grado.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Año Escolar *
                        </label>
                        <input
                            type="number"
                            required
                            min="2020"
                            max="2030"
                            value={formData.anio_escolar}
                            onChange={(e) => setFormData({ ...formData, anio_escolar: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Periodo *
                        </label>
                        <select
                            required
                            value={formData.periodo_tipo}
                            onChange={(e) => setFormData({ ...formData, periodo_tipo: e.target.value as 'bimestral' | 'trimestral' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="bimestral">Bimestral (4 periodos)</option>
                            <option value="trimestral">Trimestral (3 periodos)</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción (Opcional)
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Descripción general de la programación..."
                        />
                    </div>
                </div>
            </div>

            {/* Selección de Competencias */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Competencias del Área *
                    </h3>
                    {competencias.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={selectAllCompetencias}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Seleccionar todas
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                                type="button"
                                onClick={deselectAllCompetencias}
                                className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                            >
                                Deseleccionar todas
                            </button>
                        </div>
                    )}
                </div>

                {!formData.area_id ? (
                    <p className="text-sm text-gray-500 italic">
                        Seleccione un área curricular para ver las competencias disponibles
                    </p>
                ) : competencias.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                        No hay competencias disponibles para esta área
                    </p>
                ) : (
                    <div className="space-y-2">
                        {competencias.map(competencia => (
                            <label
                                key={competencia.id}
                                className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.competencias_ids.includes(competencia.id)}
                                    onChange={() => toggleCompetencia(competencia.id)}
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm text-gray-700">{competencia.nombre}</span>
                            </label>
                        ))}
                    </div>
                )}

                {formData.competencias_ids.length > 0 && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-indigo-700">
                            <span className="font-semibold">{formData.competencias_ids.length}</span> de{' '}
                            <span className="font-semibold">{competencias.length}</span> competencias seleccionadas
                        </p>
                    </div>
                )}
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading || formData.competencias_ids.length === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Programación'}
                </button>
            </div>
        </form>
    )
}
