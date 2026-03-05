import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Gemini API ────────────────────────────────────────────────────────────────
const GEMINI_API_KEY_CHAT = Deno.env.get('GEMINI_API_KEY_CHAT') || ""
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY_CHAT}`

// ─── System Prompts ────────────────────────────────────────────────────────────

const INTENT_ROUTER_PROMPT = `Eres un clasificador de intenciones para un Asistente Curricular de docentes peruanos.
Tu única tarea es clasificar la consulta del usuario en UNA de las siguientes categorías:

- SECUENCIA_CURRICULAR: preguntas sobre cómo organizar, secuenciar o distribuir contenidos curriculares por semanas, unidades o bimestres. Solicitudes de propuestas de planificación semanal o distribución de temas.
- CONSULTA_NORMATIVA: preguntas sobre normativa educativa del MINEDU, CNEB, Resoluciones Ministeriales, enfoques transversales, competencias, capacidades, desempeños, evaluación formativa, políticas educativas peruanas.
- SOPORTE_PLATAFORMA: preguntas sobre cómo usar el sistema o la plataforma (crear programaciones, unidades, sesiones, exportar PDFs, configurar datos, navegar el menú, etc.).
- FUERA_DOMINIO: cualquier consulta que NO esté relacionada con educación, currículum, normativa educativa peruana, o uso de esta plataforma.

Responde ÚNICAMENTE con el nombre de la categoría, sin explicación, sin puntuación adicional.
Ejemplo de respuesta: SECUENCIA_CURRICULAR`

const SECUENCIA_CURRICULAR_PROMPT = `Eres un especialista en planificación curricular del MINEDU – Perú (CNEB).
Tu rol es ayudar al docente a organizar y secuenciar contenidos curriculares de forma semanal o por periodos.

RESTRICCIONES ESTRICTAS:
- NUNCA generes sesiones de aprendizaje completas. Solo propón distribución semanal de temas/contenidos.
- Respuestas estructuradas, máximo 400 palabras.
- Usa la siguiente estructura de respuesta cuando propongas una secuencia:
  📅 PROPUESTA DE SECUENCIA CURRICULAR
  Área/Curso: [...]
  Nivel/Grado: [...]
  Periodo: [...]
  
  | Semana | Tema principal | Competencia/Capacidad | Recursos sugeridos |
  |--------|---------------|----------------------|-------------------|
  | 1 | ... | ... | ... |
  
  💡 Nota: Esta es una propuesta orientadora. Puedes exportarla al Generador de Sesiones para desarrollar cada semana.

- Si el docente no especifica nivel, grado o área, solicita esa información antes de generar la propuesta.
- No respondas preguntas fuera del ámbito curricular.
- Basa todo en el CNEB vigente y las normativas del MINEDU Perú.`

const CONSULTA_NORMATIVA_PROMPT = `Eres un experto en normativa educativa peruana con amplio conocimiento del:
- Currículo Nacional de Educación Básica (CNEB) vigente
- Resoluciones Ministeriales del MINEDU Perú
- Enfoques transversales (Interculturalidad, Igualdad de género, Ambiental, etc.)
- Marco del Buen Desempeño Docente
- Evaluación formativa y sumativa
- Estructura de competencias, capacidades y desempeños por área y nivel

RESTRICCIONES ESTRICTAS:
- Respuestas BREVES y ESTRUCTURADAS. Máximo 250 palabras.
- Usa siempre listas con viñetas o tablas para organizar la información.
- Al final, si es relevante, sugiere: "💡 Sugerencia: Revisa tu planificación actual para verificar que este aspecto normativo esté correctamente aplicado."
- NO generes textos creativos, poemas, cuentos ni contenido fuera de la normativa educativa peruana.
- No respondas preguntas que no sean de normativa o política educativa peruana.
- Cita la normativa específica cuando sea posible (Ej: "Según la R.M. 649-2016-MINEDU, CNEB...").`

const SOPORTE_PLATAFORMA_PROMPT = `Eres el asistente de soporte técnico y de uso de la plataforma "Asistente Normativo Docente" para docentes peruanos.

La plataforma tiene las siguientes secciones accesibles desde el menú lateral:
1. 📊 Dashboard: resumen de actividad, documentos recientes y estadísticas.
2. 📅 Programaciones Anuales: crear y gestionar programaciones curriculares anuales por área y grado.
3. 📖 Unidades Didácticas: crear unidades de aprendizaje con situación significativa, competencias y evaluación.
4. 📝 Sesiones de Aprendizaje: crear sesiones con secuencia didáctica generada por IA (botón "Generar con IA").
5. ✅ Validación Normativa: validar documentos contra la normativa CNEB.
6. ⚙️ Configuración: ajustar datos de perfil e institución educativa.

