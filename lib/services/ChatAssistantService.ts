// lib/services/ChatAssistantService.ts
'use client'

import { createClient } from '@/lib/supabase/client'

export interface ChatMessage {
    id?: string
    role: 'user' | 'assistant'
    content: string
    intent?: string
    metadata?: {
        has_sequence_proposal?: boolean
        [key: string]: unknown
    }
    created_at?: string
}

export interface ChatResponse {
    session_id: string
    intent: string
    message: string
    metadata: Record<string, unknown>
}

export class ChatAssistantService {
    private static FUNCTION_NAME = 'chat-assistant'

    static async sendMessage(
        message: string,
        sessionId: string | null,
        history: ChatMessage[],
    ): Promise<ChatResponse> {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) throw new Error('No autenticado')

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        const response = await fetch(
            `${supabaseUrl}/functions/v1/${this.FUNCTION_NAME}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                    'apikey': anonKey!,
                },
                body: JSON.stringify({
                    message,
                    session_id: sessionId,
                    history: history.slice(-8).map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            }
        )

        if (!response.ok) {
            const err = await response.json().catch(() => ({}))
            throw new Error(err?.error ?? `Error HTTP ${response.status}`)
        }

        return response.json()
    }
}
