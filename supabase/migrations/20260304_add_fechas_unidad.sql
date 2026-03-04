-- Migration: add_fechas_unidad
-- Adds fecha_inicio and fecha_fin columns to the unidades table

ALTER TABLE unidades ADD COLUMN IF NOT EXISTS fecha_inicio DATE;
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS fecha_fin DATE;
