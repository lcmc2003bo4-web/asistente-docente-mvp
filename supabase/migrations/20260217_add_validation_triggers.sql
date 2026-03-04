-- Migration: Add auto-validation triggers
-- Phase 6: Motor de Validación Normativa (V1 Estático)
-- Note: Triggers use AFTER INSERT OR UPDATE to auto-validate documents on save

-- ============================================================================
-- Helper: Auto-validate programacion trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_validate_programacion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only validate if key fields changed or on insert
    IF TG_OP = 'INSERT' OR (
        TG_OP = 'UPDATE' AND (
            NEW.titulo IS DISTINCT FROM OLD.titulo OR
            NEW.area_id IS DISTINCT FROM OLD.area_id OR
            NEW.grado_id IS DISTINCT FROM OLD.grado_id OR
            NEW.periodo_id IS DISTINCT FROM OLD.periodo_id
        )
    ) THEN
        -- Call validate_programacion (it updates the record internally)
        PERFORM validate_programacion(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- Helper: Auto-validate unidad trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_validate_unidad()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (
        TG_OP = 'UPDATE' AND (
            NEW.titulo IS DISTINCT FROM OLD.titulo OR
            NEW.duracion_semanas IS DISTINCT FROM OLD.duracion_semanas OR
            NEW.programacion_id IS DISTINCT FROM OLD.programacion_id
        )
    ) THEN
        PERFORM validate_unidad(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- Helper: Auto-validate sesion trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_validate_sesion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (
        TG_OP = 'UPDATE' AND (
            NEW.titulo IS DISTINCT FROM OLD.titulo OR
            NEW.duracion_minutos IS DISTINCT FROM OLD.duracion_minutos OR
            NEW.unidad_id IS DISTINCT FROM OLD.unidad_id OR
            NEW.fecha_tentativa IS DISTINCT FROM OLD.fecha_tentativa
        )
    ) THEN
        PERFORM validate_sesion(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- Triggers on programaciones
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_auto_validate_programacion ON programaciones;
CREATE TRIGGER trigger_auto_validate_programacion
    AFTER INSERT OR UPDATE ON programaciones
    FOR EACH ROW
    EXECUTE FUNCTION auto_validate_programacion();

-- ============================================================================
-- Triggers on unidades
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_auto_validate_unidad ON unidades;
CREATE TRIGGER trigger_auto_validate_unidad
    AFTER INSERT OR UPDATE ON unidades
    FOR EACH ROW
    EXECUTE FUNCTION auto_validate_unidad();

-- ============================================================================
-- Triggers on sesiones
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_auto_validate_sesion ON sesiones;
CREATE TRIGGER trigger_auto_validate_sesion
    AFTER INSERT OR UPDATE ON sesiones
    FOR EACH ROW
    EXECUTE FUNCTION auto_validate_sesion();

-- ============================================================================
-- Cascade: Re-validate programacion when a unidad changes
-- ============================================================================
CREATE OR REPLACE FUNCTION cascade_validate_programacion_on_unidad()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- When a unidad is added/updated/deleted, re-validate its parent programacion
    IF TG_OP = 'DELETE' THEN
        PERFORM validate_programacion(OLD.programacion_id);
    ELSE
        PERFORM validate_programacion(NEW.programacion_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_cascade_validate_programacion ON unidades;
CREATE TRIGGER trigger_cascade_validate_programacion
    AFTER INSERT OR UPDATE OR DELETE ON unidades
    FOR EACH ROW
    EXECUTE FUNCTION cascade_validate_programacion_on_unidad();

-- ============================================================================
-- Cascade: Re-validate unidad when detalles_unidad changes
-- ============================================================================
CREATE OR REPLACE FUNCTION cascade_validate_unidad_on_detalle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM validate_unidad(OLD.unidad_id);
    ELSE
        PERFORM validate_unidad(NEW.unidad_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_cascade_validate_unidad ON detalles_unidad;
CREATE TRIGGER trigger_cascade_validate_unidad
    AFTER INSERT OR UPDATE OR DELETE ON detalles_unidad
    FOR EACH ROW
    EXECUTE FUNCTION cascade_validate_unidad_on_detalle();

-- ============================================================================
-- Cascade: Re-validate sesion when detalles_sesion changes
-- ============================================================================
CREATE OR REPLACE FUNCTION cascade_validate_sesion_on_detalle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM validate_sesion(OLD.sesion_id);
    ELSE
        PERFORM validate_sesion(NEW.sesion_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_cascade_validate_sesion_detalle ON detalles_sesion;
CREATE TRIGGER trigger_cascade_validate_sesion_detalle
    AFTER INSERT OR UPDATE OR DELETE ON detalles_sesion
    FOR EACH ROW
    EXECUTE FUNCTION cascade_validate_sesion_on_detalle();

-- ============================================================================
-- Cascade: Re-validate sesion when secuencias_sesion changes
-- ============================================================================
CREATE OR REPLACE FUNCTION cascade_validate_sesion_on_secuencia()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM validate_sesion(OLD.sesion_id);
    ELSE
        PERFORM validate_sesion(NEW.sesion_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_cascade_validate_sesion_secuencia ON secuencias_sesion;
CREATE TRIGGER trigger_cascade_validate_sesion_secuencia
    AFTER INSERT OR UPDATE OR DELETE ON secuencias_sesion
    FOR EACH ROW
    EXECUTE FUNCTION cascade_validate_sesion_on_secuencia();
