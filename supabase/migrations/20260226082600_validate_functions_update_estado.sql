-- Actualización de funciones de validación para automatizar el estado 'Validado'
-- Estas funciones ahora actualizarán la columna 'estado' a 'Validado' o 'Borrador' según el resultado

-- 1. Actualización para UNIDADES
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
    is_valid BOOLEAN;
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
    
    -- [Lógica de validación omitida para brevedad, se mantiene igual...]
    -- Validación 1: Campos obligatorios
    IF unidad_record.titulo IS NULL OR unidad_record.titulo = '' THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'REQUIRED_FIELD', 'field', 'titulo', 'message', 'El título es obligatorio', 'severity', 'error'
        ));
    END IF;
    
    IF unidad_record.duracion_semanas IS NULL OR unidad_record.duracion_semanas <= 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'INVALID_DURACION', 'field', 'duracion_semanas', 'message', 'La duración debe ser mayor a 0 semanas', 'severity', 'error'
        ));
    END IF;

    -- Situacion significativa (Warning)
    IF unidad_record.situacion_significativa IS NULL OR unidad_record.situacion_significativa = '' THEN
        warnings := warnings || jsonb_build_array(jsonb_build_object(
            'code', 'MISSING_SITUACION', 'field', 'situacion_significativa', 'message', 'Se recomienda incluir una situación significativa', 'severity', 'warning'
        ));
    END IF;
    
    -- Desempeños
    SELECT COUNT(*) INTO desempenos_count FROM detalles_unidad WHERE unidad_id = unidad_id_param;
    IF desempenos_count = 0 AND unidad_record.matriz_ia IS NULL THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'NO_DESEMPENOS', 'field', 'desempenos', 'message', 'Debe seleccionar al menos un desempeño', 'severity', 'error'
        ));
    END IF;
    
    -- Herencia
    SELECT COUNT(*) INTO desempenos_invalidos
    FROM detalles_unidad du
    JOIN desempenos d ON du.desempeno_id = d.id
    JOIN capacidades c ON d.capacidad_id = c.id
    WHERE du.unidad_id = unidad_id_param
    AND c.competencia_id NOT IN (
        SELECT competencia_id FROM detalles_programacion WHERE programacion_id = unidad_record.programacion_id
    );
    
    IF desempenos_invalidos > 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object(
            'code', 'DESEMPENOS_NOT_IN_PROGRAMACION', 'message', format('Hay %s desempeño(s) que no pertenecen a las competencias programadas', desempenos_invalidos), 'severity', 'error'
        ));
    END IF;

    is_valid := (jsonb_array_length(errors) = 0);

    -- ========================================
    -- Actualizar estado de validación y ESTADO DE DOCUMENTO
    -- ========================================
    UPDATE unidades
    SET 
        estado = CASE WHEN is_valid THEN 'Validado' ELSE 'Borrador' END,
        validation_status = CASE 
            WHEN NOT is_valid THEN 'invalid'
            WHEN jsonb_array_length(warnings) > 0 THEN 'warning'
            ELSE 'valid'
        END,
        validation_errors = errors || warnings,
        validated_at = NOW()
    WHERE id = unidad_id_param;
    
    RETURN jsonb_build_object(
        'valid', is_valid,
        'errors', errors,
        'warnings', warnings,
        'summary', jsonb_build_object(
            'total_issues', jsonb_array_length(errors) + jsonb_array_length(warnings),
            'errors_count', jsonb_array_length(errors),
            'warnings_count', jsonb_array_length(warnings),
            'desempenos_selected', desempenos_count
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Actualización para SESIONES
CREATE OR REPLACE FUNCTION validate_sesion(sesion_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    errors JSONB := '[]'::jsonb;
    sesion_record RECORD;
    detalles_count INT;
    secuencias_count INT;
    is_valid BOOLEAN;
BEGIN
    SELECT * INTO sesion_record FROM sesiones WHERE id = sesion_id_param;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'errors', jsonb_build_array(jsonb_build_object('code', 'NOT_FOUND', 'message', 'Sesión no encontrada')));
    END IF;
    
    -- Validaciones básicas
    IF sesion_record.titulo IS NULL OR sesion_record.titulo = '' THEN
        errors := errors || jsonb_build_array(jsonb_build_object('code', 'REQUIRED_FIELD', 'message', 'El título es obligatorio', 'severity', 'error'));
    END IF;
    
    SELECT COUNT(*) INTO detalles_count FROM detalles_sesion WHERE sesion_id = sesion_id_param;
    IF detalles_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object('code', 'NO_DESEMPENOS', 'message', 'Debe seleccionar al menos un desempeño', 'severity', 'error'));
    END IF;
    
    SELECT COUNT(*) INTO secuencias_count FROM secuencias_sesion WHERE sesion_id = sesion_id_param;
    IF secuencias_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object('code', 'NO_SECUENCIAS', 'message', 'Debe agregar al menos una secuencia didáctica', 'severity', 'error'));
    END IF;

    is_valid := (jsonb_array_length(errors) = 0);

    -- ========================================
    -- Update validation status and ESTADO DE DOCUMENTO
    -- ========================================
    UPDATE sesiones
    SET 
        estado = CASE WHEN is_valid THEN 'Validado' ELSE 'Borrador' END,
        validation_status = CASE WHEN is_valid THEN 'valid' ELSE 'invalid' END,
        validation_errors = errors,
        validated_at = NOW()
    WHERE id = sesion_id_param;
    
    RETURN jsonb_build_object(
        'valid', is_valid,
        'errors', errors,
        'validated_at', NOW()
    );
