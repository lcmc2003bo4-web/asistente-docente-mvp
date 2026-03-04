'use client'

import { useState } from 'react'
import { pdfService } from '@/lib/services/PdfService'

interface DownloadPdfButtonProps {
    documentId: string
    documentType: 'programacion' | 'unidad' | 'sesion'
    className?: string
    variant?: 'button' | 'link'
}

export default function DownloadPdfButton({
    documentId,
    documentType,
    className = '',
    variant = 'button'
}: DownloadPdfButtonProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDownload = async () => {
        setLoading(true)
        setError(null)

        try {
            if (documentType === 'programacion') {
                await pdfService.downloadProgramacionPDF(documentId)
            } else if (documentType === 'unidad') {
                await pdfService.downloadUnidadPDF(documentId)
            } else {
                await pdfService.downloadSesionPDF(documentId)
            }
        } catch (err: any) {
            setError('Error al generar el PDF. Intente nuevamente.')
            console.error('PDF generation error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (variant === 'link') {
        return (
            <div>
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className={`text-indigo-600 hover:text-indigo-700 text-sm font-medium transition disabled:opacity-50 ${className}`}
                >
                    {loading ? '⏳ Generando...' : '📄 Descargar PDF'}
                </button>
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
        )
    }

    return (
        <div>
            <button
                onClick={handleDownload}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin">⏳</span>
                        <span>Generando PDF...</span>
                    </>
                ) : (
                    <>
                        <span>📄</span>
                        <span>Descargar PDF</span>
                    </>
                )}
            </button>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    )
}
