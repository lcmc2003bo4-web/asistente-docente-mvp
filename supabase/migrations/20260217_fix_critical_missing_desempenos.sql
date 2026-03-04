-- Migration: Fix Critical Missing Desempeños
-- Phase A: Add Matemática, Comunicación, and complete Ciencia y Tecnología
-- Date: 2026-02-17
-- Total: 65 desempeños (24 MAT + 39 COM + 2 CYT)

-- ============================================================================
-- MATEMÁTICA - 24 desempeños (8 capacidades × 3 grados)
-- ============================================================================

-- MAT-C1-CAP1: Traduce cantidades a expresiones numéricas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C1-CAP1-D1', 'Traduce cantidades discretas y continuas a expresiones numéricas con números racionales, notación exponencial y científica, así como modelos financieros de aumento y descuento porcentual simple.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C1-CAP1-D2', 'Traduce cantidades discretas y continuas a expresiones numéricas con números racionales e irracionales, notación exponencial y científica, así como modelos financieros de aumento y descuento porcentual compuesto.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C1-CAP1-D3', 'Traduce cantidades discretas y continuas a expresiones numéricas con números reales, notación exponencial y científica, así como modelos financieros de interés simple y compuesto.');

-- MAT-C1-CAP2: Comunica su comprensión sobre los números y las operaciones
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C1-CAP2-D1', 'Comunica su comprensión de los números racionales, sus propiedades, operaciones y el sentido de las operaciones con números racionales, usando lenguaje numérico y diversas representaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C1-CAP2-D2', 'Comunica su comprensión de los números racionales e irracionales, sus propiedades, operaciones y el sentido de las operaciones, usando lenguaje numérico y diversas representaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C1-CAP2-D3', 'Comunica su comprensión de los números reales, sus propiedades, operaciones y el sentido de las operaciones, usando lenguaje numérico y diversas representaciones.');

-- MAT-C1-CAP3: Usa estrategias y procedimientos de estimación y cálculo
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C1-CAP3-D1', 'Usa estrategias y procedimientos para realizar operaciones con números racionales, notación exponencial y científica, así como calcular porcentajes y aumentos o descuentos porcentuales simples.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C1-CAP3-D2', 'Usa estrategias y procedimientos para realizar operaciones con números racionales e irracionales, notación exponencial y científica, así como calcular porcentajes y aumentos o descuentos porcentuales compuestos.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C1-CAP3-D3', 'Usa estrategias y procedimientos para realizar operaciones con números reales, notación exponencial y científica, así como calcular interés simple y compuesto.');

-- MAT-C1-CAP4: Argumenta afirmaciones sobre las relaciones numéricas y las operaciones
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C1-CAP4-D1', 'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones con números racionales, usando ejemplos y propiedades de los números y las operaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C1-CAP4-D2', 'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones con números racionales e irracionales, usando ejemplos y propiedades de los números y las operaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C1-CAP4-D3', 'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones con números reales, usando ejemplos y propiedades de los números y las operaciones.');

-- MAT-C2-CAP1: Traduce datos y condiciones a expresiones algebraicas y gráficas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C2-CAP1-D1', 'Traduce datos y condiciones a expresiones algebraicas (ecuaciones lineales, inecuaciones lineales) y funciones lineales, así como a representaciones gráficas.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C2-CAP1-D2', 'Traduce datos y condiciones a expresiones algebraicas (ecuaciones cuadráticas, sistemas de ecuaciones lineales) y funciones cuadráticas, así como a representaciones gráficas.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C2-CAP1-D3', 'Traduce datos y condiciones a expresiones algebraicas (ecuaciones exponenciales, sistemas de ecuaciones) y funciones exponenciales, así como a representaciones gráficas.');

-- MAT-C2-CAP2: Comunica su comprensión sobre las relaciones algebraicas
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C2-CAP2-D1', 'Comunica su comprensión sobre ecuaciones lineales, inecuaciones lineales y funciones lineales, usando lenguaje algebraico y diversas representaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C2-CAP2-D2', 'Comunica su comprensión sobre ecuaciones cuadráticas, sistemas de ecuaciones lineales y funciones cuadráticas, usando lenguaje algebraico y diversas representaciones.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C2-CAP2-D3', 'Comunica su comprensión sobre ecuaciones exponenciales, sistemas de ecuaciones y funciones exponenciales, usando lenguaje algebraico y diversas representaciones.');

