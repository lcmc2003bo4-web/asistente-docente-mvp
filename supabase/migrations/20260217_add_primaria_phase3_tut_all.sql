-- =====================================================
-- MIGRATION: Add Primaria Desempeños - Phase 3 Part 2: Tutoría
-- TUT: 6 capacidades × 6 grados = 36 desempeños
-- Competencias:
--   C1: Desarrolla habilidades socioemocionales (3 capacidades)
--   C2: Construye su proyecto de vida (3 capacidades)
-- =====================================================

-- TUTORÍA 1° PRIMARIA (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
-- Competencia 1: Desarrolla habilidades socioemocionales
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'TUT-C1-CAP1-D1P', 'Identifica y nombra sus emociones básicas (alegría, tristeza, miedo, enojo) en diferentes situaciones cotidianas, y las expresa de manera apropiada con ayuda del docente.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'TUT-C1-CAP2-D1P', 'Reconoce sus características físicas, habilidades y preferencias que lo hacen único, y las comparte con sus compañeros.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'TUT-C1-CAP3-D1P', 'Participa en actividades grupales respetando las normas de convivencia y mostrando actitudes de cooperación y respeto hacia sus compañeros.'),
-- Competencia 2: Construye su proyecto de vida
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'TUT-C2-CAP1-D1P', 'Expresa sus intereses y preferencias sobre actividades que le gustan realizar en la escuela y en casa.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'TUT-C2-CAP2-D1P', 'Toma decisiones sencillas sobre actividades cotidianas considerando sus preferencias y las consecuencias básicas de sus acciones.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'TUT-C2-CAP3-D1P', 'Organiza sus útiles escolares y materiales de trabajo con ayuda del docente, estableciendo rutinas básicas de orden.');

