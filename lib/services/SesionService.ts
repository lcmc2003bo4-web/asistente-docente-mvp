import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Sesion = Database['public']['Tables']['sesiones']['Row']
type Secuencia = Database['public']['Tables']['secuencias_sesion']['Row']
type Desempeno = Database['public']['Tables']['desempenos']['Row']

export interface SesionWithRelations extends Sesion {
    unidades?: {
        id: string
        titulo: string
        programaciones?: {
            id: string
            titulo: string
            areas?: { nombre: string }
            grados?: { nombre: string; nivel: string }
        }
    }
    detalles_sesion?: Array<{
        desempenos: Desempeno & {
            competencias?: {
                id: string
                nombre: string
            }
        }
    }>
    secuencias_sesion?: Secuencia[]
    contenido_ia?: any
}

export interface ValidationResult {
    valid: boolean
    errors: Array<{
        code: string
        field?: string
        message: string
        severity: 'error' | 'warning'
        reference?: string
    }>
    warnings: Array<{
        code: string
        field?: string
        message: string
        severity: 'warning'
    }>
    summary?: {
        total_issues: number
        errors_count: number
        warnings_count: number
        desempenos_selected: number
        secuencias_count: number
        tiempo_total: number
        tiempo_esperado: number
        has_inicio: boolean
        has_desarrollo: boolean
        has_cierre: boolean
    }
}

export interface DesempenoDisponible {
    id: string
    descripcion: string
    competencia_id: string
    competencia_nombre: string
}

export interface SecuenciaData {
    momento: 'Inicio' | 'Desarrollo' | 'Cierre'
    actividad: string
    tiempo_minutos: number
    recursos?: string
    orden: number
}

class SesionService {
    private supabase = createClient()

    /**
     * Lista sesiones de una unidad específica
     */
    async listByUnidad(unidadId: string): Promise<SesionWithRelations[]> {
        const { data, error } = await this.supabase
            .from('sesiones')
            .select(`
        *,
        unidades(
          id,
          titulo,
          programaciones(id, titulo, areas(nombre), grados(nombre, nivel))
        ),
        detalles_sesion(
          desempenos(
            id,
            descripcion,
            capacidad_id,
            grado_id,
            codigo,
            created_at,
            competencias:capacidades(id, nombre)
          )
        ),
        secuencias_sesion(*)
      `)
            .eq('unidad_id', unidadId)
            .order('orden', { ascending: true })

        if (error) throw error
        return data as SesionWithRelations[]
    }

