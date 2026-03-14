-- ============================================================
-- MIGRACIÓN: Matemática - Ciclo VI
-- Pobla: Estándares de Aprendizaje, Campos Temáticos, Desempeños Precisados
-- Aplica a: 1° y 2° Secundaria (Ciclo VI)
-- Fuente: PLANIFICACIÓN ANUAL DE MATEMÁTICA - I.E. Jesús Sacramentado 2026
-- ============================================================

-- ============================================================
-- SECCIÓN 1: ESTÁNDARES DE APRENDIZAJE (Ciclo VI)
-- ============================================================

INSERT INTO public.estandares (competencia_id, ciclo, descripcion)
SELECT
  c.id,
  'VI',
  'Resuelve problemas referidos a las relaciones entre cantidades o magnitudes, traduciéndolas a expresiones numéricas y operativas con números naturales, enteros y racionales, y descuentos porcentuales sucesivos, verificando si estas expresiones cumplen con las condiciones iniciales del problema. Expresa su comprensión de la relación entre los órdenes del sistema de numeración decimal con las potencias de base diez, y entre las operaciones con números enteros y racionales; y las usa para interpretar enunciados o textos diversos de contenido matemático. Representa relaciones de equivalencia entre expresiones decimales, fraccionarias y porcentuales, entre unidades de masa, tiempo y monetarias; empleando lenguaje matemático. Selecciona, emplea y combina recursos, estrategias, procedimientos, y propiedades de las operaciones y de los números para estimar o calcular con enteros y racionales; y realizar conversiones entre unidades de masa, tiempo y temperatura; verificando su eficacia. Plantea afirmaciones sobre los números enteros y racionales, sus propiedades y relaciones, y las justifica mediante ejemplos y sus conocimientos de las operaciones, e identifica errores o vacíos en las argumentaciones propias o de otros y las corrige.'
FROM public.competencias c
WHERE c.codigo = 'MAT-C1'
ON CONFLICT DO NOTHING;

INSERT INTO public.estandares (competencia_id, ciclo, descripcion)
SELECT
  c.id,
  'VI',
  'Resuelve problemas referidos a interpretar cambios constantes o regularidades entre magnitudes, valores o entre expresiones; traduciéndolas a patrones numéricos y gráficos, progresiones aritméticas, ecuaciones e inecuaciones con una incógnita, funciones lineales y afín, y relaciones de proporcionalidad directa e inversa. Comprueba si la expresión algebraica usada expresó o reprodujo las condiciones del problema. Expresa su comprensión de: la relación entre función lineal y proporcionalidad directa; las diferencias entre una ecuación e inecuación lineal y sus propiedades; la variable como un valor que cambia; el conjunto de valores que puede tomar un término desconocido para verificar una inecuación; las usa para interpretar enunciados, expresiones algebraicas o textos diversos de contenido matemático. Selecciona, emplea y combina recursos, estrategias, métodos gráficos y procedimientos matemáticos para determinar el valor de términos desconocidos en una progresión aritmética, simplificar expresiones algebraicas y dar solución a ecuaciones e inecuaciones lineales, y evaluar funciones lineales. Plantea afirmaciones sobre propiedades de las progresiones aritméticas, ecuaciones e inecuaciones, así como de una función lineal, lineal afín con base a sus experiencias, y las justifica mediante ejemplos y propiedades matemáticas; encuentra errores o vacíos en las argumentaciones propias y las de otros y las corrige.'
FROM public.competencias c
WHERE c.codigo = 'MAT-C2'
ON CONFLICT DO NOTHING;

INSERT INTO public.estandares (competencia_id, ciclo, descripcion)
SELECT
  c.id,
  'VI',
  'Resuelve problemas en los que modela características de objetos mediante prismas, pirámides y polígonos, sus elementos y propiedades, y la semejanza y congruencia de formas geométricas; así como la ubicación y movimiento mediante coordenadas en el plano cartesiano, mapas y planos a escala, y transformaciones. Expresa su comprensión de las formas congruentes y semejantes, la relación entre una forma geométrica y sus diferentes perspectivas; usando dibujos y construcciones. Clasifica prismas, pirámides, polígonos y círculos, según sus propiedades. Selecciona y emplea estrategias, procedimientos y recursos para determinar la longitud, área o volumen de formas geométricas en unidades convencionales y para construir formas geométricas a escala. Plantea afirmaciones sobre la semejanza y congruencia de formas, entre relaciones entre áreas de formas geométricas; las justifica mediante ejemplos y propiedades geométricas.'
FROM public.competencias c
WHERE c.codigo = 'MAT-C3'
ON CONFLICT DO NOTHING;

INSERT INTO public.estandares (competencia_id, ciclo, descripcion)
SELECT
  c.id,
  'VI',
  'Resuelve problemas en los que plantea temas de estudio, identificando la población pertinente y las variables cuantitativas continuas, así como cualitativas nominales y ordinales. Recolecta datos mediante encuestas y los registra en tablas de datos agrupados, así también determina la media aritmética y mediana de datos discretos; representa su comportamiento en histogramas, polígonos de frecuencia, gráficos circulares, tablas de frecuencia y medidas de tendencia central; usa el significado de las medidas de tendencia central para interpretar y comparar la información contenida en estos. Basado en ello, plantea y contrasta conclusiones, sobre las características de una población. Expresa la probabilidad de un evento aleatorio como decimal o fracción, así como su espacio muestral; e interpreta que un suceso seguro, probable e imposible, se asocia a los valores entre 0 y 1. Hace predicciones sobre la ocurrencia de eventos y las justifica.'
