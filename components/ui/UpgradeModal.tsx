'use client'

import { useState } from 'react'

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    reason?: string
}

const PRO_FEATURES = [
    { icon: '📋', text: 'Programaciones anuales ilimitadas' },
    { icon: '📚', text: 'Unidades didácticas ilimitadas' },
    { icon: '📝', text: 'Sesiones de aprendizaje ilimitadas' },
    { icon: '✨', text: '200 generaciones de IA por mes' },
    { icon: '📄', text: 'Exportación PDF sin marca de agua' },
    { icon: '🎯', text: 'Soporte prioritario' },
]

const CONTACT = {
    name: 'Franco Martinez',
    phone: '949562736',
    whatsapp: `https://wa.me/51949562736?text=${encodeURIComponent('Hola Franco, me interesa el Plan PRO del Asistente Normativo Docente 🎓')}`,
}

// Ícono de cerrar inline
const XIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

// Ícono de flecha atrás
const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 5 5 12 12 19" />
    </svg>
)

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
    const [showContact, setShowContact] = useState(false)

    if (!isOpen) return null

    const handleClose = () => {
        setShowContact(false)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={showContact ? 'Datos de contacto' : 'Mejora tu plan'}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Card */}
            <div
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Gradient header band */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    aria-label="Cerrar"
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
                >
                    <XIcon />
                </button>

                {/* ── VISTA 1: Plan PRO ── */}
                {!showContact && (
                    <div className="px-6 py-5">
                        {/* Icon + Title */}
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-3">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Mejora al Plan PRO</h2>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                {reason ?? 'Has alcanzado el límite de tu plan gratuito.'}
                            </p>
                        </div>

                        {/* Feature list */}
                        <ul className="space-y-2 mb-5">
                            {PRO_FEATURES.map(feat => (
                                <li key={feat.text} className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-base">
                                        {feat.icon}
                                    </div>
                                    <span>{feat.text}</span>
                                    <svg className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </li>
                            ))}
                        </ul>

                        {/* Price hint */}
                        <div className="bg-indigo-50 rounded-xl px-4 py-3 mb-5 space-y-2">
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="text-2xl font-black text-indigo-700">S/. 50</span>
                                    <span className="text-xs text-indigo-500 ml-1">/ mes</span>
                                </div>
                                <div className="text-[11px] text-indigo-400 ml-auto">Acceso completo</div>
                            </div>
                            <div className="border-t border-indigo-100 pt-2 flex items-center gap-2">
                                <div>
                                    <span className="text-lg font-black text-violet-700">S/. 300</span>
                                    <span className="text-xs text-violet-500 ml-1">/ año</span>
                                </div>
                                <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                    Ahorra S/. 300
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowContact(true)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md shadow-indigo-200"
                            >
                                Contactar para mejorar a PRO
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-1.5"
                            >
                                Continuar con plan gratuito →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── VISTA 2: Datos de Contacto ── */}
                {showContact && (
                    <div className="px-6 py-5">
                        {/* Back button */}
                        <button
                            onClick={() => setShowContact(false)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-4"
                        >
                            <ArrowLeftIcon />
                            Volver
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-emerald-200 mb-3">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">¡Hablemos!</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Contáctame directamente para activar tu plan PRO hoy.
                            </p>
                        </div>

                        {/* Contact card */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-5">
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    FM
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{CONTACT.name}</p>
                                    <p className="text-xs text-slate-500">Administrador del Asistente Docente</p>
                                </div>
                            </div>

                            {/* Phone number row */}
                            <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2.5">
                                <span className="text-lg">📱</span>
                                <span className="text-sm font-mono font-semibold text-slate-700 flex-1">
                                    {CONTACT.phone}
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(CONTACT.phone)}
                                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                    title="Copiar número"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href={CONTACT.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition-colors shadow-md shadow-green-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.065.524 4.013 1.441 5.713L0 24l6.476-1.408A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.84 0-3.564-.469-5.063-1.289l-.362-.21-3.83.832.848-3.742-.223-.375A9.954 9.954 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                            Escribir por WhatsApp
                        </a>

                        <p className="text-center text-[11px] text-slate-400 mt-3">
                            Te responderemos en menos de 24 horas 🕐
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
