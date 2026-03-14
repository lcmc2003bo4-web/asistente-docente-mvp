import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generarSecuenciaFallback(params: {
  titulo_sesion: string
  proposito_aprendizaje: string
  desempenos?: string[]
  area_nombre: string
  grado_nombre: string
  nivel?: string
  duracion_minutos?: number
}) {
  const total = params.duracion_minutos ?? 90
  const inicioMin = Math.round(total * 0.20)
  const desarrolloMin = Math.round(total * 0.60)
  const cierreMin = total - inicioMin - desarrolloMin

  return {
    aspectos_curriculares: {
      capacidades: ["Capacidad genérica en base al área."],
      conocimientos: [`Conceptos sobre ${params.titulo_sesion}`],
      actitudes: ["Participación activa e interés."],
      aprendizaje_esperado: params.proposito_aprendizaje
    },
    secuencia_didactica: [
      {
        fase: 'Inicio',
        tiempo_total: inicioMin,
        actividades: [
          { titulo: "Motivación", descripcion: "Activación de saberes previos.", tiempo_sugerido: "5 min" },
          { titulo: "Propósito", descripcion: `Presentar el propósito: "${params.proposito_aprendizaje}".`, tiempo_sugerido: "5 min" }
        ],
        recursos: ['Pizarra', 'Plumones']
      },
      {
        fase: 'Desarrollo',
        tiempo_total: desarrolloMin,
        actividades: [
          { titulo: "Construcción", descripcion: `Exploración del tema: "${params.titulo_sesion}".`, tiempo_sugerido: `${Math.round(desarrolloMin / 2)} min` },
          { titulo: "Aplicación", descripcion: "Resolución de ejercicios prácticos.", tiempo_sugerido: `${Math.round(desarrolloMin / 2)} min` }
        ],
        recursos: ['Libro de texto', 'Fichas de trabajo']
      },
      {
        fase: 'Cierre',
        tiempo_total: cierreMin,
        actividades: [
          { titulo: "Metacognición", descripcion: "¿Qué aprendimos hoy y cómo lo aprendimos?", tiempo_sugerido: "10 min" }
        ],
        recursos: ['Ficha de metacognición']
      }
    ],
    evaluacion: {
      aprendizajes: [
        {
          criterio: params.desempenos?.[0] || "Comprende los conceptos tratados.",
          indicadores: ["Identifica elementos clave."],
          instrumento: "Lista de cotejo"
        }
      ],
      actitudes: [
        {
          criterio: "Participación y esfuerzo",
          indicadores: ["Muestra interés en la sesión."],
          instrumento: "Guía de observación"
        }
      ],
      rubrica: {
        aspectos: ["Comprensión"],
        niveles: {
          sobresaliente: ["Comprende detalladamente el concepto"],
          satisfactorio: ["Comprende el concepto principal"],
          en_proceso: ["Comprende parcialmente usando ayuda"],
          inicio: ["No comprende el concepto"]
        }
      }
    },
    generado_con_ia: false,
  }
}

