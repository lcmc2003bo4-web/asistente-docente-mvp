-- Migration: Add validation fields to documents
-- Phase 6: Motor de Validación Normativa (V1 Estático)

-- ============================================================================
-- Add validation fields to programaciones
-- ============================================================================
ALTER TABLE programaciones
ADD COLUMN validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid')),
ADD COLUMN validation_errors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN validated_at TIMESTAMPTZ;

-- ============================================================================
-- Add validation fields to unidades
-- ============================================================================
ALTER TABLE unidades
ADD COLUMN validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid')),
ADD COLUMN validation_errors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN validated_at TIMESTAMPTZ;

-- ============================================================================
-- Add validation fields to sesiones
-- ============================================================================
ALTER TABLE sesiones
ADD COLUMN validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid')),
ADD COLUMN validation_errors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN validated_at TIMESTAMPTZ;

-- ============================================================================
-- Create indexes for validation queries
-- ============================================================================
CREATE INDEX idx_programaciones_validation ON programaciones(validation_status);
CREATE INDEX idx_unidades_validation ON unidades(validation_status);
CREATE INDEX idx_sesiones_validation ON sesiones(validation_status);

-- ============================================================================
-- Validation function for sesiones
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_sesion(sesion_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    errors JSONB := '[]'::jsonb;
    sesion_record RECORD;
    unidad_record RECORD;
    detalles_count INT;
    secuencias_count INT;
    total_tiempo INT;
    has_inicio BOOLEAN;
    has_desarrollo BOOLEAN;
    has_cierre BOOLEAN;
BEGIN
    -- Fetch sesion
    SELECT * INTO sesion_record FROM sesiones WHERE id = sesion_id_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'errors', jsonb_build_array(
            jsonb_build_object('code', 'NOT_FOUND', 'message', 'Sesión no encontrada')
        ));
    END IF;
    
    -- Fetch parent unidad
    SELECT * INTO unidad_record FROM unidades WHERE id = sesion_record.unidad_id;
    
    -- ========================================================================
    -- Validation 1: Required fields
    -- ========================================================================
    IF sesion_record.titulo IS NULL OR sesion_record.titulo = '' THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD',
            'field', 'titulo',
            'message', 'El título es obligatorio',
            'severity', 'error'
        ));
    END IF;
    
    -- ========================================================================
    -- Validation 2: Duration range
    -- ========================================================================
    IF sesion_record.duracion_minutos < 30 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'DURATION_TOO_SHORT',
            'field', 'duracion_minutos',
            'message', 'La duración mínima es 30 minutos',
            'severity', 'error',
            'reference', 'Norma técnica MINEDU'
        ));
    END IF;
    
    IF sesion_record.duracion_minutos > 180 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'DURATION_TOO_LONG',
            'field', 'duracion_minutos',
            'message', 'La duración máxima recomendada es 180 minutos (3 horas pedagógicas)',
            'severity', 'warning'
        ));
    END IF;
    
    -- ========================================================================
    -- Validation 3: Must have at least one desempeño
    -- ========================================================================
    SELECT COUNT(*) INTO detalles_count FROM detalles_sesion WHERE sesion_id = sesion_id_param;
    
    IF detalles_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'NO_DESEMPENOS',
            'field', 'desempenos',
            'message', 'Debe seleccionar al menos un desempeño',
            'severity', 'error'
        ));
    END IF;
    
    -- ========================================================================
    -- Validation 4: Desempeños must be from parent unidad
    -- ========================================================================
    IF EXISTS (
        SELECT 1 FROM detalles_sesion ds
        WHERE ds.sesion_id = sesion_id_param
        AND NOT EXISTS (
            SELECT 1 FROM detalles_unidad du
            WHERE du.unidad_id = sesion_record.unidad_id
            AND du.desempeno_id = ds.desempeno_id
        )
    ) THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'DESEMPENO_NOT_IN_UNIDAD',
            'field', 'desempenos',
            'message', 'Todos los desempeños deben estar incluidos en la unidad didáctica',
            'severity', 'error',
            'reference', 'Coherencia curricular CNEB'
        ));
    END IF;
    
    -- ========================================================================
    -- Validation 5: Must have at least one secuencia
    -- ========================================================================
    SELECT COUNT(*) INTO secuencias_count FROM secuencias_sesion WHERE sesion_id = sesion_id_param;
    
    IF secuencias_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'NO_SECUENCIAS',
            'field', 'secuencias',
            'message', 'Debe agregar al menos una secuencia didáctica',
            'severity', 'error'
        ));
    END IF;
    
    -- ========================================================================
    -- Validation 6: Secuencias must cover critical momentos
    -- ========================================================================
    SELECT 
        EXISTS(SELECT 1 FROM secuencias_sesion WHERE sesion_id = sesion_id_param AND momento = 'Inicio') INTO has_inicio;
    SELECT 
        EXISTS(SELECT 1 FROM secuencias_sesion WHERE sesion_id = sesion_id_param AND momento = 'Desarrollo') INTO has_desarrollo;
    SELECT 
        EXISTS(SELECT 1 FROM secuencias_sesion WHERE sesion_id = sesion_id_param AND momento = 'Cierre') INTO has_cierre;
    
    IF NOT has_inicio THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'MISSING_INICIO',
            'field', 'secuencias',
            'message', 'Se recomienda incluir al menos una secuencia de Inicio',
            'severity', 'warning',
            'reference', 'Estructura pedagógica recomendada'
        ));
    END IF;
    
    IF NOT has_desarrollo THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'MISSING_DESARROLLO',
            'field', 'secuencias',
            'message', 'Debe incluir al menos una secuencia de Desarrollo',
            'severity', 'error'
        ));
    END IF;
    
    IF NOT has_cierre THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'MISSING_CIERRE',
            'field', 'secuencias',
            'message', 'Se recomienda incluir al menos una secuencia de Cierre',
            'severity', 'warning',
            'reference', 'Estructura pedagógica recomendada'
        ));
    END IF;
    
    -- ========================================================================
    -- Validation 7: Time coherence
    -- ========================================================================
    SELECT COALESCE(SUM(tiempo_minutos), 0) INTO total_tiempo 
    FROM secuencias_sesion 
    WHERE sesion_id = sesion_id_param;
    
    IF total_tiempo > sesion_record.duracion_minutos + 10 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'TIME_EXCEEDED',
            'field', 'secuencias',
            'message', format('El tiempo total de secuencias (%s min) excede la duración planificada (%s min)', 
                total_tiempo, sesion_record.duracion_minutos),
            'severity', 'warning'
        ));
    END IF;
    
    -- ========================================================================
    -- Update validation status in sesiones table
    -- ========================================================================
    UPDATE sesiones
    SET 
        validation_status = CASE WHEN jsonb_array_length(errors) = 0 THEN 'valid' ELSE 'invalid' END,
        validation_errors = errors,
        validated_at = NOW()
    WHERE id = sesion_id_param;
    
    -- ========================================================================
    -- Return result
    -- ========================================================================
    RETURN jsonb_build_object(
        'valid', jsonb_array_length(errors) = 0,
        'errors', errors,
        'validated_at', NOW()
    );
END;
$$;

-- ============================================================================
-- Grant execute permission to authenticated users
-- ============================================================================
GRANT EXECUTE ON FUNCTION validate_sesion(UUID) TO authenticated;