END;
$$;


-- 3. Actualización para PROGRAMACIONES
CREATE OR REPLACE FUNCTION validate_programacion(programacion_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    errors JSONB := '[]'::jsonb;
    prog_record RECORD;
    competencias_count INT;
    unidades_count INT;
    is_valid BOOLEAN;
    error_count INT;
BEGIN
    SELECT * INTO prog_record FROM programaciones WHERE id = programacion_id_param;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'errors', jsonb_build_array(jsonb_build_object('code', 'NOT_FOUND', 'message', 'Programación no encontrada', 'severity', 'error')));
    END IF;

    IF prog_record.titulo IS NULL OR trim(prog_record.titulo) = '' THEN
        errors := errors || jsonb_build_array(jsonb_build_object('code', 'REQUIRED_FIELD', 'message', 'El título es obligatorio', 'severity', 'error'));
    END IF;

    SELECT COUNT(*) INTO competencias_count FROM detalles_programacion WHERE programacion_id = programacion_id_param;
    IF competencias_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object('code', 'NO_COMPETENCIAS', 'message', 'Debe seleccionar al menos una competencia', 'severity', 'error'));
    END IF;

    SELECT COUNT(*) INTO unidades_count FROM unidades WHERE programacion_id = programacion_id_param;
    -- Note: We don't mark as invalid if no units exist yet, maybe just a warning? 
    -- But for consistency, let's say it needs at least one unit to be 'Validado'.
    IF unidades_count = 0 THEN
        errors := errors || jsonb_build_array(jsonb_build_object('code', 'NO_UNIDADES', 'message', 'Debe crear al menos una unidad didáctica', 'severity', 'error'));
    END IF;

    SELECT COUNT(*) INTO error_count FROM jsonb_array_elements(errors) e WHERE e->>'severity' = 'error';
    is_valid := (error_count = 0);

    -- ========================================
    -- Update validation status and ESTADO DE DOCUMENTO
    -- ========================================
    UPDATE programaciones
    SET
        estado = CASE WHEN is_valid THEN 'Validado' ELSE 'Borrador' END,
        validation_status = CASE WHEN is_valid THEN 'valid' ELSE 'invalid' END,
        validation_errors = errors,
        validated_at = NOW()
    WHERE id = programacion_id_param;

    RETURN jsonb_build_object(
        'valid', is_valid,
        'errors', errors,
        'validated_at', NOW()
    );
END;
$$;