Deno.serve(async (req: Request) => {
  // CORS preflight
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

    const params = await req.json()
    const {
      // Contexto Sesion
      titulo_sesion,
      desempenos,
      experiencia_aprendizaje,

      // Contexto Unidad (Herencia)
      unidad_titulo,
      situacion_significativa,
      matriz_ia, // { competencia, capacidades, desempenos_contextualizados }
      enfoques_transversales, // array de objetos

      // Contexto de Programación
      area_nombre,
      grado_nombre,
      nivel = '',

      // Inputs del Usuario
      duracion_minutos = 90,
      recursos_extra = '',
      contexto_extra = ''
    } = params

    // Validación básica
    if (!titulo_sesion || !unidad_titulo || !area_nombre || !grado_nombre) {
      return new Response(
        JSON.stringify({ error: 'Faltan parámetros requeridos para estructurar la sesión' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiKey = Deno.env.get('GEMINI_API_KEY') || ""
    console.log('--- Nueva petición de generación ---')
    console.log('Contexto:', { titulo_sesion, unidad_titulo, area_nombre, duracion_minutos })

    // ── Sin API key → fallback ─────────────────────────────────────────────
    if (!geminiKey) {
      console.log('No GEMINI_API_KEY found, using template fallback')
      const fallback = generarSecuenciaFallback({
        titulo_sesion, proposito_aprendizaje: desempenos || titulo_sesion, desempenos: [desempenos || ''],
        area_nombre, grado_nombre, nivel, duracion_minutos
      })
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ── Con Gemini API ─────────────────────────────────────────────────────
    const inicioMin = Math.round(duracion_minutos * 0.20)
    const desarrolloMin = Math.round(duracion_minutos * 0.65)
    const cierreMin = duracion_minutos - inicioMin - desarrolloMin

    const prompt = `🧠 ROL DEL AGENTE

Actúa como especialista en planificación curricular del MINEDU – Perú, experto en:
- Currículo Nacional de Educación Básica (CNEB)
- Enfoque por competencias
- Evaluación formativa
- Secuencia didáctica estructurada
- Diversificación curricular
- Atención a la diversidad

No generes contenido genérico.
No reutilices estructuras intercambiables.
No improvises fuera de normativa vigente.

Tu producción debe ser técnicamente sólida, coherente y aplicable en aula real.

📚 FUENTES OBLIGATORIAS DE REFERENCIA
Debes basarte rigurosamente en:
- Investigación normativa previamente realizada.
- Documento: “CONVERSACIÓN CON GEMINI - SESIÓN DE APRENDIZAJE - RESULTADO ESPERADO”
- Plantillas oficiales compartidas en carpeta PLANTILLAS.

La estructura final debe respetar la distribución lógica de esas plantillas: Aspectos Curriculares, Secuencia Didáctica y Evaluación.

📌 DATOS DE ENTRADA
- Área: ${area_nombre}
- Grado: ${grado_nombre}${nivel ? ` (${nivel})` : ''}
- Título de la sesión: "${titulo_sesion}"
- Unidad asociada: "${unidad_titulo}"
- Situación Significativa: "${situacion_significativa || 'No provista'}"
- Duración: ${duracion_minutos} minutos
- Competencia y Capacidades heredadas: ${matriz_ia?.competencia || 'No provista'} / ${Array.isArray(matriz_ia?.capacidades) ? matriz_ia.capacidades.join(', ') : 'No provistas'}
- Desempeños a trabajar: "${desempenos || 'Deducir del título'}"
- Enfoques Transversales heredados: ${Array.isArray(enfoques_transversales) ? JSON.stringify(enfoques_transversales) : 'No provistos'}
- Recursos extra: "${recursos_extra}"
- Contexto extra: "${contexto_extra}"

🎯 REGLA DE DIVERSIFICACIÓN UNIVERSAL:
La profundidad pedagógica, el rigor disciplinar y el vocabulario DEBEN ADAPTARSE ESTRICTAMENTE al nivel de complejidad que exige el "${grado_nombre} de ${nivel || 'Educación Básica'}" para el área de "${area_nombre}". SIN EMBARGO, esta adaptación de complejidad NO TE EXIME de cumplir las reglas de formato físico. Debes ser capaz de sintetizar conceptos altamente complejos para encuadrar tu respuesta dentro de los límites físicos (líneas/párrafos) que se exigen a continuación.
🎯 REGLAS DE FORMATO Y ESTRUCTURA OBLIGATORIAS:
- NO uses formato Markdown (como **negritas** o *cursivas*) dentro de las descripciones o títulos. Usa texto plano limpio.
- REGLA DE EXTENSIÓN (Secuencia): DEBES LOGRAR UN EQUILIBRIO PERFECTO: alta calidad pedagógica que llene exactamente UNA hoja A4 completa sin desbordarse. Para lograrlo: Sé muy preciso en "Inicio" y "Cierre" (1 a 2 actividades breves, 2-3 líneas). ENFÓCATE en "Desarrollo", creando de 3 a 5 actividades sustanciales, cada una con un párrafo robusto (3 a 5 oraciones ricas en detalle metodológico, uso de materiales y dinámicas estudiantiles). Calcula el volumen total para que no exceda el espacio físico de una sola página impresa.
- REGLA DE EXTENSIÓN (Aspectos Curriculares): Debes llenar la tabla inicial de forma profesional. Genera EXACTAMENTE:
  1. 4 a 5 "Capacidades" específicas alineadas a la sesión.
  2. 4 a 5 "Conocimientos" (temas/conceptos) bien detallados.
  3. 3 a 4 "Actitudes" relevantes (enfoques transversales o del área).
- REGLA DE EXTENSIÓN (Aprendizaje Esperado): El "aprendizaje_esperado" debe ser un párrafo integrador (4-6 líneas) que explique claramente el qué, el cómo y el para qué.
- REGLA DE EXTENSIÓN (Evaluación): Tu objetivo es que la sección III sea detallada e integral, pero que TODO su contenido encaje matemáticamente en UNA SOLA HOJA estructurada en 3 tablas.
  1. Genera EXACTAMENTE 2 "Criterios de Evaluación" del aprendizaje.
  2. Genera EXACTAMENTE 2 "Indicadores" detallados por criterio (pueden ser oraciones completas de 1 a 2 líneas para asegurar claridad evaluativa).
  3. En la Rúbrica, proporciona EXACTAMENTE 2 "Aspectos a Evaluar" en base a los criterios. Las descripciones de cada nivel (Sobresaliente, etc.) deben ser claras, redactadas en forma de oración completa, pero con una longitud máxima de 2 o 3 líneas, sin extenderse innecesariamente.
  4. Genera de 1 a 2 "Actitudes", con 1 o 2 indicadores observables.

🎯 REGLA ESTRICTA DE ENLACES (BIBLIOGRAFÍA):
- En la sección "bibliografia", como no posees un buscador en vivo para validar IDs de videos, ESTÁ TOTALMENTE PROHIBIDO inventar o adivinar URLs directas (watch?v=...).
- OBLIGATORIAMENTE DEBES generar enlaces de resultados de búsqueda en YouTube sumamente precisos.
- Formato a usar: "https://www.youtube.com/results?search_query=terminos+de+busqueda+precisos"
- Propón como máximo 2 a 3 enlaces muy bien curados en sus términos de búsqueda.

🎯 OBJETIVO DE LA GENERACIÓN
Construir una sesión de aprendizaje profesional, coherente con la unidad, con alineación vertical completa:
Competencia → Capacidad → Desempeño → Propósito → Actividades → Evidencia → Evaluación
Si se rompe la coherencia, regenerar.

🏗 ESTRUCTURA OBLIGATORIA DEL JSON ESPERADO
Deberás retornar estrictamente la siguiente estructura JSON (sin usar bloques Markdown de código \`\`\`json):
{
  "aspectos_curriculares": {
    "capacidades": [
      "Extraer capacidades específicas relativas a la sesión"
    ],
      "conocimientos": [
        "Conceptos clave que se aprenderán"
      ],
        "actitudes": [
          "Actitudes ante el área que se fomentarán"
        ],
          "aprendizaje_esperado": "Resumen profundamente descriptivo y largo de lo que el estudiante logrará y cómo lo demostrará bajo el enfoque de proyectos/competencias..."
  },
  "secuencia_didactica": [
    {
      "fase": "Inicio",
      "tiempo_total": ${inicioMin},
    "actividades": [
      {
        "titulo": "Motivación y Saberes Previos",
        "descripcion": "Descripción concisa de la motivación...",
        "tiempo_sugerido": "15 min"
      }
    ],
    "recursos": [
      "Pizarra", "Proyector"
    ]
    },
{
  "fase": "Desarrollo",
    "tiempo_total": ${desarrolloMin},
  "actividades": [
    {
      "titulo": "Construcción del Conocimiento",
      "descripcion": "Explicación de...",
      "tiempo_sugerido": "25 min"
    },
    {
      "titulo": "Aplicación Dirigida",
      "descripcion": "Taller...",
      "tiempo_sugerido": "30 min"
    }
  ],
    "recursos": [
      "Fichas", "Hojas de apuntes"
    ]
},
{
  "fase": "Cierre",
    "tiempo_total": ${cierreMin},
  "actividades": [
    {
      "titulo": "Análisis y Conclusión",
      "descripcion": "El profesor enfatiza...",
      "tiempo_sugerido": "10 min"
    },
    {
      "titulo": "Evaluación",
      "descripcion": "Resolución de problema...",
      "tiempo_sugerido": "10 min"
    }
  ],
    "recursos": [
      "Hoja de evaluación"
    ]
}
  ],
  "evaluacion": {
  "aprendizajes": [
    {
      "criterio": "Comunica su comprensión sobre las relaciones",
      "indicadores": [
        "Define correctamente...",
        "Establece condiciones..."
      ],
      "instrumento": "Lista de Cotejo"
    }
  ],
    "actitudes": [
      {
        "criterio": "Demuestra perseverancia e interés",
        "indicadores": [
          "Participa activamente en la sesión."
        ],
        "instrumento": "Guía de Observación"
      }
    ],
      "rubrica": {
    "aspectos": ["Resolución de problemas", "Comunicación"],
      "niveles": {
      "sobresaliente": ["Resuelve todos los problemas de forma autónoma...", "Comunica las ideas claramente sin errores..."],
        "satisfactorio": ["Resuelve la mayoría de problemas...", "Comunica de forma comprensible..."],
          "en_proceso": ["Resuelve con ayuda constante...", "Presenta dificultad al comunicar..."],
            "inicio": ["No logra identificar los pasos de resolución...", "Comunicación ininteligible o ausente..."]
    }
  }
},
"bibliografia": [
  {
    "titulo_video": "Título descriptivo del video (Ej: Teoría de MRU, Práctica de MRU)",
    "url": "https://www.youtube.com/results?search_query=...",
    "descripcion": "Indicar si es Teoría, Ejercicios, o Aplicación Práctica"
  }
],
"generado_con_ia": true
}`

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
        }
      }),
    })

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()
      console.error('Gemini API Error:', geminiResponse.status, errText)
      throw new Error(`Gemini API Error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (!rawText) {
      console.error('Gemini returned empty text. Data:', JSON.stringify(geminiData))
      throw new Error('IA no devolvió contenido')
    }

    let secuenciaResult
    try {
      secuenciaResult = JSON.parse(rawText)
    } catch (parseErr) {
      console.error('Error parsing Gemini JSON:', parseErr, 'Raw text:', rawText)
      // Intento de limpieza si hay markdown
      try {
        const cleaned = rawText.replace(/```json|```/g, '').trim()
        secuenciaResult = JSON.parse(cleaned)
      } catch (e) {
        console.error('Fallo definitivo en parseo JSON')
        throw new Error(`Formato de respuesta IA inválido. Raw Text: ${rawText}`)
      }
    }

    return new Response(JSON.stringify(secuenciaResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('ERROR EN EDGE FUNCTION:', error)
    return new Response(
      JSON.stringify({
        error: error?.message ?? 'Error interno',
        details: error?.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
