'use client'

import { useState } from 'react'
import type { SecuenciaData } from '@/lib/services/SesionService'

interface MomentoCardProps {
    momento: 'Inicio' | 'Desarrollo' | 'Cierre'
    secuencias: SecuenciaData[]
    onAdd: (secuencia: Omit<SecuenciaData, 'orden'>) => void
    onEdit: (index: number, secuencia: SecuenciaData) => void
    onDelete: (index: number) => void
    duracionTotal: number
}

const MOMENTO_CONFIG = {
    Inicio: {
        color: 'blue',
        icon: '🚀',
        description: 'Motivación, saberes previos, propósito'
    },
    Desarrollo: {
        color: 'green',
        icon: '📚',
        description: 'Construcción del aprendizaje, actividades principales'
    },
    Cierre: {
        color: 'purple',
        icon: '✅',
        description: 'Metacognición, evaluación, transferencia'
    }
}

export default function MomentoCard({
    momento,
    secuencias,
    onAdd,
    onEdit,
    onDelete,
    duracionTotal
}: MomentoCardProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        actividad: '',
        tiempo_minutos: 10,
        recursos: ''
    })

    const config = MOMENTO_CONFIG[momento]
    const tiempoMomento = secuencias.reduce((sum, s) => sum + s.tiempo_minutos, 0)
    const porcentaje = duracionTotal > 0 ? (tiempoMomento / duracionTotal) * 100 : 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingIndex !== null) {
            onEdit(editingIndex, {
                ...formData,
                momento,
                orden: secuencias[editingIndex].orden
            })
            setEditingIndex(null)
        } else {
            onAdd({
                ...formData,
                momento
            })
        }

        setFormData({ actividad: '', tiempo_minutos: 10, recursos: '' })
        setIsAdding(false)
    }

    const handleEdit = (index: number) => {
        const sec = secuencias[index]
        setFormData({
            actividad: sec.actividad,
            tiempo_minutos: sec.tiempo_minutos,
            recursos: sec.recursos || ''
        })
        setEditingIndex(index)
        setIsAdding(true)
    }

    const handleCancel = () => {
        setFormData({ actividad: '', tiempo_minutos: 10, recursos: '' })
        setEditingIndex(null)
        setIsAdding(false)
    }

    return (
        <div className={`border-2 border-${config.color}-200 rounded-lg p-4 bg-${config.color}-50`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                        <h3 className="font-semibold text-gray-900">{momento}</h3>
                        <p className="text-xs text-gray-600">{config.description}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{tiempoMomento} min</div>
                    <div className="text-xs text-gray-500">{porcentaje.toFixed(0)}%</div>
                </div>
            </div>

            {/* Secuencias List */}
            {secuencias.length > 0 && (
                <div className="space-y-2 mb-3">
                    {secuencias.map((sec, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-3 border border-gray-200"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{sec.actividad}</p>
                                    {sec.recursos && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            📎 {sec.recursos}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 ml-3">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {sec.tiempo_minutos} min
                                    </span>
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="text-indigo-600 hover:text-indigo-700 text-xs"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(index)}
                                        className="text-red-600 hover:text-red-700 text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form */}
            {isAdding ? (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-3 border-2 border-indigo-300">
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Actividad *
                            </label>
                            <textarea
                                required
                                value={formData.actividad}
                                onChange={(e) => setFormData({ ...formData, actividad: e.target.value })}
                                rows={2}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Describe la actividad..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tiempo (min) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.tiempo_minutos}
                                    onChange={(e) => setFormData({ ...formData, tiempo_minutos: parseInt(e.target.value) })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Recursos
                                </label>
                                <input
                                    type="text"
                                    value={formData.recursos}
                                    onChange={(e) => setFormData({ ...formData, recursos: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Ej: PPT, fichas..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                        <button
                            type="submit"
                            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                        >
                            {editingIndex !== null ? 'Actualizar' : 'Agregar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full px-3 py-2 text-sm font-medium text-indigo-600 bg-white border-2 border-dashed border-indigo-300 rounded hover:bg-indigo-50 transition"
                >
                    + Agregar actividad
                </button>
            )}
        </div>
    )
}
