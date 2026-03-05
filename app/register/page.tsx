'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nombreCompleto, setNombreCompleto] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleGoogleRegister = async () => {
        setGoogleLoading(true)
        setError(null)
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        // La página redirige automáticamente a Google — no se vuelve aquí
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { nombre_completo: nombreCompleto },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setTimeout(() => {
                router.push('/auth/verify-email')
            }, 1000)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* ── Panel izquierdo — Marca ── */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #3730a3 0%, #312e81 50%, #1e1b4b 100%)' }}
            >
                {/* Decoración de fondo */}
                <div className="absolute inset-0 opacity-5" aria-hidden="true">
                    <div className="absolute top-16 left-16 w-64 h-64 rounded-full border-2 border-white" />
                    <div className="absolute bottom-32 right-8 w-96 h-96 rounded-full border border-white" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white" />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">Asistente Normativo Docente</span>
                </div>

                {/* Contenido central */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white leading-tight mb-3">
                            Empieza tu viaje pedagógico
                        </h1>
                        <p className="text-indigo-200 text-base leading-relaxed">
                            Únete a docentes peruanos que ya planifican con inteligencia y cumplen el CNEB sin esfuerzo.
                        </p>
                    </div>

                    <ul className="space-y-4">
                        {[
                            'Configuración en menos de 2 minutos',
                            'Sin costo durante la fase beta',
                            'Datos protegidos, solo tú accedes',
                        ].map(item => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                                <span className="text-indigo-100 text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Badge MINEDU */}
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Alineado con MINEDU 2024
                    </span>
                </div>
            </div>

            {/* ── Panel derecho — Formulario ── */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile: logo */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-indigo-700">Asistente Normativo Docente</span>
                    </div>

                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Crear cuenta</h2>
                        <p className="text-sm text-slate-500 mt-1">Comienza gratis en menos de 2 minutos</p>
                    </div>

                    {/* Éxito */}
                    {success ? (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-medium">¡Cuenta creada! Redirigiendo al dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleRegister} className="space-y-5">
                                {/* Nombre completo */}
                                <div className="space-y-1.5">
                                    <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
                                        Nombre Completo <span className="text-red-500 text-xs">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <input
                                            id="nombre"
                                            type="text"
                                            value={nombreCompleto}
                                            onChange={(e) => setNombreCompleto(e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Prof. Juan Pérez García"
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Correo Electrónico <span className="text-red-500 text-xs">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
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
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Contraseña */}
                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Contraseña <span className="text-red-500 text-xs">*</span>
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
                                            minLength={6}
                                            autoComplete="new-password"
                                            placeholder="Mínimo 6 caracteres"
                                            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
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
                                </div>

                                {/* Error inline */}
                                {error && (
                                    <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                {/* Botón */}
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
                                            Creando cuenta...
                                        </>
                                    ) : 'Crear Cuenta'}
                                </button>
                            </form>

                            {/* Separador + Google */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-white text-slate-400">O usa otra opción</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                disabled={googleLoading || loading}
                                className="w-full flex items-center justify-center gap-3 h-11 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {googleLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                )}
                                {googleLoading ? 'Redirigiendo...' : 'Registrarse con Google'}
                            </button>
                        </>
                    )}

                    <p className="text-center text-sm text-slate-500">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
