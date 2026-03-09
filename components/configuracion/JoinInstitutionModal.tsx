'use client'

import { useState, useEffect, useCallback } from 'react'
import { institucionService } from '@/lib/services/InstitucionService'
import type { InstitucionGlobal } from '@/lib/services/InstitucionService'

interface Props {
    userId: string
    alreadyJoinedIds: string[]
    onJoined: () => void
    onClose: () => void
}

export function JoinInstitutionModal({ userId, alreadyJoinedIds, onJoined, onClose }: Props) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<InstitucionGlobal[]>([])
    const [searching, setSearching] = useState(false)
    const [joining, setJoining] = useState<string | null>(null)
    const [joined, setJoined] = useState<string[]>([])
    const [esDefault, setEsDefault] = useState(false)

    const search = useCallback(async (q: string) => {
        if (!q.trim()) { setResults([]); return }
        setSearching(true)
        try {
            const data = await institucionService.searchGlobal(q)
            setResults(data)
        } catch (e) {
            console.error(e)
        } finally {
            setSearching(false)
        }
    }, [])

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => search(query), 350)
        return () => clearTimeout(timer)
    }, [query, search])

    const handleJoin = async (inst: InstitucionGlobal) => {
        setJoining(inst.id)
        try {
            await institucionService.joinGlobal(userId, inst.id, esDefault)
            setJoined(prev => [...prev, inst.id])
            onJoined()
        } catch (e) {
            console.error(e)
            alert('Error al unirse a la institución')
        } finally {
            setJoining(null)
        }
    }

    const isJoined = (id: string) => joined.includes(id) || alreadyJoinedIds.includes(id)

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Buscar institución</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Encuentra y únete a un colegio ya configurado en la plataforma</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition mt-0.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search input */}
                    <div className="relative mt-4">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            autoFocus
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Nombre del colegio, código modular o UGEL..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {searching && (
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {!query.trim() && (
                        <div className="text-center py-10 text-gray-400">
                            <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">Escribe el nombre de tu colegio para buscarlo</p>
                        </div>
                    )}

                    {query.trim() && !searching && results.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <span className="text-4xl">🏫</span>
                            <p className="text-sm mt-2">No encontramos ningún colegio con ese nombre</p>
                            <p className="text-xs mt-1">¿Tu colegio no está? Puedes registrarlo tú mismo.</p>
                        </div>
                    )}

                    {results.map(inst => {
                        const already = isJoined(inst.id)
                        return (
                            <div
                                key={inst.id}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border transition ${already ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40'}`}
                            >
                                {/* Logo/Icon */}
                                <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                    {inst.logo_url ? (
                                        <img src={inst.logo_url} alt={inst.nombre} className="w-full h-full object-contain p-0.5" />
                                    ) : (
                                        <span className="text-xl">🏫</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{inst.nombre}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                        {inst.ugel && <span className="text-xs text-gray-500">{inst.ugel}</span>}
                                        {inst.codigo_modular && <span className="text-xs text-gray-400">Cód. {inst.codigo_modular}</span>}
                                        {inst.direccion && <span className="text-xs text-gray-400 truncate">{inst.direccion}</span>}
                                    </div>
                                </div>

                                {/* Platform badge */}
                                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">🔒 Plataforma</span>
                                    {already ? (
                                        <span className="text-xs text-green-600 font-medium">✓ Unido</span>
                                    ) : (
                                        <button
                                            onClick={() => handleJoin(inst)}
                                            disabled={joining === inst.id}
                                            className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                        >
                                            {joining === inst.id ? '...' : 'Unirme'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer: set as default option */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/60">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={esDefault}
                            onChange={e => setEsDefault(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-xs text-gray-600">Establecer como institución predeterminada al unirme</span>
                    </label>
                </div>
            </div>
        </div>
    )
}