-- TUTORÍA 2° PRIMARIA (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'TUT-C1-CAP1-D2P', 'Identifica y nombra sus emociones básicas (alegría, tristeza, miedo, enojo) en diferentes situaciones cotidianas, y las expresa de manera apropiada, buscando estrategias simples para regularlas.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'TUT-C1-CAP2-D2P', 'Reconoce sus características físicas, habilidades y preferencias que lo hacen único, y valora las diferencias con sus compañeros.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'TUT-C1-CAP3-D2P', 'Participa en actividades grupales respetando las normas de convivencia, mostrando actitudes de cooperación y ayudando a resolver conflictos de manera pacífica.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'TUT-C2-CAP1-D2P', 'Expresa sus intereses y preferencias sobre actividades que le gustan realizar, y reconoce aquellas en las que se desempeña mejor.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'TUT-C2-CAP2-D2P', 'Toma decisiones sobre actividades cotidianas considerando sus preferencias, las consecuencias de sus acciones y el bienestar de los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'TUT-C2-CAP3-D2P', 'Organiza sus útiles escolares y materiales de trabajo de manera autónoma, estableciendo rutinas de orden y cuidado de sus pertenencias.');

-- TUTORÍA 3° PRIMARIA (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'TUT-C1-CAP1-D3P', 'Identifica y describe sus emociones (alegría, tristeza, miedo, enojo, sorpresa, vergüenza) en diferentes situaciones, y utiliza estrategias para regularlas de manera apropiada.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'TUT-C1-CAP2-D3P', 'Reconoce y valora sus fortalezas y aspectos por mejorar, y establece metas sencillas para su desarrollo personal.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'TUT-C1-CAP3-D3P', 'Establece relaciones de amistad basadas en el respeto, la empatía y la comunicación asertiva, y participa en la resolución de conflictos de manera constructiva.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'TUT-C2-CAP1-D3P', 'Reflexiona sobre sus intereses, habilidades y metas a corto plazo, y reconoce cómo sus acciones contribuyen a alcanzarlas.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'TUT-C2-CAP2-D3P', 'Toma decisiones informadas considerando diferentes alternativas, las consecuencias de sus acciones y los valores que orientan su comportamiento.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'TUT-C2-CAP3-D3P', 'Desarrolla hábitos de estudio organizando su tiempo, espacio y materiales de trabajo, y utiliza técnicas básicas de estudio para mejorar su aprendizaje.');

-- TUTORÍA 4° PRIMARIA (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'TUT-C1-CAP1-D4P', 'Identifica y describe sus emociones y las de los demás, reconociendo las causas que las generan, y utiliza estrategias de autorregulación emocional de manera autónoma.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'TUT-C1-CAP2-D4P', 'Reconoce y valora sus fortalezas y aspectos por mejorar, establece metas realistas para su desarrollo personal y evalúa su progreso.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'TUT-C1-CAP3-D4P', 'Establece relaciones interpersonales saludables basadas en el respeto, la empatía y la comunicación asertiva, y contribuye a la construcción de un clima de convivencia positivo.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'TUT-C2-CAP1-D4P', 'Reflexiona sobre sus intereses, habilidades y metas a mediano plazo, y reconoce las acciones necesarias para alcanzarlas.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'TUT-C2-CAP2-D4P', 'Toma decisiones informadas y responsables considerando diferentes alternativas, las consecuencias de sus acciones y los valores que orientan su comportamiento.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'TUT-C2-CAP3-D4P', 'Desarrolla hábitos de estudio organizando su tiempo, espacio y materiales de trabajo de manera eficiente, y utiliza técnicas de estudio variadas para mejorar su aprendizaje.');

-- TUTORÍA 5° PRIMARIA (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'TUT-C1-CAP1-D5P', 'Identifica, describe y gestiona sus emociones y las de los demás de manera autónoma, utilizando estrategias de autorregulación emocional en diferentes contextos.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'TUT-C1-CAP2-D5P', 'Reconoce y valora sus fortalezas y aspectos por mejorar, establece metas desafiantes para su desarrollo personal y evalúa su progreso de manera reflexiva.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'TUT-C1-CAP3-D5P', 'Establece relaciones interpersonales saludables basadas en el respeto, la empatía, la comunicación asertiva y la resolución constructiva de conflictos, promoviendo la inclusión y el bienestar común.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'TUT-C2-CAP1-D5P', 'Reflexiona sobre sus intereses, habilidades, valores y metas a mediano y largo plazo, y elabora un plan de acción para alcanzarlas.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'TUT-C2-CAP2-D5P', 'Toma decisiones informadas y responsables considerando diferentes alternativas, las consecuencias de sus acciones, los valores que orientan su comportamiento y el impacto en su proyecto de vida.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'TUT-C2-CAP3-D5P', 'Desarrolla hábitos de estudio organizando su tiempo, espacio y materiales de trabajo de manera eficiente, utiliza técnicas de estudio variadas y evalúa su efectividad para mejorar su aprendizaje.');

-- TUTORÍA 6° PRIMARIA (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'TUT-C1-CAP1-D6P', 'Identifica, describe y gestiona sus emociones y las de los demás de manera autónoma, utilizando estrategias de autorregulación emocional en diferentes contextos y situaciones desafiantes.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'TUT-C1-CAP2-D6P', 'Reconoce y valora sus fortalezas y aspectos por mejorar, establece metas desafiantes para su desarrollo personal y evalúa su progreso de manera reflexiva y crítica.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C1-CAP3'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'TUT-C1-CAP3-D6P', 'Establece relaciones interpersonales saludables basadas en el respeto, la empatía, la comunicación asertiva y la resolución constructiva de conflictos, promoviendo la inclusión, la equidad y el bienestar común.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'TUT-C2-CAP1-D6P', 'Reflexiona sobre sus intereses, habilidades, valores y metas a mediano y largo plazo, elabora un plan de acción para alcanzarlas y lo ajusta según su progreso y nuevas oportunidades.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'TUT-C2-CAP2-D6P', 'Toma decisiones informadas y responsables considerando diferentes alternativas, las consecuencias de sus acciones, los valores que orientan su comportamiento, el impacto en su proyecto de vida y el bienestar de su comunidad.'),
((SELECT id FROM capacidades WHERE codigo = 'TUT-C2-CAP3'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'TUT-C2-CAP3-D6P', 'Desarrolla hábitos de estudio organizando su tiempo, espacio y materiales de trabajo de manera eficiente, utiliza técnicas de estudio variadas, evalúa su efectividad y las adapta para optimizar su aprendizaje y prepararse para la secundaria.');
