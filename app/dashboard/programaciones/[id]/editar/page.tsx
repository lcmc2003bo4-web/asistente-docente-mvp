'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Area = {
    id: string
    nombre: string
}

type Grado = {
    id: string
    nombre: string
    nivel: string
}

type Competencia = {
    id: string
    codigo: string
    nombre: string
}

export default function EditarProgramacionPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [areas, setAreas] = useState<Area[]>([])
    const [grados, setGrados] = useState<Grado[]>([])
    const [competencias, setCompetencias] = useState<Competencia[]>([])
    const [selectedCompetencias, setSelectedCompetencias] = useState<string[]>([])
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        titulo: '',
        curso_nombre: '',
        institucion: '',
        area_id: '',
        grado_id: '',
        anio_escolar: new Date().getFullYear(),
        periodo_tipo: 'Trimestral' as 'Bimestral' | 'Trimestral',
    })

    useEffect(() => {
        loadInitialData()
    }, [id])

    useEffect(() => {
        if (formData.area_id) {
            loadCompetencias(formData.area_id)
        } else {
            setCompetencias([])
        }
    }, [formData.area_id])

    const loadInitialData = async () => {
        try {
            setLoading(true)

            // basic metadata
            const [areasRes, gradosRes] = await Promise.all([
                supabase.from('areas').select('id, nombre').order('nombre'),
                supabase.from('grados').select('id, nombre, nivel').order('nombre')
            ])

            if (areasRes.data) setAreas(areasRes.data)
            if (gradosRes.data) setGrados(gradosRes.data)

            // programacion data
            const { data: programacion, error } = await supabase
                .from('programaciones')
                .select(`
                    *,
                    detalles_programacion (competencia_id)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            if (programacion) {
                setFormData({
                    titulo: programacion.titulo || '',
                    curso_nombre: programacion.curso_nombre || '',
                    institucion: programacion.institucion || '',
                    area_id: programacion.area_id || '',
                    grado_id: programacion.grado_id || '',
                    anio_escolar: programacion.anio_escolar || new Date().getFullYear(),
                    periodo_tipo: programacion.periodo_tipo || 'Trimestral',
                })
                setCurrentLogoUrl(programacion.logo_url)
                if (programacion.detalles_programacion) {
                    setSelectedCompetencias(programacion.detalles_programacion.map((d: any) => d.competencia_id))
                }
            }
        } catch (err) {
            console.error('Error loading initial data:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadCompetencias = async (areaId: string) => {
        const { data } = await supabase
            .from('competencias')
            .select('id, codigo, nombre')
            .eq('area_id', areaId)
            .order('codigo')
        if (data) {
            setCompetencias(data)
        }
    }

    const toggleCompetencia = (id: string) => {
        setSelectedCompetencias(prev =>
            prev.includes(id)
                ? prev.filter(cid => cid !== id)
                : [...prev, id]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            let logo_url = currentLogoUrl
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

            // Update programacion
            const { error: progError } = await supabase
                .from('programaciones')
                .update({
                    ...formData,
                    institucion: formData.institucion || null,
                    logo_url: logo_url,
                    curso_nombre: formData.curso_nombre || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (progError) throw progError

            // Update competencias (Delete and Re-insert)
            await supabase
                .from('detalles_programacion')
                .delete()
                .eq('programacion_id', id)

            if (selectedCompetencias.length > 0) {
                const detalles = selectedCompetencias.map(comp_id => ({
                    programacion_id: id,
                    competencia_id: comp_id,
                }))

                const { error: detallesError } = await supabase
                    .from('detalles_programacion')
                    .insert(detalles)

                if (detallesError) throw detallesError
            }

            router.push(`/dashboard/programaciones/${id}`)
            router.refresh()
        } catch (error) {
            console.error('Error updating programacion:', error)
            alert('Error al actualizar la programación')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <Link
                    href={`/dashboard/programaciones/${id}`}
                    className="text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
                >
                    ← Volver al Detalle
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">Editar Programación Anual</h1>
                <p className="text-gray-600 mt-2">
                    Modifica los datos de tu programación curricular
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

                {/* Institución */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institución Educativa (Opcional)
                    </label>
                    <input
                        type="text"
                        value={formData.institucion}
                        onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ej: I.E. San Juan Bautista"
                    />
                </div>

                {/* Logo de Institución */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo de la Institución (Opcional)
                    </label>
                    {currentLogoUrl && !logoFile && (
                        <div className="mb-3 flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <img src={currentLogoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                            <span className="text-sm text-gray-500">Logo actual preservado</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sube una nueva imagen si deseas cambiar el logo actual.</p>
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

                {/* Grado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grado *
                    </label>
                    <select
                        required
                        value={formData.grado_id}
                        onChange={(e) => setFormData({ ...formData, grado_id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Selecciona un grado</option>
                        {grados.map((grado) => (
                            <option key={grado.id} value={grado.id}>
                                {grado.nombre} ({grado.nivel})
                            </option>
                        ))}
                    </select>
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
                {formData.area_id && competencias.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Competencias a Trabajar *
                        </label>
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
                        disabled={submitting || selectedCompetencias.length === 0}
                        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Actualizando...' : 'Actualizar Programación'}
                    </button>
                </div>
            </form>
        </div>
    )
}
