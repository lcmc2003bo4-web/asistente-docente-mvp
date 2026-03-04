-- Migration: Add Inglés and Arte y Cultura
-- Phase 3: Language & Arts
-- Date: 2026-02-17

-- ============================================================================
-- COMPETENCIAS for Inglés
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Inglés'), 'ING-C1', 'Se comunica oralmente en inglés como lengua extranjera', 'El estudiante se comunica oralmente mediante diversos tipos de textos en inglés. Infiere el tema, propósito, hechos y conclusiones a partir de información explícita e interpreta la intención del interlocutor. Se expresa adecuando el texto a situaciones comunicativas cotidianas usando pronunciación y entonación adecuadas; organiza y desarrolla ideas en torno a un tema central haciendo uso de algunos conectores coordinados incluyendo vocabulario de uso frecuente y construcciones gramaticales determinadas y pertinentes.'),
((SELECT id FROM areas WHERE nombre = 'Inglés'), 'ING-C2', 'Lee diversos tipos de textos escritos en inglés como lengua extranjera', 'El estudiante lee diversos tipos de texto en inglés que presentan estructura simple con vocabulario de uso frecuente. Obtiene información e integra datos que están en distintas partes del texto. Realiza inferencias locales a partir de información explícita e implícita e interpreta el texto seleccionando información relevante y complementaria. Reflexiona sobre aspectos variados del texto evaluando el uso del lenguaje y la intención de los recursos textuales más comunes a partir de su conocimiento y experiencia.'),
((SELECT id FROM areas WHERE nombre = 'Inglés'), 'ING-C3', 'Escribe diversos tipos de textos en inglés como lengua extranjera', 'El estudiante escribe diversos tipos de textos de mediana extensión en inglés. Adecúa su texto al destinatario, propósito y registro a partir de su experiencia previa y fuentes de información complementaria. Organiza y desarrolla sus ideas en torno a un tema central y las estructura en uno o dos párrafos. Relaciona sus ideas a través del uso de algunos recursos cohesivos (sinónimos, pronominalización y conectores aditivos, adversativos, temporales y causales) con vocabulario de uso frecuente y construcciones gramaticales simples y de mediana complejidad.');

-- ============================================================================
-- CAPACIDADES for Inglés
-- ============================================================================

-- Competencia ING-C1: Se comunica oralmente en inglés
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ING-C1'), 'ING-C1-CAP1', 'Obtiene información de textos orales', 'El estudiante recupera y extrae información explícita expresada por los interlocutores.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C1'), 'ING-C1-CAP2', 'Infiere e interpreta información de textos orales', 'El estudiante construye el sentido del texto a partir de relacionar información explícita e implícita para deducir una nueva información o completar los vacíos del texto oral.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C1'), 'ING-C1-CAP3', 'Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada', 'El estudiante expresa sus ideas adaptándose al propósito, destinatario, características del tipo de texto, género discursivo y registro.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C1'), 'ING-C1-CAP4', 'Utiliza recursos no verbales y paraverbales de forma estratégica', 'El estudiante emplea variados recursos no verbales (gestos, movimientos corporales) o paraverbales (entonación, volumen) según la situación comunicativa.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C1'), 'ING-C1-CAP5', 'Interactúa estratégicamente con distintos interlocutores', 'El estudiante intercambia los roles de hablante y oyente alternada y dinámicamente, participando de forma pertinente, oportuna y relevante.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C1'), 'ING-C1-CAP6', 'Reflexiona y evalúa la forma, el contenido y el contexto del texto oral', 'El estudiante se distancia de los textos orales en los que participa de forma presencial o a través de medios audiovisuales, comparando y contrastando aspectos formales y de contenido.');

-- Competencia ING-C2: Lee diversos tipos de textos escritos en inglés
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ING-C2'), 'ING-C2-CAP1', 'Obtiene información del texto escrito', 'El estudiante localiza y selecciona información explícita en textos escritos con un propósito específico.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C2'), 'ING-C2-CAP2', 'Infiere e interpreta información del texto escrito', 'El estudiante construye el sentido del texto. Para ello, establece relaciones entre la información explícita e implícita de este para deducir una nueva información o completar los vacíos del texto escrito.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C2'), 'ING-C2-CAP3', 'Reflexiona y evalúa la forma, el contenido y el contexto del texto escrito', 'El estudiante se distancia de los textos escritos situados en épocas y lugares distintos, y de esta manera analiza y reflexiona sobre el contenido, la organización, el propósito y el contexto de producción de dichos textos.');

-- Competencia ING-C3: Escribe diversos tipos de textos en inglés
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ING-C3'), 'ING-C3-CAP1', 'Adecúa el texto a la situación comunicativa', 'El estudiante considera el propósito, destinatario, tipo de texto, género discursivo y registro que utilizará al escribir los textos, así como los contextos socioculturales que enmarcan la comunicación escrita.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C3'), 'ING-C3-CAP2', 'Organiza y desarrolla las ideas de forma coherente y cohesionada', 'El estudiante ordena lógicamente las ideas en torno a un tema, ampliándolas y complementándolas, estableciendo relaciones de cohesión entre ellas y utilizando un vocabulario pertinente.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C3'), 'ING-C3-CAP3', 'Utiliza convenciones del lenguaje escrito de forma pertinente', 'El estudiante usa de forma apropiada recursos textuales para garantizar la claridad, el uso estético del lenguaje y el sentido del texto escrito.'),
((SELECT id FROM competencias WHERE codigo = 'ING-C3'), 'ING-C3-CAP4', 'Reflexiona y evalúa la forma, el contenido y el contexto del texto escrito', 'El estudiante se distancia del texto que ha escrito para revisar de manera permanente el contenido, la coherencia, cohesión y adecuación a la situación comunicativa con la finalidad de mejorarlo.');

