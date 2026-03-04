-- Migration: Add Ciencias Sociales and DPCC
-- Phase 2: Core Academic Areas
-- Date: 2026-02-17

-- ============================================================================
-- COMPETENCIAS for Ciencias Sociales
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Ciencias Sociales'), 'CS-C1', 'Construye interpretaciones históricas', 'El estudiante sustenta una posición crítica sobre hechos y procesos históricos que ayuden a comprender el presente y sus desafíos, articulando el uso de distintas fuentes; la comprensión de los cambios temporales y la explicación de las múltiples causas y consecuencias de estos.'),
((SELECT id FROM areas WHERE nombre = 'Ciencias Sociales'), 'CS-C2', 'Gestiona responsablemente el espacio y el ambiente', 'El estudiante toma decisiones que contribuyen a la satisfacción de las necesidades desde una posición crítica y una perspectiva de desarrollo sostenible -es decir, sin poner en riesgo a las generaciones futuras-, y participa en acciones de mitigación y adaptación al cambio climático y de disminución de la vulnerabilidad de la sociedad frente a distintos desastres.'),
((SELECT id FROM areas WHERE nombre = 'Ciencias Sociales'), 'CS-C3', 'Gestiona responsablemente los recursos económicos', 'El estudiante es capaz de administrar los recursos, tanto personales como familiares, a partir de asumir una postura crítica sobre el manejo de estos, de manera informada y responsable.');

-- ============================================================================
-- CAPACIDADES for Ciencias Sociales
-- ============================================================================

-- Competencia CS-C1: Construye interpretaciones históricas
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'CS-C1'), 'CS-C1-CAP1', 'Interpreta críticamente fuentes diversas', 'El estudiante reconoce la diversidad de fuentes y su diferente utilidad para abordar un hecho o proceso histórico. Supone ubicarlas en su contexto y comprender, de manera crítica, que estas reflejan una perspectiva particular y tienen diferentes grados de fiabilidad.'),
((SELECT id FROM competencias WHERE codigo = 'CS-C1'), 'CS-C1-CAP2', 'Comprende el tiempo histórico', 'El estudiante usa las nociones relativas a la sucesión, simultaneidad y duración de hechos o procesos históricos, y emplea categorías temporales. Implica el reconocimiento de que el presente y el pasado están conectados.'),
((SELECT id FROM competencias WHERE codigo = 'CS-C1'), 'CS-C1-CAP3', 'Elabora explicaciones sobre procesos históricos', 'El estudiante jerarquiza las causas de los procesos históricos relacionando las motivaciones de sus protagonistas con su cosmovisión y la época en la que vivieron. Establece múltiples consecuencias y determina sus implicancias en el presente.');

-- Competencia CS-C2: Gestiona responsablemente el espacio y el ambiente
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'CS-C2'), 'CS-C2-CAP1', 'Comprende las relaciones entre los elementos naturales y sociales', 'El estudiante explica las dinámicas y transformaciones del espacio geográfico a partir del reconocimiento de sus elementos naturales y sociales, así como de sus interacciones.'),
((SELECT id FROM competencias WHERE codigo = 'CS-C2'), 'CS-C2-CAP2', 'Maneja fuentes de información para comprender el espacio geográfico y el ambiente', 'El estudiante se apropia y utiliza diversas fuentes y herramientas cartográficas y socioculturales para ubicarse, orientarse e identificar elementos del espacio geográfico y el ambiente.'),
((SELECT id FROM competencias WHERE codigo = 'CS-C2'), 'CS-C2-CAP3', 'Genera acciones para conservar el ambiente local y global', 'El estudiante propone y pone en práctica acciones orientadas al cuidado del ambiente y a contribuir a la prevención de situaciones de riesgo de desastre.');

-- Competencia CS-C3: Gestiona responsablemente los recursos económicos
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'CS-C3'), 'CS-C3-CAP1', 'Comprende las relaciones entre los elementos del sistema económico y financiero', 'El estudiante explica el rol de los diversos agentes que intervienen en el sistema, analiza las interacciones entre ellos y comprende el rol del Estado en dichas interrelaciones.'),
((SELECT id FROM competencias WHERE codigo = 'CS-C3'), 'CS-C3-CAP2', 'Toma decisiones económicas y financieras', 'El estudiante planifica el uso de sus recursos económicos de manera sostenible, en función a sus necesidades y posibilidades. Ejerce sus derechos y asume sus responsabilidades económicas y financieras.');

