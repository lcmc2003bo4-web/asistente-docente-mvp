import Link from 'next/link'

export default function VerifyEmailPage() {
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

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-5">
                    {/* Ícono */}
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {/* Texto */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Verifica tu correo</h1>
                        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                            Te hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, ábrelo para activar tu cuenta.
                        </p>
                    </div>

                    {/* Pasos */}
                    <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3">
                        {[
                            { step: '1', text: 'Revisa tu bandeja de entrada' },
                            { step: '2', text: 'Busca el correo de "Asistente Normativo Docente"' },
                            { step: '3', text: 'Haz clic en "Confirmar correo electrónico"' },
                        ].map(item => (
                            <div key={item.step} className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                    {item.step}
                                </span>
                                <span className="text-sm text-slate-700">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Nota de spam */}
                    <p className="text-xs text-slate-400">
                        ¿No lo encuentras? Revisa tu carpeta de{' '}
                        <strong className="text-slate-600">spam o correo no deseado</strong>.
                    </p>

                    {/* Enlace a login */}
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}
