-- Agregando campos para soportar la validación y datos estructurados de Unidades de Aprendizaje para colegios públicos
ALTER TABLE public.unidades
ADD COLUMN IF NOT EXISTS aprendizajes_esperados jsonb NULL,
ADD COLUMN IF NOT EXISTS criterios_evaluacion jsonb NULL,
ADD COLUMN IF NOT EXISTS secuencia_sesiones_ia jsonb NULL;

COMMENT ON COLUMN public.unidades.aprendizajes_esperados IS 'Matriz jsonb con competencias, capacidades, desempeños precisados y contenidos generada por la IA';
COMMENT ON COLUMN public.unidades.criterios_evaluacion IS 'Matriz jsonb con sesiones, competencias, criterios e instrumentos de evaluación';
COMMENT ON COLUMN public.unidades.secuencia_sesiones_ia IS 'Matriz jsonb con los detalles propuestos por la IA (desempeño, temática, evidencia, etc) de las sesiones';
