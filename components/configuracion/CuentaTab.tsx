'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'

export function CuentaTab() {
    const { profile, loading } = useUserProfile()
    const router = useRouter()
    const supabase = createClient()
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwords, setPasswords] = useState({ nueva: '', confirmar: '' })
    const [pwdMsg, setPwdMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
    const [savingPwd, setSavingPwd] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.nueva !== passwords.confirmar) {
            setPwdMsg({ type: 'err', text: 'Las contraseñas no coinciden.' })
            return
        }
        if (passwords.nueva.length < 8) {
            setPwdMsg({ type: 'err', text: 'La contraseña debe tener al menos 8 caracteres.' })
            return
        }
        setSavingPwd(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: passwords.nueva })
            if (error) throw error
            setPwdMsg({ type: 'ok', text: 'Contraseña actualizada correctamente.' })
            setPasswords({ nueva: '', confirmar: '' })
            setChangingPassword(false)
        } catch (err: any) {
            setPwdMsg({ type: 'err', text: err.message || 'Error al cambiar la contraseña.' })
        } finally {
            setSavingPwd(false)
        }
    }

    const handleSignOut = async (scope: 'local' | 'global') => {
        setLoggingOut(true)
        await supabase.auth.signOut({ scope })
        router.push('/auth/login')
    }

    if (loading) return <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Email info */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cuenta vinculada</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{profile?.email}</p>
                        <p className="text-xs text-gray-400">Email de acceso — no editable desde aquí</p>
                    </div>
                </div>
            </div>

            {/* Change password */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Contraseña</h3>
                        <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
                    </div>
                    <button
                        onClick={() => { setChangingPassword(!changingPassword); setPwdMsg(null) }}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        {changingPassword ? 'Cancelar' : 'Cambiar'}
                    </button>
                </div>
                {changingPassword && (
                    <form onSubmit={handleChangePassword} className="space-y-3">
                        {pwdMsg && (
                            <div className={`text-sm p-3 rounded-lg ${pwdMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {pwdMsg.text}
                            </div>
                        )}
                        <input
                            type="password"
                            placeholder="Nueva contraseña (mín. 8 caracteres)"
                            value={passwords.nueva}
                            onChange={e => setPasswords({ ...passwords, nueva: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <input
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={passwords.confirmar}
                            onChange={e => setPasswords({ ...passwords, confirmar: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={savingPwd}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {savingPwd ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </form>
                )}
            </div>

            {/* Sign out */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Cerrar sesión</h3>
                <p className="text-sm text-gray-500 mb-4">Sale de la cuenta en este dispositivo o en todos los dispositivos.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleSignOut('local')}
                        disabled={loggingOut}
                        className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Cerrar sesión (este dispositivo)
                    </button>
                    <button
                        onClick={() => handleSignOut('global')}
                        disabled={loggingOut}
                        className="flex-1 px-5 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                    >
                        Cerrar sesión en todos los dispositivos
                    </button>
                </div>
            </div>
        </div>
    )
}