-- ============================================================================
-- COMPETENCIAS for Arte y Cultura
-- ============================================================================

INSERT INTO competencias (area_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM areas WHERE nombre = 'Arte y Cultura'), 'ART-C1', 'Aprecia de manera crítica manifestaciones artístico-culturales', 'El estudiante interactúa con manifestaciones artístico-culturales, desde las formas más tradicionales hasta las formas emergentes y contemporáneas, para descifrar sus significados y comprender la contribución que hacen a la cultura y a la sociedad. Asimismo, usa sus conocimientos sobre los diversos contextos y prácticas artístico-culturales para enriquecer su experiencia estética.'),
((SELECT id FROM areas WHERE nombre = 'Arte y Cultura'), 'ART-C2', 'Crea proyectos desde los lenguajes artísticos', 'El estudiante usa los diversos lenguajes de las artes (artes visuales, música, danza, teatro, entre otros) para expresar o comunicar mensajes, ideas y sentimientos. Pone en práctica habilidades imaginativas, creativas y reflexivas para generar ideas, planificar, concretar propuestas y evaluarlas de manera continua, para lo cual hace uso de recursos y conocimientos que ha desarrollado en su interacción con el entorno, con manifestaciones artístico-culturales diversas y con los diversos lenguajes del arte.'),
((SELECT id FROM areas WHERE nombre = 'Arte y Cultura'), 'ART-C3', 'Crea proyectos desde los lenguajes del arte', 'El estudiante usa los diversos lenguajes artísticos (artes visuales, música, danza, teatro, artes interdisciplinares y otros) para expresar o comunicar mensajes, ideas y sentimientos. Pone en práctica habilidades imaginativas, creativas y reflexivas para generar ideas, planificar, concretar propuestas y evaluarlas de manera continua.');

-- ============================================================================
-- CAPACIDADES for Arte y Cultura
-- ============================================================================

-- Competencia ART-C1: Aprecia de manera crítica manifestaciones artístico-culturales
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ART-C1'), 'ART-C1-CAP1', 'Percibe manifestaciones artístico-culturales', 'El estudiante usa sus sentidos para observar, escuchar, describir y analizar las cualidades visuales, táctiles, sonoras y kinestésicas de diversas manifestaciones artístico-culturales.'),
((SELECT id FROM competencias WHERE codigo = 'ART-C1'), 'ART-C1-CAP2', 'Contextualiza manifestaciones artístico-culturales', 'El estudiante investiga los contextos donde se originan manifestaciones artístico-culturales tradicionales y contemporáneas e identifica cómo los cambios, las tradiciones, las creencias y valores revelan la manera en que una determinada persona o sociedad ha vivido.'),
((SELECT id FROM competencias WHERE codigo = 'ART-C1'), 'ART-C1-CAP3', 'Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales', 'El estudiante interpreta las manifestaciones artístico-culturales a partir de las cualidades estéticas, simbólicas y culturales, y emite juicios de valor fundamentados en los conocimientos que tiene sobre las mismas.');

-- Competencia ART-C2: Crea proyectos desde los lenguajes artísticos
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ART-C2'), 'ART-C2-CAP1', 'Explora y experimenta los lenguajes artísticos', 'El estudiante usa los elementos de los lenguajes artísticos para explorar sus posibilidades expresivas y ensaya distintas maneras de utilizar materiales, herramientas y técnicas para obtener diversos efectos.'),
((SELECT id FROM competencias WHERE codigo = 'ART-C2'), 'ART-C2-CAP2', 'Aplica procesos creativos', 'El estudiante genera ideas a partir de estímulos y fuentes diversas (tradicionales, locales y globales) y planifica su trabajo artístico tomando en cuenta la información recogida. Manipula una serie de elementos, medios, técnicas, herramientas y materiales para desarrollar sus propuestas y descubrir las posibilidades que cada uno le ofrece.'),
((SELECT id FROM competencias WHERE codigo = 'ART-C2'), 'ART-C2-CAP3', 'Evalúa y comunica sus procesos y proyectos', 'El estudiante registra las experiencias y comunica sus descubrimientos hacia la comunidad. Asimismo, reflexiona sobre las cualidades estéticas de su proyecto, el manejo de las herramientas y materiales, y su rol en el proceso creativo.');

-- Competencia ART-C3: Crea proyectos desde los lenguajes del arte
INSERT INTO capacidades (competencia_id, codigo, nombre, descripcion) VALUES
((SELECT id FROM competencias WHERE codigo = 'ART-C3'), 'ART-C3-CAP1', 'Explora y experimenta los lenguajes del arte', 'El estudiante usa los elementos de los lenguajes artísticos para explorar sus posibilidades expresivas y ensaya distintas maneras de utilizar materiales, herramientas y técnicas.'),
((SELECT id FROM competencias WHERE codigo = 'ART-C3'), 'ART-C3-CAP2', 'Aplica procesos creativos', 'El estudiante genera ideas a partir de estímulos y fuentes diversas y planifica su trabajo artístico tomando en cuenta la información recogida.'),
((SELECT id FROM competencias WHERE codigo = 'ART-C3'), 'ART-C3-CAP3', 'Evalúa y comunica sus procesos y proyectos', 'El estudiante registra las experiencias y comunica sus descubrimientos. Reflexiona sobre las cualidades estéticas de su proyecto, el manejo de las herramientas y materiales, y su rol en el proceso creativo.');
