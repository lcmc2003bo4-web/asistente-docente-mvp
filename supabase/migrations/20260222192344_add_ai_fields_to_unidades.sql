-- Migracion para agregar campos de Inteligencia Artificial al generar Unidades de Aprendizaje

ALTER TABLE public.unidades
ADD COLUMN proposito_aprendizaje text NULL,
ADD COLUMN evidencias_aprendizaje text NULL,
ADD COLUMN instrumento_evaluacion text NULL,
ADD COLUMN matriz_ia jsonb NULL;

COMMENT ON COLUMN public.unidades.proposito_aprendizaje IS 'Proposito dinamico y contextualizado generado por la IA (Verbo + Contenido + Condicion + Criterio)';
COMMENT ON COLUMN public.unidades.matriz_ia IS 'Almacena la estructura {competencias: [], capacidades: [], desempenos: []} autogenerada por la IA';
