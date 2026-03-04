-- Migration: Add Educación Física, EPT, and Educación Religiosa
-- Phase 4: Physical & Vocational Education
-- Date: 2026-02-17

-- ============================================================================
-- COMPETENCIAS for Educación Física
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Educación Física'), 'EF-C1', 'Se desenvuelve de manera autónoma a través de su motricidad', 'El estudiante comprende y toma conciencia de sí mismo en interacción con el espacio y las personas de su entorno, lo que le permite construir su identidad y autoestima. Interioriza y organiza sus movimientos eficazmente según sus posibilidades, en la práctica de actividades físicas como el juego, el deporte y aquellas que se desarrollan en la vida cotidiana.'),
((SELECT id FROM areas WHERE nombre = 'Educación Física'), 'EF-C2', 'Asume una vida saludable', 'El estudiante tiene conciencia reflexiva sobre su bienestar, por lo que incorpora prácticas autónomas que conllevan a una mejora de su calidad de vida. Esto supone que comprende la relación entre vida saludable y bienestar, así como practica actividad física para su bienestar, posturas corporales adecuadas, alimentación saludable e higiene personal y del ambiente, según sus recursos y entorno sociocultural y ambiental.'),
((SELECT id FROM areas WHERE nombre = 'Educación Física'), 'EF-C3', 'Interactúa a través de sus habilidades sociomotrices', 'El estudiante actúa asertivamente en situaciones motrices en las que debe interactuar con otros, tomando decisiones pertinentes a partir de la utilización de capacidades vinculadas con la construcción de la corporeidad, la cual se manifiesta en la práctica de diferentes actividades físicas (juegos, deportes, actividades predeportivas, etc.).');

-- ============================================================================
-- CAPACIDADES for Educación Física
-- ============================================================================

-- Competencia EF-C1: Se desenvuelve de manera autónoma a través de su motricidad
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'EF-C1'), 'EF-C1-CAP1', 'Comprende su cuerpo', 'El estudiante desarrolla aprendizajes sobre su cuerpo y su imagen corporal, y toma conciencia de sí mismo, de su postura corporal, de sus posibilidades de movimiento y de su equilibrio.'),
((SELECT id FROM competencias WHERE codigo = 'EF-C1'), 'EF-C1-CAP2', 'Se expresa corporalmente', 'El estudiante usa el lenguaje corporal para comunicar emociones, sentimientos y pensamientos. Implica utilizar el tono, los gestos, mímicas, posturas y movimientos para expresarse, desarrollando la creatividad al usar todos los recursos que ofrece el cuerpo y el movimiento.');

-- Competencia EF-C2: Asume una vida saludable
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'EF-C2'), 'EF-C2-CAP1', 'Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y la salud', 'El estudiante tiene conocimiento sobre cómo cuidar su salud y entiende cómo se relacionan la actividad física, la alimentación, la postura, la higiene personal y del ambiente con la salud, para mejorar la calidad de vida.'),
((SELECT id FROM competencias WHERE codigo = 'EF-C2'), 'EF-C2-CAP2', 'Incorpora prácticas que mejoran su calidad de vida', 'El estudiante adopta hábitos saludables relacionados con la actividad física, la alimentación, la postura y la higiene personal y del ambiente, que favorecen el cuidado de su salud y mejoran su calidad de vida.');

-- Competencia EF-C3: Interactúa a través de sus habilidades sociomotrices
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'EF-C3'), 'EF-C3-CAP1', 'Se relaciona utilizando sus habilidades sociomotrices', 'El estudiante interactúa de manera asertiva con los demás en la práctica lúdica y deportiva experimentando el placer y disfrute que ella representa. Desarrolla habilidades como el respeto a las normas de juego, liderazgo, tolerancia, actitud proactiva, la resolución de conflictos interpersonales, la pertenencia positiva a un grupo, entre otras.'),
((SELECT id FROM competencias WHERE codigo = 'EF-C3'), 'EF-C3-CAP2', 'Crea y aplica estrategias y tácticas de juego', 'El estudiante reflexiona y pone en práctica diferentes acciones tácticas y estratégicas, tomando en cuenta las características de la actividad física y deportiva, el reglamento, su experiencia en este tipo de actividades, las características del equipo propio y rival para alcanzar el objetivo del juego.');

-- ============================================================================
-- COMPETENCIAS for EPT (Educación para el Trabajo)
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Educación para el Trabajo'), 'EPT-C1', 'Gestiona proyectos de emprendimiento económico o social', 'El estudiante lleva a la acción una idea creativa movilizando con eficiencia y eficacia los recursos, tareas y técnicas necesarias para alcanzar objetivos y metas individuales o colectivas en atención de resolver una necesidad no satisfecha o un problema económico o social.'),
((SELECT id FROM areas WHERE nombre = 'Educación para el Trabajo'), 'EPT-C2', 'Aplica habilidades técnicas', 'El estudiante, en situaciones de aprendizaje o en función de resolver un problema o aprovechar una oportunidad, selecciona, combina y aplica con criterio ético, pertinencia y coherencia, habilidades técnicas de diversas especialidades ocupacionales.');

