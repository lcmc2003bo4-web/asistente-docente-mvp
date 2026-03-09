'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserPreferencias } from '@/types/database.types'
import { institucionService, type InstitucionVinculada } from '@/lib/services/InstitucionService'

export interface Institucion {
    id: string
    user_id: string
    nombre: string
    codigo_modular: string | null
    direccion: string | null
    ugel: string | null
    logo_url: string | null
    es_predeterminada: boolean
    perfil_completado: boolean
    created_at: string
    updated_at: string
}

export type AnyInstitucion = Institucion | InstitucionVinculada

export interface UserProfile {
    id: string
    nombre_completo: string
    especialidad: string | null
    nivel: 'Primaria' | 'Secundaria' | null
    institucion: string | null
    logo_url: string | null
    avatar_url: string | null
    preferencias: UserPreferencias
    email: string | null
    instituciones: AnyInstitucion[]
    institucionPredeterminada: AnyInstitucion | null
}

const DEFAULT_PREFS: UserPreferencias = {
    duracion_sesion: 90,
    nivel: 'Secundaria',
    periodo_tipo: 'Bimestral',
    anio_escolar: new Date().getFullYear(),
}

let cachedProfile: UserProfile | null = null
const listeners: Array<() => void> = []

function notifyListeners() { listeners.forEach(fn => fn()) }

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(cachedProfile)
    const [loading, setLoading] = useState(!cachedProfile)
    const supabase = createClient()

    const loadProfile = useCallback(async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            const [userRes, allInstituciones] = await Promise.all([
                supabase.from('users').select('*').eq('id', user.id).single(),
                institucionService.listAll(user.id)
            ])

            const built: UserProfile = {
                id: user.id,
                nombre_completo: (userRes.data as any)?.nombre_completo || '',
                especialidad: (userRes.data as any)?.especialidad || null,
                nivel: (userRes.data as any)?.nivel || null,
                institucion: (userRes.data as any)?.institucion || null,
                logo_url: (userRes.data as any)?.logo_url || null,
                avatar_url: (userRes.data as any)?.avatar_url || null,
                preferencias: { ...DEFAULT_PREFS, ...((userRes.data as any)?.preferencias || {}) },
                email: user.email || null,
                instituciones: allInstituciones,
                institucionPredeterminada: allInstituciones.find(i => i.es_predeterminada) || null,
            }
            cachedProfile = built
            setProfile(built)
        } catch (err) {
            console.error('useUserProfile:', err)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        loadProfile()
        const refresh = () => loadProfile()
        listeners.push(refresh)
        return () => { const i = listeners.indexOf(refresh); if (i > -1) listeners.splice(i, 1) }
    }, [loadProfile])

    const refresh = useCallback(() => {
        cachedProfile = null
        loadProfile()
        notifyListeners()
    }, [loadProfile])

    return { profile, loading, refresh }
}
