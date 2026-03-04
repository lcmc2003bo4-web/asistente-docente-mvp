-- Migration: Add 4° and 5° Secundaria Desempeños
-- Phase B: Complete secondary education coverage
-- Date: 2026-02-17
-- Total: 198 desempeños (99 capacidades × 2 grados)

-- ============================================================================
-- MATEMÁTICA - 16 desempeños (8 capacidades × 2 grados)
-- ============================================================================

-- MAT-C1-CAP1: Traduce cantidades a expresiones numéricas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C1-CAP1-D4', 'Traduce cantidades y magnitudes a expresiones numéricas con números reales, notación exponencial y científica, modelos financieros de interés compuesto y tasas de crecimiento, considerando múltiples variables.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C1-CAP1-D5', 'Traduce cantidades y magnitudes a expresiones numéricas con números reales, notación exponencial y científica, modelos financieros complejos y tasas variables, integrando conceptos de optimización.');

-- MAT-C1-CAP2: Comunica su comprensión sobre los números y las operaciones
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C1-CAP2-D4', 'Comunica su comprensión de los números reales, sus propiedades, operaciones y el sentido de las operaciones, usando lenguaje numérico formal y diversas representaciones, incluyendo notación científica avanzada.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C1-CAP2-D5', 'Comunica su comprensión de los números reales y complejos, sus propiedades, operaciones y el sentido de las operaciones, usando lenguaje matemático formal y representaciones abstractas.');

-- MAT-C1-CAP3: Usa estrategias y procedimientos de estimación y cálculo
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C1-CAP3-D4', 'Usa estrategias y procedimientos para realizar operaciones con números reales, notación exponencial y científica, calcular interés compuesto y resolver problemas de optimización financiera.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C1-CAP3-D5', 'Usa estrategias y procedimientos avanzados para realizar operaciones con números reales y complejos, calcular modelos financieros complejos y resolver problemas de optimización multivariable.');

-- MAT-C1-CAP4: Argumenta afirmaciones sobre las relaciones numéricas y las operaciones
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C1-CAP4-D4', 'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones con números reales, usando demostraciones formales, propiedades matemáticas y contraejemplos.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C1-CAP4-D5', 'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones con números reales y complejos, usando demostraciones formales rigurosas y razonamiento abstracto.');

-- MAT-C2-CAP1: Traduce datos y condiciones a expresiones algebraicas y gráficas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C2-CAP1-D4', 'Traduce datos y condiciones a expresiones algebraicas (ecuaciones logarítmicas, sistemas de ecuaciones no lineales) y funciones logarítmicas y trigonométricas, así como a representaciones gráficas complejas.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C2-CAP1-D5', 'Traduce datos y condiciones a expresiones algebraicas avanzadas (ecuaciones paramétricas, sistemas complejos) y funciones compuestas e inversas, así como a representaciones gráficas en múltiples dimensiones.');

-- MAT-C2-CAP2: Comunica su comprensión sobre las relaciones algebraicas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C2-CAP2-D4', 'Comunica su comprensión sobre ecuaciones logarítmicas, sistemas de ecuaciones no lineales y funciones logarítmicas y trigonométricas, usando lenguaje algebraico formal y diversas representaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C2-CAP2-D5', 'Comunica su comprensión sobre ecuaciones paramétricas, sistemas complejos y funciones compuestas e inversas, usando lenguaje matemático avanzado y representaciones abstractas.');

-- MAT-C2-CAP3: Usa estrategias y procedimientos para encontrar equivalencias y reglas generales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C2-CAP3-D4', 'Usa estrategias y procedimientos para resolver ecuaciones logarítmicas, sistemas de ecuaciones no lineales y encontrar reglas generales de funciones logarítmicas y trigonométricas.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C2-CAP3-D5', 'Usa estrategias y procedimientos avanzados para resolver ecuaciones paramétricas, sistemas complejos y encontrar reglas generales de funciones compuestas e inversas.');

-- MAT-C2-CAP4: Argumenta afirmaciones sobre relaciones de cambio y equivalencia
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'MAT-C2-CAP4-D4', 'Argumenta afirmaciones sobre relaciones de cambio y equivalencia en ecuaciones logarítmicas, sistemas no lineales y funciones logarítmicas y trigonométricas, usando demostraciones formales y propiedades matemáticas.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'MAT-C2-CAP4-D5', 'Argumenta afirmaciones sobre relaciones de cambio y equivalencia en ecuaciones paramétricas, sistemas complejos y funciones compuestas, usando razonamiento abstracto y demostraciones rigurosas.');

-- ============================================================================
-- COMUNICACIÓN - 26 desempeños (13 capacidades × 2 grados)
-- ============================================================================

-- COM-C1-CAP1: Obtiene información del texto oral
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C1-CAP1-D4', 'Obtiene información explícita, relevante y complementaria, seleccionando datos específicos y detalles, en textos orales que presentan expresiones con sentido figurado, sesgos, falacias, ambigüedades y vocabulario especializado y técnico.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C1-CAP1-D5', 'Obtiene información explícita, relevante y complementaria, integrando datos de múltiples fuentes orales, en textos que presentan expresiones con sentido figurado, sesgos, falacias, ambigüedades, vocabulario especializado y técnico, y estructuras complejas.');

-- COM-C1-CAP2: Infiere e interpreta información del texto oral
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C1-CAP2-D4', 'Infiere información deduciendo diversas relaciones lógicas y jerárquicas entre las ideas del texto oral (causa-efecto, problema-solución, tesis-argumentos) a partir de información implícita, contrapuesta y ambigua del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C1-CAP2-D5', 'Infiere información deduciendo relaciones lógicas complejas y jerárquicas entre las ideas del texto oral (causa-efecto múltiple, problema-solución-consecuencias) a partir de información implícita, contrapuesta, ambigua y de múltiples perspectivas.');

-- COM-C1-CAP3: Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C1-CAP3-D4', 'Adecúa el texto oral a la situación comunicativa considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el contexto sociocultural, las necesidades de los interlocutores y las convenciones del discurso académico.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C1-CAP3-D5', 'Adecúa el texto oral a situaciones comunicativas complejas considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el contexto sociocultural, las necesidades diversas de los interlocutores y las convenciones del discurso académico y profesional.');

-- COM-C1-CAP4: Utiliza recursos no verbales y paraverbales de forma estratégica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C1-CAP4-D4', 'Utiliza recursos no verbales (gestos, movimientos corporales y contacto visual) y paraverbales (entonación, volumen, ritmo y pausas) de forma estratégica para producir efectos específicos en los interlocutores, mantener su atención y reforzar el mensaje.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C1-CAP4-D5', 'Utiliza recursos no verbales y paraverbales de forma estratégica y sofisticada para producir efectos retóricos específicos, persuadir, conmover o informar según el propósito comunicativo y las características de la audiencia.');

-- COM-C1-CAP5: Interactúa estratégicamente con distintos interlocutores
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C1-CAP5-D4', 'Interactúa en diversas situaciones orales, utilizando estrategias discursivas y normativas, considerando los puntos de vista de otros, sus motivaciones, intereses y contextos culturales, y construyendo sobre las ideas de los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C1-CAP5-D5', 'Interactúa en situaciones comunicativas complejas, utilizando estrategias discursivas sofisticadas, considerando múltiples perspectivas, negociando significados y construyendo consensos o disensos fundamentados.');

