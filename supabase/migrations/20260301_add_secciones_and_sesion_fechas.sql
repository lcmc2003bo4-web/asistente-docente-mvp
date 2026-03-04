-- =============================================================
-- Migration: Add secciones to programaciones + sesion_fechas_seccion
-- Date: 20260301
-- =============================================================

-- 1. Add secciones[] to programaciones
--    NULL means the teacher has a single un-named section (existing behaviour).
ALTER TABLE programaciones
  ADD COLUMN IF NOT EXISTS secciones TEXT[] DEFAULT NULL;

COMMENT ON COLUMN programaciones.secciones IS
  'Array de secciones del aula, ej. {A,B,C}. NULL si el docente no usa secciones.';

-- 2. Create the pivot table for per-section session dates
CREATE TABLE IF NOT EXISTS sesion_fechas_seccion (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id   UUID        NOT NULL REFERENCES sesiones(id)      ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id)    ON DELETE CASCADE,
  seccion     TEXT        NOT NULL,   -- e.g. 'A', 'B', 'C'
  fecha       DATE        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sesion_id, seccion)
);

COMMENT ON TABLE sesion_fechas_seccion IS
  'Fechas de dictado de una sesión por sección. Una sesión puede dictarse en fechas '
  'distintas para cada sección del mismo grado.';

-- 3. Row Level Security
ALTER TABLE sesion_fechas_seccion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sesion_fechas_seccion"
  ON sesion_fechas_seccion
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Index for fast lookups by session
CREATE INDEX IF NOT EXISTS idx_sesion_fechas_seccion_sesion_id
  ON sesion_fechas_seccion (sesion_id);

CREATE INDEX IF NOT EXISTS idx_sesion_fechas_seccion_user_fecha
  ON sesion_fechas_seccion (user_id, fecha);

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_sesion_fechas_seccion_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sesion_fechas_seccion_updated_at ON sesion_fechas_seccion;
CREATE TRIGGER trg_sesion_fechas_seccion_updated_at
  BEFORE UPDATE ON sesion_fechas_seccion
  FOR EACH ROW EXECUTE FUNCTION update_sesion_fechas_seccion_updated_at();
