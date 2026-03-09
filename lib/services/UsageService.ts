import { createClient } from '@/lib/supabase/client'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserUsage {
    plan_tier: 'free' | 'pro'
    ai_generations_used: number
    ai_generations_limit: number
    programaciones_count: number
    prog_limit: number
    unidades_count: number
    unidades_limit: number
    sesiones_count: number
    sesiones_limit: number
}

export interface LimitCheckResult {
    allowed: boolean
    reason?: string
}

// ─── Plan limits (kept in sync with DB) ──────────────────────────────────────

export const PLAN_LIMITS = {
    free: {
        programaciones: 1,
        unidades: 2,
        sesiones: 5,
        ai_generations: 5,
    },
    pro: {
        programaciones: 999,
        unidades: 999,
        sesiones: 9999,
        ai_generations: 100,
    },
} as const

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Returns the current usage summary for the authenticated user.
 */
export async function getUserUsage(): Promise<UserUsage> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase.rpc('get_user_usage', {
        p_user_id: user.id,
    })

    if (error) throw new Error(error.message)
    if (!data || data.length === 0) throw new Error('No se pudo obtener el uso del usuario')

    const row = data[0]
    return {
        plan_tier: row.plan_tier as 'free' | 'pro',
        ai_generations_used: row.ai_generations_used,
        ai_generations_limit: row.ai_generations_limit,
        programaciones_count: row.programaciones_count,
        prog_limit: row.prog_limit,
        unidades_count: row.unidades_count,
        unidades_limit: row.unidades_limit,
        sesiones_count: row.sesiones_count,
        sesiones_limit: row.sesiones_limit,
    }
}

/**
 * Returns the plan tier for the current user.
 */
export async function getUserPlan(): Promise<'free' | 'pro'> {
    const usage = await getUserUsage()
    return usage.plan_tier
}

/**
 * Check if the user can create a new Programación.
 */
export function checkProgramacionLimit(usage: UserUsage): LimitCheckResult {
    if (usage.programaciones_count >= usage.prog_limit) {
        return {
            allowed: false,
            reason: `Has alcanzado el límite de ${usage.prog_limit} programación(es) en el Plan Gratuito. ¡Mejora a PRO para crear ilimitadas!`,
        }
    }
    return { allowed: true }
}

/**
 * Check if the user can create a new Unidad.
 */
export function checkUnidadLimit(usage: UserUsage): LimitCheckResult {
    if (usage.unidades_count >= usage.unidades_limit) {
        return {
            allowed: false,
            reason: `Has alcanzado el límite de ${usage.unidades_limit} unidad(es) en el Plan Gratuito. ¡Mejora a PRO para crear ilimitadas!`,
        }
    }
    return { allowed: true }
}

/**
 * Check if the user can create a new Sesión.
 */
export function checkSesionLimit(usage: UserUsage): LimitCheckResult {
    if (usage.sesiones_count >= usage.sesiones_limit) {
        return {
            allowed: false,
            reason: `Has alcanzado el límite de ${usage.sesiones_limit} sesión(es) en el Plan Gratuito. ¡Mejora a PRO para crear ilimitadas!`,
        }
    }
    return { allowed: true }
}

/**
 * Check if the user can make an AI generation request.
 */
export function checkAiGenerationLimit(usage: UserUsage): LimitCheckResult {
    if (usage.ai_generations_used >= usage.ai_generations_limit) {
        return {
            allowed: false,
            reason: `Has agotado tus ${usage.ai_generations_limit} generaciones de IA este mes en el Plan Gratuito. ¡Mejora a PRO para obtener 100 generaciones mensuales!`,
        }
    }
    return { allowed: true }
}

/**
 * Increments the AI generation counter. Returns whether the action was allowed.
 * Should be called AFTER confirming the AI action succeeded.
 */
export async function incrementAiGeneration(): Promise<{
    allowed: boolean
    used: number
    plan: string
}> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase.rpc('increment_ai_generation', {
        p_user_id: user.id,
    })

    if (error) throw new Error(error.message)
    if (!data || data.length === 0) throw new Error('No se pudo registrar la generación de IA')

    const row = data[0]

    // Disparar evento para que el Sidebar (hook useUsage) actualice visualmente los números
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('usageUpdated'))
    }

    return { allowed: row.allowed, used: row.used, plan: row.plan }
}
