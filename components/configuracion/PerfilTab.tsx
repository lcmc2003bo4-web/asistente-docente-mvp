'use client'

import { useState } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { institucionService } from '@/lib/services/InstitucionService'
import { createClient } from '@/lib/supabase/client'

export function PerfilTab() {
    const { profile, loading, refresh } = useUserProfile()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [formData, setFormData] = useState<{
        nombre_completo: string
        especialidad: string
        nivel: 'Primaria' | 'Secundaria' | ''
    } | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    // Sync form once profile loads
    if (profile && !formData) {
        setFormData({
            nombre_completo: profile.nombre_completo,
            especialidad: profile.especialidad || '',
            nivel: profile.nivel || '',
        })
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile || !formData) return
        setSaving(true)
        try {
            await institucionService.updateProfile(profile.id, {
                nombre_completo: formData.nombre_completo,
                especialidad: formData.especialidad || null,
                nivel: formData.nivel || null,
            })
            if (avatarFile) {
                await institucionService.uploadAvatar(profile.id, avatarFile)
            }
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
            refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loading || !formData) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
            </div>
        )
    }

    const avatarSrc = avatarPreview || profile?.avatar_url
    const initials = (profile?.nombre_completo || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Avatar */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="Avatar" className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-100" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-indigo-100">
                            <span className="text-xl font-bold text-white">{initials}</span>
                        </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:bg-gray-50 shadow-sm transition">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{profile?.nombre_completo}</h3>
                    <p className="text-sm text-gray-500">{profile?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG o WebP · Máx 2 MB</p>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Nombre */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                </label>
                <input
                    type="text"
                    required
                    value={formData.nombre_completo}
                    onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: María Elena Quispe Torres"
                />
                <p className="text-xs text-gray-400 mt-1">Aparecerá en todos los documentos generados</p>
            </div>

            {/* Especialidad */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidad / Área que enseña
                </label>
                <input
                    type="text"
                    value={formData.especialidad}
                    onChange={e => setFormData({ ...formData, especialidad: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ej: Matemática, Comunicación, Ciencias..."
                />
            </div>

            {/* Nivel */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel Educativo
                </label>
                <div className="flex gap-3">
                    {(['Primaria', 'Secundaria'] as const).map(nv => (
                        <button
                            key={nv}
                            type="button"
                            onClick={() => setFormData({ ...formData, nivel: nv })}
                            className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition ${formData.nivel === nv
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >
                            {nv}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Guardando...</>
                    ) : saved ? (
                        <><span>✓</span>Guardado</>
                    ) : 'Guardar cambios'}
                </button>
            </div>
        </form>
    )
}