-- COM-C1-CAP6: Reflexiona y evalúa la forma, el contenido y contexto del texto oral
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C1-CAP6-D4', 'Reflexiona y evalúa como hablante y oyente los textos orales del ámbito escolar, social, académico y de medios de comunicación a partir de sus conocimientos, el contexto sociocultural, la validez de la información, la eficacia de los recursos retóricos y la intención del hablante.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C1-CAP6-D5', 'Reflexiona y evalúa críticamente los textos orales del ámbito escolar, social, académico, profesional y de medios de comunicación, analizando la validez de los argumentos, la eficacia de los recursos retóricos, las intenciones implícitas y los sesgos ideológicos.');

-- COM-C2-CAP1: Obtiene información del texto escrito
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C2-CAP1-D4', 'Obtiene información explícita, relevante y complementaria, seleccionando datos específicos y detalles, en diversos tipos de textos con estructura compleja, vocabulario especializado y técnico, y múltiples perspectivas.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C2-CAP1-D5', 'Obtiene información explícita, relevante y complementaria, integrando datos de múltiples fuentes escritas, en textos con estructura compleja, vocabulario especializado y técnico, múltiples perspectivas y referencias intertextuales.');

-- COM-C2-CAP2: Infiere e interpreta información del texto
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C2-CAP2-D4', 'Infiere información deduciendo diversas relaciones lógicas y jerárquicas entre las ideas del texto escrito (causa-efecto múltiple, problema-solución, tesis-argumentos) a partir de información implícita, contrapuesta y ambigua del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C2-CAP2-D5', 'Infiere información deduciendo relaciones lógicas complejas y jerárquicas entre las ideas del texto escrito, a partir de información implícita, contrapuesta, ambigua y de múltiples perspectivas, considerando el contexto sociocultural e histórico.');

-- COM-C2-CAP3: Reflexiona y evalúa la forma, el contenido y contexto del texto
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C2-CAP3-D4', 'Reflexiona y evalúa los textos que lee opinando acerca del contenido, la organización textual, las estrategias discursivas, la validez y confiabilidad de la información, la eficacia de los recursos textuales, la intención del autor y el contexto sociocultural.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C2-CAP3-D5', 'Reflexiona y evalúa críticamente los textos que lee, analizando el contenido, la organización textual, las estrategias discursivas, la validez de los argumentos, la eficacia de los recursos textuales, las intenciones implícitas, los sesgos ideológicos y el contexto sociocultural e histórico.');

-- COM-C3-CAP1: Adecúa el texto a la situación comunicativa
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C3-CAP1-D4', 'Adecúa el texto a la situación comunicativa considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el formato, el soporte, el contexto sociocultural, las necesidades del destinatario y las convenciones del discurso académico.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C3-CAP1-D5', 'Adecúa el texto a situaciones comunicativas complejas considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el formato, el soporte, el contexto sociocultural, las necesidades diversas del destinatario y las convenciones del discurso académico y profesional.');

-- COM-C3-CAP2: Organiza y desarrolla las ideas de forma coherente y cohesionada
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C3-CAP2-D4', 'Organiza y desarrolla las ideas de forma coherente y cohesionada. Ordena las ideas en torno a un tema, las jerarquiza en subtemas e ideas principales y secundarias, y las desarrolla para ampliar, precisar, contrastar, reforzar o ejemplificar información de manera estratégica.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C3-CAP2-D5', 'Organiza y desarrolla las ideas de forma coherente y cohesionada en textos complejos. Ordena las ideas en torno a un tema, las jerarquiza en múltiples niveles, y las desarrolla para ampliar, precisar, contrastar, reforzar, ejemplificar o refutar información de manera estratégica y sofisticada.');

-- COM-C3-CAP3: Utiliza convenciones del lenguaje escrito de forma pertinente
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C3-CAP3-D4', 'Utiliza convenciones del lenguaje escrito de forma pertinente. Usa de forma precisa y variada los recursos gramaticales y ortográficos (tiempos verbales, conectores lógicos, puntuación, referentes) que contribuyen al sentido y la cohesión de su texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C3-CAP3-D5', 'Utiliza convenciones del lenguaje escrito de forma pertinente y sofisticada. Usa de forma precisa, variada y estratégica los recursos gramaticales y ortográficos que contribuyen al sentido, la cohesión y el estilo de su texto académico o profesional.');

-- COM-C3-CAP4: Reflexiona y evalúa la forma, el contenido y contexto del texto escrito
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'COM-C3-CAP4-D4', 'Reflexiona y evalúa de manera permanente el texto que escribe, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes entre sí, si el uso de conectores y referentes asegura la cohesión, si los recursos ortográficos contribuyen al sentido del texto, si la información es precisa y si el registro es apropiado.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'COM-C3-CAP4-D5', 'Reflexiona y evalúa críticamente el texto que escribe, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes y están bien fundamentadas, si el uso de recursos cohesivos es efectivo, si los recursos ortográficos y estilísticos contribuyen al propósito comunicativo y si el texto es efectivo para la audiencia prevista.');

-- ============================================================================
-- CIENCIA Y TECNOLOGÍA - 22 desempeños (11 capacidades × 2 grados)
-- ============================================================================

-- CYT-C1-CAP1: Problematiza situaciones para hacer indagación
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C1-CAP1-D4', 'Problematiza situaciones para hacer indagación científica, formulando preguntas e hipótesis que involucran variables independientes, dependientes e intervinientes, considerando modelos científicos complejos.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C1-CAP1-D5', 'Problematiza situaciones para hacer indagación científica avanzada, formulando preguntas e hipótesis complejas que involucran múltiples variables y relaciones causales, considerando modelos científicos sofisticados.');

-- CYT-C1-CAP2: Diseña estrategias para hacer indagación
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C1-CAP2-D4', 'Diseña estrategias para hacer indagación científica, seleccionando materiales, instrumentos e información para comprobar o refutar hipótesis, considerando el margen de error y la confiabilidad de los datos.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C1-CAP2-D5', 'Diseña estrategias sofisticadas para hacer indagación científica, seleccionando y justificando materiales, instrumentos e información, considerando el control riguroso de variables, el margen de error y la validez estadística de los datos.');

-- CYT-C1-CAP3: Evalúa las implicancias del saber y del quehacer científico y tecnológico
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C1-CAP3-D4', 'Evalúa las implicancias éticas, sociales, ambientales y económicas del saber y del quehacer científico y tecnológico, considerando el desarrollo sostenible, la responsabilidad social y los dilemas éticos contemporáneos.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C1-CAP3-D5', 'Evalúa críticamente las implicancias éticas, sociales, ambientales, económicas y políticas del saber y del quehacer científico y tecnológico, considerando el desarrollo sostenible, la justicia social y los dilemas éticos globales.');