-- MAT-C2-CAP3: Usa estrategias y procedimientos para encontrar equivalencias y reglas generales
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C2-CAP3-D1', 'Usa estrategias y procedimientos para resolver ecuaciones lineales, inecuaciones lineales y encontrar reglas generales de funciones lineales.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C2-CAP3-D2', 'Usa estrategias y procedimientos para resolver ecuaciones cuadráticas, sistemas de ecuaciones lineales y encontrar reglas generales de funciones cuadráticas.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C2-CAP3-D3', 'Usa estrategias y procedimientos para resolver ecuaciones exponenciales, sistemas de ecuaciones y encontrar reglas generales de funciones exponenciales.');

-- MAT-C2-CAP4: Argumenta afirmaciones sobre relaciones de cambio y equivalencia
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'MAT-C2-CAP4-D1', 'Argumenta afirmaciones sobre relaciones de cambio y equivalencia en ecuaciones lineales, inecuaciones lineales y funciones lineales, usando ejemplos y propiedades.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'MAT-C2-CAP4-D2', 'Argumenta afirmaciones sobre relaciones de cambio y equivalencia en ecuaciones cuadráticas, sistemas de ecuaciones lineales y funciones cuadráticas, usando ejemplos y propiedades.'),
((SELECT id FROM capacidades WHERE codigo = 'MAT-C2-CAP4'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'MAT-C2-CAP4-D3', 'Argumenta afirmaciones sobre relaciones de cambio y equivalencia en ecuaciones exponenciales, sistemas de ecuaciones y funciones exponenciales, usando ejemplos y propiedades.');

-- ============================================================================
-- COMUNICACIÓN - 39 desempeños (13 capacidades × 3 grados)
-- ============================================================================

-- COM-C1-CAP1: Obtiene información del texto oral
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C1-CAP1-D1', 'Obtiene información explícita, relevante y complementaria, en textos orales que presentan expresiones con sentido figurado, y vocabulario que incluye sinónimos y términos propios de los campos del saber.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C1-CAP1-D2', 'Obtiene información explícita, relevante y complementaria, distinguiendo lo accesorio, en textos orales que presentan expresiones con sentido figurado, ironías y vocabulario especializado.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C1-CAP1-D3', 'Obtiene información explícita, relevante y complementaria, seleccionando datos específicos, en textos orales que presentan expresiones con sentido figurado, sesgos, falacias y vocabulario especializado.');

-- COM-C1-CAP2: Infiere e interpreta información del texto oral
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C1-CAP2-D1', 'Infiere información deduciendo diversas relaciones lógicas entre las ideas del texto oral (causa-efecto, semejanza-diferencia, entre otras) a partir de información explícita y presuposiciones del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C1-CAP2-D2', 'Infiere información deduciendo diversas relaciones lógicas entre las ideas del texto oral (causa-efecto, semejanza-diferencia, entre otras) a partir de información contrapuesta del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C1-CAP2-D3', 'Infiere información deduciendo diversas relaciones lógicas entre las ideas del texto oral (causa-efecto, semejanza-diferencia, entre otras) a partir de información implícita, contrapuesta y ambigua del texto.');

-- COM-C1-CAP3: Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C1-CAP3-D1', 'Adecúa el texto oral a la situación comunicativa considerando el propósito comunicativo, el tipo textual y las características del género discursivo. Elige el registro formal e informal de acuerdo con sus interlocutores y el contexto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C1-CAP3-D2', 'Adecúa el texto oral a la situación comunicativa considerando el propósito comunicativo, el tipo textual, las características del género discursivo y el contexto sociocultural. Elige el registro formal e informal adaptándose a los interlocutores.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C1-CAP3-D3', 'Adecúa el texto oral a la situación comunicativa considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el contexto sociocultural y las necesidades de los interlocutores.');

-- COM-C1-CAP4: Utiliza recursos no verbales y paraverbales de forma estratégica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C1-CAP4-D1', 'Utiliza recursos no verbales (gestos y movimientos corporales) y paraverbales (entonación) para enfatizar lo que dice. Regula la distancia física que guarda con sus interlocutores.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C1-CAP4-D2', 'Utiliza recursos no verbales (gestos y movimientos corporales) y paraverbales (entonación y volumen) de forma estratégica para enfatizar significados y mantener el interés del público.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP4'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C1-CAP4-D3', 'Utiliza recursos no verbales (gestos y movimientos corporales) y paraverbales (entonación, volumen y ritmo) de forma estratégica para producir efectos en los interlocutores y mantener su atención.');

