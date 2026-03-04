'use client'

import { ValidationError } from '@/types/validation.types'

interface ValidationErrorsDisplayProps {
    errors: ValidationError[]
}

export default function ValidationErrorsDisplay({ errors }: ValidationErrorsDisplayProps) {
    if (errors.length === 0) return null

    const errorsList = errors.filter(e => e.severity === 'error')
    const warningsList = errors.filter(e => e.severity === 'warning')

    return (
        <div className="space-y-4">
            {errorsList.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold mb-2 flex items-center">
                        <span className="mr-2">❌</span>
                        Errores de Validación ({errorsList.length})
                    </h3>
                    <ul className="space-y-2">
                        {errorsList.map((error, idx) => (
                            <li key={idx} className="text-sm text-red-700">
                                <div className="font-medium">{error.message}</div>
                                {error.reference && (
                                    <div className="text-xs text-red-600 mt-1">
                                        📖 {error.reference}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {warningsList.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-yellow-800 font-semibold mb-2 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Advertencias ({warningsList.length})
                    </h3>
                    <ul className="space-y-2">
                        {warningsList.map((error, idx) => (
                            <li key={idx} className="text-sm text-yellow-700">
                                <div className="font-medium">{error.message}</div>
                                {error.reference && (
                                    <div className="text-xs text-yellow-600 mt-1">
                                        📖 {error.reference}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