-- CYT-C2-CAP1: Comprende y usa conocimientos sobre los seres vivos, materia y energía
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C2-CAP1-D4', 'Comprende y usa conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo para explicar fenómenos naturales complejos, integrando conceptos de múltiples disciplinas científicas.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C2-CAP1-D5', 'Comprende y usa conocimientos avanzados sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo para explicar fenómenos naturales complejos y sus interrelaciones, integrando conceptos de múltiples disciplinas científicas y modelos teóricos sofisticados.');

-- CYT-C2-CAP2: Evalúa las implicancias del saber y del quehacer científico y tecnológico
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C2-CAP2-D4', 'Evalúa las implicancias del saber y del quehacer científico y tecnológico en la comprensión de fenómenos naturales, considerando evidencias científicas, modelos teóricos y sus limitaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C2-CAP2-D5', 'Evalúa críticamente las implicancias del saber y del quehacer científico y tecnológico en la comprensión de fenómenos naturales, analizando evidencias científicas, modelos teóricos, sus limitaciones y el contexto histórico del conocimiento científico.');

-- CYT-C3-CAP1: Determina una alternativa de solución tecnológica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C3-CAP1-D4', 'Determina una alternativa de solución tecnológica, integrando principios científicos y tecnológicos avanzados, considerando los requerimientos del problema, las restricciones, los recursos disponibles y criterios de optimización.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C3-CAP1-D5', 'Determina alternativas de solución tecnológica innovadoras, integrando principios científicos y tecnológicos complejos, considerando múltiples criterios de optimización, sostenibilidad e impacto social.');

-- CYT-C3-CAP2: Diseña la alternativa de solución tecnológica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C3-CAP2-D4', 'Diseña la alternativa de solución tecnológica representando su funcionamiento con dibujos, esquemas o diagramas estructurados, seleccionando materiales por sus propiedades físicas y químicas, y calculando dimensiones y tolerancias.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C3-CAP2-D5', 'Diseña alternativas de solución tecnológica sofisticadas, representando su funcionamiento con diagramas técnicos detallados, seleccionando materiales y procesos óptimos, y calculando dimensiones, tolerancias y especificaciones técnicas precisas.');

-- CYT-C3-CAP3: Implementa la alternativa de solución tecnológica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C3-CAP3-D4', 'Implementa la alternativa de solución tecnológica manipulando materiales, herramientas e instrumentos con técnicas convencionales y de seguridad, verificando el funcionamiento de cada parte o fase del prototipo y realizando ajustes.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C3-CAP3-D5', 'Implementa alternativas de solución tecnológica manipulando materiales, herramientas e instrumentos con técnicas avanzadas y de seguridad, verificando el funcionamiento integral del prototipo, realizando ajustes y optimizaciones basadas en pruebas sistemáticas.');

-- CYT-C3-CAP4: Evalúa y comunica el funcionamiento y los impactos de su alternativa de solución tecnológica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CYT-C3-CAP4-D4', 'Evalúa y comunica el funcionamiento de su alternativa de solución tecnológica, sus beneficios y limitaciones, considerando los requerimientos establecidos, los impactos ambientales y sociales, y propone mejoras.'),
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CYT-C3-CAP4-D5', 'Evalúa críticamente y comunica el funcionamiento de su alternativa de solución tecnológica, analizando su eficiencia, beneficios, limitaciones, impactos ambientales, sociales y económicos, y propone mejoras innovadoras basadas en evidencias.');


-- ============================================================================
-- CIENCIAS SOCIALES - 16 desempeños (8 capacidades × 2 grados)
-- ============================================================================

-- CS-C1-CAP1: Interpreta críticamente fuentes diversas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C1-CAP1-D4', 'Interpreta críticamente fuentes diversas (escritas, iconográficas, arqueológicas, orales, etc.) sobre hechos o procesos históricos, desde el origen de la humanidad hasta el siglo XX, evaluando la confiabilidad y utilidad de las fuentes para comprender la perspectiva de los protagonistas.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C1-CAP1-D5', 'Interpreta críticamente fuentes diversas sobre procesos históricos del siglo XX y XXI, evaluando la confiabilidad, utilidad y perspectiva de las fuentes, reconociendo sus limitaciones y sesgos, y contrastando múltiples interpretaciones historiográficas.');

-- CS-C1-CAP2: Comprende el tiempo histórico
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C1-CAP2-D4', 'Comprende el tiempo histórico, identificando simultaneidades, secuencias, duraciones y ritmos de cambio en procesos históricos complejos, y estableciendo relaciones entre múltiples causas y consecuencias.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C1-CAP2-D5', 'Comprende el tiempo histórico de manera sofisticada, analizando simultaneidades, secuencias, duraciones y ritmos de cambio en procesos históricos complejos del siglo XX y XXI, estableciendo relaciones multicausales y evaluando consecuencias de corto, mediano y largo plazo.');

-- CS-C1-CAP3: Elabora explicaciones sobre procesos históricos
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C1-CAP3-D4', 'Elabora explicaciones sobre procesos históricos, estableciendo relaciones entre múltiples causas y consecuencias, utilizando conceptos históricos complejos y reconociendo la relevancia de estos procesos para comprender el presente.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C1-CAP3-D5', 'Elabora explicaciones sofisticadas sobre procesos históricos del siglo XX y XXI, estableciendo relaciones multicausales complejas, utilizando conceptos históricos avanzados, reconociendo múltiples perspectivas y evaluando la relevancia de estos procesos para comprender y transformar el presente.');

-- CS-C2-CAP1: Comprende las relaciones entre los elementos naturales y sociales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C2-CAP1-D4', 'Comprende las relaciones entre los elementos naturales y sociales que configuran los espacios geográficos, explicando cómo las sociedades se adaptan, transforman y organizan el espacio a diferentes escalas, considerando la sostenibilidad ambiental.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C2-CAP1-D5', 'Comprende de manera integral las relaciones complejas entre los elementos naturales y sociales que configuran los espacios geográficos, explicando cómo las sociedades se adaptan, transforman y organizan el espacio a múltiples escalas, evaluando críticamente la sostenibilidad ambiental y la justicia espacial.');

-- CS-C2-CAP2: Maneja fuentes de información para comprender el espacio geográfico
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C2-CAP2-D4', 'Maneja fuentes de información (cartográficas, fotográficas, estadísticas, SIG, etc.) para comprender el espacio geográfico, interpretando y elaborando representaciones del espacio a diferentes escalas.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C2-CAP2-D5', 'Maneja de manera sofisticada fuentes de información diversas (cartográficas, fotográficas, estadísticas, SIG, teledetección, etc.) para comprender el espacio geográfico, interpretando, elaborando y evaluando críticamente representaciones del espacio a múltiples escalas.');

-- CS-C2-CAP3: Genera acciones para conservar el ambiente local y global
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C2-CAP3-D4', 'Genera acciones para conservar el ambiente local y global, explicando la importancia de la gestión sostenible de los recursos naturales y la mitigación del cambio climático, y participando en acciones concretas de conservación.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C2-CAP3-D5', 'Genera acciones innovadoras para conservar el ambiente local y global, explicando la importancia de la gestión sostenible, la mitigación y adaptación al cambio climático, la justicia ambiental, y liderando acciones concretas de conservación y transformación socioambiental.');

