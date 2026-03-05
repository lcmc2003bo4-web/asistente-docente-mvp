'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.')
            return
        }
        if (password !== confirm) {
            setError('Las contraseñas no coinciden.')
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError('No se pudo actualizar la contraseña. El enlace puede haber expirado.')
            setLoading(false)
        } else {
            setDone(true)
            setTimeout(() => router.push('/dashboard'), 3000)
        }
    }

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-indigo-700">Asistente Normativo Docente</span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                    {done ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">¡Contraseña actualizada!</h2>
                                <p className="text-sm text-slate-500 mt-2">
                                    Tu contraseña se cambió exitosamente. Serás redirigido al dashboard en unos segundos...
                                </p>
                            </div>
                            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                                Ir al dashboard ahora
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Nueva contraseña</h1>
                                <p className="text-sm text-slate-500 mt-1">Elige una contraseña segura para tu cuenta.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Nueva contraseña */}
                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            placeholder="Mínimo 8 caracteres"
                                            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(p => !p)}
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {/* Indicador de fuerza */}
                                    {password.length > 0 && (
                                        <div className="flex gap-1 mt-1.5" aria-label={`Fuerza de contraseña: ${strength === 1 ? 'débil' : strength === 2 ? 'moderada' : 'fuerte'}`}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? (strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-yellow-400' : 'bg-green-500') : 'bg-slate-200'}`} />
                                            ))}
                                            <span className="text-xs text-slate-500 ml-1">{strength === 1 ? 'Débil' : strength === 2 ? 'Moderada' : 'Fuerte'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="space-y-1.5">
                                    <label htmlFor="confirm" className="text-sm font-medium text-slate-700">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        id="confirm"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        required
                                        placeholder="Repite la contraseña"
                                        className={`w-full px-4 py-2.5 border rounded-xl text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${confirm && password !== confirm ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                    />
                                    {confirm && password !== confirm && (
                                        <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                                    )}
                                </div>

                                {error && (
                                    <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || (confirm.length > 0 && password !== confirm)}
                                    className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Actualizando...
                                        </>
                                    ) : 'Actualizar contraseña'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