-- ============================================================================
-- COMPETENCIAS for DPCC (Desarrollo Personal, Ciudadanía y Cívica)
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Desarrollo Personal, Ciudadanía y Cívica'), 'DPCC-C1', 'Construye su identidad', 'El estudiante conoce y valora su cuerpo, su forma de sentir, de pensar y de actuar desde el reconocimiento de las distintas identidades que lo definen (histórica, étnica, social, sexual, cultural, de género, ambiental, entre otras) como producto de las interacciones continuas entre los individuos y los diversos contextos en los que se desenvuelven (familia, institución educativa, comunidad).'),
((SELECT id FROM areas WHERE nombre = 'Desarrollo Personal, Ciudadanía y Cívica'), 'DPCC-C2', 'Convive y participa democráticamente en la búsqueda del bien común', 'El estudiante actúa en la sociedad relacionándose con los demás de manera justa y equitativa, reconociendo que todas las personas tienen los mismos derechos y deberes. Muestra disposición por conocer, comprender y enriquecerse con los aportes de las diversas culturas, respetando las diferencias.');

-- ============================================================================
-- CAPACIDADES for DPCC
-- ============================================================================

-- Competencia DPCC-C1: Construye su identidad
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'DPCC-C1'), 'DPCC-C1-CAP1', 'Se valora a sí mismo', 'El estudiante reconoce sus características, cualidades, limitaciones y potencialidades que lo hacen ser quien es, que le permiten aceptarse, sentirse bien consigo mismo y ser capaz de asumir retos y alcanzar sus metas.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C1'), 'DPCC-C1-CAP2', 'Autorregula sus emociones', 'El estudiante reconoce y toma conciencia de sus emociones, a fin de poder expresarlas de manera adecuada según el contexto, los patrones culturales diversos y las consecuencias que estas tienen para sí mismo y para los demás.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C1'), 'DPCC-C1-CAP3', 'Reflexiona y argumenta éticamente', 'El estudiante analiza situaciones cotidianas para identificar los valores que están presentes en ellas y asumir una posición sustentada en argumentos razonados y en principios éticos.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C1'), 'DPCC-C1-CAP4', 'Vive su sexualidad de manera integral y responsable de acuerdo a su etapa de desarrollo y madurez', 'El estudiante toma conciencia de sí mismo como hombre o mujer, a partir del desarrollo de su imagen corporal, de su identidad sexual y de género, y mediante el conocimiento y valoración de su cuerpo.');

-- Competencia DPCC-C2: Convive y participa democráticamente
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'DPCC-C2'), 'DPCC-C2-CAP1', 'Interactúa con todas las personas', 'El estudiante reconoce a todos como personas valiosas y con derechos, muestra preocupación por el otro, respeta las diferencias y se enriquece de ellas.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C2'), 'DPCC-C2-CAP2', 'Construye normas y asume acuerdos y leyes', 'El estudiante participa en la construcción de normas, las respeta y evalúa en relación a los principios que las sustentan, así como cumple los acuerdos y las leyes, reconociendo la importancia de estas para la convivencia.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C2'), 'DPCC-C2-CAP3', 'Maneja conflictos de manera constructiva', 'El estudiante actúa con empatía y asertividad frente a ellos y pone en práctica pautas y estrategias para resolverlos de manera pacífica y creativa, contribuyendo a construir comunidades democráticas.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C2'), 'DPCC-C2-CAP4', 'Delibera sobre asuntos públicos', 'El estudiante participa en un proceso de reflexión y diálogo sobre asuntos que involucran a todos, donde se plantean diversos puntos de vista y se busca llegar a consensos orientados al bien común.'),
((SELECT id FROM competencias WHERE codigo = 'DPCC-C2'), 'DPCC-C2-CAP5', 'Participa en acciones que promueven el bienestar común', 'El estudiante propone y gestiona iniciativas vinculadas con el interés común y con la promoción y defensa de los derechos humanos, tanto en la escuela como en la comunidad.');
