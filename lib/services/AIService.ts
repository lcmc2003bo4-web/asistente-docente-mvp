import { createClient } from '@/lib/supabase/client'

export type ActividadSesion = {
    titulo: string
    descripcion: string
    tiempo_sugerido: string
}

export type SecuenciaMomento = {
    fase: 'Inicio' | 'Desarrollo' | 'Cierre'
    tiempo_total: number
    actividades: ActividadSesion[]
    recursos: string[]
}

export type EvaluacionCriterio = {
    criterio: string
    indicadores: string[]
    instrumento: string
}

export type EvaluacionRubrica = {
    aspectos: string[]
    niveles: {
        sobresaliente: string[]
        satisfactorio: string[]
        en_proceso: string[]
        inicio: string[]
    }
}

export type EvaluacionCompleta = {
    aprendizajes: EvaluacionCriterio[]
    actitudes: EvaluacionCriterio[]
    rubrica: EvaluacionRubrica
}

export type SecuenciaResult = {
    aspectos_curriculares: {
        capacidades: string[]
        conocimientos: string[]
        actitudes: string[]
        aprendizaje_esperado: string
    }
    secuencia_didactica: SecuenciaMomento[]
    evaluacion: EvaluacionCompleta
    bibliografia?: Array<{ titulo_video: string, url: string, descripcion?: string }>
    generado_con_ia: boolean
}

export type UnidadIAResult = {
    situacion_significativa: string
    proposito_aprendizaje: string
    evaluacion: {
        evidencias: string
        criterios: string[]
        instrumento: string
    }
    // Single competencia (backward compat / fallback)
    matriz_ia?: {
        competencia: string
        capacidades: string[]
        desempenos_contextualizados: string[]
    }
    // Multiple competencias (new: when 2+ are selected)
    matrices_ia?: Array<{
        competencia: string
        capacidades: string[]
        desempenos_contextualizados: string[]
    }>
    enfoques_transversales: {
        enfoque: string
        valor: string
        actitudes: string
    }[]
    secuencia_sesiones: {
        titulo: string
        desempenos: string
        experiencia_aprendizaje: string
    }[]
}

export type DistribucionPeriodo = {
    periodo: string
    competencias: string[]
    competencias_nombres: string[]
    justificacion: string
}

export type DistribucionResult = {
    distribucion: DistribucionPeriodo[]
    metadata: {
        area: string
        grado: string
        nivel: string
        anio_escolar: string
        total_competencias: number
        generado_con_ia: boolean
    }
}

/**
 * Genera una secuencia didáctica (Inicio / Desarrollo / Cierre) usando Gemini
 * a través de la Edge Function `generate-secuencia-sesion`.
 */
export async function generarSecuenciaSesion(params: {
    // Contexto Sesion
    titulo_sesion: string
    desempenos?: string
    experiencia_aprendizaje?: string

    // Contexto Unidad (Herencia)
    unidad_titulo: string
    situacion_significativa?: string
    matriz_ia?: any
    enfoques_transversales?: any[]

    // Contexto de Programación
    area_nombre: string
    grado_nombre: string
    nivel?: string

    // Inputs del Usuario
    duracion_minutos?: number
    recursos_extra?: string
    contexto_extra?: string
}): Promise<SecuenciaResult> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Usuario no autenticado')

    console.log("--- PAYLOAD ENVIADO A LA IA ---", JSON.stringify(params, null, 2))

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-secuencia-sesion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': anonKey!
        },
        body: JSON.stringify(params)
    })

    if (!response.ok) {
        let errorDetalle = `Error HTTP ${response.status}`
        const errorText = await response.text().catch(() => '')
        try {
            if (errorText) {
                const errJson = JSON.parse(errorText)
                console.error('SERVER JSON ERROR:', errJson)
                errorDetalle = errJson.error || errorDetalle
                if (errJson.details) {
                    errorDetalle += ` \n ${errJson.details}`
                }
            }
        } catch {
            console.error('SERVER TEXT ERROR:', errorText)
            errorDetalle = errorText || errorDetalle
        }
        throw new Error(`Error en servidor: ${errorDetalle}`)
    }

    const data = await response.json()
    if (data.error) {
        throw new Error(`Error de IA generativa: ${data.error} \n ${data.details || ''}`)
    }
    return data
}

/**
 * Sugiere una distribución de competencias por bimestres usando Gemini
 * a través de la Edge Function `suggest-competencias-distribution`.
 */
export async function sugerirDistribucionCompetencias(params: {
    area_id: string
    grado_id: string
    anio_escolar: string
}): Promise<DistribucionResult> {
    const supabase = createClient()
    const { data, error } = await supabase.functions.invoke<DistribucionResult>(
        'suggest-competencias-distribution',
        { body: params }
    )
    if (error) throw new Error(error.message)
    if (!data) throw new Error('La función no devolvió datos')
    return data
}

/**
 * Genera el cuerpo de una Unidad de Aprendizaje (Situación, Propósito, Evidencias, Matriz)
 * de forma contextualizada a través de la Edge Function `generate-unidad-aprendizaje`.
 *
 * Los parámetros `contexto_institucional` y `contexto_aula` son opcionales:
 * si se proporcionan, la IA generará situaciones significativas específicas
 * a la realidad de la institución y el aula del docente.
 */
export async function generarUnidadAprendizaje(params: {
    titulo: string
    grado_nombre: string
    area_nombre: string
    duracion_semanas: number
    sesiones_list: string[]
    competencias_seleccionadas?: string[]
    /** Contexto del colegio — mejora drásticamente la situación significativa */
    contexto_institucional?: import('@/types/database.types').ContextoInstitucionalPayload | null
    /** Contexto específico del aula del docente */
    contexto_aula?: import('@/types/database.types').ContextoAulaPayload | null
}): Promise<UnidadIAResult> {
    const supabase = createClient()
    const { data, error } = await supabase.functions.invoke<UnidadIAResult>(
        'generate-unidad-aprendizaje',
        { body: params }
    )
    if (error) throw new Error(error.message)
    if (!data) throw new Error('La función IA de unidades no devolvió datos')
    return data
}
