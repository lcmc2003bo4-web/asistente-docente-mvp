-- Migration: Add validate_unidad function
-- Created: 2026-02-17
-- Purpose: Implement validation logic for Unidad Didáctica with competencia inheritance check

CREATE OR REPLACE FUNCTION validate_unidad(unidad_id_param UUID)
RETURNS JSONB AS $$
DECLARE
    unidad_record RECORD;
    errors JSONB := '[]'::JSONB;
    warnings JSONB := '[]'::JSONB;
    desempenos_count INT;
    desempenos_invalidos INT;
    duracion_total_unidades INT;
    duracion_programacion INT;
BEGIN
    -- Obtener unidad con datos de programación
    SELECT 
        u.*,
        p.periodo_tipo,
        p.titulo as prog_titulo,
        p.id as prog_id
    INTO unidad_record
    FROM unidades u
    JOIN programaciones p ON u.programacion_id = p.id
    WHERE u.id = unidad_id_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'errors', jsonb_build_array(jsonb_build_object(
                'code', 'NOT_FOUND',
                'message', 'Unidad no encontrada',
                'severity', 'error'
            ))
        );
    END IF;
    
    -- ========================================
    -- Validación 1: Campos obligatorios
    -- ========================================
    IF unidad_record.titulo IS NULL OR unidad_record.titulo = '' THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD',
            'field', 'titulo',
            'message', 'El título es obligatorio',
            'severity', 'error'
        ));
    END IF;
    
    IF unidad_record.situacion_significativa IS NULL OR unidad_record.situacion_significativa = '' THEN
        warnings := warnings || jsonb_build_array(jsonb_build_object(
            'code', 'MISSING_SITUACION',
            'field', 'situacion_significativa',
            'message', 'Se recomienda incluir una situación significativa',
            'severity', 'warning',
            'reference', 'CNEB requiere contextualización del aprendizaje'
        ));
    END IF;
    
    IF unidad_record.duracion_semanas IS NULL OR unidad_record.duracion_semanas <= 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'INVALID_DURACION',
            'field', 'duracion_semanas',
            'message', 'La duración debe ser mayor a 0 semanas',
            'severity', 'error'
        ));
    END IF;
    
    -- ========================================
    -- Validación 2: Desempeños seleccionados
    -- ========================================
    SELECT COUNT(*) INTO desempenos_count
    FROM detalles_unidad
    WHERE unidad_id = unidad_id_param;
    
    IF desempenos_count = 0 AND unidad_record.matriz_ia IS NULL THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'NO_DESEMPENOS',
            'field', 'desempenos',
            'message', 'Debe seleccionar al menos un desempeño',
            'severity', 'error',
            'reference', 'Los desempeños definen los propósitos de aprendizaje'
        ));
    END IF;
    
    -- ========================================
    -- Validación 3: HERENCIA DE COMPETENCIAS (CRÍTICO)
    -- Los desempeños deben pertenecer a competencias de la programación
    -- ========================================
    SELECT COUNT(*) INTO desempenos_invalidos
    FROM detalles_unidad du
    JOIN desempenos d ON du.desempeno_id = d.id
    JOIN capacidades c ON d.capacidad_id = c.id
    WHERE du.unidad_id = unidad_id_param
    AND c.competencia_id NOT IN (
        SELECT competencia_id 
        FROM detalles_programacion 
        WHERE programacion_id = unidad_record.programacion_id
    );
    
    IF desempenos_invalidos > 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'DESEMPENOS_NOT_IN_PROGRAMACION',
            'field', 'desempenos',
            'message', format('Hay %s desempeño(s) que no pertenecen a las competencias programadas', desempenos_invalidos),
            'severity', 'error',
            'reference', 'Coherencia curricular: Unidad debe heredar competencias de la Programación',
            'details', jsonb_build_object('invalid_count', desempenos_invalidos)
        ));
    END IF;
    
    -- ========================================
    -- Validación 4: Duración total de unidades
    -- ========================================
    SELECT COALESCE(SUM(duracion_semanas), 0) INTO duracion_total_unidades
    FROM unidades
    WHERE programacion_id = unidad_record.programacion_id;
    
    -- Calcular duración esperada según tipo de periodo
    -- Año escolar peruano: ~36 semanas efectivas
    duracion_programacion := CASE 
        WHEN unidad_record.periodo_tipo = 'bimestral' THEN 36  -- 4 bimestres
        WHEN unidad_record.periodo_tipo = 'trimestral' THEN 36 -- 3 trimestres
        ELSE 36
    END;
    
    IF duracion_total_unidades > duracion_programacion THEN
        warnings := warnings || jsonb_build_array(jsonb_build_object(
            'code', 'DURACION_EXCEDIDA',
            'field', 'duracion_semanas',
            'message', format('La duración total de unidades (%s semanas) excede el año escolar (~%s semanas)', 
                duracion_total_unidades, duracion_programacion),
            'severity', 'warning',
            'details', jsonb_build_object(
                'total_unidades', duracion_total_unidades,
                'esperado', duracion_programacion,
                'exceso', duracion_total_unidades - duracion_programacion
            )
        ));
    END IF;
    
    -- ========================================
    -- Actualizar estado de validación en la tabla
    -- ========================================
    UPDATE unidades
    SET 
        validation_status = CASE 
            WHEN jsonb_array_length(errors) > 0 THEN 'invalid'
            WHEN jsonb_array_length(warnings) > 0 THEN 'warning'
            ELSE 'valid'
        END,
        validation_errors = errors || warnings,
        validated_at = NOW()
    WHERE id = unidad_id_param;
    
    -- ========================================
    -- Retornar resultado de validación
    -- ========================================
    RETURN jsonb_build_object(
        'valid', jsonb_array_length(errors) = 0,
        'errors', errors,
        'warnings', warnings,
        'summary', jsonb_build_object(
            'total_issues', jsonb_array_length(errors) + jsonb_array_length(warnings),
            'errors_count', jsonb_array_length(errors),
            'warnings_count', jsonb_array_length(warnings),
            'desempenos_selected', desempenos_count,
            'desempenos_invalidos', desempenos_invalidos,
            'duracion_total', duracion_total_unidades,
            'duracion_esperada', duracion_programacion
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario de la función
COMMENT ON FUNCTION validate_unidad(UUID) IS 
'Valida una Unidad Didáctica verificando:
1. Campos obligatorios (título, duración)
2. Presencia de desempeños
3. HERENCIA DE COMPETENCIAS: desempeños deben pertenecer a competencias programadas
4. Duración total no excede año escolar';
