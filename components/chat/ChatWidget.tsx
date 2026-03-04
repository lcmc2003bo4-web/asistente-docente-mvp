'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatAssistantService, ChatMessage } from '@/lib/services/ChatAssistantService'
import { useRouter } from 'next/navigation'

const INTENT_LABELS: Record<string, string> = {
    SECUENCIA_CURRICULAR: '📅 Secuencia Curricular',
    CONSULTA_NORMATIVA: '📚 Normativa',
    SOPORTE_PLATAFORMA: '💻 Soporte',
    FUERA_DOMINIO: '⚠️ Fuera de dominio',
    DESCONOCIDO: '',
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-4 py-2">
            <span className="block w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="block w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="block w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    )
}

function MessageBubble({ msg, onExport }: { msg: ChatMessage; onExport?: (content: string) => void }) {
    const isUser = msg.role === 'user'
    const hasSequenceProposal = msg.metadata?.has_sequence_proposal === true

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1">
                    <span className="text-sm">🤖</span>
                </div>
            )}
            <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {msg.intent && !isUser && INTENT_LABELS[msg.intent] && (
                    <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-wide px-1">
                        {INTENT_LABELS[msg.intent]}
                    </span>
                )}
                <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${isUser
                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                        }`}
                >
                    {msg.content}
                </div>
                {hasSequenceProposal && onExport && (
                    <button
                        onClick={() => onExport(msg.content)}
                        className="mt-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full transition font-medium"
                    >
                        📤 Exportar al Generador de Sesiones
                    </button>
                )}
            </div>
        </div>
    )
}

export default function ChatWidget() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen, scrollToBottom])

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus()
    }, [isOpen])

    // Add welcome message when first opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: '¡Hola! Soy tu Asistente Curricular. Puedo ayudarte con:\n\n📅 Secuenciación de contenidos por semanas\n📚 Consultas sobre normativa CNEB y MINEDU\n💻 Soporte para usar esta plataforma\n\n¿En qué te puedo orientar hoy?',
            }])
        }
    }, [isOpen, messages.length])

    const handleSend = useCallback(async () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

        const userMsg: ChatMessage = { role: 'user', content: trimmed }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const response = await ChatAssistantService.sendMessage(trimmed, sessionId, messages)

            if (!sessionId) setSessionId(response.session_id)

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.message,
                intent: response.intent,
                metadata: response.metadata,
            }])
        } catch (e: unknown) {
            const err = e as Error
            setError(err?.message ?? 'Error al conectar con el asistente')
        } finally {
            setIsLoading(false)
        }
    }, [input, isLoading, sessionId, messages])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleExport = useCallback((sequenceContent: string) => {
        // Encode context in query params and redirect to new session page
        const encoded = encodeURIComponent(sequenceContent.substring(0, 500))
        router.push(`/dashboard/sesiones/nueva?from_assistant=1&context=${encoded}`)
    }, [router])

    const handleNewChat = () => {
        setMessages([])
        setSessionId(null)
        setError(null)
    }

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                aria-label="Asistente Curricular"
                title="Asistente Curricular"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
                    </svg>
                )}
            </button>

            {/* Notification dot when closed and there are messages */}
            {!isOpen && messages.filter(m => m.role === 'assistant').length > 1 && (
                <span className="fixed bottom-[4.5rem] right-6 z-50 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[70vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <div>
                                <p className="font-semibold text-sm">Asistente Curricular</p>
                                <p className="text-[10px] text-indigo-200">Solo orientación educativa</p>
                            </div>
                        </div>
                        <button
                            onClick={handleNewChat}
                            title="Nueva conversación"
                            className="text-indigo-200 hover:text-white transition text-xs underline px-1"
                        >
                            Nueva
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-1 min-h-[200px]">
                        {messages.map((msg, i) => (
                            <MessageBubble
                                key={msg.id ?? i}
                                msg={msg}
                                onExport={msg.metadata?.has_sequence_proposal ? handleExport : undefined}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                    <span className="text-sm">🤖</span>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
                                ⚠️ {error}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-100 p-3 bg-white">
                        <div className="flex gap-2 items-end">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe tu consulta... (Enter para enviar)"
                                rows={2}
                                maxLength={1000}
                                disabled={isLoading}
                                className="flex-1 resize-none text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent disabled:opacity-50 transition bg-gray-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="flex-shrink-0 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl flex items-center justify-center transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                            Solo responder consultas de dominio educativo · No modifica datos
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
