import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

        const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                Authorization: authHeader,
                apikey: supabaseAnonKey,
            },
        });

        if (!authResponse.ok) {
            return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const { area_id, grado_id, anio_escolar } = await req.json()

        // Validar parámetros
        if (!area_id || !grado_id || !anio_escolar) {
            return new Response(
                JSON.stringify({ error: 'Faltan parámetros requeridos: area_id, grado_id, anio_escolar' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Crear cliente Supabase
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Obtener área
        const { data: area } = await supabase
            .from('areas')
            .select('nombre')
            .eq('id', area_id)
            .single()

        // Obtener grado
        const { data: grado } = await supabase
            .from('grados')
            .select('nombre, nivel')
            .eq('id', grado_id)
            .single()

        // Paso 1: Obtener qué competencias tienen desempeños para este grado
        const { data: caps } = await supabase
            .from('desempenos')
            .select('capacidades!inner(competencia_id)')
            .eq('grado_id', grado_id)

        const competenciaIdsReq = [...new Set(
            (caps || []).map((d: any) => d.capacidades?.competencia_id).filter(Boolean)
        )] as string[]

        if (competenciaIdsReq.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No se encontraron competencias con desempeños para este grado' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Paso 2: Obtener competencias del área que aplican al grado
        const { data: competencias } = await supabase
            .from('competencias')
            .select('id, nombre')
            .eq('area_id', area_id)
            .in('id', competenciaIdsReq)
            .order('nombre')

        if (!competencias || competencias.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No se encontraron competencias para esta área y grado' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Llamar a OpenAI para sugerir distribución
        const openAIKey = Deno.env.get('OPENAI_API_KEY')

        if (!openAIKey) {
            // Si no hay API key, devolver distribución simple sin IA
            const periodos = 4 // Bimestral por defecto
            const competenciasPorPeriodo = Math.ceil(competencias.length / periodos)

            const distribucion = []
            for (let i = 0; i < periodos; i++) {
                const inicio = i * competenciasPorPeriodo
                const fin = Math.min((i + 1) * competenciasPorPeriodo, competencias.length)
                const competenciasPeriodo = competencias.slice(inicio, fin)

                distribucion.push({
                    periodo: `Bimestre ${i + 1}`,
                    competencias: competenciasPeriodo.map(c => c.id),
                    competencias_nombres: competenciasPeriodo.map(c => c.nombre),
                    justificacion: 'Distribución equitativa de competencias a lo largo del año escolar'
                })
            }

            return new Response(
                JSON.stringify({
                    distribucion,
                    metadata: {
                        area: area?.nombre,
                        grado: grado?.nombre,
                        nivel: grado?.nivel,
                        anio_escolar,
                        total_competencias: competencias.length,
                        generado_con_ia: false
                    }
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Generar prompt para OpenAI
        const prompt = `Eres un experto en planificación curricular del CNEB (Currículo Nacional de Educación Básica) de Perú.

Tu tarea es sugerir una distribución pedagógicamente coherente de las siguientes competencias del área de "${area?.nombre}" para ${grado?.nivel} - ${grado?.nombre}, durante el año escolar ${anio_escolar}.

Competencias a distribuir:
${competencias.map((c, i) => `${i + 1}. ${c.nombre}`).join('\n')}

Consideraciones pedagógicas:
- Distribuir en 4 bimestres
- Considerar la complejidad progresiva (de lo simple a lo complejo)
- Algunas competencias pueden trabajarse en múltiples bimestres si es pedagógicamente apropiado
- Considerar la articulación entre competencias relacionadas
- Priorizar competencias fundamentales en los primeros bimestres

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "distribucion": [
    {
      "periodo": "Bimestre 1",
      "competencias_ids": ["id1", "id2"],
      "justificacion": "Explicación pedagógica breve (máx 100 caracteres)"
    }
  ]
}

IMPORTANTE: Usa los IDs exactos de las competencias proporcionadas.`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en planificación curricular del CNEB peruano. Respondes únicamente con JSON válido.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
            }),
        })

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`)
        }

        const data = await response.json()
        const aiResponse = data.choices[0].message.content

        // Parsear respuesta de IA
        let suggestion
        try {
            suggestion = JSON.parse(aiResponse)
        } catch (e) {
            // Si falla el parsing, usar distribución simple
            console.error('Error parsing AI response:', e)
            const periodos = 4
            const competenciasPorPeriodo = Math.ceil(competencias.length / periodos)

            const distribucion = []
            for (let i = 0; i < periodos; i++) {
                const inicio = i * competenciasPorPeriodo
                const fin = Math.min((i + 1) * competenciasPorPeriodo, competencias.length)
                const competenciasPeriodo = competencias.slice(inicio, fin)

                distribucion.push({
                    periodo: `Bimestre ${i + 1}`,
                    competencias: competenciasPeriodo.map(c => c.id),
                    competencias_nombres: competenciasPeriodo.map(c => c.nombre),
                    justificacion: 'Distribución equitativa (fallback)'
                })
            }

            suggestion = { distribucion }
        }

        // Enriquecer con nombres de competencias
        const distribucionEnriquecida = suggestion.distribucion.map((periodo: any) => {
            const competenciasIds = periodo.competencias_ids || periodo.competencias || []
            const competenciasNombres = competenciasIds.map((id: string) => {
                const comp = competencias.find(c => c.id === id)
                return comp ? comp.nombre : 'Competencia no encontrada'
            })

            return {
                periodo: periodo.periodo,
                competencias: competenciasIds,
                competencias_nombres: competenciasNombres,
                justificacion: periodo.justificacion || 'Sin justificación'
            }
        })

        return new Response(
            JSON.stringify({
                distribucion: distribucionEnriquecida,
                metadata: {
                    area: area?.nombre,
                    grado: grado?.nombre,
                    nivel: grado?.nivel,
                    anio_escolar,
                    total_competencias: competencias.length,
                    generado_con_ia: true
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
