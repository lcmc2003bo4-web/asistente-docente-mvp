import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const params = await req.json();
    const { titulo, grado_nombre, area_nombre, duracion_semanas, sesiones_list, competencias_seleccionadas } = params;

    if (!titulo || !grado_nombre || !area_nombre || !sesiones_list || !Array.isArray(sesiones_list) || sesiones_list.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios o lista de sesiones inválida' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY no está configurada');

    const tieneMultiples = Array.isArray(competencias_seleccionadas) && competencias_seleccionadas.length > 1;
    const tieneCompetencias = Array.isArray(competencias_seleccionadas) && competencias_seleccionadas.length > 0;

    // Schema base — shared fields
    const camposComunes = {
      situacion_significativa: {
        type: "STRING",
        description: "Los 4 bloques: CONTEXTO, EXPLORACIÓN, RETO, PROPÓSITO. Clear academic language."
      },
      proposito_aprendizaje: {
        type: "STRING",
        description: "Verbo observable + contenido específico + contexto + criterio de logro macro."
      },
      evaluacion: {
        type: "OBJECT",
        properties: {
          evidencias: { type: "STRING" },
          criterios: { type: "ARRAY", items: { type: "STRING" } },
          instrumento: { type: "STRING" }
        },
        required: ["evidencias", "criterios", "instrumento"]
      },
      enfoques_transversales: {
        type: "ARRAY",
        description: "MÍNIMO 4 enfoques transversales con valor y actitudes observables específicas al contexto.",
        items: {
          type: "OBJECT",
          properties: {
            enfoque: { type: "STRING" },
            valor: { type: "STRING" },
            actitudes: { type: "STRING", description: "Actitudes observables específicas a la unidad" }
          },
          required: ["enfoque", "valor", "actitudes"]
        },
        minItems: 4
      },
      secuencia_sesiones: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            titulo: { type: "STRING" },
            desempeno_precisado: { type: "STRING" },
            experiencia_aprendizaje: { type: "STRING" }
          },
          required: ["titulo", "desempeno_precisado", "experiencia_aprendizaje"]
        }
      }
    };

    const matrizSingle = {
      type: "OBJECT",
      description: "Competencia única para la matriz CNEB",
      properties: {
        competencia: { type: "STRING" },
        capacidades: { type: "ARRAY", items: { type: "STRING" } },
        desempenos_contextualizados: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: ["competencia", "capacidades", "desempenos_contextualizados"]
    };

    const matrizMultiple = {
      type: "ARRAY",
      description: "Una fila por cada competencia seleccionada por el docente. No omitas ninguna.",
      items: {
        type: "OBJECT",
        properties: {
          competencia: { type: "STRING" },
          capacidades: { type: "ARRAY", items: { type: "STRING" } },
          desempenos_contextualizados: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["competencia", "capacidades", "desempenos_contextualizados"]
      },
      minItems: competencias_seleccionadas?.length ?? 1
    };

    const schema = {
      type: "OBJECT",
      properties: tieneMultiples
        ? { ...camposComunes, matrices_ia: matrizMultiple }
        : { ...camposComunes, matriz_ia: matrizSingle },
      required: tieneMultiples
        ? ["situacion_significativa", "proposito_aprendizaje", "evaluacion", "enfoques_transversales", "matrices_ia", "secuencia_sesiones"]
        : ["situacion_significativa", "proposito_aprendizaje", "evaluacion", "enfoques_transversales", "matriz_ia", "secuencia_sesiones"]
    };

    const competenciasBlock = tieneCompetencias
      ? `\n⚠️ COMPETENCIAS FIJADAS POR EL DOCENTE (OBLIGATORIO)\nEl docente ha pre-seleccionado las siguientes ${competencias_seleccionadas.length} competencias del CNEB para esta unidad. DEBES incluir TODAS en la Matriz Curricular — una fila por cada una. No omitas ninguna:\n${competencias_seleccionadas.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}\n${tieneMultiples ? `Genera el campo 'matrices_ia' como un array con ${competencias_seleccionadas.length} elementos, uno por cada competencia. Para cada una, extrae sus capacidades y construye desempeños contextualizados independientes al área temática de la unidad.` : `Usa esta competencia como campo 'matriz_ia'. Extrae capacidades y desempeños CNEB contextualizados.`}\n`
      : '';

    const instruccionMatriz = tieneMultiples
      ? `Genera ${competencias_seleccionadas.length} filas en 'matrices_ia', una por cada competencia fijada. Capacidades y desempeños deben ser independientes y contextualizados para cada competencia.`
      : tieneCompetencias
        ? 'Usa OBLIGATORIAMENTE la competencia fijada por el docente. NO uses otras.'
        : 'Selecciona la competencia y capacidades oficiales del CNEB para el área exacta.';

    const promptBase = `
🧠 ROL Y NIVEL DE RIGOR
Actúa EXCLUSIVAMENTE como especialista de planificación curricular MACRO del MINEDU – Perú (Normativa CNEB 2026), experto en enfoque por competencias y evaluación formativa.
ESTRICTA RESTRICCIÓN: Tu único propósito es estructurar la "Unidad de Aprendizaje". BAJO NINGUNA CIRCUNSTANCIA debes generar dinámicas de aula, momentos pedagógicos (Inicio, Desarrollo, Cierre) ni detalles micro-curriculares propios de una "Sesión de Aprendizaje". Las lista de temas proporcionada sirve ÚNICAMENTE como ancla temática articuladora.
No generes contenido genérico ni reutilices formulaciones estándar. Todo debe construirse específicamente en función del contexto y grado indicado con un rigor académico y profesional impecable.
${competenciasBlock}
📌 DATOS DE ENTRADA
Grado: ${grado_nombre}
Área: ${area_nombre}
Título de la Unidad: ${titulo}
Duración: ${duracion_semanas || 4} semanas
Lista de Temas (Usar SOLO para alineamiento temático de los propósitos y la situación):
${sesiones_list.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

🎯 INSTRUCCIONES DE GENERACIÓN ESTRUCTURAL (UNIDAD DE APRENDIZAJE)
1️⃣ Situación Significativa: Redacta en lenguaje académico, retador. Usa exactamente los subtítulos CONTEXTO, EXPLORACIÓN, RETO y PROPÓSITO (en mayúsculas como encabezados en el texto).
2️⃣ Matriz Curricular: ${instruccionMatriz} Desempeños "precisados/contextualizados" deben mencionar explícitamente los contenidos temáticos, la acción observable y la condición.
3️⃣ Propósito de Aprendizaje: Verbo observable + contenido específico + contexto + criterio de logro macro (integrador de todos los temas).
4️⃣ Evaluación Formativa: Evidencia final (producto o actuación), Criterios de evaluación medibles, Instrumento oficial (Rúbrica, Guía de observación, etc.).
5️⃣ Enfoques Transversales (MÍNIMO 4, máximo 6): Selecciona enfoques pertinentes del CNEB. Para cada uno indica: el nombre del enfoque, el valor específico que se trabaja, y la "actitud observable" redactada explícitamente en el contexto de esta unidad. NO uses actitudes genéricas.
6️⃣ Secuencia de Sesiones: Para cada tema provisto genera SÓLO un desempeño precisado y una brevísima experiencia de aprendizaje (1-2 oraciones). Mantén el ORDEN EXACTO de la lista.

🔍 VALIDACIÓN OBLIGATORIA
- ¿El lenguaje es académico y apto para directivos del MINEDU?
- ¿Se generaron MÍNIMO 4 Enfoques Transversales?
- ¿Los desempeños precisados son estándares CNEB contextualizados?
${tieneCompetencias ? `- ¿Se incluyeron TODAS las ${competencias_seleccionadas.length} competencias seleccionadas por el docente en la matriz?` : ''}
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptBase }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: schema
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      throw new Error(`Error en API de Gemini: ${errText}`);
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    let jsonRespuesta;
    try {
      jsonRespuesta = typeof rawText === 'string' ? JSON.parse(rawText) : rawText;
    } catch (parseErr) {
      console.error('Error parsing Gemini response:', parseErr, 'raw:', rawText);
      throw new Error('La respuesta de Gemini no es un JSON válido');
    }

    // Normalize: if tieneMultiples but IA returned matriz_ia, convert to matrices_ia
    if (tieneMultiples && jsonRespuesta.matriz_ia && !jsonRespuesta.matrices_ia) {
      jsonRespuesta.matrices_ia = [jsonRespuesta.matriz_ia];
      delete jsonRespuesta.matriz_ia;
    }
    // Normalize: if single competencia returned matrices_ia array, flatten to matriz_ia
    if (!tieneMultiples && jsonRespuesta.matrices_ia && !jsonRespuesta.matriz_ia) {
      jsonRespuesta.matriz_ia = jsonRespuesta.matrices_ia[0];
      delete jsonRespuesta.matrices_ia;
    }

    return new Response(
      JSON.stringify(jsonRespuesta),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Error interno del servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
