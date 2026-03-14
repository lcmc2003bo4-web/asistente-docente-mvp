import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

interface ContextoInstitucional {
  nombre_institucion: string;
  tipo_gestion: string;
  zona: string;
  region: string;
  distrito: string;
  contexto_socioeconomico: string;
  actividades_economicas: string[];
  identidad_cultural?: string | null;
  problematicas_locales: string[];
  festividades_regionales: string[];
  proyectos_comunitarios: string[];
  mision?: string | null;
  vision?: string | null;
  valores: string[];
  enfoque_religioso?: string | null;
}

interface ContextoAula {
  seccion?: string | null;
  num_estudiantes?: number | null;
  intereses_comunes: string[];
  retos_educativos: string[];
  nivel_socioeconomico?: string | null;
  caracteristicas_adicionales?: string | null;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT ENGINE
// Convierte el contexto institucional en una comprensión
// narrativa que la IA usa como inspiración, no como datos.
// ═══════════════════════════════════════════════════════════════

interface ContextoDistribuido {
  // Cada "slot" recibe UN subconjunto distinto del contexto
  // para evitar que la IA lo repita en todas las secciones.
  slot_situacion: string;      // Situación significativa (CONTEXTO + EXPLORACION)
  slot_reto_proposito: string; // RETO + PROPOSITO de la situación
  slot_matriz: string;         // Inspiración para desempeños y capacidades
  slot_enfoques: string;       // Valores e identidad para enfoques transversales
  slot_sesiones: string[];     // Un micro-contexto por sesión (rotado)
  narrativa_completa: string;  // Comprensión global del contexto
}

function contextEngine(ctx: ContextoInstitucional, aula: ContextoAula | null, numSesiones: number): ContextoDistribuido {
  const lugar = ctx.distrito ? `${ctx.distrito} (${ctx.region})` : ctx.region;
  const zonaDesc = ctx.zona === 'Rural' ? 'comunidad rural' : ctx.zona === 'Urbano-marginal' ? 'zona periurbana' : 'distrito';

  // Pool de elementos contextuales — cada uno se usa UNA SOLA VEZ
  const actividades = [...(ctx.actividades_economicas || [])];
  const problematicas = [...(ctx.problematicas_locales || [])];
  const festividades = [...(ctx.festividades_regionales || [])];
  const proyectos = [...(ctx.proyectos_comunitarios || [])];
  const valores = [...(ctx.valores || [])];

  // Narrativa global de comprensión
  const narrativa_completa = [
    `La institucion "${ctx.nombre_institucion}" pertenece a ${lugar}, un ${zonaDesc} de nivel socioeconomico ${ctx.contexto_socioeconomico.toLowerCase()}.`,
    actividades.length ? `La vida de las familias gira en torno a: ${actividades.join(', ')}.` : '',
    problematicas.length ? `La comunidad convive con desafios reales como: ${problematicas.join(', ')}.` : '',
    festividades.length ? `El calendario local incluye: ${festividades.join(', ')}.` : '',
    proyectos.length ? `La comunidad impulsa: ${proyectos.join(', ')}.` : '',
    ctx.identidad_cultural ? `Identidad territorial: ${ctx.identidad_cultural}.` : '',
    ctx.enfoque_religioso ? `Caracter institucional: ${ctx.enfoque_religioso}.` : '',
    valores.length ? `Valores que orientan la escuela: ${valores.join(', ')}.` : '',
    ctx.mision ? `Mision: "${ctx.mision.slice(0, 150)}"` : '',
    aula?.num_estudiantes ? `Grupo de ${aula.num_estudiantes} estudiantes.` : '',
    aula?.intereses_comunes?.length ? `Intereses del grupo: ${aula.intereses_comunes.join(', ')}.` : '',
    aula?.retos_educativos?.length ? `Retos pedagogicos: ${aula.retos_educativos.join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  // --- Slot 1: SITUACION SIGNIFICATIVA (CONTEXTO + EXPLORACION) ---
  // Usa: geografia, actividades economicas, 1 problematica
  const act1 = actividades.slice(0, 2).join(' y ');
  const prob1 = problematicas[0] || '';
  const slot_situacion = [
    `Escenario geografico y economico: ${lugar}, ${zonaDesc}. ${act1 ? `Actividades predominantes: ${act1}.` : ''}`,
    prob1 ? `Tension principal del entorno para la exploracion: "${prob1}".` : '',
    ctx.identidad_cultural ? `Rasgo identitario disponible: ${ctx.identidad_cultural}.` : '',
    aula?.intereses_comunes?.length ? `Los estudiantes muestran interes en: ${aula.intereses_comunes.slice(0, 2).join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  // --- Slot 2: RETO + PROPOSITO ---
  // Usa: 2a problematica (distinta), valores, enfoque religioso
  const prob2 = problematicas[1] || problematicas[0] || '';
  const val1 = valores.slice(0, 2).join(' y ');
  const slot_reto_proposito = [
    prob2 ? `Desafio para el RETO: "${prob2}" — enmarcado en la accion comunitaria.` : '',
    val1 ? `Valores a reflejar implicitamente en el RETO y PROPOSITO: ${val1}.` : '',
    ctx.enfoque_religioso ? `El caracter ${ctx.enfoque_religioso} debe respirarse en el PROPOSITO sin mencionarlo explicitamente.` : '',
    ctx.mision ? `Horizonte de formacion (usar como telón de fondo): "${ctx.mision.slice(0, 100)}"` : '',
  ].filter(Boolean).join(' ');

  // --- Slot 3: MATRIZ CURRICULAR ---
  // Usa: actividades economicas 3, proyectos comunitarios
  const act2 = actividades.slice(2, 4).join(', ') || actividades[0] || '';
  const proy1 = proyectos[0] || '';
  const slot_matriz = [
    act2 ? `Para contextualizar desempenos: relacionar con practicas de ${act2}.` : '',
    proy1 ? `Vinculo comunitario disponible para capacidades: ${proy1}.` : '',
    aula?.retos_educativos?.length ? `Retos del grupo a trabajar: ${aula.retos_educativos.slice(0, 2).join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  // --- Slot 4: ENFOQUES TRANSVERSALES ---
  // Usa: valores completos, festividades, proyectos restantes
  const val2 = valores.slice(2).join(', ') || valores.join(', ');
  const fest1 = festividades[0] || '';
  const proy2 = proyectos[1] || '';
  const slot_enfoques = [
    val2 ? `Valores disponibles para los enfoques: ${val2}.` : '',
    fest1 ? `Expresion cultural del calendario local: ${fest1}.` : '',
    proy2 ? `Iniciativa comunitaria como referencia de ciudadania: ${proy2}.` : '',
    ctx.enfoque_religioso ? `Dimension trascendente: ${ctx.enfoque_religioso}.` : '',
  ].filter(Boolean).join(' ');

  // --- Slot 5: SESIONES (un micro-contexto rotado por sesion) ---
  // Pool de ideas para rotar entre sesiones — garantiza variedad
  const ideasSesion = [
    act1 ? `Practica economica local: ${act1}` : null,
    prob1 ? `Tension ambiental/social: ${prob1}` : null,
    fest1 ? `Expresion cultural: ${fest1}` : null,
    proy1 ? `Iniciativa comunitaria: ${proy1}` : null,
    ctx.identidad_cultural ? `Identidad del territorio: ${ctx.identidad_cultural}` : null,
    prob2 && prob2 !== prob1 ? `Segunda tension del entorno: ${prob2}` : null,
    proy2 ? `Segundo proyecto: ${proy2}` : null,
    val1 ? `Valor institucional: ${val1}` : null,
    aula?.intereses_comunes?.[0] ? `Interes estudiantil: ${aula.intereses_comunes[0]}` : null,
    aula?.retos_educativos?.[0] ? `Reto del grupo: ${aula.retos_educativos[0]}` : null,
  ].filter(Boolean) as string[];

  const slot_sesiones: string[] = [];
  for (let i = 0; i < numSesiones; i++) {
    const idea = ideasSesion[i % ideasSesion.length] || `Entorno de ${lugar}`;
    slot_sesiones.push(idea);
  }

  return { slot_situacion, slot_reto_proposito, slot_matriz, slot_enfoques, slot_sesiones, narrativa_completa };
}

// ═══════════════════════════════════════════════════════════════
// THEMATIC COHERENCE FILTER
// Analiza el título de la unidad y filtra qué elementos
// del contexto son pertinentes a su eje temático.
// Evita que elementos descontextualizados (ej. festividades)
// aparezcan en unidades donde no son relevantes.
// ═══════════════════════════════════════════════════════════════

type TematicaUnidad =
  | 'convivencia'    // retorno a clases, compromisos, normas, convivencia
  | 'inicio_anio'   // inicio del año, planificación escolar
  | 'habilidades'   // competencias, aprendizaje, habilidades
  | 'ciencia'       // ciencias, tecnología, ambiente, naturaleza
  | 'ambiente'      // medioambiente, sostenibilidad, recursos naturales
  | 'identidad'     // identidad, cultura, historia, patrimonio
  | 'gestion'       // emprendimiento, economía, finanzas, producción
  | 'salud'         // salud, bienestar, prevención
  | 'general';      // sin categoría dominante

interface FiltroTematico {
  tematica: TematicaUnidad;
  // Restricciones para el slot de situación significativa
  permitir_festividades: boolean;
  permitir_actividades_economicas: boolean;
  permitir_identidad_cultural: boolean;
  // Mensaje sobre el eje temático para incluir en el prompt
  restriccion_narrativa: string;
}

function thematicFilter(titulo: string, sesiones: string[]): FiltroTematico {
  const texto = `${titulo} ${sesiones.join(' ')}`.toLowerCase();

  // Detectar temática por palabras clave en el título y sesiones
  const esConvivencia = /conviv|compromi|norma|acuerdo|retorn|bienvenid|inicio.*clas|clas.*inicio|a.*escol|escol.*a|disciplin|respet|ciudadan/.test(texto);
  const esInicioAnio = /inicio|retorno|comienzo|primer.*bimest|primer.*trim|primer.*mes|regres|nuevo.*a.o|bienvenid/.test(texto);
  const esCiencia = /cient|ecolog|organis|celul|materi|energi|f.sic|quimi|biolog|tecnolog|datos|estad|probabilid/.test(texto);
  const esAmbiente = /ambient|natural|recurso|sostenib|cambio.*clim|ecosis|contamin|reliev|hidro|geografi/.test(texto);
  const esIdentidad = /identidad|cultura|histori|patrimon|tradicion|herencia|memoria|region|local|ancestral/.test(texto);
  const esGestion = /emprend|econom|finanz|produccion|comerci|consumo|mercad|costo|presupuest|administr/.test(texto);
  const esSalud = /salud|bienestar|prevenci|alimentaci|nutrici|higiene|cuerpo|deporte|actividad.f.sic/.test(texto);

  // Prioridad: convivencia/inicio > ambiente/ciencia > identidad > gestion > salud > general
  if (esConvivencia || (esInicioAnio && !esAmbiente && !esCiencia)) {
    return {
      tematica: esInicioAnio ? 'inicio_anio' : 'convivencia',
      permitir_festividades: false,   // Las festividades NO van en unidades de convivencia/inicio año
      permitir_actividades_economicas: false,
      permitir_identidad_cultural: false,
      restriccion_narrativa: `El eje temático es "${titulo}". La situacion significativa DEBE girar en torno al inicio del año escolar, los compromisos del aula, la convivencia y la organizacion escolar. PROHIBIDO incluir festividades religiosas o culturales, actividades economicas de la comunidad, o cualquier elemento que no guarde relacion directa con el inicio y la vida escolar.`
    };
  }

  if (esAmbiente || (esCiencia && esAmbiente)) {
    return {
      tematica: 'ambiente',
      permitir_festividades: false,
      permitir_actividades_economicas: true,  // Las actividades economicas pueden generar impacto ambiental
      permitir_identidad_cultural: false,
      restriccion_narrativa: `El eje temático es "${titulo}". La situacion significativa debe abordar el entorno natural, los recursos, el impacto humano o la sostenibilidad. Las actividades economicas locales pueden aparecer SOLO si generan una consecuencia ambiental concreta. PROHIBIDO introducir festividades o elementos culturales no relacionados con el entorno natural.`
    };
  }

  if (esCiencia) {
    return {
      tematica: 'ciencia',
      permitir_festividades: false,
      permitir_actividades_economicas: true,
      permitir_identidad_cultural: false,
      restriccion_narrativa: `El eje temático es "${titulo}". La situacion significativa debe anclar en un fenomeno observable, dato o problema de la realidad local que se pueda investigar con herramientas cientificas o matematicas. El contexto economico puede servir como fuente de datos reales. PROHIBIDO desviar la situacion hacia festividades o eventos sin relacion con el fenomeno a estudiar.`
    };
  }

  if (esIdentidad) {
    return {
      tematica: 'identidad',
      permitir_festividades: true,   // Las festividades SÍ son relevantes para identidad
      permitir_actividades_economicas: false,
      permitir_identidad_cultural: true,
      restriccion_narrativa: `El eje temático es "${titulo}". La situacion significativa debe explorar la identidad cultural, la historia local o el patrimonio. Las festividades y expresiones culturales son BIENVENIDAS aqui. Las actividades economicas solo si estan relacionadas con la identidad o la tradicion.`
    };
  }

  if (esGestion) {
    return {
      tematica: 'gestion',
      permitir_festividades: false,
      permitir_actividades_economicas: true,  // Las actividades economicas son el eje
      permitir_identidad_cultural: false,
      restriccion_narrativa: `El eje temático es "${titulo}". La situacion significativa debe anclar en una situacion economica, de emprendimiento o gestion real de la comunidad. Las actividades economicas locales son el centro de la narrativa. PROHIBIDO introducir festividades o elementos culturales que no tengan relacion directa con la produccion o gestion.`
    };
  }

  if (esSalud) {
    return {
      tematica: 'salud',
      permitir_festividades: false,
      permitir_actividades_economicas: false,
      permitir_identidad_cultural: false,
      restriccion_narrativa: `El eje temático es "${titulo}". La situacion significativa debe abordar una situacion de salud, bienestar o prevencion que afecte a los estudiantes o su comunidad. PROHIBIDO introducir festividades u otros elementos desconectados del contexto de salud y bienestar.`
    };
  }

  // general: permite todo pero el titulo sigue siendo el ancla
  return {
    tematica: 'general',
    permitir_festividades: true,
    permitir_actividades_economicas: true,
    permitir_identidad_cultural: true,
    restriccion_narrativa: `El eje temático es "${titulo}". Todo el contenido de la situacion significativa debe girar en torno a este tema. Los elementos del contexto institucional son SECUNDARIOS: solo se usan si enriquecen naturalmente el tema central. NUNCA introduzcas un elemento contextual que genere incoherencia con el titulo.`
  };
}


// ═══════════════════════════════════════════════════════════════
// VARIATION ENGINE
// Asigna arquetipos pedagogicos distintos a cada sesion
// para garantizar progresion y variedad narrativa.
// ═══════════════════════════════════════════════════════════════

interface SesionArquetipo {
  etapa: 'apertura' | 'exploracion' | 'profundizacion' | 'transferencia' | 'evidencia';
  verbo_pedagogico: string;
  enfoque_narrativo: string;
}

function variationEngine(numSesiones: number, duracionSemanas: number): SesionArquetipo[] {
  // Distribucion de etapas proporcional a la duracion
  const arquetipos: SesionArquetipo[] = [
    {
      etapa: 'apertura',
      verbo_pedagogico: 'observa y cuestiona',
      enfoque_narrativo: 'activacion de saberes previos y conexion con la realidad cotidiana'
    },
    {
      etapa: 'exploracion',
      verbo_pedagogico: 'investiga y recoge datos',
      enfoque_narrativo: 'indagacion directa sobre el fenomeno o problema situado'
    },
    {
      etapa: 'profundizacion',
      verbo_pedagogico: 'analiza y modela',
      enfoque_narrativo: 'uso de herramientas conceptuales para comprender la complejidad'
    },
    {
      etapa: 'profundizacion',
      verbo_pedagogico: 'interpreta y argumenta',
      enfoque_narrativo: 'construccion de explicaciones fundamentadas con evidencia'
    },
    {
      etapa: 'transferencia',
      verbo_pedagogico: 'diseña y propone',
      enfoque_narrativo: 'aplicacion del aprendizaje a una situacion nueva o desafio real'
    },
    {
      etapa: 'transferencia',
      verbo_pedagogico: 'evalua y toma decisiones',
      enfoque_narrativo: 'juicio critico sobre alternativas en contexto real'
    },
    {
      etapa: 'evidencia',
      verbo_pedagogico: 'produce y comunica',
      enfoque_narrativo: 'elaboracion del producto final para una audiencia real'
    },
  ];

  const result: SesionArquetipo[] = [];
  for (let i = 0; i < numSesiones; i++) {
    // Distribucion uniforme de arquetipos, garantizando apertura al inicio y evidencia al final
    if (i === 0) {
      result.push(arquetipos[0]); // siempre apertura
    } else if (i === numSesiones - 1) {
      result.push(arquetipos[6]); // siempre evidencia al final
    } else {
      // Rotar los arquetipos intermedios de forma distribuida
      const idx = 1 + ((i - 1) % 5);
      result.push(arquetipos[idx]);
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════
// MEMORY ENGINE
// Construye el bloque de instrucciones de distribucion
// para que la IA siga el mapa de elementos asignados.
// ═══════════════════════════════════════════════════════════════

function memoryEngine(distribucion: ContextoDistribuido, arquetipos: SesionArquetipo[], sesiones: string[], duracionSemanas: number): string {
  const sesionesGuia = sesiones.map((titulo, i) => {
    const arq = arquetipos[i];
    const micro = distribucion.slot_sesiones[i];
    const semana = Math.round((i + 1) * duracionSemanas / sesiones.length);
    return `  Sesion ${i + 1} (semana ~${semana}): "${titulo}"
    Etapa: ${arq.etapa.toUpperCase()} | Enfoque: ${arq.enfoque_narrativo}
    Verbo guia: "${arq.verbo_pedagogico}"
    Micro-contexto asignado (usar SOLO aqui, no en otras sesiones): ${micro}`;
  }).join('\n\n');

  return `
MAPA DE DISTRIBUCION DEL CONTEXTO (Memory Engine — seguir estrictamente)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLA FUNDAMENTAL: Cada elemento del contexto se usa UNA SOLA VEZ en todo el documento.
No repitas el mismo dato, lugar, actividad o value en secciones distintas.

SECCION: SITUACION SIGNIFICATIVA — Bloques CONTEXTO y EXPLORACION
Elementos ASIGNADOS a esta seccion (usar solo aqui):
${distribucion.slot_situacion}

SECCION: SITUACION SIGNIFICATIVA — Bloques RETO y PROPOSITO
Elementos ASIGNADOS a esta seccion (usar solo aqui):
${distribucion.slot_reto_proposito}

SECCION: MATRIZ CURRICULAR
Inspiracion contextual ASIGNADA (usar solo aqui):
${distribucion.slot_matriz}

SECCION: ENFOQUES TRANSVERSALES
Elementos ASIGNADOS (valores, expresiones culturales):
${distribucion.slot_enfoques}

SECCION: SECUENCIA DE SESIONES — Guia de variacion y progresion
La duracion total es ${duracionSemanas} semanas. Cada sesion tiene etapa y micro-contexto DISTINTO:

${sesionesGuia}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

// ═══════════════════════════════════════════════════════════════
// EDGE FUNCTION HANDLER
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
      headers: { Authorization: authHeader, apikey: supabaseAnonKey },
    });

    if (!authResponse.ok) {
      return new Response(JSON.stringify({ error: 'Token invalido o expirado' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const params = await req.json();
    const {
      titulo,
      grado_nombre,
      area_nombre,
      duracion_semanas,
      sesiones_list,
      competencias_seleccionadas,
      contexto_institucional,
      contexto_aula,
    } = params;

    if (!titulo || !grado_nombre || !area_nombre || !sesiones_list || !Array.isArray(sesiones_list) || sesiones_list.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios o lista de sesiones invalida' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY no esta configurada');

    const tieneMultiples = Array.isArray(competencias_seleccionadas) && competencias_seleccionadas.length > 1;
    const tieneCompetencias = Array.isArray(competencias_seleccionadas) && competencias_seleccionadas.length > 0;
    const tieneContexto = !!contexto_institucional;
    const duracion = duracion_semanas || 4;

    // ─── Schema de respuesta ───────────────────────────────────

    // La situacion_significativa se devuelve como OBJETO con 4 campos independientes.
    // Esto impide fisicamente que la IA mezcle el contenido de un bloque con otro.
    // El servidor la reconstruye como cadena limpia antes de enviar al frontend.
    const situacionSchema = {
      type: "OBJECT",
      properties: {
        contexto: {
          type: "STRING",
          description: "Escena narrativa del colegio (3-4 oraciones). Menciona colegio y grado. Tono evocador. NO incluye preguntas."
        },
        exploracion: {
          type: "STRING",
          description: "Preguntas de investigacion calibradas para el grado y el area (3-4 preguntas). Contenido DIFERENTE al de contexto."
        },
        reto: {
          type: "STRING",
          description: "Desafio de accion en 2-3 oraciones. Empieza con verbo plural (Asumimos/Construimos/Decidimos). Ideas COMPLETAMENTE NUEVAS respecto a contexto y exploracion."
        },
        proposito: {
          type: "STRING",
          description: "Meta formativa en 2-3 oraciones. Cierra el sentido de la unidad. Ideas NUEVAS, no repite contexto ni reto."
        }
      },
      required: ["contexto", "exploracion", "reto", "proposito"]
    };

    const camposComunes = {
      situacion_significativa: situacionSchema,
      proposito_aprendizaje: {
        type: "STRING",
        description: "Una oracion: verbo observable + contenido + contexto de aplicacion + criterio integrador."
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
        description: "MINIMO 4 enfoques. Actitudes especificas al grupo real, no genericas.",
        items: {
          type: "OBJECT",
          properties: {
            enfoque: { type: "STRING" },
            valor: { type: "STRING" },
            actitudes: { type: "STRING" }
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
            desempenos: { type: "STRING" },
            experiencia_aprendizaje: { type: "STRING" }
          },
          required: ["titulo", "desempenos", "experiencia_aprendizaje"]
        }
      }
    };

    const matrizSingle = {
      type: "OBJECT",
      properties: {
        competencia: { type: "STRING" },
        capacidades: { type: "ARRAY", items: { type: "STRING" } },
        desempenos_contextualizados: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: ["competencia", "capacidades", "desempenos_contextualizados"]
    };

    const matrizMultiple = {
      type: "ARRAY",
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
      ? `\nCOMPETENCIAS FIJADAS POR EL DOCENTE (OBLIGATORIO — incluir TODAS):\n${competencias_seleccionadas.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}\n${tieneMultiples ? `Genera 'matrices_ia' con ${competencias_seleccionadas.length} elementos, uno por competencia.` : `Usa como 'matriz_ia'.`}\n`
      : '';

    const instruccionMatriz = tieneMultiples
      ? `Genera ${competencias_seleccionadas.length} filas en 'matrices_ia', capacidades y desempenos independientes por competencia.`
      : tieneCompetencias
        ? 'Usa la competencia fijada como matriz_ia. No sustituyas por otra.'
        : 'Selecciona la competencia y capacidades oficiales del CNEB para el area.';

    // ─── Ejecutar los 3 motores ────────────────────────────────

    let contextBlock = '';
    let memoryBlock = '';

    if (tieneContexto) {
      const ctx = contexto_institucional as ContextoInstitucional;
      const aula = contexto_aula as ContextoAula | null;

      // Context Engine: convierte el contexto en comprension narrativa distribuida
      const distribucion = contextEngine(ctx, aula, sesiones_list.length);

      // Thematic Coherence Filter: analiza el titulo y filtra elementos del contexto
      const filtro = thematicFilter(titulo, sesiones_list);

      // Aplicar filtro: si el tema no permite festividades, eliminarlas del slot de situacion
      // El slot de enfoques puede conservarlas (los enfoques transversales son mas flexibles)
      if (!filtro.permitir_festividades) {
        // Limpiar referencias a festividades del slot_situacion
        distribucion.slot_situacion = distribucion.slot_situacion
          .replace(/Expresion cultural local disponible:[^.]+\./gi, '')
          .trim();
        // Limpiar del pool de sesiones iniciales (apertura/exploracion)
        for (let i = 0; i < Math.min(2, distribucion.slot_sesiones.length); i++) {
          if (/cultural|festividad|celebraci/i.test(distribucion.slot_sesiones[i])) {
            distribucion.slot_sesiones[i] = `Entorno cotidiano de los estudiantes relacionado con: ${titulo}`;
          }
        }
      }
      if (!filtro.permitir_actividades_economicas) {
        distribucion.slot_situacion = distribucion.slot_situacion
          .replace(/Actividades (predominantes|del entorno)[^.]+\./gi, '')
          .replace(/Escenario geografico y economico[^.]+\./gi, (m) => m.replace(/economico/, 'geografico'))
          .trim();
      }
      if (!filtro.permitir_identidad_cultural) {
        distribucion.slot_situacion = distribucion.slot_situacion
          .replace(/Rasgo identitario[^.]+\./gi, '')
          .trim();
      }

      // Variation Engine: asigna arquetipos pedagogicos por sesion
      const arquetipos = variationEngine(sesiones_list.length, duracion);

      // Memory Engine: construye el mapa de distribucion del contexto
      const memBlockRaw = memoryEngine(distribucion, arquetipos, sesiones_list, duracion);
      memoryBlock = memBlockRaw;

      // Bloque de comprension global (lo que la IA debe entender sobre la comunidad)
      contextBlock = `
COMPRENSION DEL CONTEXTO INSTITUCIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${distribucion.narrativa_completa}

COHERENCIA TEMATICA (PRIORIDAD ABSOLUTA):
${filtro.restriccion_narrativa}

PRINCIPIOS DE USO DEL CONTEXTO:
┉ El titulo de la unidad es el EJE DOMINANTE. Ninguna narrativa puede desviarse de el.
┉ Los elementos del contexto institucional son SECUNDARIOS: se usan SOLO si enriquecen el eje tematico.
┉ Si un elemento del contexto (festividad, actividad economica, etc.) no tiene relacion directa con el titulo, IGNORALO.
┉ NUNCA menciones el contexto como ficha tecnica: "la institucion se ubica en...", "las actividades son...".
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    }

    // Temperatura: reducida para mayor control y evitar repeticion de contenido
    const temperature = tieneContexto ? 0.60 : 0.55;

    const nombreInstitucion = tieneContexto ? (contexto_institucional as ContextoInstitucional).nombre_institucion : 'la institucion';

    const promptBase = `
ROL
Eres un especialista de planificacion curricular MINEDU Peru (CNEB 2026) con 20 anos de experiencia en aula. Tu voz es la de un docente reflexivo y preciso. Nunca suenas como plantilla automatica.

RESTRICCION: Solo nivel MACRO (Unidad de Aprendizaje). NUNCA incluyas momentos de sesion (Inicio, Desarrollo, Cierre).

${contextBlock}
${memoryBlock}
${competenciasBlock}
DATOS DE LA UNIDAD
Institucion: ${nombreInstitucion}
Grado: ${grado_nombre}
Area: ${area_nombre}
Titulo de la Unidad: "${titulo}"
Duracion: ${duracion} semanas | ${sesiones_list.length} sesiones

INSTRUCCIONES DE GENERACION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. SITUACION SIGNIFICATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLA TEMATICA ABSOLUTA: El titulo "${titulo}" es el ANCLA de toda la situacion. Cada bloque debe girar en torno a este tema.
REGLA ANTI-REPETICION CRITICA: Cada bloque es COMPLETAMENTE INDEPENDIENTE. Ningun bloque puede copiar, parafrasear ni resumir el contenido de bloques anteriores. RETO y PROPOSITO deben aportar ideas NUEVAS.

Escribe exactamente 4 bloques, con sus encabezados en MAYUSCULAS, separados por salto de linea:

CONTEXTO
Escena narrativa del colegio ${nombreInstitucion} relacionada directamente con el tema "${titulo}".
- OBLIGATORIO: mencionar el grado "${grado_nombre}" de forma natural en este bloque.
- OBLIGATORIO: mencionar el nombre del colegio "${nombreInstitucion}" de forma natural.
- Usa los elementos del MAPA asignados a este bloque (si existen), solo si son coherentes con el tema.
- Minimo 3 oraciones. Tono: narrativo y evocador, como una escena real.
- NO INCLUYAS preguntas aqui. Las preguntas van solo en EXPLORACION.

EXPLORACION
Preguntas de investigacion que emergen de la escena descrita en CONTEXTO.
- Preguntas articuladas con herramientas del area de ${area_nombre}, calibradas para ${grado_nombre}.
- Minimo 3 preguntas. Estas preguntas deben ser NUEVAS, no repetir ideas de CONTEXTO.
- Cada pregunta sugiere una accion de aprendizaje especifica.

RETO
Desafio de accion para los estudiantes de ${grado_nombre}, DIRECTAMENTE relacionado con "${titulo}".
- ATENCION CRITICA: Este bloque debe contener ideas COMPLETAMENTE NUEVAS. NO puedes repetir, citar ni parafrasear ningun texto de CONTEXTO ni de EXPLORACION.
- Es una invitacion a actuar, no a describir ni a preguntar.
- Extension: exactamente 2-3 oraciones concisas.
- Empieza con un verbo de accion en primera persona del plural ("Asumimos...", "Construimos...", "Decidimos...", etc.).

PROPOSITO
Meta de formacion integral del estudiante, coherente con "${titulo}" y el area ${area_nombre}.
- ATENCION CRITICA: Ideas NUEVAS. NO repitas ni parafrasees CONTEXTO, EXPLORACION ni RETO.
- Puede mencionar el grado ${grado_nombre} o el colegio ${nombreInstitucion} si fluye naturalmente.
- Extension: 2-3 oraciones que cierren el sentido formativo de la situacion.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. MATRIZ CURRICULAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${instruccionMatriz}
Desempenos: accion observable + contenido especifico del area + condicion de logro. Situados en el entorno del colegio y pertinentes al tema.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. PROPOSITO DE APRENDIZAJE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Una oracion rica: verbo observable + contenido vinculado a "${titulo}" + escenario de aplicacion + criterio integrador.
Menciona el grado ${grado_nombre} o el colegio ${nombreInstitucion} si fluye con naturalidad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. EVALUACION FORMATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Evidencia observable de ${grado_nombre}, ligada al tema. Criterios medibles (3-5). Instrumento oficial CNEB.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. ENFOQUES TRANSVERSALES (MINIMO 4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre CNEB + valor especifico + actitud concreta que haria un estudiante real de ${grado_nombre} en ESTA unidad, en ESTE colegio.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. SECUENCIA DE SESIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sigue el mapa de distribucion: etapa, verbo guia, micro-contexto DISTINTO por cada sesion. Progresion de apertura a evidencia.
Desempeno: unico e irrepetible por sesion. Experiencia: 2 oraciones vividas de accion estudiantil en ${grado_nombre}.

REGLAS FINALES:
- El eje tematico "${titulo}" domina todo el documento.
- Cada bloque de la situacion significativa es independiente: no se repite ni parafrasea.
- El texto suena escrito por un docente real.
${tieneCompetencias ? `- Incluir las ${competencias_seleccionadas.length} competencias: ${competencias_seleccionadas.join(', ')}.` : ''}
    `;



    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptBase }] }],
        generationConfig: {
          temperature,
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
      throw new Error('La respuesta de Gemini no es un JSON valido');
    }

    // Normalizar formato de matrices
    if (tieneMultiples && jsonRespuesta.matriz_ia && !jsonRespuesta.matrices_ia) {
      jsonRespuesta.matrices_ia = [jsonRespuesta.matriz_ia];
      delete jsonRespuesta.matriz_ia;
    }
    if (!tieneMultiples && jsonRespuesta.matrices_ia && !jsonRespuesta.matriz_ia) {
      jsonRespuesta.matriz_ia = jsonRespuesta.matrices_ia[0];
      delete jsonRespuesta.matrices_ia;
    }

    // Reconstruir situacion_significativa como cadena limpia desde el objeto estructurado
    // El schema la devuelve como objeto { contexto, exploracion, reto, proposito }
    if (jsonRespuesta.situacion_significativa && typeof jsonRespuesta.situacion_significativa === 'object') {
      const ss = jsonRespuesta.situacion_significativa as {
        contexto?: string; exploracion?: string; reto?: string; proposito?: string;
      };
      jsonRespuesta.situacion_significativa = [
        ss.contexto ? `CONTEXTO\n${ss.contexto.trim()}` : '',
        ss.exploracion ? `EXPLORACION\n${ss.exploracion.trim()}` : '',
        ss.reto ? `RETO\n${ss.reto.trim()}` : '',
        ss.proposito ? `PROPOSITO\n${ss.proposito.trim()}` : '',
      ].filter(Boolean).join('\n\n');
    }

    jsonRespuesta._tiene_contexto_institucional = tieneContexto;

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
