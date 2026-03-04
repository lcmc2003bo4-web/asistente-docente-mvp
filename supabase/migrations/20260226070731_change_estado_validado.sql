-- Actualización del estado 'Finalizado' a 'Validado'
-- Para las tablas programaciones, unidades y sesiones
-- Drop old constraints
DO $$
BEGIN
    ALTER TABLE IF EXISTS programaciones DROP CONSTRAINT IF EXISTS programaciones_estado_check;
    ALTER TABLE IF EXISTS unidades DROP CONSTRAINT IF EXISTS unidades_estado_check;
    ALTER TABLE IF EXISTS sesiones DROP CONSTRAINT IF EXISTS sesiones_estado_check;
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- Update rows
UPDATE programaciones SET estado = 'Validado' WHERE estado = 'Finalizado';
UPDATE unidades SET estado = 'Validado' WHERE estado = 'Finalizado';
UPDATE sesiones SET estado = 'Validado' WHERE estado = 'Finalizado';

-- Add new constraints
ALTER TABLE IF EXISTS programaciones ADD CONSTRAINT programaciones_estado_check CHECK (estado IN ('Borrador', 'Validado'));
ALTER TABLE IF EXISTS unidades ADD CONSTRAINT unidades_estado_check CHECK (estado IN ('Borrador', 'Validado'));
ALTER TABLE IF EXISTS sesiones ADD CONSTRAINT sesiones_estado_check CHECK (estado IN ('Borrador', 'Validado'));
