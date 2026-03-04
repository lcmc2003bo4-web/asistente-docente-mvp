-- Migration: Create Dashboard Views for MVP
-- Description: Creates dashboard_resumen and documentos_recientes views used in /dashboard
-- Date: 2026-02-20

-- ============================================================================
-- 1. View: documentos_recientes
-- Union of all document types, ordered by update time
-- ============================================================================
DROP VIEW IF EXISTS documentos_recientes;

CREATE OR REPLACE VIEW documentos_recientes
WITH (security_invoker = true)
AS
SELECT 
    id,
    user_id,
    titulo,
    'programacion' as type,
    updated_at,
    validation_status
FROM programaciones

UNION ALL

SELECT 
    id,
    user_id,
    titulo,
    'unidad' as type,
    updated_at,
    validation_status
FROM unidades

UNION ALL

SELECT 
    id,
    user_id,
    titulo,
    'sesion' as type,
    updated_at,
    validation_status
FROM sesiones;

-- ============================================================================
-- 2. View: dashboard_resumen
-- Aggregated stats per user
-- ============================================================================
DROP VIEW IF EXISTS dashboard_resumen;

CREATE OR REPLACE VIEW dashboard_resumen
WITH (security_invoker = true)
AS
SELECT
    u.id as user_id,
    (SELECT COUNT(*) FROM programaciones p WHERE p.user_id = u.id) as total_programaciones,
    (SELECT COUNT(*) FROM unidades un WHERE un.user_id = u.id) as total_unidades,
    (SELECT COUNT(*) FROM sesiones s WHERE s.user_id = u.id) as total_sesiones,
    (SELECT COUNT(*) FROM sesiones s WHERE s.user_id = u.id AND s.validation_status = 'valid') as sesiones_validas,
    (SELECT COUNT(*) FROM sesiones s WHERE s.user_id = u.id AND s.validation_status = 'invalid') as sesiones_invalidas,
    (SELECT COUNT(*) FROM sesiones s WHERE s.user_id = u.id AND (s.validation_status = 'pending' OR s.validation_status IS NULL)) as sesiones_pendientes
FROM users u;
