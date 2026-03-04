'use client'

import { useState, useRef } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { institucionService } from '@/lib/services/InstitucionService'
import type { Institucion } from '@/hooks/useUserProfile'

interface FormState {
    nombre: string
    codigo_modular: string
    direccion: string
    ugel: string
    es_predeterminada: boolean
    logoFile: File | null
    logoPreview: string | null
    existingLogoUrl: string | null
}

const EMPTY_FORM: FormState = {
    nombre: '', codigo_modular: '', direccion: '', ugel: '',
    es_predeterminada: false, logoFile: null, logoPreview: null, existingLogoUrl: null
}

export function InstitucionesTab() {
    const { profile, loading, refresh } = useUserProfile()
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormState>(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const openCreate = () => {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setShowModal(true)
    }

    const openEdit = (inst: Institucion) => {
        setEditingId(inst.id)
        setForm({
            nombre: inst.nombre,
            codigo_modular: inst.codigo_modular || '',
            direccion: inst.direccion || '',
            ugel: inst.ugel || '',
            es_predeterminada: inst.es_predeterminada,
            logoFile: null,
            logoPreview: null,
            existingLogoUrl: inst.logo_url,
        })
        setShowModal(true)
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setForm(prev => ({ ...prev, logoFile: file, logoPreview: URL.createObjectURL(file) }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return
        setSaving(true)
        try {
            if (editingId) {
                // Update existing
                let logo_url = form.existingLogoUrl
                if (form.logoFile) {
                    logo_url = await institucionService.uploadLogo(profile.id, editingId, form.logoFile)
                }
                await institucionService.update(editingId, profile.id, {
                    nombre: form.nombre,
                    codigo_modular: form.codigo_modular || null,
                    direccion: form.direccion || null,
                    ugel: form.ugel || null,
                    logo_url,
                    es_predeterminada: form.es_predeterminada,
                })
            } else {
                // Create – first insert to get id, then upload logo if any
                const created = await institucionService.create(profile.id, {
                    nombre: form.nombre,
                    codigo_modular: form.codigo_modular || undefined,
                    direccion: form.direccion || undefined,
                    ugel: form.ugel || undefined,
                    es_predeterminada: form.es_predeterminada,
                })
                if (form.logoFile) {
                    const logo_url = await institucionService.uploadLogo(profile.id, created.id, form.logoFile)
                    await institucionService.update(created.id, profile.id, { logo_url })
                }
            }
            setShowModal(false)
            refresh()
        } catch (err) {
            console.error(err)
            alert('Error al guardar la institución')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (inst: Institucion) => {
        if (!profile) return
        if (!confirm(`¿Eliminar "${inst.nombre}"?`)) return
        setDeleting(inst.id)
        try {
            await institucionService.remove(inst.id, profile.id)
            refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(null)
        }
    }

    const handleSetDefault = async (inst: Institucion) => {
        if (!profile) return
        await institucionService.update(inst.id, profile.id, { es_predeterminada: true })
        refresh()
    }

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-44 bg-gray-100 rounded-xl" />)}
        </div>
    }

    const instituciones = profile?.instituciones || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {instituciones.length === 0
                        ? 'Agrega los colegios donde trabajas. El predeterminado se auto-rellenará en tus programaciones.'
                        : `${instituciones.length} institución${instituciones.length > 1 ? 'es' : ''} registrada${instituciones.length > 1 ? 's' : ''}`}
                </p>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Agregar institución
                </button>
            </div>

            {/* Empty state */}
            {instituciones.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <span className="text-5xl">🏫</span>
                    <h3 className="mt-4 font-semibold text-gray-700">Sin instituciones aún</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Agrega tu colegio para que se auto-rellene en tus documentos</p>
                    <button onClick={openCreate} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        + Agregar mi primera institución
                    </button>
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instituciones.map(inst => (
                    <div key={inst.id} className={`relative bg-white rounded-xl border-2 p-5 transition ${inst.es_predeterminada ? 'border-indigo-300 shadow-sm' : 'border-gray-200'}`}>
                        {inst.es_predeterminada && (
                            <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                ✓ Predeterminada
                            </span>
                        )}

                        <div className="flex items-start gap-4">
                            {/* Logo */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                {inst.logo_url ? (
                                    <img src={inst.logo_url} alt={inst.nombre} className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-2xl">🏫</span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{inst.nombre}</h3>
                                {inst.ugel && <p className="text-xs text-gray-500 truncate">{inst.ugel}</p>}
                                {inst.codigo_modular && <p className="text-xs text-gray-400">Cód. {inst.codigo_modular}</p>}
                                {inst.direccion && <p className="text-xs text-gray-400 truncate mt-0.5">{inst.direccion}</p>}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                            {!inst.es_predeterminada && (
                                <button
                                    onClick={() => handleSetDefault(inst)}
                                    className="flex-1 text-xs py-1.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
                                >
                                    Marcar como predeterminada
                                </button>
                            )}
                            <button
                                onClick={() => openEdit(inst)}
                                className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(inst)}
                                disabled={deleting === inst.id}
                                className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs hover:bg-red-50 transition disabled:opacity-40"
                            >
                                {deleting === inst.id ? '...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingId ? 'Editar institución' : 'Nueva institución'}
                            </h2>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {/* Logo upload */}
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition overflow-hidden"
                                >
                                    {form.logoPreview || form.existingLogoUrl ? (
                                        <img src={form.logoPreview || form.existingLogoUrl!} alt="Logo" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs text-gray-400 mt-1">Logo</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Logo del colegio</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, SVG · Máx 2 MB</p>
                                    <button type="button" onClick={() => fileRef.current?.click()}
                                        className="mt-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                        {form.logoPreview || form.existingLogoUrl ? 'Cambiar logo' : 'Subir logo'}
                                    </button>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                </div>
                            </div>

                            {/* Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del colegio *</label>
                                <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ej: I.E. Mariscal Castilla" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código modular</label>
                                    <input value={form.codigo_modular} onChange={e => setForm({ ...form, codigo_modular: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Ej: 0123456" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UGEL / DRE</label>
                                    <input value={form.ugel} onChange={e => setForm({ ...form, ugel: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Ej: UGEL 03" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Av. Lima 123, Callao" />
                            </div>

                            {/* Predeterminada */}
                            <label className="flex items-center gap-3 cursor-pointer bg-indigo-50 p-3 rounded-lg">
                                <input type="checkbox" checked={form.es_predeterminada}
                                    onChange={e => setForm({ ...form, es_predeterminada: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 rounded" />
                                <div>
                                    <p className="text-sm font-medium text-indigo-900">Establecer como predeterminada</p>
                                    <p className="text-xs text-indigo-600">Se auto-rellenará en nuevas programaciones</p>
                                </div>
                            </label>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                                    {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear institución'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