-- COM-C1-CAP5: Interactúa estratégicamente con distintos interlocutores
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C1-CAP5-D1', 'Interactúa en diversas situaciones orales, utilizando estrategias discursivas, normas y modos de cortesía según el contexto sociocultural.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C1-CAP5-D2', 'Interactúa en diversas situaciones orales, utilizando estrategias discursivas y normativas, considerando los puntos de vista de otros y recurriendo a saberes previos.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP5'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C1-CAP5-D3', 'Interactúa en diversas situaciones orales, utilizando estrategias discursivas y normativas, considerando los puntos de vista de otros, sus motivaciones y sus intereses.');

-- COM-C1-CAP6: Reflexiona y evalúa la forma, el contenido y contexto del texto oral
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C1-CAP6-D1', 'Reflexiona y evalúa los textos orales del ámbito escolar y social y de medios de comunicación a partir de sus conocimientos y del contexto sociocultural en que se desenvuelve.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C1-CAP6-D2', 'Reflexiona y evalúa como hablante y oyente los textos orales del ámbito escolar, social y de medios de comunicación a partir de sus conocimientos, el contexto sociocultural y la validez de la información.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C1-CAP6'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C1-CAP6-D3', 'Reflexiona y evalúa como hablante y oyente los textos orales del ámbito escolar, social y de medios de comunicación a partir de sus conocimientos, el contexto sociocultural, la validez y la eficacia de los recursos retóricos.');

-- COM-C2-CAP1: Obtiene información del texto escrito
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C2-CAP1-D1', 'Obtiene información explícita, relevante y complementaria, distinguiendo detalles, en diversos tipos de textos con estructura compleja y vocabulario variado.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C2-CAP1-D2', 'Obtiene información explícita, relevante y complementaria, distinguiendo detalles y datos específicos, en diversos tipos de textos con estructura compleja y vocabulario especializado.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C2-CAP1-D3', 'Obtiene información explícita, relevante y complementaria, seleccionando datos específicos y detalles, en diversos tipos de textos con estructura compleja y vocabulario especializado y técnico.');

-- COM-C2-CAP2: Infiere e interpreta información del texto
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C2-CAP2-D1', 'Infiere información deduciendo diversas relaciones lógicas entre las ideas del texto escrito (causa-efecto, semejanza-diferencia, entre otras) a partir de información explícita e implícita del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C2-CAP2-D2', 'Infiere información deduciendo diversas relaciones lógicas entre las ideas del texto escrito (causa-efecto, semejanza-diferencia, entre otras) a partir de información contrapuesta o de detalle del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C2-CAP2-D3', 'Infiere información deduciendo diversas relaciones lógicas entre las ideas del texto escrito (causa-efecto, semejanza-diferencia, entre otras) a partir de información implícita, contrapuesta y ambigua del texto.');

-- COM-C2-CAP3: Reflexiona y evalúa la forma, el contenido y contexto del texto
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C2-CAP3-D1', 'Reflexiona y evalúa los textos que lee opinando acerca del contenido, la organización textual, las estrategias discursivas y la intención del autor.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C2-CAP3-D2', 'Reflexiona y evalúa los textos que lee opinando acerca del contenido, la organización textual, las estrategias discursivas, la validez de la información y la intención del autor.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C2-CAP3-D3', 'Reflexiona y evalúa los textos que lee opinando acerca del contenido, la organización textual, las estrategias discursivas, la validez de la información, la eficacia de los recursos textuales y la intención del autor.');

