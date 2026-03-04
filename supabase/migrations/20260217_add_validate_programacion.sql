-- Migration: Add validate_programacion function
-- Phase 6: Motor de Validación Normativa (V1 Estático)

-- ============================================================================
-- Validation function for programaciones
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_programacion(programacion_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    errors JSONB := '[]'::jsonb;
    prog_record RECORD;
    unidades_count INT;
    competencias_count INT;
    duracion_total INT;
    periodo_semanas INT;
    competencias_sin_usar INT;
BEGIN
    -- Fetch programacion
    SELECT p.*, a.nombre AS area_nombre
    INTO prog_record
    FROM programaciones p
    LEFT JOIN areas a ON a.id = p.area_id
    WHERE p.id = programacion_id_param;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'errors', jsonb_build_array(
            jsonb_build_object('code', 'NOT_FOUND', 'message', 'Programación no encontrada', 'severity', 'error')
        ));
    END IF;

    -- ========================================================================
    -- Validation 1: Required fields
    -- ========================================================================
    IF prog_record.titulo IS NULL OR trim(prog_record.titulo) = '' THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD',
            'field', 'titulo',
            'message', 'El título de la programación es obligatorio',
            'severity', 'error'
        ));
    END IF;

    IF prog_record.area_id IS NULL THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD',
            'field', 'area_id',
            'message', 'Debe seleccionar un área curricular',
            'severity', 'error'
        ));
    END IF;

    IF prog_record.grado_id IS NULL THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD',
            'field', 'grado_id',
            'message', 'Debe seleccionar un grado',
            'severity', 'error'
        ));
    END IF;

    IF prog_record.periodo_id IS NULL THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD',
            'field', 'periodo_id',
            'message', 'Debe seleccionar un periodo académico',
            'severity', 'error'
        ));
    END IF;

    -- ========================================================================
    -- Validation 2: Must have at least one competencia
    -- ========================================================================
    SELECT COUNT(*) INTO competencias_count
    FROM detalles_programacion
    WHERE programacion_id = programacion_id_param;

    IF competencias_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'NO_COMPETENCIAS',
            'field', 'competencias',
            'message', 'Debe seleccionar al menos una competencia del área',
            'severity', 'error',
            'reference', 'CNEB - Competencias por área'
        ));
    END IF;

    -- ========================================================================
    -- Validation 3: Competencias must belong to the selected area
    -- ========================================================================
    IF prog_record.area_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM detalles_programacion dp
        JOIN competencias c ON c.id = dp.competencia_id
        WHERE dp.programacion_id = programacion_id_param
        AND c.area_id != prog_record.area_id
    ) THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'COMPETENCIA_INVALID_AREA',
            'field', 'competencias',
            'message', 'Todas las competencias deben pertenecer al área curricular seleccionada',
            'severity', 'error',
            'reference', 'Coherencia curricular CNEB'
        ));
    END IF;

    -- ========================================================================
    -- Validation 4: Must have at least one unidad
    -- ========================================================================
    SELECT COUNT(*) INTO unidades_count
    FROM unidades
    WHERE programacion_id = programacion_id_param;

    IF unidades_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'NO_UNIDADES',
            'field', 'unidades',
            'message', 'Debe crear al menos una unidad didáctica',
            'severity', 'error'
        ));
    END IF;

    -- ========================================================================
    -- Validation 5 (Warning): Recommended minimum 4 unidades (MINEDU)
    -- ========================================================================
    IF unidades_count > 0 AND unidades_count < 4 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'FEW_UNIDADES',
            'field', 'unidades',
            'message', format('Se recomienda al menos 4 unidades didácticas. Actualmente tiene %s.', unidades_count),
            'severity', 'warning',
            'reference', 'Orientaciones MINEDU para programación curricular'
        ));
    END IF;

    -- ========================================================================
    -- Validation 6 (Warning): Total duration vs periodo
    -- ========================================================================
    SELECT COALESCE(SUM(duracion_semanas), 0) INTO duracion_total
    FROM unidades
    WHERE programacion_id = programacion_id_param;

    -- Get periodo duration if available
    SELECT COALESCE(duracion_semanas, 40) INTO periodo_semanas
    FROM periodos_academicos
    WHERE id = prog_record.periodo_id;

    IF duracion_total > 0 AND ABS(duracion_total - periodo_semanas) > 4 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'DURACION_MISMATCH',
            'field', 'unidades',
            'message', format('La duración total de unidades (%s semanas) difiere significativamente del periodo (%s semanas)',
                duracion_total, periodo_semanas),
            'severity', 'warning',
            'reference', 'Planificación curricular anual'
        ));
    END IF;

    -- ========================================================================
    -- Validation 7 (Warning): Competencias sin usar en ninguna unidad
    -- ========================================================================
    SELECT COUNT(*) INTO competencias_sin_usar
    FROM detalles_programacion dp
    WHERE dp.programacion_id = programacion_id_param
    AND NOT EXISTS (
        SELECT 1 FROM detalles_unidad du
        JOIN unidades u ON u.id = du.unidad_id
        JOIN desempenos d ON d.id = du.desempeno_id
        WHERE u.programacion_id = programacion_id_param
        AND d.competencia_id = dp.competencia_id
    );

    IF competencias_sin_usar > 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'COMPETENCIAS_SIN_USAR',
            'field', 'competencias',
            'message', format('Hay %s competencia(s) seleccionada(s) que no aparecen en ninguna unidad didáctica',
                competencias_sin_usar),
            'severity', 'warning',
            'reference', 'Coherencia entre programación y unidades'
        ));
    END IF;

    -- ========================================================================
    -- Determine overall validity (only errors, not warnings, affect validity)
    -- ========================================================================
    DECLARE
        error_count INT;
        only_errors JSONB;
    BEGIN
        SELECT jsonb_agg(e) INTO only_errors
        FROM jsonb_array_elements(errors) e
        WHERE e->>'severity' = 'error';

        error_count := COALESCE(jsonb_array_length(only_errors), 0);

        -- ========================================================================
        -- Update validation status in programaciones table
        -- ========================================================================
        UPDATE programaciones
        SET
            validation_status = CASE WHEN error_count = 0 THEN 'valid' ELSE 'invalid' END,
            validation_errors = errors,
            validated_at = NOW()
        WHERE id = programacion_id_param;

        -- ========================================================================
        -- Return result
        -- ========================================================================
        RETURN jsonb_build_object(
            'valid', error_count = 0,
            'errors', COALESCE(only_errors, '[]'::jsonb),
            'warnings', COALESCE(
                (SELECT jsonb_agg(e) FROM jsonb_array_elements(errors) e WHERE e->>'severity' = 'warning'),
                '[]'::jsonb
            ),
            'summary', jsonb_build_object(
                'total_unidades', unidades_count,
                'duracion_total', duracion_total,
                'duracion_esperada', periodo_semanas,
                'total_competencias', competencias_count,
                'competencias_sin_usar', competencias_sin_usar
            ),
            'validated_at', NOW()
        );
    END;
END;
$$;

-- ============================================================================
-- Grant execute permission to authenticated users
-- ============================================================================
GRANT EXECUTE ON FUNCTION validate_programacion(UUID) TO authenticated;
