-- =====================================================
-- MIGRATION: Add Primaria Desempeños - Phase 2 Part 2: EF and ER
-- EF: 9 capacidades × 6 grados = 54 desempeños
-- ER: 6 capacidades × 6 grados = 36 desempeños
-- Total: 90 desempeños
-- =====================================================

-- EDUCACIÓN FÍSICA (EF) - All Grades (54 desempeños total)

-- EF 1° Primaria (9 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'EF-C1-CAP1-D1P', 'Explora de manera autónoma las posibilidades de su cuerpo en diferentes acciones para mejorar sus movimientos (saltar, correr, lanzar) al mantener y/o recuperar el equilibrio en el espacio y con los objetos, cuando utiliza conscientemente distintas bases de sustentación; así, conoce en sí mismo su lado dominante.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'EF-C1-CAP2-D1P', 'Se expresa motrizmente para comunicar sus emociones (miedo, angustia, alegría, placer, torpeza, inhibición, rabia, entre otras) y representa en el juego objetos, animales, personajes, historias, entre otros.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'EF-C2-CAP1-D1P', 'Describe los alimentos de su dieta familiar y las posturas que son beneficiosas para su salud en la vida cotidiana y en la práctica de actividades lúdicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'EF-C2-CAP2-D1P', 'Regula su esfuerzo al participar en actividades lúdicas e identifica en sí mismo y en otros la diferencia entre inspiración y espiración, en reposo y movimiento, en las actividades lúdicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'EF-C3-CAP1-D1P', 'Asume roles y funciones de manera individual y dentro de un grupo; interactúa de forma espontánea en actividades lúdicas y disfruta de la compañía de sus pares para sentirse parte del grupo.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'EF-C3-CAP2-D1P', 'Participa en juegos cooperativos y de oposición en parejas y pequeños grupos; acepta al oponente como compañero de juego y las formas diferentes de jugar.');

-- EF 2° Primaria (9 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'EF-C1-CAP1-D2P', 'Explora de manera autónoma las posibilidades de su cuerpo en diferentes acciones para mejorar sus movimientos (saltar, correr, lanzar) al mantener y/o recuperar el equilibrio en el espacio y con los objetos, cuando utiliza conscientemente distintas bases de sustentación; así, conoce en sí mismo su lado dominante.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'EF-C1-CAP2-D2P', 'Se expresa motrizmente para comunicar sus emociones (miedo, angustia, alegría, placer, torpeza, inhibición, rabia, entre otras) y representa en el juego objetos, animales, personajes, historias, entre otros.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'EF-C2-CAP1-D2P', 'Describe los alimentos de su dieta familiar y las posturas que son beneficiosas para su salud en la vida cotidiana y en la práctica de actividades lúdicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'EF-C2-CAP2-D2P', 'Regula su esfuerzo al participar en actividades lúdicas e identifica en sí mismo y en otros la diferencia entre inspiración y espiración, en reposo y movimiento, en las actividades lúdicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'EF-C3-CAP1-D2P', 'Asume roles y funciones de manera individual y dentro de un grupo; interactúa de forma espontánea en actividades lúdicas y disfruta de la compañía de sus pares para sentirse parte del grupo.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'EF-C3-CAP2-D2P', 'Participa en juegos cooperativos y de oposición en parejas y pequeños grupos; acepta al oponente como compañero de juego y las formas diferentes de jugar.');

-- EF 3° Primaria (9 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'EF-C1-CAP1-D3P', 'Reconoce la izquierda y la derecha con relación a objetos y a sus pares, para mejorar sus posibilidades de movimiento en diferentes acciones lúdicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'EF-C1-CAP2-D3P', 'Se orienta en un espacio y tiempo determinados, con relación a sí mismo, a los objetos y a sus compañeros; coordina sus movimientos en situaciones lúdicas y regula su equilibrio al variar la base de sustentación y la altura de la superficie de apoyo, de esta manera, afianza sus habilidades motrices básicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'EF-C2-CAP1-D3P', 'Explica la importancia de la activación corporal (calentamiento) y psicológica (atención, concentración y motivación) antes de la actividad lúdica, e identifica los signos y síntomas relacionados con el ritmo cardiaco, la respiración agitada y la sudoración, que aparecen en el organismo al practicar actividades lúdicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'EF-C2-CAP2-D3P', 'Incorpora prácticas de cuidado al asearse, al vestirse, al adoptar posturas adecuadas en la práctica de actividades lúdicas y de la vida cotidiana. Ejemplo: El estudiante usa diversos medios de protección frente a la radiación solar.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'EF-C3-CAP1-D3P', 'Propone cambios en las condiciones de juego, si fuera necesario, para posibilitar la inclusión de sus pares; así, promueve el respeto y la participación, y busca un sentido de pertenencia al grupo en la práctica de diferentes actividades físicas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'EF-C3-CAP2-D3P', 'Participa en juegos cooperativos y de oposición en parejas, pequeños y grandes grupos; acepta al oponente como compañero de juego y toma consensos sobre la manera de jugar.');

-- EF 4° Primaria (9 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'EF-C1-CAP1-D4P', 'Utiliza su cuerpo (posturas, gestos y mímica) y diferentes movimientos para expresar formas, ideas, emociones, sentimientos y pensamientos en la actividad física.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'EF-C1-CAP2-D4P', 'Se orienta en un espacio y tiempo determinados, reconociendo su lado izquierdo y derecho, y a través de las nociones "arriba-abajo", "dentro-fuera", "cerca-lejos", con relación a sí mismo y de acuerdo a sus intereses y necesidades.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'EF-C2-CAP1-D4P', 'Explica la importancia de la activación corporal (calentamiento) y psicológica (atención, concentración y motivación), que lo ayuda a estar predispuesto a la actividad.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'EF-C2-CAP2-D4P', 'Practica diferentes actividades lúdicas adaptando su esfuerzo y aplicando los conocimientos de los beneficios de la práctica de actividad física y de la salud relacionados con el ritmo cardiaco, la respiración y la sudoración.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'EF-C3-CAP1-D4P', 'Propone reglas y las modifica de acuerdo a las necesidades, el contexto y los intereses, con adaptaciones o modificaciones propuestas por el grupo, para favorecer la inclusión; muestra una actitud responsable y de respeto por el cumplimiento de los acuerdos establecidos.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'EF-C3-CAP2-D4P', 'Propone actividades lúdicas, como juegos populares y/o tradicionales, con adaptaciones o modificaciones propuestas por el grupo; acepta al oponente como compañero de juego y llega a consensos sobre la manera de jugar.');

-- EF 5° Primaria (9 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'EF-C1-CAP1-D5P', 'Aplica la alternancia de sus lados corporales de acuerdo a su preferencia, utilidad y/o necesidad, y anticipa las acciones motrices a realizar en un espacio y tiempo, para mejorar las posibilidades de respuesta en una actividad física.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'EF-C1-CAP2-D5P', 'Resuelve situaciones motrices al utilizar su lenguaje corporal (gesto, contacto visual, actitud corporal, apariencia, etc.), verbal y sonoro, que lo ayudan a sentirse seguro, confiado y aceptado.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'EF-C2-CAP1-D5P', 'Explica las condiciones que favorecen la aptitud física (Índice de Masa Corporal -IMC, consumo de alimentos favorables, cantidad y proporción necesarias) y las pruebas que la miden (resistencia, velocidad, flexibilidad y fuerza) para mejorar la calidad de vida, con relación a sus características personales.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'EF-C2-CAP2-D5P', 'Adopta posturas adecuadas en desplazamientos, al saltar y caer, al lanzar y recibir, y para ello aplica y describe los beneficios relacionados con la salud para su bienestar.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'EF-C3-CAP1-D5P', 'Emplea la resolución reflexiva y el diálogo como herramientas para solucionar problemas o conflictos surgidos con sus pares durante la práctica de actividades lúdicas y predeportivas diversas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'EF-C3-CAP2-D5P', 'Realiza actividades lúdicas en las que interactúa con sus compañeros y oponentes como compañeros de juego; respeta las diferencias personales y asume roles y cambio de roles.');

-- EF 6° Primaria (9 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'EF-C1-CAP1-D6P', 'Aplica la alternancia de sus lados corporales de acuerdo a su preferencia, utilidad y/o necesidad, y anticipa las acciones motrices a realizar en un espacio y tiempo, para mejorar las posibilidades de respuesta en una actividad física.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'EF-C1-CAP2-D6P', 'Resuelve situaciones motrices al utilizar su lenguaje corporal (gesto, contacto visual, actitud corporal, apariencia, etc.), verbal y sonoro, que lo ayudan a sentirse seguro, confiado y aceptado.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'EF-C2-CAP1-D6P', 'Explica las condiciones que favorecen la aptitud física (Índice de Masa Corporal -IMC, consumo de alimentos favorables, cantidad y proporción necesarias) y las pruebas que la miden (resistencia, velocidad, flexibilidad y fuerza) para mejorar la calidad de vida, con relación a sus características personales.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'EF-C2-CAP2-D6P', 'Adopta posturas adecuadas en desplazamientos, al saltar y caer, al lanzar y recibir, y para ello aplica y describe los beneficios relacionados con la salud para su bienestar.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'EF-C3-CAP1-D6P', 'Emplea la resolución reflexiva y el diálogo como herramientas para solucionar problemas o conflictos surgidos con sus pares durante la práctica de actividades lúdicas y predeportivas diversas.'),
((SELECT id FROM capacidades WHERE codigo = 'EF-C3-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'EF-C3-CAP2-D6P', 'Realiza actividades lúdicas en las que interactúa con sus compañeros y oponentes como compañeros de juego; respeta las diferencias personales y asume roles y cambio de roles.');

-- EDUCACIÓN RELIGIOSA (ER) - All Grades (36 desempeños total)

-- ER 1° Primaria (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'ER-C1-CAP1-D1P', 'Identifica que Dios manifiesta su amor en la Creación y lo relaciona con el amor que recibe de las personas que lo rodean.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'ER-C1-CAP2-D1P', 'Comprende los principales hechos de la Historia de la Salvación y los relaciona con su familia y su institución educativa.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'ER-C2-CAP1-D1P', 'Descubre el amor de Dios con diversas acciones en su familia, institución educativa y entorno.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '1° Primaria'), 'ER-C2-CAP2-D1P', 'Muestra en forma oral, gráfica y corporal el amor a su amigo Jesús.');

-- ER 2° Primaria (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'ER-C1-CAP1-D2P', 'Identifica que Dios manifiesta su amor en la Creación y lo relaciona con el amor que recibe de las personas que lo rodean.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'ER-C1-CAP2-D2P', 'Comprende los principales hechos de la Historia de la Salvación y los relaciona con su familia y su institución educativa.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'ER-C2-CAP1-D2P', 'Descubre el amor de Dios con diversas acciones en su familia, institución educativa y entorno.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '2° Primaria'), 'ER-C2-CAP2-D2P', 'Muestra en forma oral, gráfica y corporal el amor a su amigo Jesús.');

-- ER 3° Primaria (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'ER-C1-CAP1-D3P', 'Identifica la acción de Dios en diversos acontecimientos de la Historia de la Salvación.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'ER-C1-CAP2-D3P', 'Conoce a Dios Padre, que se manifiesta en las Sagradas Escrituras, y acepta el mensaje que le da a conocer para vivir en armonía con Él y con los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'ER-C2-CAP1-D3P', 'Expresa su amor a Dios y al prójimo realizando acciones que fomentan el respeto por la vida humana.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '3° Primaria'), 'ER-C2-CAP2-D3P', 'Practica el silencio y la oración en celebraciones de fe para comunicarse con Dios.');

-- ER 4° Primaria (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'ER-C1-CAP1-D4P', 'Identifica la acción de Dios en diversos acontecimientos de la Historia de la Salvación.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'ER-C1-CAP2-D4P', 'Conoce a Dios Padre, que se manifiesta en las Sagradas Escrituras, y acepta el mensaje que le da a conocer para vivir en armonía con Él y con los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'ER-C2-CAP1-D4P', 'Expresa su amor a Dios y al prójimo realizando acciones que fomentan el respeto por la vida humana.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '4° Primaria'), 'ER-C2-CAP2-D4P', 'Practica el silencio y la oración en celebraciones de fe para comunicarse con Dios.');

-- ER 5° Primaria (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'ER-C1-CAP1-D5P', 'Relaciona el amor de Dios con sus experiencias de vida, para actuar con coherencia.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'ER-C1-CAP2-D5P', 'Reconoce el amor de Dios presente en la Historia de la Salvación respetándose a sí mismo y a los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'ER-C2-CAP1-D5P', 'Expresa su fe al participar en su comunidad y respeta a sus compañeros y a los que profesan diferentes credos.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '5° Primaria'), 'ER-C2-CAP2-D5P', 'Reconoce que las enseñanzas de Jesucristo le permiten desarrollar actitudes de cambio a nivel personal y comunitario.');

-- ER 6° Primaria (6 desempeños)
INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion) VALUES
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'ER-C1-CAP1-D6P', 'Relaciona el amor de Dios con sus experiencias de vida, para actuar con coherencia.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C1-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'ER-C1-CAP2-D6P', 'Reconoce el amor de Dios presente en la Historia de la Salvación respetándose a sí mismo y a los demás.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP1'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'ER-C2-CAP1-D6P', 'Expresa su fe al participar en su comunidad y respeta a sus compañeros y a los que profesan diferentes credos.'),
((SELECT id FROM capacidades WHERE codigo = 'ER-C2-CAP2'), (SELECT id FROM grados WHERE nombre = '6° Primaria'), 'ER-C2-CAP2-D6P', 'Reconoce que las enseñanzas de Jesucristo le permiten desarrollar actitudes de cambio a nivel personal y comunitario.');
