-- Migration to add 'curso_nombre' to programaciones
ALTER TABLE programaciones ADD COLUMN IF NOT EXISTS curso_nombre TEXT;

-- Migration to add 'institucion' and 'logo_url' to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS institucion TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS logo_url TEXT;