FROM public.competencias c
WHERE c.codigo = 'MAT-C4'
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECCIÓN 2: CAMPOS TEMÁTICOS (Ciclo VI - Matemática)
-- ============================================================

-- C1: Resuelve problemas de cantidad
INSERT INTO public.campos_tematicos (area_id, ciclo, nombre)
SELECT a.id, 'VI', nombre_campo
FROM public.areas a
CROSS JOIN (VALUES
  ('Números enteros: operaciones y propiedades'),
  ('Fracciones: clasificación, amplificación, simplificación y equivalencia'),
  ('Números racionales: fracciones y decimales'),
  ('Notación exponencial y científica'),
  ('Potenciación y radicación con exponente entero'),
  ('Aumentos y descuentos porcentuales sucesivos'),
  ('IGV y transacciones financieras y comerciales'),
  ('Equivalencias entre unidades de masa, tiempo y temperatura')
) AS campos(nombre_campo)
WHERE a.nombre = 'Matemática'
ON CONFLICT DO NOTHING;

-- C2: Resuelve problemas de regularidad, equivalencia y cambio
INSERT INTO public.campos_tematicos (area_id, ciclo, nombre)
SELECT a.id, 'VI', nombre_campo
FROM public.areas a
CROSS JOIN (VALUES
  ('Expresiones algebraicas: términos, monomios y polinomios'),
  ('Operaciones con monomios: adición, sustracción, multiplicación y división'),
  ('Progresiones aritméticas y su regla de formación'),
  ('Ecuaciones lineales con una incógnita (ax + b = cx + d)'),
  ('Inecuaciones de primer grado'),
  ('Funciones lineales y afín'),
  ('Proporcionalidad directa e inversa'),
  ('Transformaciones geométricas: patrones gráficos')
) AS campos(nombre_campo)
WHERE a.nombre = 'Matemática'
ON CONFLICT DO NOTHING;

-- C3: Resuelve problemas de forma, movimiento y localización
INSERT INTO public.campos_tematicos (area_id, ciclo, nombre)
SELECT a.id, 'VI', nombre_campo
FROM public.areas a
CROSS JOIN (VALUES
  ('Polígonos: clasificación, elementos y propiedades'),
  ('Triángulos: semejanza y congruencia'),
  ('Prismas y pirámides: elementos y propiedades'),
  ('Circunferencia y círculo'),
  ('Transformaciones geométricas: traslación, rotación, reflexión y ampliación'),
  ('Coordenadas cartesianas y planos a escala'),
  ('Perímetro y área de figuras planas'),
  ('Volumen de prismas y pirámides'),
  ('Áreas compuestas e irregulares')
) AS campos(nombre_campo)
WHERE a.nombre = 'Matemática'
ON CONFLICT DO NOTHING;

-- C4: Resuelve problemas de gestión de datos e incertidumbre
INSERT INTO public.campos_tematicos (area_id, ciclo, nombre)
SELECT a.id, 'VI', nombre_campo
FROM public.areas a
CROSS JOIN (VALUES
  ('Variables cualitativas (nominales y ordinales) y cuantitativas (discretas y continuas)'),
  ('Recopilación de datos mediante encuestas'),
  ('Tablas de frecuencia: datos agrupados'),
  ('Histogramas y polígonos de frecuencia'),
  ('Gráficos circulares'),
  ('Medidas de tendencia central: media, mediana y moda'),
  ('Probabilidad: espacio muestral y sucesos'),
  ('Regla de Laplace y frecuencia relativa')
) AS campos(nombre_campo)
WHERE a.nombre = 'Matemática'
ON CONFLICT DO NOTHING;

-- ============================================================
-- SECCIÓN 3: DESEMPEÑOS PRECISADOS (2° Secundaria - Ciclo VI)
-- ============================================================

