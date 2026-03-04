'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteButton({ programacionId }: { programacionId: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar esta programación? Esta acción no se puede deshacer.')) {
            return
        }

        setDeleting(true)
        try {
            const { error } = await supabase
                .from('programaciones')
                .delete()
                .eq('id', programacionId)

            if (error) throw error

            router.push('/dashboard/programaciones')
            router.refresh()
        } catch (error) {
            console.error('Error deleting programacion:', error)
            alert('Error al eliminar la programación')
            setDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {deleting ? '⏳ Eliminando...' : '🗑️ Eliminar'}
        </button>
    )
}