-- CS-C3-CAP1: Interpreta críticamente fuentes diversas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C3-CAP1-D4', 'Interpreta críticamente fuentes diversas sobre la economía y el desarrollo sostenible, evaluando la confiabilidad de la información y reconociendo diferentes perspectivas sobre los procesos económicos y su impacto social y ambiental.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C3-CAP1-D5', 'Interpreta críticamente fuentes diversas sobre la economía global y el desarrollo sostenible, evaluando la confiabilidad, utilidad y sesgos de la información, y contrastando múltiples perspectivas sobre los procesos económicos contemporáneos y sus implicancias sociales, ambientales y éticas.');

-- CS-C3-CAP2: Gestiona responsablemente los recursos económicos
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CS-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'CS-C3-CAP2-D4', 'Gestiona responsablemente los recursos económicos, tomando decisiones informadas sobre el consumo, el ahorro y la inversión, considerando sus derechos y responsabilidades como consumidor y ciudadano económico.'),
((SELECT id FROM capacidades WHERE codigo = 'CS-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'CS-C3-CAP2-D5', 'Gestiona responsablemente los recursos económicos de manera estratégica, tomando decisiones informadas y éticas sobre el consumo, el ahorro, la inversión y el emprendimiento, considerando sus derechos, responsabilidades y el impacto de sus decisiones en el desarrollo sostenible y la justicia social.');

-- ============================================================================
-- DESARROLLO PERSONAL, CIUDADANÍA Y CÍVICA - 18 desempeños (9 capacidades × 2 grados)
-- ============================================================================

-- DPCC-C1-CAP1: Se valora a sí mismo
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C1-CAP1-D4', 'Se valora a sí mismo reconociendo sus características, potencialidades y limitaciones, reflexionando sobre su identidad y proyecto de vida, y tomando decisiones autónomas y responsables sobre su desarrollo personal.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C1-CAP1-D5', 'Se valora a sí mismo de manera integral, reconociendo sus características, potencialidades y limitaciones, reflexionando críticamente sobre su identidad, proyecto de vida y rol social, y tomando decisiones autónomas, responsables y éticas sobre su desarrollo personal y profesional.');

-- DPCC-C1-CAP2: Autorregula sus emociones
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C1-CAP2-D4', 'Autorregula sus emociones identificando sus causas y consecuencias, utilizando estrategias de regulación emocional para afrontar situaciones desafiantes y mantener relaciones interpersonales saludables.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C1-CAP2-D5', 'Autorregula sus emociones de manera sofisticada, identificando sus causas y consecuencias, utilizando estrategias avanzadas de regulación emocional para afrontar situaciones complejas, mantener relaciones interpersonales saludables y contribuir al bienestar colectivo.');

-- DPCC-C1-CAP3: Reflexiona y argumenta éticamente
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C1-CAP3-D4', 'Reflexiona y argumenta éticamente sobre situaciones que involucran dilemas morales, sustentando su posición en principios éticos, valores democráticos y derechos humanos, y considerando múltiples perspectivas.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C1-CAP3-D5', 'Reflexiona y argumenta éticamente de manera sofisticada sobre situaciones que involucran dilemas morales complejos, sustentando su posición en principios éticos universales, valores democráticos, derechos humanos y teorías éticas, considerando múltiples perspectivas y consecuencias.');

-- DPCC-C1-CAP4: Vive su sexualidad de manera integral y responsable
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C1-CAP4-D4', 'Vive su sexualidad de manera integral y responsable, tomando decisiones informadas sobre su salud sexual y reproductiva, respetando la diversidad sexual y de género, y estableciendo relaciones afectivas basadas en el respeto, la igualdad y el consentimiento.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C1-CAP4-D5', 'Vive su sexualidad de manera integral, responsable y autónoma, tomando decisiones informadas y éticas sobre su salud sexual y reproductiva, respetando y promoviendo la diversidad sexual y de género, y estableciendo relaciones afectivas basadas en el respeto, la igualdad, el consentimiento y la responsabilidad compartida.');

-- DPCC-C2-CAP1: Interactúa con todas las personas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C2-CAP1-D4', 'Interactúa con todas las personas reconociendo y valorando la diversidad cultural, étnica, lingüística y de género, rechazando toda forma de discriminación y promoviendo relaciones interculturales basadas en el respeto y la igualdad.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C2-CAP1-D5', 'Interactúa con todas las personas de manera inclusiva, reconociendo y valorando la diversidad en todas sus manifestaciones, rechazando toda forma de discriminación y violencia, y promoviendo activamente relaciones interculturales basadas en el respeto, la igualdad y la justicia social.');

-- DPCC-C2-CAP2: Construye normas y asume acuerdos y leyes
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C2-CAP2-D4', 'Construye normas y asume acuerdos y leyes, evaluando su pertinencia y legitimidad, participando en su elaboración y modificación, y cumpliendo sus responsabilidades como ciudadano en el marco del Estado de derecho.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C2-CAP2-D5', 'Construye normas y asume acuerdos y leyes de manera crítica, evaluando su pertinencia, legitimidad y justicia, participando activamente en su elaboración y modificación, y cumpliendo sus responsabilidades como ciudadano comprometido con el fortalecimiento del Estado de derecho y la democracia.');

-- DPCC-C2-CAP3: Maneja conflictos de manera constructiva
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C2-CAP3-D4', 'Maneja conflictos de manera constructiva utilizando estrategias de diálogo, negociación y mediación, reconociendo las causas del conflicto, los intereses de las partes y buscando soluciones justas y pacíficas.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C2-CAP3-D5', 'Maneja conflictos de manera constructiva y sofisticada, utilizando estrategias avanzadas de diálogo, negociación, mediación y construcción de paz, analizando las causas estructurales del conflicto, los intereses y necesidades de las partes, y promoviendo soluciones justas, pacíficas y transformadoras.');

-- DPCC-C2-CAP4: Delibera sobre asuntos públicos
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C2-CAP4-D4', 'Delibera sobre asuntos públicos sustentando su posición en argumentos razonados, información confiable y principios democráticos, considerando múltiples perspectivas y buscando el bien común.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C2-CAP4-D5', 'Delibera sobre asuntos públicos complejos sustentando su posición en argumentos rigurosos, evidencias confiables, principios democráticos y éticos, considerando múltiples perspectivas, intereses en conflicto y buscando el bien común y la justicia social.');

-- DPCC-C2-CAP5: Participa en acciones que promueven el bienestar común
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP5'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'DPCC-C2-CAP5-D4', 'Participa en acciones que promueven el bienestar común, ejerciendo sus derechos y responsabilidades como ciudadano, y contribuyendo a la construcción de una sociedad democrática, inclusiva y sostenible.'),
((SELECT id FROM capacidades WHERE codigo = 'DPCC-C2-CAP5'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'DPCC-C2-CAP5-D5', 'Participa activamente en acciones que promueven el bienestar común y la transformación social, ejerciendo sus derechos y responsabilidades como ciudadano comprometido, y liderando iniciativas para la construcción de una sociedad democrática, inclusiva, justa y sostenible.');

-- ============================================================================
-- INGLÉS - 26 desempeños (13 capacidades × 2 grados)
-- ============================================================================

-- ING-C1-CAP1: Obtiene información de textos orales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C1-CAP1-D4', 'Obtiene información explícita, relevante y complementaria, seleccionando datos específicos, en textos orales en inglés que presentan vocabulario variado, expresiones idiomáticas y estructuras gramaticales complejas.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C1-CAP1-D5', 'Obtiene información explícita, relevante y complementaria, integrando datos de múltiples fuentes orales en inglés, en textos que presentan vocabulario especializado, expresiones idiomáticas complejas y estructuras gramaticales sofisticadas.');

-- ING-C1-CAP2: Infiere e interpreta información de textos orales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C1-CAP2-D4', 'Infiere e interpreta información de textos orales en inglés, deduciendo relaciones lógicas entre ideas, el significado de expresiones idiomáticas y el propósito comunicativo, a partir de información implícita y el contexto sociocultural.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C1-CAP2-D5', 'Infiere e interpreta información de textos orales complejos en inglés, deduciendo relaciones lógicas sofisticadas, el significado de expresiones idiomáticas y culturales, el propósito comunicativo y las intenciones implícitas, a partir del contexto sociocultural e histórico.');

-- ING-C1-CAP3: Adecúa, organiza y desarrolla las ideas en inglés de forma coherente y cohesionada
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C1-CAP3-D4', 'Adecúa, organiza y desarrolla las ideas en inglés de forma coherente y cohesionada, considerando el propósito comunicativo, el tipo textual y las características del género discursivo, utilizando vocabulario variado y estructuras gramaticales complejas.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C1-CAP3-D5', 'Adecúa, organiza y desarrolla las ideas en inglés de forma coherente y cohesionada en situaciones comunicativas complejas, considerando el propósito, el tipo textual, el género discursivo y el contexto sociocultural, utilizando vocabulario especializado y estructuras gramaticales sofisticadas.');

-- ING-C1-CAP4: Utiliza recursos no verbales y paraverbales de forma estratégica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C1-CAP4-D4', 'Utiliza recursos no verbales y paraverbales de forma estratégica para enfatizar significados, mantener el interés del interlocutor y facilitar la comprensión en inglés.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C1-CAP4-D5', 'Utiliza recursos no verbales y paraverbales de forma estratégica y sofisticada para producir efectos retóricos específicos, persuadir y facilitar la comprensión en situaciones comunicativas complejas en inglés.');

-- ING-C1-CAP5: Interactúa estratégicamente en inglés con distintos interlocutores
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C1-CAP5-D4', 'Interactúa estratégicamente en inglés con distintos interlocutores, utilizando estrategias discursivas y considerando el contexto sociocultural, para construir significados y mantener la comunicación.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C1-CAP5-D5', 'Interactúa estratégicamente en inglés en situaciones comunicativas complejas, utilizando estrategias discursivas sofisticadas, considerando múltiples perspectivas y el contexto sociocultural, para negociar significados y construir consensos.');

-- ING-C1-CAP6: Reflexiona y evalúa la forma, el contenido y el contexto del texto oral en inglés
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C1-CAP6-D4', 'Reflexiona y evalúa la forma, el contenido y el contexto del texto oral en inglés, opinando sobre la validez de la información, la eficacia de los recursos retóricos y la intención del hablante.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C1-CAP6-D5', 'Reflexiona y evalúa críticamente la forma, el contenido y el contexto del texto oral en inglés, analizando la validez de los argumentos, la eficacia de los recursos retóricos, las intenciones implícitas y los sesgos culturales.');

-- ING-C2-CAP1: Obtiene información de textos escritos en inglés
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C2-CAP1-D4', 'Obtiene información explícita, relevante y complementaria, seleccionando datos específicos, en textos escritos en inglés con estructura compleja, vocabulario variado y expresiones idiomáticas.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C2-CAP1-D5', 'Obtiene información explícita, relevante y complementaria, integrando datos de múltiples fuentes escritas en inglés, en textos con estructura compleja, vocabulario especializado, expresiones idiomáticas y referencias intertextuales.');

-- ING-C2-CAP2: Infiere e interpreta información de textos escritos en inglés
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C2-CAP2-D4', 'Infiere e interpreta información de textos escritos en inglés, deduciendo relaciones lógicas entre ideas, el significado de expresiones idiomáticas y el propósito comunicativo, a partir de información implícita y el contexto sociocultural.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C2-CAP2-D5', 'Infiere e interpreta información de textos escritos complejos en inglés, deduciendo relaciones lógicas sofisticadas, el significado de expresiones idiomáticas y culturales, el propósito comunicativo y las intenciones implícitas, considerando el contexto sociocultural e histórico.');

-- ING-C2-CAP3: Reflexiona y evalúa la forma, el contenido y el contexto del texto escrito en inglés
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C2-CAP3-D4', 'Reflexiona y evalúa la forma, el contenido y el contexto del texto escrito en inglés, opinando sobre la validez de la información, la eficacia de los recursos textuales y la intención del autor.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C2-CAP3-D5', 'Reflexiona y evalúa críticamente la forma, el contenido y el contexto del texto escrito en inglés, analizando la validez de los argumentos, la eficacia de los recursos textuales, las intenciones implícitas y los sesgos culturales e ideológicos.');

-- ING-C3-CAP1: Adecúa el texto escrito en inglés a la situación comunicativa
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C3-CAP1-D4', 'Adecúa el texto escrito en inglés a la situación comunicativa, considerando el propósito, el tipo textual, las características del género discursivo y el contexto sociocultural.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C3-CAP1-D5', 'Adecúa el texto escrito en inglés a situaciones comunicativas complejas, considerando el propósito, el tipo textual, las características del género discursivo, el contexto sociocultural y las convenciones del discurso académico y profesional.');

-- ING-C3-CAP2: Organiza y desarrolla las ideas en inglés de forma coherente y cohesionada
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C3-CAP2-D4', 'Organiza y desarrolla las ideas en inglés de forma coherente y cohesionada, utilizando vocabulario variado, estructuras gramaticales complejas y conectores lógicos apropiados.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C3-CAP2-D5', 'Organiza y desarrolla las ideas en inglés de forma coherente y cohesionada en textos complejos, utilizando vocabulario especializado, estructuras gramaticales sofisticadas y recursos cohesivos variados de manera estratégica.');

-- ING-C3-CAP3: Utiliza convenciones del lenguaje escrito en inglés de forma pertinente
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C3-CAP3-D4', 'Utiliza convenciones del lenguaje escrito en inglés de forma pertinente, usando de forma precisa los recursos gramaticales, ortográficos y de puntuación que contribuyen al sentido del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C3-CAP3-D5', 'Utiliza convenciones del lenguaje escrito en inglés de forma pertinente y sofisticada, usando de forma precisa, variada y estratégica los recursos gramaticales, ortográficos y estilísticos que contribuyen al sentido y la efectividad del texto.');

-- ING-C3-CAP4: Reflexiona y evalúa la forma, el contenido y el contexto del texto escrito en inglés
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ING-C3-CAP4-D4', 'Reflexiona y evalúa de manera permanente el texto que escribe en inglés, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes y si el uso de recursos cohesivos y ortográficos es apropiado.'),
((SELECT id FROM capacidades WHERE codigo = 'ING-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ING-C3-CAP4-D5', 'Reflexiona y evalúa críticamente el texto que escribe en inglés, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes y están bien fundamentadas, y si el uso de recursos cohesivos, ortográficos y estilísticos es efectivo para el propósito comunicativo.');

-- ============================================================================
-- ARTE Y CULTURA - 14 desempeños (7 capacidades × 2 grados)
-- ============================================================================

-- ART-C1-CAP1: Percibe manifestaciones artístico-culturales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C1-CAP1-D4', 'Percibe manifestaciones artístico-culturales identificando y describiendo los elementos, técnicas y procesos que las componen, analizando cómo transmiten mensajes, ideas y sentimientos, y reconociendo las influencias de diversos contextos culturales e históricos.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C1-CAP1-D5', 'Percibe manifestaciones artístico-culturales de manera sofisticada, identificando y analizando los elementos, técnicas y procesos complejos que las componen, interpretando cómo transmiten mensajes, ideas y sentimientos, y evaluando críticamente las influencias de diversos contextos culturales, históricos y sociales.');

-- ART-C1-CAP2: Contextualiza manifestaciones artístico-culturales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C1-CAP2-D4', 'Contextualiza manifestaciones artístico-culturales relacionándolas con sus contextos de producción y recepción, reconociendo las influencias de diversos movimientos artísticos, corrientes estéticas y contextos socioculturales e históricos.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C1-CAP2-D5', 'Contextualiza manifestaciones artístico-culturales de manera crítica, analizando sus contextos de producción y recepción, evaluando las influencias de diversos movimientos artísticos, corrientes estéticas, contextos socioculturales, históricos y políticos, y reconociendo múltiples interpretaciones.');

-- ART-C1-CAP3: Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C1-CAP3-D4', 'Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales, interpretando las intenciones y significados, evaluando la eficacia de los recursos utilizados y emitiendo juicios de valor fundamentados.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C1-CAP3-D5', 'Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales de manera sofisticada, interpretando múltiples intenciones y significados, evaluando la eficacia de los recursos utilizados, emitiendo juicios de valor fundamentados y proponiendo interpretaciones alternativas.');

-- ART-C2-CAP1: Explora y experimenta los lenguajes artísticos
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C2-CAP1-D4', 'Explora y experimenta los lenguajes artísticos (artes visuales, música, danza, teatro) utilizando diversos materiales, técnicas y recursos tecnológicos para desarrollar sus ideas creativas y expresar sus emociones, sentimientos e ideas de manera personal.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C2-CAP1-D5', 'Explora y experimenta los lenguajes artísticos de manera innovadora, utilizando diversos materiales, técnicas avanzadas y recursos tecnológicos para desarrollar propuestas creativas originales y expresar sus emociones, sentimientos, ideas y perspectivas de manera personal y sofisticada.');

-- ART-C2-CAP2: Aplica procesos creativos
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C2-CAP2-D4', 'Aplica procesos creativos planificando, diseñando y produciendo proyectos artísticos individuales o colaborativos, seleccionando y combinando elementos, técnicas y recursos de manera intencional para comunicar ideas y emociones.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C2-CAP2-D5', 'Aplica procesos creativos sofisticados, planificando, diseñando y produciendo proyectos artísticos individuales o colaborativos complejos, seleccionando y combinando elementos, técnicas y recursos de manera estratégica e innovadora para comunicar ideas, emociones y perspectivas de manera efectiva.');

-- ART-C2-CAP3: Evalúa y comunica sus procesos y proyectos
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C2-CAP3-D4', 'Evalúa y comunica sus procesos y proyectos artísticos, describiendo las intenciones, decisiones y logros, reflexionando sobre su proceso creativo y el impacto de su trabajo en sí mismo y en los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C2-CAP3-D5', 'Evalúa críticamente y comunica sus procesos y proyectos artísticos, analizando las intenciones, decisiones y logros, reflexionando profundamente sobre su proceso creativo, el impacto de su trabajo en sí mismo y en los demás, y proponiendo mejoras y nuevas direcciones creativas.');

-- ART-C3-CAP1: Genera ideas y propuestas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ART-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ART-C3-CAP1-D4', 'Genera ideas y propuestas artísticas innovadoras a partir de estímulos diversos, investigando y experimentando con diferentes lenguajes artísticos para desarrollar proyectos creativos que respondan a intenciones específicas.'),
((SELECT id FROM capacidades WHERE codigo = 'ART-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ART-C3-CAP1-D5', 'Genera ideas y propuestas artísticas innovadoras y originales a partir de estímulos diversos, investigando y experimentando con diferentes lenguajes artísticos de manera sofisticada para desarrollar proyectos creativos complejos que respondan a intenciones específicas y tengan impacto social o cultural.');

-- ============================================================================
-- EDUCACIÓN FÍSICA - 12 desempeños (6 capacidades × 2 grados)
-- ============================================================================

-- EF-C1-CAP1: Comprende su cuerpo
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EF-C1-CAP1-D4', 'Comprende su cuerpo reconociendo sus capacidades físicas, habilidades motrices y posibilidades de movimiento, y cómo estas se relacionan con la salud, el bienestar y el rendimiento físico, aplicando principios de entrenamiento y acondicionamiento físico.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EF-C1-CAP1-D5', 'Comprende su cuerpo de manera integral, reconociendo sus capacidades físicas, habilidades motrices y posibilidades de movimiento, y cómo estas se relacionan con la salud, el bienestar y el rendimiento físico, aplicando principios avanzados de entrenamiento, acondicionamiento físico y prevención de lesiones.');

-- EF-C1-CAP2: Se expresa corporalmente
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EF-C1-CAP2-D4', 'Se expresa corporalmente utilizando el lenguaje corporal para comunicar ideas, emociones y sentimientos, creando secuencias de movimiento y coreografías que integran diferentes elementos expresivos y técnicos.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EF-C1-CAP2-D5', 'Se expresa corporalmente de manera sofisticada, utilizando el lenguaje corporal para comunicar ideas, emociones y sentimientos complejos, creando secuencias de movimiento y coreografías originales que integran diversos elementos expresivos, técnicos y culturales.');

-- EF-C2-CAP1: Se relaciona utilizando sus habilidades sociomotrices
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EF-C2-CAP1-D4', 'Se relaciona utilizando sus habilidades sociomotrices al participar en actividades físicas y deportivas, asumiendo roles y responsabilidades, respetando las normas y a sus compañeros, y resolviendo conflictos de manera constructiva.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EF-C2-CAP1-D5', 'Se relaciona de manera efectiva utilizando sus habilidades sociomotrices al participar en actividades físicas y deportivas complejas, asumiendo liderazgo, promoviendo la inclusión, respetando las normas y a sus compañeros, y resolviendo conflictos de manera constructiva y colaborativa.');

-- EF-C2-CAP2: Crea y aplica estrategias y tácticas de juego
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EF-C2-CAP2-D4', 'Crea y aplica estrategias y tácticas de juego en actividades deportivas, adaptándolas a las características del equipo, del oponente y del contexto, para mejorar el rendimiento colectivo.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EF-C2-CAP2-D5', 'Crea y aplica estrategias y tácticas de juego sofisticadas en actividades deportivas complejas, adaptándolas de manera flexible a las características del equipo, del oponente y del contexto, y evaluando su efectividad para optimizar el rendimiento colectivo.');

-- EF-C3-CAP1: Comprende las relaciones entre la actividad física, alimentación, postura e higiene
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EF-C3-CAP1-D4', 'Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y su impacto en la salud y el bienestar, adoptando prácticas saludables de manera autónoma.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EF-C3-CAP1-D5', 'Comprende de manera integral las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y su impacto en la salud y el bienestar, adoptando y promoviendo prácticas saludables de manera autónoma y responsable.');

-- EF-C3-CAP2: Incorpora prácticas que mejoran su calidad de vida
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EF-C3-CAP2-D4', 'Incorpora prácticas que mejoran su calidad de vida, planificando y ejecutando programas de actividad física y alimentación saludable de manera autónoma, evaluando sus resultados y realizando ajustes.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EF-C3-CAP2-D5', 'Incorpora prácticas que mejoran su calidad de vida de manera integral, planificando y ejecutando programas personalizados de actividad física y alimentación saludable, evaluando sus resultados de manera sistemática, realizando ajustes y promoviendo estilos de vida saludables en su entorno.');

-- ============================================================================
-- EDUCACIÓN PARA EL TRABAJO - 14 desempeños (7 capacidades × 2 grados)
-- ============================================================================

-- EPT-C1-CAP1: Define metas de aprendizaje
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C1-CAP1-D4', 'Define metas de aprendizaje relacionadas con su proyecto de vida y desarrollo profesional, identificando sus intereses, habilidades y oportunidades del entorno, y planificando acciones para alcanzarlas.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C1-CAP1-D5', 'Define metas de aprendizaje estratégicas relacionadas con su proyecto de vida y desarrollo profesional, analizando sus intereses, habilidades, oportunidades del entorno y tendencias del mercado laboral, y planificando acciones concretas y realistas para alcanzarlas.');

-- EPT-C1-CAP2: Organiza acciones estratégicas para alcanzar sus metas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C1-CAP2-D4', 'Organiza acciones estratégicas para alcanzar sus metas de aprendizaje y desarrollo profesional, gestionando su tiempo y recursos de manera eficiente, y monitoreando su progreso.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C1-CAP2-D5', 'Organiza acciones estratégicas de manera sofisticada para alcanzar sus metas de aprendizaje y desarrollo profesional, gestionando su tiempo y recursos de manera óptima, monitoreando su progreso de manera sistemática y realizando ajustes basados en evidencias.');

-- EPT-C1-CAP3: Reflexiona sobre sus procesos de aprendizaje
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C1-CAP3-D4', 'Reflexiona sobre sus procesos de aprendizaje, identificando sus fortalezas, debilidades y estrategias efectivas, y aplicando mejoras para optimizar su desarrollo personal y profesional.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C1-CAP3-D5', 'Reflexiona críticamente sobre sus procesos de aprendizaje, analizando sus fortalezas, debilidades, estrategias efectivas y áreas de mejora, y aplicando mejoras sistemáticas para optimizar su desarrollo personal y profesional de manera continua.');

-- EPT-C2-CAP1: Recoge información sobre necesidades o problemas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C2-CAP1-D4', 'Recoge información sobre necesidades o problemas de su entorno utilizando diversas técnicas de investigación, analizando datos y identificando oportunidades para proponer soluciones innovadoras.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C2-CAP1-D5', 'Recoge información sobre necesidades o problemas de su entorno de manera sistemática, utilizando técnicas de investigación avanzadas, analizando datos cualitativos y cuantitativos, e identificando oportunidades para proponer soluciones innovadoras y viables.');

-- EPT-C2-CAP2: Diseña alternativas de propuesta de valor
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C2-CAP2-D4', 'Diseña alternativas de propuesta de valor creativas e innovadoras que respondan a necesidades o problemas identificados, considerando aspectos técnicos, económicos y ambientales.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C2-CAP2-D5', 'Diseña alternativas de propuesta de valor creativas, innovadoras y viables que respondan a necesidades o problemas identificados, considerando aspectos técnicos, económicos, ambientales, sociales y éticos, y evaluando su factibilidad.');

-- EPT-C2-CAP3: Implementa sus alternativas de propuesta de valor
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C2-CAP3-D4', 'Implementa sus alternativas de propuesta de valor planificando y ejecutando acciones, gestionando recursos, trabajando en equipo y superando obstáculos para lograr los resultados esperados.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C2-CAP3-D5', 'Implementa sus alternativas de propuesta de valor de manera eficiente, planificando y ejecutando acciones estratégicas, gestionando recursos de manera óptima, liderando equipos de trabajo y superando obstáculos de manera creativa para lograr los resultados esperados.');

-- EPT-C2-CAP4: Evalúa los resultados del proyecto de emprendimiento
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'EPT-C2-CAP4-D4', 'Evalúa los resultados del proyecto de emprendimiento analizando el logro de objetivos, el impacto generado y las lecciones aprendidas, y propone mejoras para futuros proyectos.'),
((SELECT id FROM capacidades WHERE codigo = 'EPT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'EPT-C2-CAP4-D5', 'Evalúa críticamente los resultados del proyecto de emprendimiento analizando el logro de objetivos, el impacto económico, social y ambiental generado, las lecciones aprendidas y la sostenibilidad del proyecto, y propone mejoras estratégicas para futuros emprendimientos.');

-- ============================================================================
-- EDUCACIÓN RELIGIOSA - 10 desempeños (5 capacidades × 2 grados)
-- ============================================================================

-- ER-C1-CAP1: Conoce a Dios y asume su identidad religiosa y espiritual
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ER-C1-CAP1-D4', 'Conoce a Dios y asume su identidad religiosa y espiritual como persona digna, libre y trascendente, comprendiendo la doctrina de su propia religión y dialogando con otras tradiciones religiosas y espirituales.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ER-C1-CAP1-D5', 'Conoce a Dios y asume su identidad religiosa y espiritual de manera madura, como persona digna, libre y trascendente, comprendiendo profundamente la doctrina de su propia religión, dialogando críticamente con otras tradiciones religiosas y espirituales, y construyendo su proyecto de vida desde una perspectiva de fe.');

-- ER-C1-CAP2: Cultiva y valora las manifestaciones religiosas de su entorno
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ER-C1-CAP2-D4', 'Cultiva y valora las manifestaciones religiosas de su entorno argumentando su fe de manera comprensible y respetuosa, y reconociendo la importancia del diálogo interreligioso para la convivencia pacífica.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ER-C1-CAP2-D5', 'Cultiva y valora las manifestaciones religiosas de su entorno argumentando su fe de manera comprensible, respetuosa y fundamentada, reconociendo la importancia del diálogo interreligioso e intercultural para la convivencia pacífica y la construcción de una sociedad más justa.');

-- ER-C2-CAP1: Transforma su entorno desde el encuentro personal y comunitario con Dios
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ER-C2-CAP1-D4', 'Transforma su entorno desde el encuentro personal y comunitario con Dios y desde la fe que profesa, actuando coherentemente con los principios de su conciencia moral en situaciones concretas de la vida.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ER-C2-CAP1-D5', 'Transforma su entorno de manera comprometida desde el encuentro personal y comunitario con Dios y desde la fe que profesa, actuando coherentemente con los principios de su conciencia moral en situaciones concretas de la vida y promoviendo la justicia, la paz y el bien común.');

-- ER-C2-CAP2: Actúa coherentemente en razón de su fe
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ER-C2-CAP2-D4', 'Actúa coherentemente en razón de su fe según los principios de su conciencia moral en situaciones concretas de la vida, tomando decisiones responsables y comprometiéndose con la promoción de los derechos humanos y el bien común.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ER-C2-CAP2-D5', 'Actúa coherentemente en razón de su fe de manera madura y comprometida, según los principios de su conciencia moral en situaciones concretas de la vida, tomando decisiones responsables y éticas, y liderando acciones que promuevan los derechos humanos, la justicia social y el bien común.');

-- ER-C2-CAP3: Asume su rol en la transformación de la sociedad
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'ER-C2-CAP3-D4', 'Asume su rol en la transformación de la sociedad a la luz del Evangelio y de la enseñanza de la Iglesia, participando en acciones concretas que promuevan la justicia, la solidaridad y el cuidado de la creación.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'ER-C2-CAP3-D5', 'Asume su rol en la transformación de la sociedad de manera protagónica a la luz del Evangelio y de la enseñanza de la Iglesia, liderando acciones concretas que promuevan la justicia, la solidaridad, el cuidado de la creación y la construcción de una civilización del amor.');

-- ============================================================================
-- PERSONAL SOCIAL - 8 desempeños (4 capacidades × 2 grados)
-- ============================================================================

-- PS-C1-CAP1: Construye su identidad
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'PS-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'PS-C1-CAP1-D4', 'Construye su identidad reconociendo sus características personales, culturales y sociales, reflexionando sobre su proyecto de vida y tomando decisiones autónomas y responsables sobre su desarrollo personal y social.'),
((SELECT id FROM capacidades WHERE codigo = 'PS-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'PS-C1-CAP1-D5', 'Construye su identidad de manera integral, reconociendo sus características personales, culturales y sociales, reflexionando críticamente sobre su proyecto de vida y rol en la sociedad, y tomando decisiones autónomas, responsables y éticas sobre su desarrollo personal, social y profesional.');

-- PS-C1-CAP2: Se valora a sí mismo
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'PS-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'PS-C1-CAP2-D4', 'Se valora a sí mismo reconociendo sus potencialidades y limitaciones, desarrollando una autoestima positiva y tomando decisiones que favorezcan su bienestar y desarrollo personal.'),
((SELECT id FROM capacidades WHERE codigo = 'PS-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'PS-C1-CAP2-D5', 'Se valora a sí mismo de manera integral, reconociendo sus potencialidades y limitaciones, desarrollando una autoestima positiva y resiliente, y tomando decisiones que favorezcan su bienestar, desarrollo personal y contribución a la sociedad.');

-- PS-C2-CAP1: Convive y participa democráticamente
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'PS-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'PS-C2-CAP1-D4', 'Convive y participa democráticamente en la búsqueda del bien común, respetando la diversidad, cumpliendo sus responsabilidades y ejerciendo sus derechos en el marco de una cultura de paz y respeto a los derechos humanos.'),
((SELECT id FROM capacidades WHERE codigo = 'PS-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'PS-C2-CAP1-D5', 'Convive y participa democráticamente de manera activa y comprometida en la búsqueda del bien común, respetando y promoviendo la diversidad, cumpliendo sus responsabilidades, ejerciendo sus derechos y liderando acciones que fortalezcan la cultura de paz y el respeto a los derechos humanos.');

-- PS-C2-CAP2: Construye interpretaciones históricas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'PS-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'PS-C2-CAP2-D4', 'Construye interpretaciones históricas sobre procesos y hechos relevantes, estableciendo relaciones entre causas y consecuencias, utilizando fuentes diversas y reconociendo múltiples perspectivas.'),
((SELECT id FROM capacidades WHERE codigo = 'PS-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'PS-C2-CAP2-D5', 'Construye interpretaciones históricas sofisticadas sobre procesos y hechos relevantes, estableciendo relaciones multicausales complejas, utilizando fuentes diversas de manera crítica, reconociendo múltiples perspectivas y evaluando su relevancia para comprender el presente.');

-- ============================================================================
-- TUTORÍA - 8 desempeños (4 capacidades × 2 grados)
-- ============================================================================

-- TUT-C1-CAP1: Construye su identidad
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'TUT-C1-CAP1-D4', 'Construye su identidad reconociendo sus características, intereses y aspiraciones, reflexionando sobre su proyecto de vida y tomando decisiones informadas sobre su desarrollo personal, académico y vocacional.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'TUT-C1-CAP1-D5', 'Construye su identidad de manera integral, reconociendo sus características, intereses, aspiraciones y valores, reflexionando críticamente sobre su proyecto de vida y tomando decisiones informadas, autónomas y responsables sobre su desarrollo personal, académico, vocacional y profesional.');

-- TUT-C1-CAP2: Desarrolla habilidades socioemocionales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'TUT-C1-CAP2-D4', 'Desarrolla habilidades socioemocionales identificando y gestionando sus emociones, estableciendo relaciones interpersonales saludables y tomando decisiones responsables en diversos contextos.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'TUT-C1-CAP2-D5', 'Desarrolla habilidades socioemocionales de manera integral, identificando y gestionando sus emociones de manera efectiva, estableciendo relaciones interpersonales saludables y empáticas, y tomando decisiones responsables y éticas en diversos contextos personales y sociales.');

-- TUT-C2-CAP1: Gestiona su aprendizaje de manera autónoma
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'TUT-C2-CAP1-D4', 'Gestiona su aprendizaje de manera autónoma definiendo metas, organizando estrategias y recursos, monitoreando su progreso y realizando ajustes para mejorar su desempeño académico.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'TUT-C2-CAP1-D5', 'Gestiona su aprendizaje de manera autónoma y estratégica, definiendo metas claras y realistas, organizando estrategias y recursos de manera óptima, monitoreando su progreso de manera sistemática y realizando ajustes basados en evidencias para optimizar su desempeño académico y desarrollo continuo.');

-- TUT-C2-CAP2: Toma decisiones responsables sobre su futuro
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Secundaria'), 'TUT-C2-CAP2-D4', 'Toma decisiones responsables sobre su futuro explorando opciones académicas y vocacionales, considerando sus intereses, habilidades y oportunidades del entorno, y planificando acciones para alcanzar sus metas.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Secundaria'), 'TUT-C2-CAP2-D5', 'Toma decisiones responsables e informadas sobre su futuro, explorando y evaluando opciones académicas, vocacionales y profesionales, considerando sus intereses, habilidades, valores, oportunidades del entorno y tendencias del mercado laboral, y planificando acciones concretas y realistas para alcanzar sus metas de vida.');



