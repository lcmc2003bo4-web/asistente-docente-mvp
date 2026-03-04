-- =========================================================
-- Migration: Profile Enhancements + Instituciones table
-- =========================================================

-- 1. Add new columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar_url   TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS preferencias JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN users.avatar_url IS 'Profile photo uploaded to Supabase Storage';
COMMENT ON COLUMN users.preferencias IS '{"duracion_sesion": 90, "nivel": "Secundaria", "periodo_tipo": "Bimestral", "anio_escolar": 2026}';

-- 2. Create instituciones table
CREATE TABLE IF NOT EXISTS instituciones (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre           TEXT        NOT NULL,
  codigo_modular   TEXT        DEFAULT NULL,
  direccion        TEXT        DEFAULT NULL,
  ugel             TEXT        DEFAULT NULL,
  logo_url         TEXT        DEFAULT NULL,
  es_predeterminada BOOLEAN    NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE instituciones IS 'Educational institutions where the teacher works';

-- 3. RLS
ALTER TABLE instituciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own instituciones"
  ON instituciones
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_instituciones_user_id
  ON instituciones(user_id);

-- Only one predeterminada per user (partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_instituciones_predeterminada
  ON instituciones(user_id)
  WHERE es_predeterminada = true;

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_instituciones_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_instituciones_updated_at ON instituciones;
CREATE TRIGGER trg_instituciones_updated_at
  BEFORE UPDATE ON instituciones
  FOR EACH ROW EXECUTE FUNCTION update_instituciones_updated_at();
