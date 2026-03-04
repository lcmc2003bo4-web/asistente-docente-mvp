-- Migration: Add Personal Social and Tutoría
-- Phase 5: Remaining Areas (Final Phase)
-- Date: 2026-02-17

-- ============================================================================
-- COMPETENCIAS for Personal Social
-- ============================================================================

-- Note: Personal Social is primarily for primary education, but we'll add 
-- the competencies that are relevant for secondary as they transition from primary

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Personal Social'), 'PS-C1', 'Construye su identidad', 'El estudiante conoce y valora su cuerpo, su forma de sentir, de pensar y de actuar desde el reconocimiento de las distintas identidades que lo definen (histórica, étnica, social, sexual, cultural, de género, ambiental, entre otras) como producto de las interacciones continuas entre los individuos y los diversos contextos en los que se desenvuelven (familia, institución educativa, comunidad).'),
((SELECT id FROM areas WHERE nombre = 'Personal Social'), 'PS-C2', 'Convive y participa democráticamente', 'El estudiante actúa en la sociedad relacionándose con los demás de manera justa y equitativa, reconociendo que todas las personas tienen los mismos derechos y deberes. Muestra disposición por conocer, comprender y enriquecerse con los aportes de las diversas culturas, respetando las diferencias.'),
((SELECT id FROM areas WHERE nombre = 'Personal Social'), 'PS-C3', 'Construye interpretaciones históricas', 'El estudiante sustenta una posición crítica sobre hechos y procesos históricos que ayuden a comprender el presente y sus desafíos, articulando el uso de distintas fuentes, la comprensión de los cambios temporales y la explicación de las múltiples causas y consecuencias de estos.');

-- ============================================================================
-- CAPACIDADES for Personal Social
-- ============================================================================

-- Competencia PS-C1: Construye su identidad
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'PS-C1'), 'PS-C1-CAP1', 'Se valora a sí mismo', 'El estudiante reconoce sus características, cualidades, limitaciones y potencialidades que lo hacen ser quien es, que le permiten aceptarse, sentirse bien consigo mismo y ser capaz de asumir retos y alcanzar sus metas.'),
((SELECT id FROM competencias WHERE codigo = 'PS-C1'), 'PS-C1-CAP2', 'Autorregula sus emociones', 'El estudiante reconoce y toma conciencia de sus emociones, a fin de poder expresarlas de manera adecuada según el contexto, los patrones culturales diversos y las consecuencias que estas tienen para sí mismo y para los demás.'),
((SELECT id FROM competencias WHERE codigo = 'PS-C1'), 'PS-C1-CAP3', 'Reflexiona y argumenta éticamente', 'El estudiante analiza situaciones cotidianas para identificar los valores que están presentes en ellas y asumir una posición sustentada en argumentos razonados y en principios éticos.');

-- Competencia PS-C2: Convive y participa democráticamente
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'PS-C2'), 'PS-C2-CAP1', 'Interactúa con todas las personas', 'El estudiante reconoce a todos como personas valiosas y con derechos, muestra preocupación por el otro, respeta las diferencias y se enriquece de ellas.'),
((SELECT id FROM competencias WHERE codigo = 'PS-C2'), 'PS-C2-CAP2', 'Construye normas y asume acuerdos y leyes', 'El estudiante participa en la construcción de normas, las respeta y evalúa en relación a los principios que las sustentan, así como cumple los acuerdos y las leyes, reconociendo la importancia de estas para la convivencia.'),
((SELECT id FROM competencias WHERE codigo = 'PS-C2'), 'PS-C2-CAP3', 'Maneja conflictos de manera constructiva', 'El estudiante actúa con empatía y asertividad frente a ellos y pone en práctica pautas y estrategias para resolverlos de manera pacífica y creativa, contribuyendo a construir comunidades democráticas.');

-- Competencia PS-C3: Construye interpretaciones históricas
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'PS-C3'), 'PS-C3-CAP1', 'Interpreta críticamente fuentes diversas', 'El estudiante reconoce la diversidad de fuentes y su diferente utilidad para abordar un hecho o proceso histórico.'),
((SELECT id FROM competencias WHERE codigo = 'PS-C3'), 'PS-C3-CAP2', 'Comprende el tiempo histórico', 'El estudiante emplea las nociones de tiempo para ordenar hechos o procesos históricos, reconociendo que el presente y el pasado están conectados.'),
((SELECT id FROM competencias WHERE codigo = 'PS-C3'), 'PS-C3-CAP3', 'Elabora explicaciones sobre procesos históricos', 'El estudiante jerarquiza las causas de los procesos históricos relacionando las motivaciones de sus protagonistas con su cosmovisión y la época en la que vivieron.');

-- ============================================================================
-- COMPETENCIAS for Tutoría
-- ============================================================================

-- Note: Tutoría doesn't have traditional competencias in CNEB, but we'll create
-- competencies based on the dimensions of tutoring work

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Tutoría'), 'TUT-C1', 'Desarrolla habilidades socioemocionales', 'El estudiante reconoce y gestiona sus emociones, desarrolla su autoestima, toma decisiones responsables y establece relaciones interpersonales saludables.'),
((SELECT id FROM areas WHERE nombre = 'Tutoría'), 'TUT-C2', 'Construye su proyecto de vida', 'El estudiante reflexiona sobre sus intereses, fortalezas y metas personales, académicas y profesionales, y toma decisiones informadas para su desarrollo integral.');

-- ============================================================================
-- CAPACIDADES for Tutoría
-- ============================================================================

-- Competencia TUT-C1: Desarrolla habilidades socioemocionales
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'TUT-C1'), 'TUT-C1-CAP1', 'Reconoce y gestiona sus emociones', 'El estudiante identifica sus emociones, comprende sus causas y consecuencias, y desarrolla estrategias para regularlas de manera adecuada.'),
((SELECT id FROM competencias WHERE codigo = 'TUT-C1'), 'TUT-C1-CAP2', 'Desarrolla su autoestima y autoconocimiento', 'El estudiante reconoce sus características personales, valora sus fortalezas y acepta sus limitaciones, construyendo una imagen positiva de sí mismo.'),
((SELECT id FROM competencias WHERE codigo = 'TUT-C1'), 'TUT-C1-CAP3', 'Establece relaciones interpersonales saludables', 'El estudiante se relaciona con los demás de manera respetuosa, empática y asertiva, desarrollando habilidades de comunicación y resolución de conflictos.');

-- Competencia TUT-C2: Construye su proyecto de vida
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'TUT-C2'), 'TUT-C2-CAP1', 'Reflexiona sobre sus intereses y metas', 'El estudiante identifica sus intereses, aspiraciones y metas personales, académicas y profesionales, y reflexiona sobre los pasos necesarios para alcanzarlas.'),
((SELECT id FROM competencias WHERE codigo = 'TUT-C2'), 'TUT-C2-CAP2', 'Toma decisiones informadas y responsables', 'El estudiante analiza alternativas, evalúa consecuencias y toma decisiones responsables sobre su presente y futuro, considerando sus valores y el contexto en el que se desenvuelve.'),
((SELECT id FROM competencias WHERE codigo = 'TUT-C2'), 'TUT-C2-CAP3', 'Desarrolla hábitos de estudio y organización', 'El estudiante organiza su tiempo, establece prioridades y desarrolla estrategias de estudio efectivas para alcanzar sus metas académicas.');
