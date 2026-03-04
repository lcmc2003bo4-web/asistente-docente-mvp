import { createClient } from '@/lib/supabase/client'

export interface ValidationError {
    code: string
    field?: string
    message: string
    severity: 'error' | 'warning'
    reference?: string
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
    warnings: ValidationError[]
    summary?: Record<string, any>
    validated_at?: string
}

export interface CascadeValidationResult {
    programacion: ValidationResult
    unidades: Record<string, ValidationResult>
    sesiones: Record<string, ValidationResult>
    overallValid: boolean
    totalErrors: number
    totalWarnings: number
}

export interface ValidationSummary {
    total_documents: number
    valid: number
    invalid: number
    pending: number
    by_type: {
        programaciones: { valid: number; invalid: number; pending: number; total: number }
        unidades: { valid: number; invalid: number; pending: number; total: number }
        sesiones: { valid: number; invalid: number; pending: number; total: number }
    }
    documents_with_errors: Array<{
        id: string
        titulo: string
        type: 'programacion' | 'unidad' | 'sesion'
        error_count: number
        first_error: string
    }>
}

class ValidationService {
    private supabase = createClient()

    // ============================================================
    // Individual document validation
    // ============================================================

    async validateProgramacion(id: string): Promise<ValidationResult> {
        const { data, error } = await this.supabase
            .rpc('validate_programacion', { programacion_id_param: id })

        if (error) throw error

        const result = data as any
        return {
            valid: result.valid || false,
            errors: (result.errors || []).filter((e: any) => e.severity === 'error'),
            warnings: (result.warnings || result.errors?.filter((e: any) => e.severity === 'warning') || []),
            summary: result.summary,
            validated_at: result.validated_at
        }
    }

    async validateUnidad(id: string): Promise<ValidationResult> {
        const { data, error } = await this.supabase
            .rpc('validate_unidad', { unidad_id_param: id })

        if (error) throw error

        const result = data as any
        return {
            valid: result.valid || false,
            errors: (result.errors || []).filter((e: any) => e.severity === 'error'),
            warnings: (result.errors || []).filter((e: any) => e.severity === 'warning'),
            summary: result.summary,
            validated_at: result.validated_at
        }
    }

    async validateSesion(id: string): Promise<ValidationResult> {
        const { data, error } = await this.supabase
            .rpc('validate_sesion', { sesion_id_param: id })

        if (error) throw error

        const result = data as any
        return {
            valid: result.valid || false,
            errors: (result.errors || []).filter((e: any) => e.severity === 'error'),
            warnings: (result.errors || []).filter((e: any) => e.severity === 'warning'),
            summary: result.summary,
            validated_at: result.validated_at
        }
    }

    // ============================================================
    // Cascade validation (programacion + all unidades + all sesiones)
    // ============================================================

    async validateProgramacionCascade(programacionId: string): Promise<CascadeValidationResult> {
        // 1. Validate programacion
        const progResult = await this.validateProgramacion(programacionId)

        // 2. Get all unidades
        const { data: unidades } = await this.supabase
            .from('unidades')
            .select('id, titulo')
            .eq('programacion_id', programacionId)

        // 3. Validate each unidad
        const unidadesResults: Record<string, ValidationResult> = {}
        for (const unidad of unidades || []) {
            unidadesResults[unidad.id] = await this.validateUnidad(unidad.id)
        }

        // 4. Get all sesiones for these unidades
        const unidadIds = (unidades || []).map(u => u.id)
        const { data: sesiones } = await this.supabase
            .from('sesiones')
            .select('id, titulo')
            .in('unidad_id', unidadIds.length > 0 ? unidadIds : ['00000000-0000-0000-0000-000000000000'])

        // 5. Validate each sesion
        const sesionesResults: Record<string, ValidationResult> = {}
        for (const sesion of sesiones || []) {
            sesionesResults[sesion.id] = await this.validateSesion(sesion.id)
        }

        // 6. Compute totals
        const allResults = [
            progResult,
            ...Object.values(unidadesResults),
            ...Object.values(sesionesResults)
        ]

        const totalErrors = allResults.reduce((sum, r) => sum + r.errors.length, 0)
        const totalWarnings = allResults.reduce((sum, r) => sum + r.warnings.length, 0)
        const overallValid = allResults.every(r => r.valid)

        return {
            programacion: progResult,
            unidades: unidadesResults,
            sesiones: sesionesResults,
            overallValid,
            totalErrors,
            totalWarnings
        }
    }

