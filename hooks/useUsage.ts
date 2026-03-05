'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUserUsage, UserUsage } from '@/lib/services/UsageService'

interface UseUsageReturn {
    usage: UserUsage | null
    loading: boolean
    error: string | null
    refresh: () => Promise<void>
    isPro: boolean
}

/**
 * Hook to get and refresh the current user's usage stats.
 * Automatically fetches on mount.
 */
export function useUsage(): UseUsageReturn {
    const [usage, setUsage] = useState<UserUsage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getUserUsage()
            setUsage(data)
        } catch (err: any) {
            setError(err.message ?? 'No se pudo obtener el uso')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refresh()

        // Escuchar eventos globales de actualización
        const handleUsageUpdated = () => refresh()
        window.addEventListener('usageUpdated', handleUsageUpdated)
        return () => window.removeEventListener('usageUpdated', handleUsageUpdated)
    }, [refresh])

    return {
        usage,
        loading,
        error,
        refresh,
        isPro: usage?.plan_tier === 'pro',
    }
}