-- COM-C3-CAP1: Adecúa el texto a la situación comunicativa
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C3-CAP1-D1', 'Adecúa el texto a la situación comunicativa considerando el propósito comunicativo, el tipo textual y las características del género discursivo, así como el formato y el soporte.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C3-CAP1-D2', 'Adecúa el texto a la situación comunicativa considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el formato, el soporte y el contexto sociocultural.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C3-CAP1-D3', 'Adecúa el texto a la situación comunicativa considerando el propósito comunicativo, el tipo textual, las características del género discursivo, el formato, el soporte, el contexto sociocultural y las necesidades del destinatario.');

-- COM-C3-CAP2: Organiza y desarrolla las ideas de forma coherente y cohesionada
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C3-CAP2-D1', 'Organiza y desarrolla las ideas de forma coherente y cohesionada. Ordena las ideas en torno a un tema, las jerarquiza en subtemas e ideas principales, y las desarrolla para ampliar o precisar la información.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C3-CAP2-D2', 'Organiza y desarrolla las ideas de forma coherente y cohesionada. Ordena las ideas en torno a un tema, las jerarquiza en subtemas e ideas principales, y las desarrolla para ampliar, precisar o contrastar información.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C3-CAP2-D3', 'Organiza y desarrolla las ideas de forma coherente y cohesionada. Ordena las ideas en torno a un tema, las jerarquiza en subtemas e ideas principales, y las desarrolla para ampliar, precisar, contrastar o reforzar información.');

-- COM-C3-CAP3: Utiliza convenciones del lenguaje escrito de forma pertinente
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C3-CAP3-D1', 'Utiliza convenciones del lenguaje escrito de forma pertinente. Usa de forma precisa, los recursos gramaticales y ortográficos (por ejemplo, tiempos verbales) que contribuyen al sentido de su texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C3-CAP3-D2', 'Utiliza convenciones del lenguaje escrito de forma pertinente. Usa de forma precisa, los recursos gramaticales y ortográficos (por ejemplo, tiempos verbales, conectores lógicos) que contribuyen al sentido de su texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C3-CAP3-D3', 'Utiliza convenciones del lenguaje escrito de forma pertinente. Usa de forma precisa, los recursos gramaticales y ortográficos (por ejemplo, tiempos verbales, conectores lógicos, puntuación) que contribuyen al sentido de su texto.');

-- COM-C3-CAP4: Reflexiona y evalúa la forma, el contenido y contexto del texto escrito
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '1° Secundaria'), 'COM-C3-CAP4-D1', 'Reflexiona y evalúa de manera permanente el texto que escribe, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes entre sí y si el uso de conectores y referentes asegura la cohesión.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '2° Secundaria'), 'COM-C3-CAP4-D2', 'Reflexiona y evalúa de manera permanente el texto que escribe, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes entre sí, si el uso de conectores y referentes asegura la cohesión y si los recursos ortográficos contribuyen al sentido del texto.'),
((SELECT id FROM capacidades WHERE codigo = 'COM-C3-CAP4'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'COM-C3-CAP4-D3', 'Reflexiona y evalúa de manera permanente el texto que escribe, revisando si se adecúa a la situación comunicativa, si las ideas son coherentes entre sí, si el uso de conectores y referentes asegura la cohesión, si los recursos ortográficos contribuyen al sentido del texto y si la información es precisa.');

-- ============================================================================
-- CIENCIA Y TECNOLOGÍA - 2 desempeños (completar 3° Secundaria)
-- ============================================================================

-- CYT-C1-CAP3: Evalúa las implicancias del saber y del quehacer científico y tecnológico
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'CYT-C1-CAP3-D3', 'Evalúa las implicancias éticas, sociales y ambientales del saber y del quehacer científico y tecnológico, considerando el desarrollo sostenible y la responsabilidad social.');

-- CYT-C3-CAP1: Determina una alternativa de solución tecnológica
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'CYT-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Secundaria'), 'CYT-C3-CAP1-D3', 'Determina una alternativa de solución tecnológica, integrando principios científicos y tecnológicos, considerando los requerimientos del problema, las restricciones y los recursos disponibles.');
