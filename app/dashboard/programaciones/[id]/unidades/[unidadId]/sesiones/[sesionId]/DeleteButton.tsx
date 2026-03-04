'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function DeleteButton({
    sesionId,
    programacionId,
    unidadId,
}: {
    sesionId: string
    programacionId: string
    unidadId: string
}) {
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar esta sesión? Esta acción no se puede deshacer.')) {
            return
        }

        setDeleting(true)

        try {
            const { error } = await supabase.from('sesiones').delete().eq('id', sesionId)

            if (error) throw error

            router.push(`/dashboard/programaciones/${programacionId}/unidades/${unidadId}/sesiones`)
        } catch (error) {
            console.error('Error deleting sesion:', error)
            alert('Error al eliminar la sesión')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition disabled:opacity-50"
        >
            {deleting ? 'Eliminando...' : '🗑️ Eliminar'}
        </button>
    )
}
