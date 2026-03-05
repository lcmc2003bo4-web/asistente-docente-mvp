'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        })

        if (error) {
            setError('Ocurrió un error. Verifica el correo e intenta nuevamente.')
            setLoading(false)
        } else {
            setSent(true)
        }
    }

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
                    {sent ? (
                        /* Estado: email enviado */
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Revisa tu correo</h2>
                                <p className="text-sm text-slate-500 mt-2">
                                    Si existe una cuenta con <span className="font-medium text-slate-700">{email}</span>, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                                </p>
                            </div>
                            <p className="text-xs text-slate-400">
                                ¿No lo recibes? Revisa tu carpeta de spam o{' '}
                                <button
                                    onClick={() => { setSent(false); setEmail('') }}
                                    className="text-indigo-600 hover:underline"
                                >
                                    intenta con otro correo
                                </button>.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        /* Estado: formulario */
                        <>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Recuperar contraseña</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            placeholder="tu@correo.com"
                                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                        />
                                    </div>
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
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 h-11 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : 'Enviar enlace de recuperación'}
                                </button>
                            </form>

                            <p className="text-center text-sm text-slate-500">
                                <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver al inicio de sesión
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
