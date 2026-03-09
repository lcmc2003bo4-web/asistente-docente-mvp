-- ============================================================
-- Migración: Sistema de Contextualización Institucional
-- Fecha: 2026-03-09
-- Descripción: Extiende la tabla instituciones con campos de
--   contexto sociocultural para mejorar la generación de
--   Unidades de Aprendizaje contextualizadas.
-- ============================================================

-- -------------------------------------------------------
-- 1. Extender tabla instituciones con columnas de contexto
-- -------------------------------------------------------
ALTER TABLE instituciones
  ADD COLUMN IF NOT EXISTS tipo_gestion TEXT 
    CHECK (tipo_gestion IN ('Pública', 'Privada', 'Parroquial', 'Fe y Alegría', 'Otro')) 
    DEFAULT 'Pública',
  ADD COLUMN IF NOT EXISTS zona TEXT 
    CHECK (zona IN ('Urbana', 'Rural', 'Urbano-marginal')) 
    DEFAULT 'Urbana',
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS distrito TEXT,
  ADD COLUMN IF NOT EXISTS mision TEXT,
  ADD COLUMN IF NOT EXISTS vision TEXT,
  ADD COLUMN IF NOT EXISTS valores TEXT[],
  ADD COLUMN IF NOT EXISTS enfoque_religioso TEXT,
  ADD COLUMN IF NOT EXISTS contexto_socioeconomico TEXT 
    CHECK (contexto_socioeconomico IN ('Bajo', 'Medio-bajo', 'Medio', 'Medio-alto', 'Alto')) 
    DEFAULT 'Medio-bajo',
  ADD COLUMN IF NOT EXISTS actividades_economicas TEXT[],
  ADD COLUMN IF NOT EXISTS identidad_cultural TEXT,
  ADD COLUMN IF NOT EXISTS problematicas_locales TEXT[],
  ADD COLUMN IF NOT EXISTS festividades_regionales TEXT[],
  ADD COLUMN IF NOT EXISTS proyectos_comunitarios TEXT[],
  ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT FALSE;

-- -------------------------------------------------------
-- 2. Crear tabla contexto_aula
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS contexto_aula (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  institucion_id            UUID REFERENCES instituciones(id) ON DELETE CASCADE NOT NULL,
  anio_escolar              INTEGER NOT NULL,
  grado_id                  UUID REFERENCES grados(id),
  seccion                   TEXT,
  num_estudiantes           INTEGER,
  intereses_comunes         TEXT[],
  retos_educativos          TEXT[],
  nivel_socioeconomico      TEXT CHECK (nivel_socioeconomico IN ('Bajo', 'Medio-bajo', 'Medio', 'Medio-alto', 'Alto')),
  caracteristicas_adicionales TEXT,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, institucion_id, anio_escolar, grado_id, seccion)
);

-- -------------------------------------------------------
-- 3. Añadir FK institucion_id a la tabla programaciones
--    (nullable para no romper registros existentes)
-- -------------------------------------------------------
ALTER TABLE programaciones
  ADD COLUMN IF NOT EXISTS institucion_id UUID REFERENCES instituciones(id) ON DELETE SET NULL;

-- -------------------------------------------------------
-- 4. Añadir flag tiene_contexto_institucional en unidades
--    (para monitoreo de calidad de contenido generado)
-- -------------------------------------------------------
ALTER TABLE unidades
  ADD COLUMN IF NOT EXISTS tiene_contexto_institucional BOOLEAN DEFAULT FALSE;

-- -------------------------------------------------------
-- 5. RLS Policies para contexto_aula
-- -------------------------------------------------------
ALTER TABLE contexto_aula ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docente puede ver su propio contexto de aula"
  ON contexto_aula FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Docente puede insertar su propio contexto de aula"
  ON contexto_aula FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Docente puede actualizar su propio contexto de aula"
  ON contexto_aula FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Docente puede eliminar su propio contexto de aula"
  ON contexto_aula FOR DELETE
  USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- 6. Trigger updated_at para contexto_aula
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_contexto_aula_updated_at ON contexto_aula;
CREATE TRIGGER set_contexto_aula_updated_at
  BEFORE UPDATE ON contexto_aula
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
