'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { contextoInstitucionalService } from '@/lib/services/ContextoInstitucionalService'
import type { ContextoInstitucionalPayload, ContextoAulaPayload } from '@/types/database.types'

interface UseContextoInstitucionalResult {
    contextoInstitucional: ContextoInstitucionalPayload | null
    contextoAula: ContextoAulaPayload | null
    isLoading: boolean
    perfilCompletado: boolean
    loadContexto: (institucionId: string, anioEscolar: number, gradoId?: string) => Promise<void>
}

/**
 * Hook para cargar el contexto institucional y de aula que se inyecta
 * en el prompt de generación de Unidades de Aprendizaje.
 */
export function useContextoInstitucional(): UseContextoInstitucionalResult {
    const [contextoInstitucional, setContextoInstitucional] = useState<ContextoInstitucionalPayload | null>(null)
    const [contextoAula, setContextoAula] = useState<ContextoAulaPayload | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const loadContexto = useCallback(async (
        institucionId: string,
        anioEscolar: number,
        gradoId?: string
    ) => {
        if (!institucionId) return
        setIsLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const [perfil, aula] = await Promise.all([
                contextoInstitucionalService.getPerfilCompleto(institucionId),
                contextoInstitucionalService.getContextoAula({
                    userId: user.id,
                    institucionId,
                    anioEscolar,
                    gradoId,
                }),
            ])

            setContextoInstitucional(perfil)
            setContextoAula(aula)
        } catch (err) {
            console.error('[useContextoInstitucional] Error cargando contexto:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        contextoInstitucional,
        contextoAula,
        isLoading,
        perfilCompletado: !!contextoInstitucional,
        loadContexto,
    }
}
