import { createClient } from '@/lib/supabase/client'
import type { Institucion } from '@/hooks/useUserProfile'
import type { UserPreferencias } from '@/types/database.types'

const LOGOS_BUCKET = 'logos-instituciones'

export const institucionService = {
    // ─── CRUD ──────────────────────────────────────────────────
    // ─── CRUD ──────────────────────────────────────────────────
    async listOwn(userId: string): Promise<Institucion[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('instituciones')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
        if (error) throw error
        return (data || []) as Institucion[]
    },

    async listAll(userId: string): Promise<Array<Institucion | InstitucionVinculada>> {
        const [own, joined] = await Promise.all([
            this.listOwn(userId),
            this.listJoined(userId)
        ])
        return [...own, ...joined]
    },

    async create(userId: string, payload: {
        nombre: string
        codigo_modular?: string
        direccion?: string
        ugel?: string
        logo_url?: string
        es_predeterminada?: boolean
    }): Promise<Institucion> {
        const supabase = createClient()
        // If setting as default, clear others first
        if (payload.es_predeterminada) {
            await supabase.from('instituciones')
                .update({ es_predeterminada: false })
                .eq('user_id', userId)
        }
        const { data, error } = await supabase
            .from('instituciones')
            .insert({ ...payload, user_id: userId })
            .select()
            .single()
        if (error) throw error
        return data as Institucion
    },

    async update(id: string, userId: string, payload: Partial<Omit<Institucion, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Institucion> {
        const supabase = createClient()
        if (payload.es_predeterminada) {
            await supabase.from('instituciones')
                .update({ es_predeterminada: false })
                .eq('user_id', userId)
                .neq('id', id)
        }
        const { data, error } = await supabase
            .from('instituciones')
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single()
        if (error) throw error
        return data as Institucion
    },

    async remove(id: string, userId: string): Promise<void> {
        const supabase = createClient()
        // Delete logo from storage first (if any)
        const { data: inst } = await supabase
            .from('instituciones').select('logo_url').eq('id', id).single()
        if ((inst as any)?.logo_url) {
            const path = `${userId}/${id}/logo`
            await supabase.storage.from(LOGOS_BUCKET).remove([path])
        }
        const { error } = await supabase
            .from('instituciones').delete().eq('id', id).eq('user_id', userId)
        if (error) throw error
    },

    // ─── Logo Upload ────────────────────────────────────────────
    async uploadLogo(userId: string, institucionId: string, file: File): Promise<string> {
        const supabase = createClient()
        const ext = file.name.split('.').pop()
        const path = `${userId}/${institucionId}/logo.${ext}`
        const { error } = await supabase.storage
            .from(LOGOS_BUCKET)
            .upload(path, file, { upsert: true, contentType: file.type })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage
            .from(LOGOS_BUCKET).getPublicUrl(path)
        return publicUrl
    },

    async deleteLogo(userId: string, institucionId: string, logoUrl: string): Promise<void> {
        const supabase = createClient()
        // Extract path from URL
        const url = new URL(logoUrl)
        const path = url.pathname.split(`/${LOGOS_BUCKET}/`)[1]
        if (path) await supabase.storage.from(LOGOS_BUCKET).remove([path])
        await supabase.from('instituciones')
            .update({ logo_url: null }).eq('id', institucionId).eq('user_id', userId)
    },

    // ─── User profile ───────────────────────────────────────────
    async updateProfile(userId: string, payload: {
        nombre_completo?: string
        especialidad?: string | null
        nivel?: 'Primaria' | 'Secundaria' | null
    }): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase.from('users').update(payload).eq('id', userId)
        if (error) throw error
    },

    async updatePreferencias(userId: string, prefs: UserPreferencias): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase.from('users')
            .update({ preferencias: prefs as any }).eq('id', userId)
        if (error) throw error
    },

    async uploadAvatar(userId: string, file: File): Promise<string> {
        const supabase = createClient()
        const ext = file.name.split('.').pop()
        const path = `${userId}/avatar.${ext}`
        const { error } = await supabase.storage
            .from('avatars')
            .upload(path, file, { upsert: true, contentType: file.type })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
        await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', userId)
        return publicUrl
    },

    // ─── Global Institutions (platform-managed) ─────────────────

    async searchGlobal(query: string): Promise<InstitucionGlobal[]> {
        const supabase = createClient()
        const q = query.trim()
        const { data, error } = await supabase
            .from('instituciones_globales')
            .select('*')
            .or(`nombre.ilike.%${q}%,codigo_modular.ilike.%${q}%,ugel.ilike.%${q}%`)
            .order('nombre', { ascending: true })
            .limit(20)
        if (error) throw error
        return (data || []) as InstitucionGlobal[]
    },

    async listJoined(userId: string): Promise<InstitucionVinculada[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('docente_institucion')
            .select(`
                id,
                es_predeterminada,
                created_at,
                instituciones_globales (
                    id, nombre, codigo_modular, direccion, ugel, logo_url
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
        if (error) throw error
        return ((data || []).map((row: any) => ({
            joinId: row.id,
            es_predeterminada: row.es_predeterminada,
            ...row.instituciones_globales,
        }))) as InstitucionVinculada[]
    },

    async joinGlobal(userId: string, globalId: string, esDefault: boolean): Promise<void> {
        const supabase = createClient()
        if (esDefault) {
            // Clear existing defaults on both tables
            await supabase.from('docente_institucion')
                .update({ es_predeterminada: false }).eq('user_id', userId)
            await supabase.from('instituciones')
                .update({ es_predeterminada: false }).eq('user_id', userId)
        }
        const { error } = await supabase.from('docente_institucion')
            .upsert({ user_id: userId, institucion_global_id: globalId, es_predeterminada: esDefault })
        if (error) throw error
    },

    async leaveGlobal(userId: string, globalId: string): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase.from('docente_institucion')
            .delete()
            .eq('user_id', userId)
            .eq('institucion_global_id', globalId)
        if (error) throw error
    },

    async setGlobalDefault(userId: string, globalId: string): Promise<void> {
        const supabase = createClient()
        // Clear all
        await supabase.from('docente_institucion').update({ es_predeterminada: false }).eq('user_id', userId)
        await supabase.from('instituciones').update({ es_predeterminada: false }).eq('user_id', userId)
        // Set this one
        await supabase.from('docente_institucion')
            .update({ es_predeterminada: true })
            .eq('user_id', userId)
            .eq('institucion_global_id', globalId)
    },
}

// ─── Types for global institutions ─────────────────────────────
export interface InstitucionGlobal {
    id: string
    nombre: string
    codigo_modular: string | null
    direccion: string | null
    ugel: string | null
    logo_url: string | null
    created_at: string
}

export interface InstitucionVinculada extends InstitucionGlobal {
    joinId: string
    es_predeterminada: boolean
    // discriminator
    es_administrada: true
}