-- ---- C1: Traduce cantidades a expresiones numéricas ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Establece relaciones entre datos y acciones de ganar, perder, comparar e igualar cantidades, o una combinación de acciones. Las transforma a expresiones numéricas (modelos) que incluyen operaciones de adición, sustracción, multiplicación, división con números enteros, expresiones fraccionarias o decimales, y potencias con exponente entero, notación exponencial, así como aumentos y descuentos porcentuales sucesivos. En este grado, el estudiante expresa los datos en unidades de masa, de tiempo, de temperatura o monetarias.'),
  ('Comprueba si la expresión numérica (modelo) planteada representó las condiciones del problema: datos, acciones y condiciones.'),
  ('Establece relaciones entre datos y acciones de ganar, perder, comparar e igualar cantidades, que incluyen operaciones de adición y sustracción con números enteros, expresiones fraccionarias o decimales en situaciones problemáticas.'),
  ('Establece relaciones entre datos que incluyen multiplicación con expresiones fraccionarias en situaciones problemáticas.'),
  ('Establece relaciones entre datos que incluyen división y multiplicación con expresiones fraccionarias en situaciones problemáticas.'),
  ('Establecemos relaciones entre datos, las transformamos en expresiones numéricas que incluyen operaciones con expresiones fraccionarias y las representamos con gráficos y lenguaje numérico.'),
  ('Establece relaciones entre datos y acciones de ganar, perder, comparar e igualar cantidades, o una combinación de acciones. Las transforma a expresiones numéricas (modelos) que incluyen operaciones de adición y sustracción con números decimales en situaciones problemáticas.'),
  ('Establece relaciones entre datos y acciones de ganar, perder, comparar e igualar cantidades, o una combinación de acciones. Las transforma a expresiones numéricas (modelos) que incluyen multiplicación con números decimales en situaciones problemáticas.'),
  ('Establece relaciones entre datos y acciones de ganar, perder, comparar e igualar cantidades, o una combinación de acciones. Las transforma a expresiones numéricas (modelos) que incluyen división con números decimales en situaciones problemáticas.'),
  ('Establece relaciones entre datos y acciones, y las transforma a expresiones numéricas que incluyen porcentajes usuales.'),
  ('Establece relaciones entre datos y acciones, y las transforma a expresiones numéricas que incluyen descuentos porcentuales.'),
  ('Establece relaciones entre datos al desarrollar notación exponencial y las transforma a expresiones numéricas (modelos) en notación exponencial.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C1-CAP1'
ON CONFLICT DO NOTHING;

-- ---- C1: Comunica su comprensión sobre los números y las operaciones ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión del valor posicional de las cifras de un número hasta los millones al ordenar, comparar, componer y descomponer números enteros y números racionales en su forma fraccionaria y decimal, así como la utilidad o sentido de expresar números naturales en su notación exponencial, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones. Reconoce la diferencia entre una descomposición polinómica y una notación exponencial.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión de la fracción como razón y operador, y del significado del signo positivo y negativo de enteros y racionales, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre la equivalencia entre dos aumentos o descuentos porcentuales sucesivos y el significado del IGV, para interpretar el problema en el contexto de las transacciones financieras y comerciales, y estableciendo relaciones entre representaciones.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre las propiedades de la potenciación de exponente entero, la relación inversa entre la radiación y potenciación con números enteros, y las expresiones racionales y fraccionarias y sus propiedades. Usa este entendimiento para asociar o secuenciar operaciones.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre las fracciones empleando su clasificación, la amplificación, simplificación y fracciones equivalentes de números racionales en su expresión fraccionaria; empleamos estrategias y procedimientos diversos para realizar operaciones y simplificar procesos usando propiedades en las operaciones.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre el orden de números racionales en su expresión fraccionaria; empleamos la representación en la recta numérica y procedimientos diversos para su representación en modelos planteados.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre el orden y la comparación de números racionales en su expresión fraccionaria; empleamos estrategias y procedimientos diversos para realizar operaciones y simplificar procesos usando propiedades de los números y las operaciones.'),
  ('Expresa con diversas representaciones y lenguaje numérico la comprensión de la fracción como razón.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre el significado del IGV, para interpretar el problema en el contexto de las transacciones financieras y comerciales, y estableciendo relaciones entre representaciones.'),
  ('Representamos con lenguaje numérico el significado del impuesto general a las ventas (IGV) en transacciones financieras y comerciales. Empleamos estrategias de cálculo y procedimientos para realizar operaciones con porcentajes usando propiedades de los números y las operaciones.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre la notación exponencial, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones. Reconoce la diferencia entre una descomposición polinómica y una notación exponencial.'),
  ('Demuestra la capacidad de expresar números muy grandes o muy pequeños utilizando notación científica.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre las propiedades de la radicación de exponente entero y las expresiones racionales y fraccionarias y sus propiedades. Usa este entendimiento para asociar o secuenciar operaciones en situaciones planteadas.'),
  ('Representamos con lenguaje numérico nuestra comprensión sobre el orden y la comparación de números racionales en su expresión fraccionaria; empleamos estrategias y procedimientos diversos para realizar operaciones con expresiones fraccionarias y simplificar procesos usando propiedades de los números y las operaciones.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C1-CAP2'
ON CONFLICT DO NOTHING;

-- ---- C1: Usa estrategias y procedimientos de estimación y cálculo ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Selecciona, emplea y combina estrategias de cálculo, estimación y procedimientos diversos para realizar operaciones con números enteros, expresiones fraccionarias, decimales y porcentuales, tasas de interés, el impuesto a la renta, y simplificar procesos usando propiedades de los números y las operaciones, de acuerdo con las condiciones de la situación planteada.'),
  ('Selecciona y usa unidades e instrumentos pertinentes para medir o estimar la masa, el tiempo y la temperatura, y para determinar equivalencias entre las unidades y subunidades de medida de masa, de temperatura, de tiempo y monetarias de diferentes países.'),
  ('Selecciona, emplea y combina estrategias de cálculo y de estimación, y procedimientos diversos para determinar equivalencias entre expresiones fraccionarias, decimales y porcentuales.'),
  ('Selecciona, emplea y combina recursos, estrategias heurísticas y el procedimiento matemático más conveniente a las condiciones de un problema en evaluación diagnóstica.'),
  ('Selecciona y usa unidades e instrumentos pertinentes para medir o estimar la masa y el tiempo para determinar equivalencias entre las unidades y subunidades de medida de masa de diferentes países mediante situaciones problemáticas.'),
  ('Selecciona y usa unidades e instrumentos pertinentes para medir o estimar la longitud y la capacidad para determinar equivalencias entre las unidades y subunidades de medida de longitud y capacidad de diferentes países mediante situaciones problemáticas.'),
  ('Selecciona y usa unidades de medidas para estimar la longitud y otros, así como realizar conversiones entre sus unidades y subunidades.'),
  ('Selecciona y emplea estrategias de cálculo para realizar operaciones con expresiones fraccionarias en situaciones planteadas.'),
  ('Selecciona, emplea y combina estrategias de cálculo, estimación y procedimientos diversos para realizar operaciones con expresiones fraccionarias, decimales y porcentuales y simplificar procesos usando propiedades de los números y las operaciones, de acuerdo con las condiciones de la situación planteada.'),
  ('Emplear estrategias y procedimientos para realizar operaciones que incluyen descuentos porcentuales sucesivos.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C1-CAP3'
ON CONFLICT DO NOTHING;

-- ---- C1: Argumenta afirmaciones sobre las relaciones numéricas y las operaciones ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Plantea afirmaciones sobre las propiedades de la potenciación y la radicación, el orden entre dos números racionales, y las equivalencias entre descuentos porcentuales sucesivos, y sobre las relaciones inversas entre las operaciones, u otras relaciones que descubre. Las justifica o sustenta con ejemplos y propiedades de los números y operaciones. Infiere relaciones entre estas. Reconoce errores o vacíos en sus justificaciones y en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre las propiedades de la potenciación y sobre las relaciones inversas entre las operaciones, u otras relaciones que descubre. Las justifica o sustenta con ejemplos y propiedades de los números y operaciones. Infiere relaciones entre estas. Reconoce errores o vacíos en sus justificaciones y en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre aumentos porcentuales sucesivos, y sobre las relaciones inversas entre las operaciones, u otras relaciones que descubre. Las justifica o sustenta con ejemplos. Reconoce errores o vacíos en sus justificaciones y en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre descuentos porcentuales sucesivos, y sobre las relaciones inversas entre las operaciones, u otras relaciones que descubre. Las justifica o sustenta con ejemplos. Reconoce errores o vacíos en sus justificaciones y en las de otros, y las corrige.'),
  ('Expresa con diversas representaciones y lenguaje numérico su comprensión sobre la equivalencia entre dos aumentos o descuentos porcentuales sucesivos estableciendo relaciones entre representaciones.'),
  ('Plantea afirmaciones sobre las propiedades de la radicación y sobre las relaciones inversas entre las operaciones, u otras relaciones que descubre. Las justifica o sustenta con ejemplos y propiedades de los números y operaciones. Infiere relaciones entre estas. Reconoce errores o vacíos en sus justificaciones y en las de otros, y las corrige.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C1-CAP4'
ON CONFLICT DO NOTHING;

-- ---- C2: Traduce datos y condiciones a expresiones algebraicas y gráficas ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Establece relaciones entre datos, regularidades, valores desconocidos, o relaciones de equivalencia o variación entre dos magnitudes. Transforma esas relaciones a expresiones algebraicas o gráficas (modelos) que incluyen la regla de formación de progresiones aritméticas con números enteros, a ecuaciones lineales (ax + b = cx + d), a inecuaciones de la forma (ax > b, ax < b, ax ≤ b y ax ≥ b), a funciones lineales y afines, a proporcionalidad directa e inversa con expresiones fraccionarias o decimales, o a gráficos cartesianos. También las transforma a patrones gráficos que combinan traslaciones, rotaciones o ampliaciones.'),
  ('Comprueba si la expresión algebraica o gráfica (modelo) que planteó le permitió solucionar el problema, y reconoce qué elementos de la expresión representan las condiciones del problema: datos, términos desconocidos, regularidades, relaciones de equivalencia o variación entre dos magnitudes.'),
  ('Establece relaciones entre datos, valores desconocidos o relaciones de equivalencia y las transforma a expresiones algebraicas incluyendo su clasificación y término algebraico.'),
  ('Comprueba si la expresión algebraica que planteó le permitió solucionar el problema de términos semejantes.'),
  ('Comprueba si la expresión algebraica o gráfica (modelo) que planteó le permitió solucionar el problema, y reconoce qué elementos de la expresión representan las condiciones del problema al expresar los grados de un monomio en su ficha de trabajo.'),
  ('Establece relaciones entre datos, regularidades, valores desconocidos, o relaciones de equivalencia o variación entre dos magnitudes. Transforma esas relaciones a expresiones algebraicas o gráficas (modelos) que incluyen ecuaciones lineales (ax + b = cx + d). También las transforma.'),
  ('Establece relaciones entre datos, valores desconocidos, o relaciones de equivalencia y las transforma a expresiones algebraicas que incluyen ecuaciones lineales.'),
  ('Establece relaciones entre datos, valores desconocidos, o relaciones de equivalencia y transforma esas relaciones a expresiones algebraicas.'),
  ('Establecemos relaciones entre datos y las transformamos en expresiones algebraicas o gráficas que incluyen la función lineal y afín. También empleamos estrategias heurísticas y procedimientos diversos para resolver un problema, y evaluamos el conjunto de valores de una función lineal y afín.'),
  ('Establecemos relaciones entre datos y valores desconocidos, y transformamos esas relaciones en expresiones algebraicas que incluyen la regla de formación de progresiones aritméticas. Asimismo, empleamos estrategias heurísticas y procedimientos diversos para resolver problemas de progresión aritmética.'),
  ('Establece relaciones entre datos o variaciones entre dos magnitudes. Transforma esas relaciones en patrones aditivos o multiplicativos.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C2-CAP1'
ON CONFLICT DO NOTHING;

-- ---- C2: Comunica su comprensión sobre las relaciones algebraicas ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Expresa, con diversas representaciones gráficas, tabulares y simbólicas, y con lenguaje algebraico, su comprensión sobre la regla de formación de patrones gráficos y progresiones aritméticas, y sobre la suma de sus términos, para interpretar un problema en su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa, con diversas representaciones gráficas, tabulares y simbólicas, y con lenguaje algebraico, su comprensión sobre la solución de una ecuación lineal y sobre el conjunto solución de una condición de desigualdad, para interpretarlas y explicarlas en el contexto de la situación. Establece conexiones entre dichas representaciones y pasa de una a otra representación cuando la situación lo requiere.'),
  ('Expresa, usando lenguaje matemático y representaciones gráficas, tabulares y simbólicas, su comprensión de la relación de correspondencia entre la constante de cambio de una función lineal y el valor de su pendiente, las diferencias entre función afín y función lineal, así como su comprensión de las diferencias entre una proporcionalidad directa e inversa, para interpretarlas y explicarlas en el contexto de la situación.'),
  ('Expresa, usando representaciones gráficas y tabulares, la comprensión de la relación de correspondencia entre dos magnitudes proporcionales y la constante de cambio de una función lineal.'),
  ('Expresa, con diversas representaciones gráficas, tabulares y simbólicas, y con lenguaje algebraico, su comprensión sobre la regla de formación de patrones gráficos y progresiones aritméticas, para interpretar un problema en su contexto y estableciendo relaciones entre dichas representaciones.'),
  ('Expresa, con diversas representaciones gráficas, tabulares y simbólicas, y con lenguaje algebraico, su comprensión sobre la suma de sus términos, para interpretar un problema en su contexto y estableciendo relaciones entre dichas representaciones.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C2-CAP2'
ON CONFLICT DO NOTHING;

-- ---- C2: Usa estrategias y procedimientos para encontrar equivalencias y reglas generales ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Selecciona y combina recursos, estrategias heurísticas y el procedimiento matemático más conveniente a las condiciones de un problema para determinar términos desconocidos o la suma de "n" términos de una progresión aritmética, simplificar expresiones algebraicas usando propiedades de la igualdad y propiedades de las operaciones, solucionar ecuaciones e inecuaciones lineales, y evaluar el conjunto de valores de una función lineal.'),
  ('Selecciona y combina recursos, estrategias heurísticas y el procedimiento matemático más conveniente a las condiciones de un problema para determinar términos desconocidos o la suma de "n" términos de una progresión aritmética, simplificar expresiones algebraicas usando propiedades de la igualdad y propiedades de las operaciones.'),
  ('Demuestra la capacidad de sumar y restar monomios utilizando las propiedades y las reglas algebraicas.'),
  ('Demuestra la capacidad de multiplicar y dividir monomios utilizando las propiedades y las reglas algebraicas.'),
  ('Establecer relaciones entre datos, valores desconocidos y transformar esas relaciones a expresiones algebraicas que incluyen propiedades de las desigualdades o inecuaciones de primer grado.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C2-CAP3'
ON CONFLICT DO NOTHING;

-- ---- C2: Argumenta afirmaciones sobre relaciones de cambio y equivalencia ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Plantea afirmaciones sobre la relación entre la posición de un término en una progresión aritmética y su regla de formación, u otras relaciones de cambio que descubre. Justifica la validez de sus afirmaciones usando ejemplos y sus conocimientos matemáticos. Reconoce errores en sus justificaciones o en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre las propiedades que sustentan la igualdad o la simplificación de expresiones algebraicas para solucionar ecuaciones e inecuaciones lineales, u otras relaciones que descubre. Justifica la validez de sus afirmaciones mediante ejemplos y sus conocimientos matemáticos. Reconoce errores en sus justificaciones o en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre las diferencias entre la función lineal y una función lineal afín, y sobre la diferencia entre una proporcionalidad directa y una proporcionalidad inversa, u otras relaciones que descubre. Justifica la validez de sus afirmaciones usando ejemplos y sus conocimientos matemáticos. Reconoce errores en sus justificaciones o en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre la diferencia entre una proporcionalidad directa y una proporcionalidad inversa, u otras relaciones que descubre. Justifica la validez de sus afirmaciones usando ejemplos y sus conocimientos matemáticos.'),
  ('Plantea afirmaciones sobre las diferencias entre la función lineal y una función lineal afín. Justifica la validez de sus afirmaciones usando ejemplos y sus conocimientos matemáticos. Reconoce errores en sus justificaciones o en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre las propiedades que sustentan la igualdad o la simplificación de expresiones algebraicas para solucionar inecuaciones lineales. Justifica la validez de sus afirmaciones mediante ejemplos y sus conocimientos matemáticos. Reconoce errores en sus justificaciones o en las de otros, y las corrige.'),
  ('Plantea afirmaciones sobre la relación entre la posición de un término en una progresión aritmética y su regla de formación. Justifica la validez de sus afirmaciones usando ejemplos y sus conocimientos matemáticos. Reconoce errores en sus justificaciones o en las de otros, y las corrige.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C2-CAP4'
ON CONFLICT DO NOTHING;

-- ---- C3: Modela objetos con formas geométricas y sus transformaciones ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Establece relaciones entre las características y los atributos medibles de objetos reales o imaginarios. Asocia estas características y las representa con formas bidimensionales compuestas y tridimensionales. Establece, también, propiedades de semejanza y congruencia entre formas poligonales, y entre las propiedades del volumen, área y perímetro.'),
  ('Describe la ubicación o el recorrido de un objeto real o imaginario, y los representa utilizando coordenadas cartesianas, planos o mapas a escala. Describe las transformaciones de un objeto en términos de combinar dos a dos ampliaciones, traslaciones, rotaciones o reflexiones.'),
  ('Establece relaciones entre las características y los atributos medibles de objetos reales o imaginarios. Asocia estas características y las representa con formas bidimensionales compuestas. Establece, también, propiedades de semejanza y congruencia entre formas poligonales, y entre las propiedades del área y perímetro.'),
  ('Establece relaciones entre las características y los atributos medibles de objetos reales o imaginarios. Asocia estas características y las representa con formas bidimensionales compuestas y tridimensionales. Establece, también, propiedades del perímetro y área de figuras polígonos regulares e irregulares.'),
  ('Describe la ubicación o el recorrido de un objeto real o imaginario, y los representa utilizando coordenadas cartesianas, planos o mapas a escala. Describe las transformaciones de un objeto en términos de combinar traslaciones, rotaciones o reflexiones.'),
  ('Expresar, con un diseño sencillo, los desplazamientos y posiciones de un objeto o imagen. Además, describir los cambios de ubicación del objeto en el plano cartesiano.'),
  ('Expresar la traslación geométrica de una figura en un croquis con el apoyo de cuadrículas y vector de desplazamiento.'),
  ('Describimos las transformaciones geométricas de un objeto, las representamos utilizando coordenadas cartesianas y expresamos nuestra comprensión sobre las características de una traslación. Asimismo, empleamos estrategias o procedimientos para describir el movimiento a partir de una traslación.'),
  ('Expresar en un plano cartesiano los cambios de tamaño y ubicación de los objetos mediante transformaciones geométricas.'),
  ('Describir la ubicación o el recorrido de un objeto real y representarlos utilizando planos o mapas a escala.'),
  ('Describimos la ubicación o el recorrido de un objeto real o imaginario y lo representamos utilizando planos o mapas a escala. Asimismo, empleamos estrategias heurísticas, recursos o procedimientos para describir la localización de los objetos en planos a escala usando unidades convencionales.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C3-CAP1'
ON CONFLICT DO NOTHING;

-- ---- C3: Comunica su comprensión sobre las formas y relaciones geométricas ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Expresa, con dibujos, construcciones con regla y compás, con material concreto y con lenguaje geométrico, su comprensión sobre las propiedades de la semejanza y congruencia de formas bidimensionales (triángulos), y de los prismas, pirámides y polígonos. Los expresa aun cuando estos cambien de posición y vistas, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa, con dibujos, construcciones con regla y compás, con material concreto y con lenguaje geométrico, su comprensión sobre las características que distinguen una rotación de una traslación y una traslación de una reflexión. Estas distinciones se hacen de formas bidimensionales para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa, con dibujos, con material concreto y con lenguaje geométrico, su comprensión sobre los polígonos. Los expresa aun cuando estos cambien de posición y vistas, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa, con dibujos, con material concreto y con lenguaje geométrico, su comprensión sobre las propiedades de la semejanza y congruencia de formas bidimensionales (triángulos). Los expresa aun cuando estos cambien de posición y vistas, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa, con dibujos, con material concreto y con lenguaje geométrico, su comprensión sobre las propiedades de los polígonos. Los expresa aun cuando estos cambien de posición y vistas, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Expresa, con dibujos, con material concreto y con lenguaje geométrico, su comprensión sobre los prismas, pirámides y cono. Los expresa aun cuando estos cambien de posición y vistas, para interpretar un problema según su contexto y estableciendo relaciones entre representaciones.'),
  ('Lee textos o gráficos que describen características, elementos o propiedades de las formas geométricas bidimensionales y tridimensionales. Reconoce propiedades de la semejanza y congruencia, y la composición de transformaciones (rotación, ampliación y reducción) para extraer información. Lee pianos o mapas a escala y los usa para ubicarse en el espacio y determinar rutas.'),
  ('Lee textos o gráficos que describen características, elementos o propiedades de las formas geométricas bidimensionales y tridimensionales. Reconoce propiedades de la semejanza y congruencia, y la composición de transformaciones (ampliación y reducción) para extraer información.'),
  ('Interpretar la traslación geométrica de una figura en un plano con cuadrículas.'),
  ('Interpretar las características de la rotación de una figura en un plano con cuadrículas dando un soporte gráfico.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C3-CAP2'
ON CONFLICT DO NOTHING;

-- ---- C3: Usa estrategias y procedimientos para orientarse en el espacio ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Selecciona y emplea estrategias heurísticas, recursos o procedimientos para determinar la longitud, el perímetro, el área o el volumen de primas, pirámides, polígonos y círculos, así como de áreas bidimensionales compuestas o irregulares, empleando coordenadas cartesianas y unidades convencionales (centímetro, metro y kilómetro) y no convencionales (bolitas, panes, botellas, etc.).'),
  ('Selecciona y emplea estrategias heurísticas, recursos o procedimientos para describir el movimiento, la localización o las perspectivas (vistas) de los objetos en planos a escala, empleando unidades convencionales (centímetro, metro y kilómetro) y no convencionales (por ejemplo, pasos).'),
  ('Emplea estrategias, procedimientos y recursos para hallar el área y el perímetro de las formas geométricas.'),
  ('Selecciona y emplea estrategias, procedimientos y recursos para hallar el área y el perímetro de formas geométricas.'),
  ('Selecciona y emplea estrategias heurísticas, recursos o procedimientos para determinar la longitud, el perímetro y el área de polígonos y círculos, así como de áreas bidimensionales compuestas empleando coordenadas cartesianas y unidades convencionales (centímetro, metro y kilómetro) y no convencionales (bolitas, panes, botellas, etc.).'),
  ('Selecciona y emplea estrategias heurísticas, recursos o procedimientos para determinar la longitud, el perímetro, el área o el volumen de prismas, pirámides y polígonos, así como de áreas bidimensionales compuestas o irregulares, empleando coordenadas cartesianas y unidades convencionales (centímetro, metro y kilómetro).'),
  ('Selecciona y emplea estrategias heurísticas, recursos o procedimientos para describir el movimiento, la localización o las perspectivas (vistas) de los objetos en planos a escala, empleando unidades convencionales (centímetro, metro y kilómetro) y no convencionales (por ejemplo, pasos).'),
  ('Selecciona y emplea estrategias heurísticas, recursos o procedimientos para determinar la longitud de polígonos empleando coordenadas cartesianas y unidades convencionales (centímetro, metro y kilómetro).')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C3-CAP3'
ON CONFLICT DO NOTHING;

-- ---- C3: Argumenta afirmaciones sobre relaciones geométricas ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Plantea afirmaciones sobre las relaciones y propiedades que descubre entre los objetos, entre objetos y formas geométricas, y entre las formas geométricas, sobre la base de simulaciones y la observación de casos. Las justifica con ejemplos y sus conocimientos geométricos. Reconoce errores en sus justificaciones y en las de otros, y los corrige.'),
  ('Plantea afirmaciones sobre las relaciones y propiedades que descubre entre los objetos, entre objetos y formas geométricas, y entre las formas geométricas, sobre la base de simulaciones y la observación de casos en los triángulos. Las justifica con ejemplos y sus conocimientos geométricos. Reconoce errores en sus justificaciones y en las de otros, y los corrige.'),
  ('Plantear afirmaciones sobre las relaciones entre las medidas de volumen entre dos objetos.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C3-CAP4'
ON CONFLICT DO NOTHING;

-- ---- C4: Representa datos con gráficos y medidas estadísticas o probabilísticas ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Representa las características de una población en estudio asociándolas a variables cualitativas nominales y ordinales, o cuantitativas discretas y continuas. Expresa el comportamiento de los datos de la población a través de histogramas, polígonos de frecuencia y medidas de tendencia central.'),
  ('Determina las condiciones y el espacio muestral de una situación aleatoria, y compara la frecuencia de sus sucesos. Representa la probabilidad de un suceso a través de la regla de Laplace (valor decimal) o representa su probabilidad mediante su frecuencia relativa expresada como decimal o porcentaje. A partir de este valor determina si un suceso es seguro, probable o imposible de suceder.'),
  ('Representa las características de una población en estudio asociándolas a variables cualitativas nominales y ordinales, o cuantitativas discretas y continuas en situaciones propuestas.'),
  ('Representar en un gráfico circular la información que ha sido organizada y presentada en una tabla de frecuencias.'),
  ('Representa las características de una población en estudio asociándolas a variables cualitativas nominales y ordinales, o cuantitativas discretas y continuas. Expresa el comportamiento de los datos de la población a través de histogramas y polígonos de frecuencia.'),
  ('Recopila datos de variables cualitativas nominales u ordinales, y cuantitativas discretas o continuas mediante encuestas. Los procesa y organiza en tablas de datos agrupados con el propósito de analizarlos y producir información.'),
  ('Determina las condiciones y el espacio muestral de una situación aleatoria, y compara la frecuencia de sus sucesos en situaciones planteadas.'),
  ('Determina las condiciones y el espacio muestral de una situación aleatoria, y compara la frecuencia de sus sucesos. Representa la probabilidad de un suceso a través de la regla de Laplace (valor decimal) o representa su probabilidad mediante su frecuencia relativa expresada como decimal o porcentaje.'),
  ('Expresar la comprensión de los posibles resultados de una situación aleatoria, usando la noción de "más probable" y su representación de forma numérica.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C4-CAP1'
ON CONFLICT DO NOTHING;

-- ---- C4: Comunica su comprensión de los conceptos estadísticos y probabilísticos ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Expresa con diversas representaciones y lenguaje matemático su comprensión sobre la pertinencia de usar la media, la mediana o la moda (datos no agrupados) para representar un conjunto de datos según el contexto de la población en estudio, así como sobre el significado del valor de la probabilidad para caracterizar como segura o imposible la ocurrencia de sucesos de una situación aleatoria.'),
  ('Expresa con diversas representaciones y lenguaje matemático su comprensión sobre la pertinencia de usar la media, la mediana o la moda (datos no agrupados) para representar un conjunto de datos según el contexto de la población en estudio.'),
  ('Expresa el comportamiento de los datos de la población medidas de tendencia central en situaciones de su entorno.'),
  ('Expresa con diversas representaciones y lenguaje matemático su comprensión sobre el significado del valor de la probabilidad para caracterizar como segura o imposible la ocurrencia de sucesos de una situación aleatoria.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C4-CAP2'
ON CONFLICT DO NOTHING;

-- ---- C4: Usa estrategias y procedimientos para recopilar y procesar datos ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Lee tablas y gráficos como histogramas, polígonos de frecuencia, así como diversos textos que contengan valores de medidas de tendencia central o descripciones de situaciones aleatorias, para comparar e interpretar la información que contienen y deducir nuevos datos. A partir de ello, produce nueva información.'),
  ('Recopila datos de variables cualitativas nominales u ordinales, y cuantitativas discretas o continuas mediante encuestas, o seleccionando y empleando procedimientos, estrategias y recursos adecuados al tipo de estudio. Los procesa y organiza en tablas con el propósito de analizarlos y producir información. Revisa los procedimientos utilizados y los adecúa a otros contextos de estudio.'),
  ('Selecciona y emplea procedimientos para determinar la mediana, la moda y la media de datos discretos, la probabilidad de sucesos de una situación aleatoria mediante la regla de Laplace o el cálculo de su frecuencia relativa expresada como porcentaje. Revisa sus procedimientos y resultados.'),
  ('Recopila datos de variables cualitativas nominales u ordinales, y cuantitativas discretas o continuas mediante encuestas, o seleccionando y empleando procedimientos, estrategias y recursos adecuados al tipo de estudio. Los procesa y organiza en tablas y gráficos con el propósito de analizarlos y producir información. Revisa los procedimientos utilizados y los adecúa a otros contextos de estudio.'),
  ('Selecciona y emplea procedimientos para determinar la mediana, la moda y la media de datos discretos, el cálculo de su frecuencia relativa expresada como porcentaje. Revisa sus procedimientos y resultados.'),
  ('Lee tablas de datos agrupados y gráficos como polígonos de frecuencia para comparar e interpretar la información que contienen y deducir nuevos datos.'),
  ('Leemos tablas y diversos textos que contienen valores de medidas de tendencia central; empleamos estrategias y procedimientos para recopilar y procesar datos y determinar sus medidas. Asimismo, justificamos con nuestros conocimientos estadísticos las características de una muestra de la población.'),
  ('Selecciona y emplea procedimientos para determinar, la probabilidad de sucesos de una situación aleatoria mediante la regla de Laplace. Revisa sus procedimientos y resultados.'),
  ('Empleamos procedimientos para determinar la probabilidad de sucesos de una situación aleatoria mediante la regla de Laplace. Asimismo, expresamos con lenguaje matemático nuestra comprensión sobre el valor de la probabilidad en una situación aleatoria.'),
  ('Plantear afirmaciones o conclusiones sobre las características de una población, usando información cuantitativa o cualitativa al leer gráficos de barras.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C4-CAP3'
ON CONFLICT DO NOTHING;

-- ---- C4: Sustenta conclusiones o decisiones con base en la información obtenida ----
INSERT INTO public.desempenos_precisados (desempeno_id, descripcion)
SELECT 
  (SELECT d.id FROM public.desempenos d WHERE d.capacidad_id = cap.id AND d.grado_id = g.id LIMIT 1),
  desc_texto
FROM public.capacidades cap
JOIN public.grados g ON g.nombre = '2° Secundaria'
CROSS JOIN (VALUES
  ('Plantea afirmaciones o conclusiones sobre las características, tendencias de los datos de una población o la probabilidad de ocurrencia de sucesos en estudio. Las justifica usando la información obtenida, y sus conocimientos estadísticos y probabilísticos. Reconoce errores en sus justificaciones y en las de otros, y los corrige.'),
  ('Plantea afirmaciones o conclusiones sobre las características de una población, usando la información obtenida. Las justifica con sus conocimientos estadísticos. Reconoce errores en sus justificaciones y en las de otros, y los corrige.'),
  ('Plantea afirmaciones o conclusiones sobre las características, tendencias de los datos de una población. Las justifica usando la información obtenida, y sus conocimientos estadísticos y probabilísticos. Reconoce errores en sus justificaciones y en las de otros, y las corrige.')
) AS dp(desc_texto)
WHERE cap.codigo = 'MAT-C4-CAP4'
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
-- Resumen de lo insertado:
--   4 Estándares de Aprendizaje (Ciclo VI, uno por competencia MAT)
--  ~33 Campos Temáticos (distribuidos entre C1, C2, C3, C4)
--  ~100+ Desempeños Precisados (para 2° Secundaria, por competencia y capacidad)
-- ============================================================
