'use client'

import { useState, useEffect } from 'react'
import MomentoCard from './MomentoCard'
import type { SecuenciaData } from '@/lib/services/SesionService'

interface SecuenciaBuilderProps {
    duracionTotal: number
    onChange: (secuencias: SecuenciaData[]) => void
    initialSecuencias?: SecuenciaData[]
}

export default function SecuenciaBuilder({
    duracionTotal,
    onChange,
    initialSecuencias = []
}: SecuenciaBuilderProps) {
    const [secuencias, setSecuencias] = useState<SecuenciaData[]>(initialSecuencias)

    // Sincronizar cuando la IA genera secuencias externamente
    useEffect(() => {
        if (initialSecuencias.length > 0) {
            setSecuencias(initialSecuencias)
        }
    }, [JSON.stringify(initialSecuencias)])

    useEffect(() => {
        onChange(secuencias)
    }, [secuencias])

    const secuenciasInicio = secuencias.filter(s => s.momento === 'Inicio')
    const secuenciasDesarrollo = secuencias.filter(s => s.momento === 'Desarrollo')
    const secuenciasCierre = secuencias.filter(s => s.momento === 'Cierre')

    const tiempoTotal = secuencias.reduce((sum, s) => sum + s.tiempo_minutos, 0)
    const diferencia = tiempoTotal - duracionTotal

    const handleAdd = (momento: 'Inicio' | 'Desarrollo' | 'Cierre') => (
        secuencia: Omit<SecuenciaData, 'orden'>
    ) => {
        const newSecuencia: SecuenciaData = {
            ...secuencia,
            momento,
            orden: secuencias.length + 1
        }
        setSecuencias([...secuencias, newSecuencia])
    }

    const handleEdit = (momento: 'Inicio' | 'Desarrollo' | 'Cierre') => (
        index: number,
        updatedSecuencia: SecuenciaData
    ) => {
        const momentoSecuencias = secuencias.filter(s => s.momento === momento)
        const globalIndex = secuencias.findIndex(s => s === momentoSecuencias[index])

        const newSecuencias = [...secuencias]
        newSecuencias[globalIndex] = updatedSecuencia
        setSecuencias(newSecuencias)
    }

    const handleDelete = (momento: 'Inicio' | 'Desarrollo' | 'Cierre') => (index: number) => {
        const momentoSecuencias = secuencias.filter(s => s.momento === momento)
        const globalIndex = secuencias.findIndex(s => s === momentoSecuencias[index])

        const newSecuencias = secuencias.filter((_, i) => i !== globalIndex)
        // Reordenar
        const reordered = newSecuencias.map((s, i) => ({ ...s, orden: i + 1 }))
        setSecuencias(reordered)
    }

    const hasInicio = secuenciasInicio.length > 0
    const hasDesarrollo = secuenciasDesarrollo.length > 0
    const hasCierre = secuenciasCierre.length > 0
    const isComplete = hasInicio && hasDesarrollo && hasCierre

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Secuencia Didáctica
                    </h3>
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${diferencia === 0 ? 'text-green-600' :
                            diferencia > 0 ? 'text-red-600' :
                                'text-yellow-600'
                            }`}>
                            {tiempoTotal} / {duracionTotal} min
                        </div>
                        {diferencia !== 0 && (
                            <div className="text-xs text-gray-600">
                                {diferencia > 0 ? `+${diferencia}` : diferencia} min
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress indicators */}
                <div className="flex items-center gap-2 text-sm">
                    <div className={`flex items-center gap-1 ${hasInicio ? 'text-green-600' : 'text-gray-400'}`}>
                        {hasInicio ? '✓' : '○'} Inicio
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className={`flex items-center gap-1 ${hasDesarrollo ? 'text-green-600' : 'text-gray-400'}`}>
                        {hasDesarrollo ? '✓' : '○'} Desarrollo
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className={`flex items-center gap-1 ${hasCierre ? 'text-green-600' : 'text-gray-400'}`}>
                        {hasCierre ? '✓' : '○'} Cierre
                    </div>
                </div>

                {/* Warnings */}
                {!isComplete && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                        ⚠️ Debes incluir al menos una actividad en cada momento (Inicio, Desarrollo, Cierre)
                    </div>
                )}

                {diferencia !== 0 && (
                    <div className={`mt-2 p-2 rounded text-xs ${diferencia > 0
                        ? 'bg-red-50 border border-red-200 text-red-700'
                        : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                        }`}>
                        {diferencia > 0
                            ? `⚠️ El tiempo total excede la duración de la sesión en ${diferencia} minutos`
                            : `⚠️ Faltan ${Math.abs(diferencia)} minutos para completar la duración de la sesión`
                        }
                    </div>
                )}
            </div>

            {/* Momentos Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MomentoCard
                    momento="Inicio"
                    secuencias={secuenciasInicio}
                    onAdd={handleAdd('Inicio')}
                    onEdit={handleEdit('Inicio')}
                    onDelete={handleDelete('Inicio')}
                    duracionTotal={duracionTotal}
                />

                <MomentoCard
                    momento="Desarrollo"
                    secuencias={secuenciasDesarrollo}
                    onAdd={handleAdd('Desarrollo')}
                    onEdit={handleEdit('Desarrollo')}
                    onDelete={handleDelete('Desarrollo')}
                    duracionTotal={duracionTotal}
                />

                <MomentoCard
                    momento="Cierre"
                    secuencias={secuenciasCierre}
                    onAdd={handleAdd('Cierre')}
                    onEdit={handleEdit('Cierre')}
                    onDelete={handleDelete('Cierre')}
                    duracionTotal={duracionTotal}
                />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div className="text-gray-600">Inicio</div>
                        <div className="text-lg font-semibold text-blue-600">
                            {secuenciasInicio.reduce((sum, s) => sum + s.tiempo_minutos, 0)} min
                        </div>
                        <div className="text-xs text-gray-500">
                            {secuenciasInicio.length} actividad(es)
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600">Desarrollo</div>
                        <div className="text-lg font-semibold text-green-600">
                            {secuenciasDesarrollo.reduce((sum, s) => sum + s.tiempo_minutos, 0)} min
                        </div>
                        <div className="text-xs text-gray-500">
                            {secuenciasDesarrollo.length} actividad(es)
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600">Cierre</div>
                        <div className="text-lg font-semibold text-purple-600">
                            {secuenciasCierre.reduce((sum, s) => sum + s.tiempo_minutos, 0)} min
                        </div>
                        <div className="text-xs text-gray-500">
                            {secuenciasCierre.length} actividad(es)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
