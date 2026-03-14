// Service layer for Unidad Didáctica CRUD operations
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Unidad = Database['public']['Tables']['unidades']['Row']
type UnidadInsert = Database['public']['Tables']['unidades']['Insert']
type UnidadUpdate = Database['public']['Tables']['unidades']['Update']

export interface UnidadWithRelations extends Unidad {
    programaciones?: {
        id: string
        titulo: string
        area_id: string
        grado_id: string
        areas?: { nombre: string }
        grados?: { nombre: string }
    }
    detalles_unidad?: Array<{
        desempenos: {
            id: string
            descripcion: string
            capacidad_id: string
            capacidades?: {
                competencia_id: string
                competencias?: {
                    id: string
                    nombre: string
                }
            }
        }
    }>
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
    warnings: ValidationError[]
    summary: {
        total_issues: number
        errors_count: number
        warnings_count: number
        desempenos_selected: number
        desempenos_invalidos: number
        duracion_total: number
        duracion_esperada: number
    }
}

export interface ValidationError {
    code: string
    field?: string
    message: string
    severity: 'error' | 'warning'
    reference?: string
    details?: any
}

export interface DesempenoDisponible {
    competencia_id: string
    competencia_nombre: string
    capacidades: Array<{
        id: string
        nombre: string
        desempenos: Array<{
            id: string
            descripcion: string
        }>
    }>
}


export class UnidadService {
    private supabase = createClient()

    /**
     * Lista todas las unidades de una programación
     */
    async listByProgramacion(programacionId: string): Promise<UnidadWithRelations[]> {
        const { data, error } = await this.supabase
            .from('unidades')
            .select(`
        *,
        detalles_unidad(
          desempenos(
            id,
            descripcion,
            capacidad_id
          )
        )
      `)
            .eq('programacion_id', programacionId)
            .order('orden')

        if (error) throw error
        return data || []
    }

    /**
     * Obtiene una unidad por ID con todas sus relaciones
     */
    async get(id: string): Promise<UnidadWithRelations> {
        const { data, error } = await this.supabase
            .from('unidades')
            .select(`
        *,
        programaciones(
          id,
          titulo,
          area_id,
          grado_id
        ),
        detalles_unidad(
          desempenos(
            id,
            descripcion,
            capacidad_id
          )
        )
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('[UnidadService.get] error code:', error.code)
            console.error('[UnidadService.get] error message:', error.message)
            console.error('[UnidadService.get] error details:', error.details)
            console.error('[UnidadService.get] error hint:', (error as any).hint)
            throw new Error(error.message || error.code || JSON.stringify(error))
        }
        return data
    }

    /**
     * Crea una nueva unidad
     */
    async create(unidad: UnidadInsert): Promise<Unidad> {
        const { data, error } = await this.supabase
            .from('unidades')
            .insert(unidad)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Actualiza una unidad existente
     */
    async update(id: string, updates: UnidadUpdate): Promise<Unidad> {
        const { data, error } = await this.supabase
            .from('unidades')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Elimina una unidad
     */
    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('unidades')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Agrega desempeños a una unidad
     * Reemplaza los desempeños existentes
     */
    async addDesempenos(unidadId: string, desempenosIds: string[]): Promise<void> {
        // Eliminar desempeños existentes
        await this.supabase
            .from('detalles_unidad')
            .delete()
            .eq('unidad_id', unidadId)

        // Insertar nuevos desempeños
        if (desempenosIds.length > 0) {
            const detalles = desempenosIds.map(desempenoId => ({
                unidad_id: unidadId,
                desempeno_id: desempenoId
            }))

            const { error } = await this.supabase
                .from('detalles_unidad')
                .insert(detalles)

            if (error) throw error
        }
    }

    /**
     * Valida una unidad usando la función backend
     */
    async validate(id: string): Promise<ValidationResult> {
        const { data, error } = await this.supabase
            .rpc('validate_unidad', { unidad_id_param: id })

        if (error) throw error

        const result = data as ValidationResult

        // Cambio automático de estado basado en la validez
        await this.supabase
            .from('unidades')
            .update({ estado: result.valid ? 'Validado' : 'Borrador' })
            .eq('id', id)

        return result
    }

    /**
     * Obtiene los desempeños disponibles para una unidad
     * (basados en las competencias de la programación)
     */
    async getAvailableDesempenos(programacionId: string, gradoId: string): Promise<DesempenoDisponible[]> {
        // Obtener competencias de la programación
        const { data: detallesProg, error: errorProg } = await this.supabase
            .from('detalles_programacion')
            .select('competencia_id')
            .eq('programacion_id', programacionId)

        if (errorProg) throw errorProg

        const competenciasIds = detallesProg.map(d => d.competencia_id)

        if (competenciasIds.length === 0) {
            return []
        }

        // Obtener competencias con sus capacidades y desempeños
        const { data: competencias, error: errorComp } = await this.supabase
            .from('competencias')
            .select(`
        id,
        nombre,
        capacidades(
          id,
          nombre,
          desempenos(
            id,
            descripcion,
            grado_id
          )
        )
      `)
            .in('id', competenciasIds)

        if (errorComp) throw errorComp

        // Filtrar desempeños por grado y estructurar respuesta
        const result: DesempenoDisponible[] = (competencias || []).map(comp => ({
            competencia_id: comp.id,
            competencia_nombre: comp.nombre,
            capacidades: (comp.capacidades || []).map(cap => ({
                id: cap.id,
                nombre: cap.nombre,
                desempenos: (cap.desempenos || [])
                    .filter(des => des.grado_id === gradoId)
                    .map(des => ({
                        id: des.id,
                        descripcion: des.descripcion
                    }))
            })).filter(cap => cap.desempenos.length > 0)
        })).filter(comp => comp.capacidades.length > 0)

        return result
    }

}

// Singleton export
export const unidadService = new UnidadService()
