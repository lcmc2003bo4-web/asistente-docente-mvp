-- ============================================================
-- Migration: create_chat_tables
-- Purpose: Asistente Curricular - Chat sessions and message logs
-- ============================================================

-- 1. CHAT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.chat_sessions IS 'Groups conversation sessions for the Curricular Assistant. One session per chat window opened.';

-- 2. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    intent TEXT CHECK (intent IN ('SECUENCIA_CURRICULAR', 'CONSULTA_NORMATIVA', 'SOPORTE_PLATAFORMA', 'FUERA_DOMINIO', 'DESCONOCIDO')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.chat_messages IS 'Logs individual messages from the Curricular Assistant chat for analytics.';
COMMENT ON COLUMN public.chat_messages.intent IS 'Intent classified by the AI for the user message.';
COMMENT ON COLUMN public.chat_messages.metadata IS 'Optional structured data, e.g., exported sequence proposal.';

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_intent ON public.chat_messages(intent);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- 4. AUTO-UPDATE updated_at for sessions
CREATE OR REPLACE FUNCTION public.update_chat_session_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.chat_sessions SET updated_at = NOW() WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_chat_session_timestamp ON public.chat_messages;
CREATE TRIGGER trg_update_chat_session_timestamp
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.update_chat_session_timestamp();

-- 5. ROW LEVEL SECURITY
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Sessions: owner-only access
CREATE POLICY "chat_sessions_owner_select" ON public.chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "chat_sessions_owner_insert" ON public.chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_sessions_owner_delete" ON public.chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Messages: accessible if owner of session
CREATE POLICY "chat_messages_owner_select" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions cs
            WHERE cs.id = chat_messages.session_id
              AND cs.user_id = auth.uid()
        )
    );

CREATE POLICY "chat_messages_owner_insert" ON public.chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_sessions cs
            WHERE cs.id = chat_messages.session_id
              AND cs.user_id = auth.uid()
        )
    );
