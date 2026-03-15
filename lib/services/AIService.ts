import { createClient } from '@/lib/supabase/client'

/**
 * Actividad para colegios públicos (input del docente)
 * Se usa en Paso 3: Secuencia de Actividades
 */
export type ActividadSecuencia = {
    id: string
    titulo: string
    campo_tematico: string
    desempeno_precisado?: string // opcional: si se omite, la IA lo genera
    tiempo_estimado: string      // ej: "90 min", "2 horas"
}

/**
 * Resultado de una actividad procesada por la IA (output)
 * Aparece en la tabla de la unidad generada
 */
export type ActividadSecuenciaIA = {
    titulo: string
    desempeno_precisado: string  // generado o optimizado por la IA
    campo_tematico: string
    evidencia_aprendizaje: string
    tiempo: string
}

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
    // Para colegios públicos, la SS puede venir como objeto. En privados como string.
    situacion_significativa: string | { contexto: string; reto: string; propositos: string }
    proposito_aprendizaje: string
    evaluacion: {
        evidencias: string
        criterios: string[]
        instrumento: string
    }
    // Backward compat
    matriz_ia?: {
        competencia: string
        capacidades: string[]
        desempenos_contextualizados: string[]
    }
    // Backward compat
    matrices_ia?: Array<{
        competencia: string
        capacidades: string[]
        desempenos_contextualizados: string[]
    }>
    
    // ---- NUEVO: Colegios Públicos ----
    aprendizajes_esperados?: Array<{
        competencia: string
        capacidades: string[]
        desempenos_precisados: string[]
        contenidos: string[]
    }>
    
    criterios_evaluacion_matriz?: Array<{
        competencia: string
        sesion_numero: number
        criterio: string
        instrumento: string
    }>
    // -----------------------------------

    enfoques_transversales: {
        enfoque: string
        valor: string
        actitudes: string
        comportamiento?: string // Nuevo campo del plan
    }[]
    
    /** Para colegios privados: tabla de sesiones / Para públicos: secuencia en la unidad */
    secuencia_sesiones: {
        numero?: number
        titulo: string
        desempenos?: string
        experiencia_aprendizaje?: string
        desempeno_precisado?: string // Nuevo público
        campo_tematico?: string // Nuevo público
        evidencia?: string // Nuevo público
        horas?: number // Nuevo público
    }[]
    
    /** (Legacy) Para colegios públicos (Paso 3 anterior) */
    secuencia_actividades?: ActividadSecuenciaIA[]
    
    _tiene_contexto_institucional?: boolean
    _modo?: 'sesiones' | 'actividades'
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
 * Genera el cuerpo de una Unidad de Aprendizaje usando Gemini.
 *
 * Soporta dos modos según el tipo de institución:
 * - **Colegio privado**: pasa `sesiones_list` (modo actual)
 * - **Colegio público**: pasa `actividades_secuencia` (nuevo modo con desempeños por actividad)
 */
export async function generarUnidadAprendizaje(params: {
    titulo: string
    grado_nombre: string
    area_nombre: string
    duracion_semanas: number
    /** Modo privado: lista de títulos de sesiones */
    sesiones_list?: string[]
    /** Modo público: lista de actividades con campo temático y desempeño opcional */
    actividades_secuencia?: ActividadSecuencia[]
    competencias_seleccionadas?: string[]
    /** Contexto del colegio — mejora drásticamente la situación significativa */
    contexto_institucional?: import('@/types/database.types').ContextoInstitucionalPayload | null
    /** Contexto específico del aula del docente */
    contexto_aula?: import('@/types/database.types').ContextoAulaPayload | null
    /** Plan Anual Institucional (colegios privados) */
    plan_institucional?: {
        situacion_significativa?: string | null
        enfoques_transversales?: string[] | null
        actitudes?: string[] | null
    }
}): Promise<UnidadIAResult> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Usuario no autenticado')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-unidad-aprendizaje`, {
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
