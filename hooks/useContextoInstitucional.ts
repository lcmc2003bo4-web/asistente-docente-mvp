'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { contextoInstitucionalService } from '@/lib/services/ContextoInstitucionalService'
import type { ContextoInstitucionalPayload, ContextoAulaPayload } from '@/types/database.types'

const TIPOS_PRIVADOS = ['Privada', 'Parroquial', 'Fe y Alegría']

interface UseContextoInstitucionalResult {
    contextoInstitucional: ContextoInstitucionalPayload | null
    contextoAula: ContextoAulaPayload | null
    isLoading: boolean
    perfilCompletado: boolean
    /** Tipo de gestión de la institución cargada ('Pública', 'Privada', etc.) */
    tipoGestion: string | null
    /** true si la institución es Privada, Parroquial o Fe y Alegría */
    isPrivado: boolean
    loadContexto: (institucionId: string, anioEscolar: number, gradoId?: string) => Promise<void>
}

/**
 * Hook para cargar el contexto institucional y de aula que se inyecta
 * en el prompt de generación de Unidades de Aprendizaje.
 * 
 * También expone `tipoGestion` e `isPrivado` para que los componentes
 * adapten el flujo según el tipo de institución.
 */
export function useContextoInstitucional(): UseContextoInstitucionalResult {
    const [contextoInstitucional, setContextoInstitucional] = useState<ContextoInstitucionalPayload | null>(null)
    const [contextoAula, setContextoAula] = useState<ContextoAulaPayload | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tipoGestion, setTipoGestion] = useState<string | null>(null)

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

            // Intentar tipo_gestion desde el perfil (puede ser null si el perfil está incompleto)
            if (perfil?.tipo_gestion) {
                setTipoGestion(perfil.tipo_gestion)
            } else {
                // Fallback: consultar directamente la BD (el perfil puede no estar completo aún)
                const { data: inst } = await supabase
                    .from('instituciones')
                    .select('tipo_gestion')
                    .eq('id', institucionId)
                    .maybeSingle()
                
                // Intentar también en instituciones_globales si no se encontró
                if (inst?.tipo_gestion) {
                    setTipoGestion(inst.tipo_gestion)
                } else {
                    const { data: global } = await supabase
                        .from('instituciones_globales')
                        .select('tipo_gestion')
                        .eq('id', institucionId)
                        .maybeSingle()
                    setTipoGestion((global as any)?.tipo_gestion ?? null)
                }
            }
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
        tipoGestion,
        isPrivado: tipoGestion ? TIPOS_PRIVADOS.includes(tipoGestion) : false,
        loadContexto,
    }
}
