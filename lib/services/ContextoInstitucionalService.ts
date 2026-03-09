import { createClient } from '@/lib/supabase/client'
import type { ContextoInstitucionalPayload, ContextoAulaPayload } from '@/types/database.types'

export type { ContextoInstitucionalPayload, ContextoAulaPayload }

export const contextoInstitucionalService = {
    // ─── Perfil Institucional ───────────────────────────────────────────────
    async getPerfilCompleto(institucionId: string): Promise<ContextoInstitucionalPayload | null> {
        const supabase = createClient()

        let rawData: any = null

        // 1. Try teacher-owned institutions table first
        const { data: ownData } = await supabase
            .from('instituciones')
            .select(`
                nombre, tipo_gestion, zona, region, distrito, mision, vision, valores,
                enfoque_religioso, contexto_socioeconomico, actividades_economicas,
                identidad_cultural, problematicas_locales, festividades_regionales,
                proyectos_comunitarios, perfil_completado
            `)
            .eq('id', institucionId)
            .maybeSingle()

        if (ownData) {
            rawData = ownData
        } else {
            // 2. If not found, try platform-managed global institutions
            const { data: globalData } = await supabase
                .from('instituciones_globales')
                .select(`
                    nombre, tipo_gestion, zona, region, distrito, mision, vision, valores,
                    enfoque_religioso, contexto_socioeconomico, actividades_economicas,
                    identidad_cultural, problematicas_locales, festividades_regionales,
                    proyectos_comunitarios, perfil_completado
                `)
                .eq('id', institucionId)
                .maybeSingle()

            if (globalData) {
                rawData = globalData
            }
        }

        if (!rawData) return null

        // Devolver el contexto si hay datos suficientes
        const hayDatos = !!(rawData.region || (rawData.actividades_economicas?.length ?? 0) > 0 || rawData.identidad_cultural)
        if (!hayDatos) return null

        return {
            nombre_institucion: rawData.nombre,
            tipo_gestion: (rawData.tipo_gestion as any) ?? 'Pública',
            zona: (rawData.zona as any) ?? 'Urbana',
            region: rawData.region ?? '',
            distrito: rawData.distrito ?? '',
            contexto_socioeconomico: (rawData.contexto_socioeconomico as any) ?? 'Medio-bajo',
            actividades_economicas: rawData.actividades_economicas ?? [],
            identidad_cultural: rawData.identidad_cultural,
            problematicas_locales: rawData.problematicas_locales ?? [],
            festividades_regionales: rawData.festividades_regionales ?? [],
            proyectos_comunitarios: rawData.proyectos_comunitarios ?? [],
            mision: rawData.mision,
            vision: rawData.vision,
            valores: rawData.valores ?? [],
            enfoque_religioso: rawData.enfoque_religioso,
        }
    },

    async updatePerfilContexto(
        institucionId: string,
        userId: string,
        payload: Partial<ContextoInstitucionalPayload> & { perfil_completado?: boolean }
    ): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from('instituciones')
            .update({
                tipo_gestion: payload.tipo_gestion,
                zona: payload.zona,
                region: payload.region,
                distrito: payload.distrito,
                mision: payload.mision,
                vision: payload.vision,
                valores: payload.valores,
                enfoque_religioso: payload.enfoque_religioso,
                contexto_socioeconomico: payload.contexto_socioeconomico,
                actividades_economicas: payload.actividades_economicas,
                identidad_cultural: payload.identidad_cultural,
                problematicas_locales: payload.problematicas_locales,
                festividades_regionales: payload.festividades_regionales,
                proyectos_comunitarios: payload.proyectos_comunitarios,
                perfil_completado: payload.perfil_completado ?? true,
            })
            .eq('id', institucionId)
            .eq('user_id', userId)

        if (error) throw error
    },

    // ─── Contexto de Aula ───────────────────────────────────────────────────
    async getContextoAula(params: {
        userId: string
        institucionId: string
        anioEscolar: number
        gradoId?: string
    }): Promise<ContextoAulaPayload | null> {
        const supabase = createClient()
        let query = supabase
            .from('contexto_aula')
            .select('*')
            .eq('user_id', params.userId)
            .eq('institucion_id', params.institucionId)
            .eq('anio_escolar', params.anioEscolar)

        if (params.gradoId) query = query.eq('grado_id', params.gradoId)

        const { data, error } = await query.maybeSingle()
        if (error || !data) return null

        return {
            seccion: data.seccion,
            num_estudiantes: data.num_estudiantes,
            intereses_comunes: data.intereses_comunes ?? [],
            retos_educativos: data.retos_educativos ?? [],
            nivel_socioeconomico: data.nivel_socioeconomico as any,
            caracteristicas_adicionales: data.caracteristicas_adicionales,
        }
    },

    async upsertContextoAula(params: {
        userId: string
        institucionId: string
        anioEscolar: number
        gradoId?: string | null
        payload: ContextoAulaPayload
    }): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from('contexto_aula')
            .upsert({
                user_id: params.userId,
                institucion_id: params.institucionId,
                anio_escolar: params.anioEscolar,
                grado_id: params.gradoId ?? null,
                seccion: params.payload.seccion ?? null,
                num_estudiantes: params.payload.num_estudiantes ?? null,
                intereses_comunes: params.payload.intereses_comunes,
                retos_educativos: params.payload.retos_educativos,
                nivel_socioeconomico: params.payload.nivel_socioeconomico ?? null,
                caracteristicas_adicionales: params.payload.caracteristicas_adicionales ?? null,
            }, {
                onConflict: 'user_id,institucion_id,anio_escolar,grado_id,seccion',
            })

        if (error) throw error
    },
}
