// Validation types for the normative engine

export type ValidationStatus = 'pending' | 'valid' | 'invalid'

export type ValidationSeverity = 'error' | 'warning'

export interface ValidationError {
    code: string
    field: string
    message: string
    severity: ValidationSeverity
    reference?: string  // Normative reference (e.g., "R.M. N° 587-2023-MINEDU")
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
    validated_at: string
}
