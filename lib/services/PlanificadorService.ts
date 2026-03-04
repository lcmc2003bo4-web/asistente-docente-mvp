import { createClient } from '@/lib/supabase/client'

// ---- Row types ----
export interface SesionFechaSeccion {
    id: string
    sesion_id: string
    user_id: string
    seccion: string
    fecha: string   // ISO date
}

export interface PlanificadorRow {
    id: string              // sesion_id
    fecha_seccion_id?: string   // id from pivot (undefined if from fecha_tentativa)
    fecha: string
    dia_semana: string
    titulo: string
    grado_nombre: string
    area_nombre: string
    seccion: string         // 'A', 'B', 'C', or '—' when no sections defined
    estado: 'Borrador' | 'Validado'
    unidad_id: string
    sesion_url: string
    semana: number
}

export interface PlanificadorMeta {
    docente: string
    institucion: string
    mes: number
    anio: number
    total: number
    sin_fecha: number
}

export type PlanificadorWarning = 'NONE' | 'NO_SESSIONS' | 'SESSIONS_WITHOUT_DATE'

export interface PlanificadorResult {
    rows: PlanificadorRow[]
    meta: PlanificadorMeta
    warning: PlanificadorWarning
    sin_fecha_count: number
}

export interface PlanificadorWeekGroup {
    semana: number
    label: string
    rows: PlanificadorRow[]
}

// ---- helpers ----
const DIAS: Record<number, string> = {
    0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
    4: 'Jueves', 5: 'Viernes', 6: 'Sábado',
}

function weekOfMonth(day: number): number { return Math.ceil(day / 7) }

function rowFromDate(
    s: any,
    fecha: string,
    grado: string,
    area: string,
    seccion: string,
    fechaSeccionId?: string
): PlanificadorRow {
    const dateObj = new Date(fecha + 'T00:00:00')
    // Use validation_status as source of truth for display:
    // 'valid' → 'Validado', anything else → 'Borrador'
    const displayEstado: 'Borrador' | 'Validado' =
        s.validation_status === 'valid' ? 'Validado' : 'Borrador'
    return {
        id: s.id,
        fecha_seccion_id: fechaSeccionId,
        fecha,
        dia_semana: DIAS[dateObj.getDay()] || '—',
        titulo: s.titulo,
        grado_nombre: grado,
        area_nombre: area,
        seccion,
        estado: displayEstado,
        unidad_id: s.unidad_id,
        sesion_url: `/dashboard/sesiones/${s.id}`,
        semana: weekOfMonth(dateObj.getDate()),
    }
}

// ---- service ----
class PlanificadorService {
    private supabase = createClient()

    /**
     * Unique institution names from user's programaciones (for Colegio dropdown).
     */
    async getInstituciones(userId: string): Promise<string[]> {
        const { data, error } = await this.supabase
            .from('programaciones')
            .select('institucion')
            .eq('user_id', userId)
            .not('institucion', 'is', null)

        if (error) throw error
        return [...new Set((data || []).map((p: any) => p.institucion as string).filter(Boolean))].sort()
    }