Flujos más comunes:
- Para crear una sesión: ve a "Sesiones de Aprendizaje" → "Nueva Sesión" → completa el formulario → usa "Generar con IA" para la secuencia.
- Para exportar PDF: abre cualquier sesión o unidad y usa el botón "Exportar PDF" en la esquina superior derecha.
- Para crear una programación: ve a "Programaciones Anuales" → "Nueva Programación".
- Para crear una unidad: entra a una programación → "Nueva Unidad".

RESTRICCIONES:
- Respuestas paso a paso, claras y concisas. Máximo 200 palabras.
- Si no conoces la función exacta, indica: "Esta función puede no estar disponible aún en la versión actual."
- No respondas preguntas fuera del uso de esta plataforma.`

const OUT_OF_DOMAIN_RESPONSE = `Lo siento, solo puedo ayudarte con temas relacionados con:
- 📅 Secuenciación curricular (distribución de contenidos por semanas)
- 📚 Consultas sobre normativa educativa peruana (CNEB, MINEDU)
- 💻 Soporte para el uso de esta plataforma

¿En qué de estos temas puedo orientarte?`

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
    role: 'user' | 'model'
    parts: { text: string }[]
}

// ─── Gemini Chat Call ──────────────────────────────────────────────────────────
async function callGemini(
    systemInstruction: string,
    history: ChatMessage[],
    userMessage: string,
    temperature = 0.5,
    maxOutputTokens = 1024
): Promise<string> {
    const body = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [
            ...history,
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        generationConfig: {
            temperature,
            maxOutputTokens,
        }
    }

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Gemini API Error ${response.status}: ${errText}`)
    }

    const data = await response.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function classifyIntent(userMessage: string): Promise<string> {
    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: INTENT_ROUTER_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 20 }
        }),
    })

    if (!response.ok) return 'DESCONOCIDO'
    const data = await response.json()
    const raw = (data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim().toUpperCase()

    const validIntents = ['SECUENCIA_CURRICULAR', 'CONSULTA_NORMATIVA', 'SOPORTE_PLATAFORMA', 'FUERA_DOMINIO']
    return validIntents.includes(raw) ? raw : 'DESCONOCIDO'
}

function getSystemPromptForIntent(intent: string): string {
    switch (intent) {
        case 'SECUENCIA_CURRICULAR': return SECUENCIA_CURRICULAR_PROMPT
        case 'CONSULTA_NORMATIVA': return CONSULTA_NORMATIVA_PROMPT
        case 'SOPORTE_PLATAFORMA': return SOPORTE_PLATAFORMA_PROMPT
        default: return ''
    }
}

// ─── Main Handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Auth: get user
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const body = await req.json()
        const { message, session_id: existingSessionId, history = [] } = body

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return new Response(JSON.stringify({ error: 'El mensaje no puede estar vacío' }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        console.log(`[chat-assistant] User: ${user.id}, Message: "${message.substring(0, 80)}..."`)

        // ── 1. Get or create chat session ──────────────────────────────────────────
        let sessionId = existingSessionId
        if (!sessionId) {
            const { data: newSession, error: sessionError } = await supabase
                .from('chat_sessions')
                .insert({ user_id: user.id })
                .select('id')
                .single()

            if (sessionError) {
                console.error('Error creating session:', sessionError)
                throw new Error('No se pudo crear la sesión de chat')
            }
            sessionId = newSession.id
        }

        // ── 2. Classify intent ─────────────────────────────────────────────────────
        const intent = await classifyIntent(message)
        console.log(`[chat-assistant] Intent classified: ${intent}`)

        // ── 3. Log user message ────────────────────────────────────────────────────
        await supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: 'user',
            content: message,
            intent,
        })

        // ── 4. Generate response ───────────────────────────────────────────────────
        let assistantContent = ''
        let responseMetadata: Record<string, unknown> = {}

        if (intent === 'FUERA_DOMINIO' || intent === 'DESCONOCIDO') {
            assistantContent = OUT_OF_DOMAIN_RESPONSE
        } else {
            // Build Gemini conversation history from the last N exchanges
            const geminiHistory: ChatMessage[] = (history as Array<{ role: string; content: string }>)
                .slice(-8) // Last 4 exchanges (8 messages) for context
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))

            const systemPrompt = getSystemPromptForIntent(intent)
            assistantContent = await callGemini(systemPrompt, geminiHistory, message, 0.5, 1500)

            // If curricular sequence, flag it for export action in metadata
            if (intent === 'SECUENCIA_CURRICULAR' && assistantContent.includes('PROPUESTA DE SECUENCIA')) {
                responseMetadata = { has_sequence_proposal: true }
            }
        }

        // ── 5. Log assistant response ──────────────────────────────────────────────
        await supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: 'assistant',
            content: assistantContent,
            intent,
            metadata: responseMetadata,
        })

        return new Response(JSON.stringify({
            session_id: sessionId,
            intent,
            message: assistantContent,
            metadata: responseMetadata,
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error: unknown) {
        const err = error as Error
        console.error('[chat-assistant] ERROR:', err)
        return new Response(JSON.stringify({
            error: err?.message ?? 'Error interno del asistente',
        }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
