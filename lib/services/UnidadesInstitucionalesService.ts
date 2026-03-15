import { createClient } from '../supabase/client'

export interface UnidadInstitucional {
  id: string
  institucion_id: string
  grado_id: string | null
  titulo: string
  situacion_significativa: string
  enfoques_transversales: any
  actitudes: any
  orden: number
  created_at?: string
  updated_at?: string
}

export type CreateUnidadInstitucionalInput = Omit<UnidadInstitucional, 'id' | 'created_at' | 'updated_at'>
export type UpdateUnidadInstitucionalInput = Partial<CreateUnidadInstitucionalInput>

export const unidadesInstitucionalesService = {
  async listByInstitucionAndGrado(institucionId: string, gradoId?: string): Promise<UnidadInstitucional[]> {
    const supabase = createClient()
    
    let query = supabase
      .from('unidades_institucionales')
      .select('*')
      .eq('institucion_id', institucionId)
      
    if (gradoId) {
      // Includes units specific to the grade AND units that apply to all grades (grado_id is null)
      query = query.or(`grado_id.eq.${gradoId},grado_id.is.null`)
    }

    // Order by 'orden'
    const { data, error } = await query.order('orden', { ascending: true })

    if (error) {
      console.error('Error fetching unidades_institucionales:', error)
      return []
    }
    
    return data as UnidadInstitucional[]
  },

  async listAllByInstitucion(institucionId: string): Promise<UnidadInstitucional[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('unidades_institucionales')
      .select('*')
      .eq('institucion_id', institucionId)
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error fetching all unidades_institucionales:', error)
      return []
    }
    
    return data as UnidadInstitucional[]
  },

  async create(input: CreateUnidadInstitucionalInput): Promise<UnidadInstitucional | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('unidades_institucionales')
      .insert(input)
      .select()
      .single()

    if (error) {
      console.error('Error creating unidad_institucional:', error)
      throw new Error(error.message || 'No se pudo guardar la unidad institucional.')
    }

    return data
  },

  async update(id: string, input: UpdateUnidadInstitucionalInput): Promise<UnidadInstitucional | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('unidades_institucionales')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating unidad_institucional:', error)
      throw new Error(error.message || 'No se pudo actualizar la unidad institucional.')
    }

    return data
  },

  async delete(id: string): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase
      .from('unidades_institucionales')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting unidad_institucional:', error)
      throw new Error(error.message || 'No se pudo eliminar la unidad institucional.')
    }

    return true
  }
}