    /**
     * Obtiene una sesión por ID con todas sus relaciones
     */
    async get(id: string): Promise<SesionWithRelations> {
        const { data, error } = await this.supabase
            .from('sesiones')
            .select(`
        *,
        unidades(
          id,
          titulo,
          programaciones(id, titulo, areas(nombre), grados(nombre, nivel))
        ),
        detalles_sesion(
          desempenos(
            id,
            descripcion,
            capacidad_id,
            grado_id,
            codigo,
            created_at,
            competencias:capacidades(id, nombre)
          )
        ),
        secuencias_sesion(*)
      `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data as SesionWithRelations
    }

    /**
     * Crea una nueva sesión
     */
    async create(sesion: Database['public']['Tables']['sesiones']['Insert']): Promise<Sesion> {
        const { data, error } = await this.supabase
            .from('sesiones')
            .insert(sesion)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Crea múltiples sesiones en lote
     */
    async createMany(sesiones: Database['public']['Tables']['sesiones']['Insert'][]): Promise<Sesion[]> {
        const { data, error } = await this.supabase
            .from('sesiones')
            .insert(sesiones)
            .select()

        if (error) throw error
        return data
    }

    /**
     * Actualiza una sesión existente
     */
    async update(id: string, sesion: Partial<Sesion>): Promise<Sesion> {
        const { data, error } = await this.supabase
            .from('sesiones')
            .update(sesion)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Elimina una sesión
     */
    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('sesiones')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Agrega desempeños a una sesión (reemplaza los existentes)
     */
    async addDesempenos(sesionId: string, desempenosIds: string[]): Promise<void> {
        // Eliminar desempeños existentes
        await this.supabase
            .from('detalles_sesion')
            .delete()
            .eq('sesion_id', sesionId)

        // Agregar nuevos desempeños
        if (desempenosIds.length > 0) {
            const detalles = desempenosIds.map(desempenoId => ({
                sesion_id: sesionId,
                desempeno_id: desempenoId
            }))

            const { error } = await this.supabase
                .from('detalles_sesion')
                .insert(detalles)

            if (error) throw error
        }
    }

    /**
     * Valida una sesión usando la función backend
     */
    async validate(sesionId: string): Promise<ValidationResult> {
        const { data, error } = await this.supabase
            .rpc('validate_sesion', { sesion_id_param: sesionId })

        if (error) throw error

        // Parsear resultado
        const result = data as any
        const validationResult: ValidationResult = {
            valid: result.valid || false,
            errors: (result.errors || []).filter((e: any) => e.severity === 'error'),
            warnings: (result.errors || []).filter((e: any) => e.severity === 'warning'),
            summary: result.summary
        }

        // Cambio automático de estado basado en la validez
        await this.supabase
            .from('sesiones')
            .update({
                estado: validationResult.valid ? 'Validado' : 'Borrador',
                validation_status: validationResult.valid ? 'valid' : 'invalid'
            })
            .eq('id', sesionId)

        return validationResult
    }

    /**
     * Obtiene los desempeños disponibles de la unidad padre
     * Usa consultas planas para evitar problemas con joins anidados en PostgREST
     */
    async getAvailableDesempenos(unidadId: string): Promise<DesempenoDisponible[]> {
        // 1. Obtener desempeños de la unidad (flat)
        const { data: detalles, error } = await this.supabase
            .from('detalles_unidad')
            .select('desempenos(id, descripcion, capacidad_id)')
            .eq('unidad_id', unidadId)

        if (error) {
            console.error('[SesionService.getAvailableDesempenos] error:', error.message)
            throw new Error(error.message || error.code)
        }

        const desempenos = (detalles || [])
            .map((d: any) => d.desempenos)
            .filter(Boolean)

        if (desempenos.length === 0) return []

        // 2. Obtener capacidades para esos desempeños (para conseguir competencia_id)
        const capacidadIds = [...new Set(desempenos.map((d: any) => d.capacidad_id).filter(Boolean))]

        const { data: capacidades } = await this.supabase
            .from('capacidades')
            .select('id, competencia_id, competencias(id, nombre)')
            .in('id', capacidadIds)

        // 3. Construir mapas locales
        const capMap: Record<string, { competencia_id: string; competencia_nombre: string }> = {}
            ; (capacidades || []).forEach((cap: any) => {
                capMap[cap.id] = {
                    competencia_id: cap.competencia_id,
                    competencia_nombre: cap.competencias?.nombre || ''
                }
            })

        // 4. Enriquecer desempeños
        return desempenos.map((d: any) => ({
            id: d.id,
            descripcion: d.descripcion,
            competencia_id: capMap[d.capacidad_id]?.competencia_id || '',
            competencia_nombre: capMap[d.capacidad_id]?.competencia_nombre || ''
        }))
    }

    /**
     * Agrega una secuencia didáctica a la sesión
     */
    async addSecuencia(sesionId: string, secuencia: SecuenciaData): Promise<Secuencia> {
        const { data, error } = await this.supabase
            .from('secuencias_sesion')
            .insert({
                sesion_id: sesionId,
                ...secuencia
            })
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Actualiza una secuencia existente
     */
    async updateSecuencia(id: string, secuencia: Partial<SecuenciaData>): Promise<Secuencia> {
        const { data, error } = await this.supabase
            .from('secuencias_sesion')
            .update(secuencia)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Elimina una secuencia
     */
    async deleteSecuencia(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('secuencias_sesion')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Reordena las secuencias de una sesión
     */
    async reorderSecuencias(sesionId: string, secuenciasOrder: Array<{ id: string, orden: number }>): Promise<void> {
        // Actualizar orden de cada secuencia
        const updates = secuenciasOrder.map(({ id, orden }) =>
            this.supabase
                .from('secuencias_sesion')
                .update({ orden })
                .eq('id', id)
        )

        await Promise.all(updates)
    }

    /**
     * Obtiene las secuencias de una sesión ordenadas
     */
    async getSecuencias(sesionId: string): Promise<Secuencia[]> {
        const { data, error } = await this.supabase
            .from('secuencias_sesion')
            .select('*')
            .eq('sesion_id', sesionId)
            .order('orden', { ascending: true })

        if (error) throw error
        return data
    }
}

// Singleton export
export const sesionService = new SesionService()
export default SesionService