    /**
     * Main query: returns all PlanificadorRows for the selected month.
     *
     * Strategy per session:
     *  1. If sesion_fechas_seccion has records → one row per section within the month.
     *  2. Else → one row from fecha_tentativa (seccion = '—') if it falls in the month.
     */
    async getByMes(
        userId: string,
        institucion: string,
        anio: number,
        mes: number,
    ): Promise<PlanificadorResult> {
        const supabase = this.supabase

        const firstDay = new Date(anio, mes - 1, 1)
        const lastDay = new Date(anio, mes, 0)
        const from = firstDay.toISOString().split('T')[0]
        const to = lastDay.toISOString().split('T')[0]

        // --- Profile ---
        const { data: profile } = await supabase
            .from('users').select('nombre_completo').eq('id', userId).single()

        // --- Programaciones for this institution ---
        const { data: progs, error: progError } = await supabase
            .from('programaciones')
            .select('id, areas(nombre), grados(nombre)')
            .eq('user_id', userId)
            .eq('institucion', institucion)

        if (progError) throw progError
        if (!progs || progs.length === 0) return this._emptyResult(profile, institucion, mes, anio)

        const progIds = progs.map((p: any) => p.id)
        const progMeta: Record<string, { grado: string; area: string }> = {}
        progs.forEach((p: any) => {
            progMeta[p.id] = {
                grado: (p as any).grados?.nombre || '—',
                area: (p as any).areas?.nombre || '—',
            }
        })

        // --- Unidades ---
        const { data: unidades, error: unidadError } = await supabase
            .from('unidades')
            .select('id, programacion_id')
            .in('programacion_id', progIds)

        if (unidadError) throw unidadError
        if (!unidades || unidades.length === 0) return this._emptyResult(profile, institucion, mes, anio)

        const unidadIds = unidades.map((u: any) => u.id)
        const unidadProgMap: Record<string, string> = {}
        unidades.forEach((u: any) => { unidadProgMap[u.id] = u.programacion_id })

        // --- Sesiones ---
        const { data: sesiones, error: sesionError } = await supabase
            .from('sesiones')
            .select('id, titulo, fecha_tentativa, estado, validation_status, unidad_id')
            .eq('user_id', userId)
            .in('unidad_id', unidadIds)

        if (sesionError) throw sesionError
        const allSesiones = sesiones || []

        const sinFecha = allSesiones.filter((s: any) => !s.fecha_tentativa).length

        // --- Pivot: per-section dates for this month ---
        const sesionIds = allSesiones.map((s: any) => s.id)
        let pivotRows: SesionFechaSeccion[] = []

        if (sesionIds.length > 0) {
            const { data: pivot, error: pivotError } = await supabase
                .from('sesion_fechas_seccion')
                .select('id, sesion_id, user_id, seccion, fecha')
                .eq('user_id', userId)
                .in('sesion_id', sesionIds)
                .gte('fecha', from)
                .lte('fecha', to)
                .order('fecha', { ascending: true })

            if (pivotError) throw pivotError
            pivotRows = (pivot || []) as SesionFechaSeccion[]
        }

        // Set of sesion_ids that have at least one pivot record (any date, not just this month)
        // We fetch them to decide whether to use fecha_tentativa as fallback
        const sesionsWithPivot = new Set<string>()
        if (sesionIds.length > 0) {
            const { data: pivotAll } = await supabase
                .from('sesion_fechas_seccion')
                .select('sesion_id')
                .eq('user_id', userId)
                .in('sesion_id', sesionIds)

                ; (pivotAll || []).forEach((p: any) => sesionsWithPivot.add(p.sesion_id))
        }

        // --- Build rows ---
        const seen = new Set<string>()   // deduplicate by sesion_id + seccion
        const rows: PlanificadorRow[] = []

        // A) From pivot (per-section dates)
        for (const p of pivotRows) {
            const sesion = allSesiones.find((s: any) => s.id === p.sesion_id)
            if (!sesion) continue
            const key = `${p.sesion_id}::${p.seccion}`
            if (seen.has(key)) continue
            seen.add(key)
            const progId = unidadProgMap[(sesion as any).unidad_id] || ''
            const { grado, area } = progMeta[progId] || { grado: '—', area: '—' }
            rows.push(rowFromDate(sesion, p.fecha, grado, area, p.seccion, p.id))
        }

        // B) Fallback: sessions WITHOUT any pivot record → use fecha_tentativa
        for (const s of allSesiones as any[]) {
            if (sesionsWithPivot.has(s.id)) continue          // already handled via pivot
            if (!s.fecha_tentativa) continue                    // no date at all
            if (s.fecha_tentativa < from || s.fecha_tentativa > to) continue  // outside month
            const key = `${s.id}::—`
            if (seen.has(key)) continue
            seen.add(key)
            const progId = unidadProgMap[s.unidad_id] || ''
            const { grado, area } = progMeta[progId] || { grado: '—', area: '—' }
            rows.push(rowFromDate(s, s.fecha_tentativa, grado, area, '—'))
        }

        // Sort by date
        rows.sort((a, b) => a.fecha.localeCompare(b.fecha))

        const warning: PlanificadorWarning = rows.length === 0
            ? (sinFecha > 0 ? 'SESSIONS_WITHOUT_DATE' : 'NO_SESSIONS')
            : sinFecha > 0 ? 'SESSIONS_WITHOUT_DATE' : 'NONE'

        return {
            rows,
            meta: {
                docente: profile?.nombre_completo || '',
                institucion,
                mes,
                anio,
                total: rows.length,
                sin_fecha: sinFecha,
            },
            warning,
            sin_fecha_count: sinFecha,
        }
    }

    /** Groups rows by week of month. */
    groupByWeek(rows: PlanificadorRow[]): PlanificadorWeekGroup[] {
        const map = new Map<number, PlanificadorRow[]>()
        for (const row of rows) {
            const g = map.get(row.semana) || []
            g.push(row)
            map.set(row.semana, g)
        }
        return Array.from(map.entries())
            .sort(([a], [b]) => a - b)
            .map(([semana, rows]) => ({ semana, label: `Semana ${semana}`, rows }))
    }

    // ---- CRUD for sesion_fechas_seccion ----

    /**
     * Fetch all per-section dates for a given session.
     */
    async getFechasPorSeccion(sesionId: string): Promise<SesionFechaSeccion[]> {
        const { data, error } = await this.supabase
            .from('sesion_fechas_seccion')
            .select('*')
            .eq('sesion_id', sesionId)
            .order('seccion', { ascending: true })

        if (error) throw error
        return (data || []) as SesionFechaSeccion[]
    }

    /**
     * Upsert per-section dates (replaces all for the session).
     * Pass fechas = [] to clear all.
     */
    async saveFechasPorSeccion(
        sesionId: string,
        userId: string,
        fechas: Array<{ seccion: string; fecha: string }>
    ): Promise<void> {
        // Delete existing
        await this.supabase
            .from('sesion_fechas_seccion')
            .delete()
            .eq('sesion_id', sesionId)

        if (fechas.length === 0) return

        const inserts = fechas
            .filter(f => f.seccion.trim() && f.fecha)
            .map(f => ({
                sesion_id: sesionId,
                user_id: userId,
                seccion: f.seccion.trim().toUpperCase(),
                fecha: f.fecha,
            }))

        if (inserts.length > 0) {
            const { error } = await this.supabase
                .from('sesion_fechas_seccion')
                .insert(inserts)
            if (error) throw error
        }
    }

    private _emptyResult(
        profile: any,
        institucion: string,
        mes: number,
        anio: number
    ): PlanificadorResult {
        return {
            rows: [],
            meta: { docente: profile?.nombre_completo || '', institucion, mes, anio, total: 0, sin_fecha: 0 },
            warning: 'NO_SESSIONS',
            sin_fecha_count: 0,
        }
    }
}

export const planificadorService = new PlanificadorService()
export default PlanificadorService
