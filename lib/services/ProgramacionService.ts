import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Programacion = Database['public']['Tables']['programaciones']['Row']
type ProgramacionInsert = Database['public']['Tables']['programaciones']['Insert']
type ProgramacionUpdate = Database['public']['Tables']['programaciones']['Update']

export interface ProgramacionWithRelations extends Programacion {
    areas?: { nombre: string }
    grados?: { nombre: string; nivel: string }
    detalles_programacion?: Array<{
        competencias: {
            id: string
            nombre: string
            capacidades?: Array<{
                id: string
                nombre: string
            }>
        }
    }>
}

export interface ValidationResult {
    valid: boolean
    errors: Array<{
        code: string
        field?: string
        message: string
        severity: 'error' | 'warning'
        reference?: string
        details?: any
    }>
    warnings: Array<{
        code: string
        field?: string
        message: string
        severity: 'error' | 'warning'
        reference?: string
        details?: any
    }>
    summary?: {
        total_issues: number
        errors_count: number
        warnings_count: number
        competencias_selected: number
        competencias_total: number
    }
}

export interface DistribucionSuggestion {
    distribucion: Array<{
        periodo: string
        competencias: string[]
        competencias_nombres: string[]
        justificacion: string
    }>
    metadata: {
        area: string
        grado: string
        nivel: string
        anio_escolar: number
        total_competencias: number
        generado_con_ia: boolean
    }
}

export class ProgramacionService {
    private supabase = createClient()

    /**
     * Obtener lista de programaciones del usuario
     */
    async list(userId: string): Promise<ProgramacionWithRelations[]> {
        const { data, error } = await this.supabase
            .from('programaciones')
            .select(`
        *,
        areas(nombre),
        grados(nombre, nivel),
        detalles_programacion(
          competencias(id, nombre)
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as ProgramacionWithRelations[]
    }

    /**
     * Obtener una programación por ID
     */
    async get(id: string): Promise<ProgramacionWithRelations> {
        const { data, error } = await this.supabase
            .from('programaciones')
            .select(`
        *,
        areas(nombre),
        grados(nombre, nivel),
        detalles_programacion(
          competencias(
            id,
            nombre,
            capacidades(id, nombre)
          )
        )
      `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data as ProgramacionWithRelations
    }

    /**
     * Crear una nueva programación
     */
    async create(programacion: ProgramacionInsert): Promise<Programacion> {
        const { data, error } = await this.supabase
            .from('programaciones')
            .insert(programacion)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Actualizar una programación existente
     */
    async update(id: string, updates: ProgramacionUpdate): Promise<Programacion> {
        const { data, error } = await this.supabase
            .from('programaciones')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Eliminar una programación
     */
    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('programaciones')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Agregar competencias a una programación
     */
    async addCompetencias(programacionId: string, competenciasIds: string[]): Promise<void> {
        // Primero eliminar las existentes
        await this.supabase
            .from('detalles_programacion')
            .delete()
            .eq('programacion_id', programacionId)

        // Luego insertar las nuevas
        const detalles = competenciasIds.map(competenciaId => ({
            programacion_id: programacionId,
            competencia_id: competenciaId
        }))

        const { error } = await this.supabase
            .from('detalles_programacion')
            .insert(detalles)

        if (error) throw error
    }

    /**
     * Validar una programación
     */
    async validate(id: string): Promise<ValidationResult> {
        const { data, error } = await this.supabase
            .rpc('validate_programacion', { programacion_id_param: id })

        if (error) throw error
        return data as ValidationResult
    }

    /**
     * Solicitar sugerencias de distribución de competencias usando IA
     */
    async suggestDistribution(
        areaId: string,
        gradoId: string,
        anioEscolar: number
    ): Promise<DistribucionSuggestion> {
        const { data, error } = await this.supabase.functions.invoke(
            'suggest-competencias-distribution',
            {
                body: {
                    area_id: areaId,
                    grado_id: gradoId,
                    anio_escolar: anioEscolar
                }
            }
        )

        if (error) throw error
        return data as DistribucionSuggestion
    }

    /**
     * Cambiar estado de una programación
     */
    async updateStatus(
        id: string,
        status: 'borrador' | 'en_revision' | 'aprobado' | 'archivado'
    ): Promise<Programacion> {
        return this.update(id, { estado: status })
    }
}

// Exportar instancia singleton
export const programacionService = new ProgramacionService()
