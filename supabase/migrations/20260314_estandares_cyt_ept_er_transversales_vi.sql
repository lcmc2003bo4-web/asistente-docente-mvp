-- Migration: Add Estándares para Ciencia y Tecnología, EPT, ER y Competencias Transversales (Ciclo VI)
-- Date: 2026-03-14

-- ============================================================================
-- ESTÁNDARES DE APRENDIZAJE (CICLO VI)
-- ============================================================================

INSERT INTO estandares_aprendizaje (competencia_id, ciclo_id, descripcion) VALUES

-- ----------------------------------------------------------------------------
-- CIENCIA Y TECNOLOGÍA
-- ----------------------------------------------------------------------------
-- CYT-C1: Indaga mediante métodos científicos para construir conocimientos
((SELECT id FROM competencias WHERE codigo = 'CYT-C1' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Indaga a partir de preguntas e hipótesis que son verificables de forma experimental o descriptiva con base en su conocimiento científico para explicar las causas o describir el fenómeno identificado. Diseña un plan de recojo de datos con base en observaciones o experimentos. Colecta datos que contribuyan a comprobar o refutar la hipótesis. Analiza tendencias o relaciones en los datos, los interpreta tomando en cuenta el error y reproducibilidad, los interpreta con base en conocimientos científicos y formula conclusiones. Evalúa si sus conclusiones responden a la pregunta de indagación y las comunica. Evalúa la fiabilidad de los métodos y las interpretaciones de los resultados de su indagación.'),

-- CYT-C2: Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo
((SELECT id FROM competencias WHERE codigo = 'CYT-C2' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Explica, con base en evidencia con respaldo científico, las relaciones cualitativas y las cuantificables entre: el campo eléctrico con la estructura del átomo, la energía con el trabajo o el movimiento, las funciones de la célula con sus requerimientos de energía y materia, la selección natural o artificial con el origen y evolución de especies, los flujos de materia y energía en la Tierra o los fenómenos meteorológicos con el funcionamiento de la biosfera. Argumenta su posición frente a las implicancias sociales y ambientales de situaciones sociocientíficas o frente a cambios en la cosmovisión suscitados por el desarrollo de la ciencia y tecnología.'),

-- CYT-C3: Diseña y construye soluciones tecnológicas para resolver problemas de su entorno
((SELECT id FROM competencias WHERE codigo = 'CYT-C3' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Diseña y construye soluciones tecnológicas al delimitar el alcance del problema tecnológico y las causas que lo generan, y proponer alternativas de solución basado en conocimientos científicos. Representa la alternativa de solución, a través de esquemas o dibujos incluyendo sus partes o etapas. Establece características de forma, estructura, función y explica el procedimiento, los recursos para implementarlas, así como las herramientas y materiales seleccionados; verifica el funcionamiento de la solución tecnológica, considerando los requerimientos, detecta errores en la selección de materiales, imprecisiones en las dimensiones, procedimientos y realiza ajustes. Explica el procedimiento, conocimiento científico aplicado, así como las dificultades en el diseño e implementación, evalúa el alcance de su funcionamiento a través de pruebas considerando los requerimientos establecidos y propone mejoras. Infiere impactos de la solución tecnológica.'),

-- ----------------------------------------------------------------------------
-- EDUCACIÓN PARA EL TRABAJO
-- ----------------------------------------------------------------------------
-- EPT-C1: Gestiona proyectos de emprendimiento económico o social
((SELECT id FROM competencias WHERE codigo = 'EPT-C1' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Gestiona proyectos de emprendimiento económico o social cuando se cuestiona sobre una situación que afecta a un grupo de usuarios y explora sus necesidades y expectativas para crear una alternativa de solución viable y reconoce aspectos éticos y culturales, así como los posibles resultados sociales y ambientales que implica. Implementa sus ideas empleando habilidades técnicas, anticipa las acciones y recursos que necesitará y trabaja cooperativamente cumpliendo sus roles y responsabilidades individuales para el logro de una meta común, propone actividades y facilita a la iniciativa y perseverancia colectiva. Evalúa el logro de resultados parciales relacionando la cantidad de insumos empleados con los beneficios sociales y ambientales generados; realiza mejoras considerando además las opiniones de los usuarios y las lecciones aprendidas.'),

-- ----------------------------------------------------------------------------
-- EDUCACIÓN RELIGIOSA
-- ----------------------------------------------------------------------------
-- ER-C1: Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente...
((SELECT id FROM competencias WHERE codigo = 'ER-C1' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Argumenta la presencia de Dios en la creación y su manifestación en el Plan de Salvación descritos en la Biblia, como alguien cercano al ser humano, que lo busca, interpela y exige una respuesta de fe y acción concreta. Comprende el cumplimiento de la promesa de salvación y la plenitud de la revelación desde las enseñanzas del Evangelio. Propone acciones que favorecen el respeto por la vida humana y la práctica del bien común en la sociedad. Participa en las diferentes manifestaciones de fe propias de su comunidad. Argumenta la acción de Dios en la historia y en la vida de la Iglesia y de la humanidad con el fin de tener un criterio de actuar cristiano. Explica, con argumentos coherentes, su fe en relación armónica entre cultura y ciencia, y valorando las diversas manifestaciones religiosas más cercanas a su entorno. Interpreta la realidad de su entorno local y nacional a la luz del mensaje del Evangelio y la Tradición de la Iglesia.'),

-- ER-C2: Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida...
((SELECT id FROM competencias WHERE codigo = 'ER-C2' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Expresa coherencia entre lo que cree, dice y hace en su proyecto de vida personal, a la luz del mensaje bíblico. Comprende su dimensión espiritual y religiosa que le permita cooperar con la transformación de sí mismo y de su entorno a la luz del Evangelio. Adopta formas de encuentro personal con Dios, mediante la oración y la celebración de la fe, para dar sentido a su vida. Relaciona el amor de Dios con el cuidado de la dignidad de la persona humana, de la naturaleza y del mundo; y asume una actitud de solidaridad y respeto frente a las necesidades del prójimo y del bien común.'),

-- ----------------------------------------------------------------------------
-- COMPETENCIAS TRANSVERSALES
-- ----------------------------------------------------------------------------
-- TRANS-C1: Se desenvuelve en entornos virtuales generados por las TIC
((SELECT id FROM competencias WHERE nombre = 'Se desenvuelve en entornos virtuales generados por las TIC' LIMIT 1), (SELECT id FROM ciclos WHERE nivel = 'Secundaria' AND numero = 'VI' LIMIT 1), 'Se desenvuelve en los entornos virtuales cuando integra distintas actividades, actitudes y conocimientos de diversos contextos socioculturales en su entorno virtual personal. Crea materiales digitales (presentaciones, videos, documentos, diseños, entre otros) que responde a necesidades concretas de acuerdo con sus procesos cognitivos y la manifestación de su individualidad.')

ON CONFLICT DO NOTHING;