    // ============================================================
    // Validation summary for dashboard
    // ============================================================

    async getValidationSummary(): Promise<ValidationSummary> {
        const { data: { user } } = await this.supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Fetch all documents with validation status
        const [progData, unidadData, sesionData] = await Promise.all([
            this.supabase
                .from('programaciones')
                .select('id, titulo, validation_status, validation_errors')
                .eq('user_id', user.id),
            this.supabase
                .from('unidades')
                .select('id, titulo, validation_status, validation_errors')
                .eq('user_id', user.id),
            this.supabase
                .from('sesiones')
                .select('id, titulo, validation_status, validation_errors')
                .eq('user_id', user.id)
        ])

        const programaciones = progData.data || []
        const unidades = unidadData.data || []
        const sesiones = sesionData.data || []

        const countByStatus = (docs: any[]) => ({
            valid: docs.filter(d => d.validation_status === 'valid').length,
            invalid: docs.filter(d => d.validation_status === 'invalid').length,
            pending: docs.filter(d => d.validation_status === 'pending' || !d.validation_status).length,
            total: docs.length
        })

        // Collect documents with errors
        const documentsWithErrors: ValidationSummary['documents_with_errors'] = []

        for (const p of programaciones.filter(d => d.validation_status === 'invalid')) {
            const errors = (p.validation_errors || []).filter((e: any) => e.severity === 'error')
            documentsWithErrors.push({
                id: p.id,
                titulo: p.titulo,
                type: 'programacion',
                error_count: errors.length,
                first_error: errors[0]?.message || 'Error desconocido'
            })
        }

        for (const u of unidades.filter(d => d.validation_status === 'invalid')) {
            const errors = (u.validation_errors || []).filter((e: any) => e.severity === 'error')
            documentsWithErrors.push({
                id: u.id,
                titulo: u.titulo,
                type: 'unidad',
                error_count: errors.length,
                first_error: errors[0]?.message || 'Error desconocido'
            })
        }

        for (const s of sesiones.filter(d => d.validation_status === 'invalid')) {
            const errors = (s.validation_errors || []).filter((e: any) => e.severity === 'error')
            documentsWithErrors.push({
                id: s.id,
                titulo: s.titulo,
                type: 'sesion',
                error_count: errors.length,
                first_error: errors[0]?.message || 'Error desconocido'
            })
        }

        const total = programaciones.length + unidades.length + sesiones.length
        const valid = programaciones.filter(d => d.validation_status === 'valid').length +
            unidades.filter(d => d.validation_status === 'valid').length +
            sesiones.filter(d => d.validation_status === 'valid').length
        const invalid = programaciones.filter(d => d.validation_status === 'invalid').length +
            unidades.filter(d => d.validation_status === 'invalid').length +
            sesiones.filter(d => d.validation_status === 'invalid').length

        return {
            total_documents: total,
            valid,
            invalid,
            pending: total - valid - invalid,
            by_type: {
                programaciones: countByStatus(programaciones),
                unidades: countByStatus(unidades),
                sesiones: countByStatus(sesiones)
            },
            documents_with_errors: documentsWithErrors
        }
    }

    // ============================================================
    // Batch validation
    // ============================================================

    async validateBatch(
        ids: string[],
        type: 'programacion' | 'unidad' | 'sesion'
    ): Promise<Record<string, ValidationResult>> {
        const results: Record<string, ValidationResult> = {}

        for (const id of ids) {
            try {
                if (type === 'programacion') {
                    results[id] = await this.validateProgramacion(id)
                } else if (type === 'unidad') {
                    results[id] = await this.validateUnidad(id)
                } else {
                    results[id] = await this.validateSesion(id)
                }
            } catch (err) {
                results[id] = {
                    valid: false,
                    errors: [{ code: 'VALIDATION_ERROR', message: 'Error al validar', severity: 'error' }],
                    warnings: []
                }
            }
        }

        return results
    }
}

export const validationService = new ValidationService()