-- ============================================================================
-- CAPACIDADES for EPT
-- ============================================================================

-- Competencia EPT-C1: Gestiona proyectos de emprendimiento
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'EPT-C1'), 'EPT-C1-CAP1', 'Crea propuestas de valor', 'El estudiante propone soluciones creativas e innovadoras a problemas o necesidades de su entorno, considerando sus implicancias éticas, sociales, ambientales y económicas.'),
((SELECT id FROM competencias WHERE codigo = 'EPT-C1'), 'EPT-C1-CAP2', 'Aplica habilidades técnicas', 'El estudiante pone en práctica habilidades técnicas para producir un bien o brindar un servicio, considerando las normas de seguridad y los procesos de producción o prestación de servicios.'),
((SELECT id FROM competencias WHERE codigo = 'EPT-C1'), 'EPT-C1-CAP3', 'Trabaja cooperativamente para lograr objetivos y metas', 'El estudiante trabaja en equipo de manera colaborativa, asumiendo roles y responsabilidades de acuerdo con sus fortalezas y las de sus compañeros, para lograr los objetivos del proyecto.'),
((SELECT id FROM competencias WHERE codigo = 'EPT-C1'), 'EPT-C1-CAP4', 'Evalúa los resultados del proyecto de emprendimiento', 'El estudiante analiza la pertinencia y relevancia de los resultados obtenidos con las expectativas de los usuarios, y propone mejoras o innovaciones para incrementar el valor del producto o servicio.');

-- Competencia EPT-C2: Aplica habilidades técnicas
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'EPT-C2'), 'EPT-C2-CAP1', 'Comprende y aplica elementos y procesos del diseño', 'El estudiante identifica necesidades o problemas, y diseña alternativas de solución creativas e innovadoras, aplicando principios del diseño.'),
((SELECT id FROM competencias WHERE codigo = 'EPT-C2'), 'EPT-C2-CAP2', 'Trabaja en equipo de manera colaborativa', 'El estudiante trabaja cooperativamente con otros para lograr objetivos comunes, asumiendo roles y responsabilidades, y respetando las ideas y aportes de los demás.');

-- ============================================================================
-- COMPETENCIAS for Educación Religiosa
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Educación Religiosa'), 'ER-C1', 'Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente', 'El estudiante descubre y asume que existe una verdad trascendente, que le permite poner en diálogo sus creencias religiosas con los diversos campos del conocimiento, el arte y la cultura. Comprende que Dios se manifiesta en la historia de la salvación descrita en la Biblia y en su historia personal, en la que desarrolla un proyecto de vida orientado hacia su desarrollo integral y el bien común.'),
((SELECT id FROM areas WHERE nombre = 'Educación Religiosa'), 'ER-C2', 'Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida en coherencia con su creencia religiosa', 'El estudiante expresa su fe mediante acciones concretas en la convivencia cotidiana, en coherencia con relatos bíblicos y la vida de los santos. Comprende su dimensión espiritual y religiosa que le permita establecer propósitos de cambio a la luz del Evangelio. Interioriza la presencia de Dios en su vida personal y en su entorno más cercano, celebrando su fe con gratitud.');

-- ============================================================================
-- CAPACIDADES for Educación Religiosa
-- ============================================================================

-- Competencia ER-C1: Construye su identidad como persona humana
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ER-C1'), 'ER-C1-CAP1', 'Conoce a Dios y asume su identidad religiosa y espiritual como persona digna, libre y trascendente', 'El estudiante comprende las distintas manifestaciones de Dios en su vida y en la historia de la salvación, y las relaciona con su identidad como hijo de Dios.'),
((SELECT id FROM competencias WHERE codigo = 'ER-C1'), 'ER-C1-CAP2', 'Cultiva y valora las manifestaciones religiosas de su entorno argumentando su fe de manera comprensible y respetuosa', 'El estudiante comprende el mensaje cristiano en relación con los problemas existenciales comunes a las religiones y característicos de todo ser humano, y lo hace comprensible en el diálogo intercultural e interreligioso.');

-- Competencia ER-C2: Asume la experiencia del encuentro personal y comunitario con Dios
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ER-C2'), 'ER-C2-CAP1', 'Transforma su entorno desde el encuentro personal y comunitario con Dios y desde la fe que profesa', 'El estudiante actúa según los principios de su conciencia moral cristiana en situaciones concretas de la convivencia humana.'),
((SELECT id FROM competencias WHERE codigo = 'ER-C2'), 'ER-C2-CAP2', 'Actúa coherentemente en razón de su fe según los principios de su conciencia moral en situaciones concretas de la vida', 'El estudiante expresa en su proyecto de vida personal y comunitario coherencia entre lo que cree, dice y hace, a la luz del mensaje bíblico y los documentos del Magisterio de la Iglesia.');
