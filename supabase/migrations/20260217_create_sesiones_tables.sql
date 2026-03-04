-- Migration: Create sesiones, secuencias_sesion, and detalles_sesion tables
-- Phase 5: Módulo Sesión de Aprendizaje

-- ============================================================================
-- Table: sesiones
-- ============================================================================
CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unidad_id UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
    orden INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    fecha_tentativa DATE,
    duracion_minutos INTEGER NOT NULL DEFAULT 90,
    proposito_aprendizaje TEXT,
    evidencias_aprendizaje TEXT,
    criterios_evaluacion TEXT,
    estado TEXT NOT NULL DEFAULT 'Borrador' CHECK (estado IN ('Borrador', 'Finalizado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sesiones_unidad ON sesiones(unidad_id);
CREATE INDEX idx_sesiones_user ON sesiones(user_id);

-- RLS Policies
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sesiones"
    ON sesiones FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own sesiones"
    ON sesiones FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sesiones"
    ON sesiones FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own sesiones"
    ON sesiones FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- Table: secuencias_sesion
-- ============================================================================
CREATE TABLE secuencias_sesion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id UUID NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    orden INTEGER NOT NULL,
    momento TEXT NOT NULL CHECK (momento IN ('Inicio', 'Desarrollo', 'Cierre')),
    actividad TEXT NOT NULL,
    tiempo_minutos INTEGER NOT NULL,
    recursos TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_secuencias_sesion ON secuencias_sesion(sesion_id);

-- RLS Policies
ALTER TABLE secuencias_sesion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view secuencias of their sesiones"
    ON secuencias_sesion FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = secuencias_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert secuencias to their sesiones"
    ON secuencias_sesion FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = secuencias_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update secuencias of their sesiones"
    ON secuencias_sesion FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = secuencias_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete secuencias of their sesiones"
    ON secuencias_sesion FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = secuencias_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );

-- ============================================================================
-- Table: detalles_sesion (links sesiones to desempeños)
-- ============================================================================
CREATE TABLE detalles_sesion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id UUID NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    desempeno_id UUID NOT NULL REFERENCES desempenos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(sesion_id, desempeno_id)
);

-- Index for performance
CREATE INDEX idx_detalles_sesion_sesion ON detalles_sesion(sesion_id);

-- RLS Policies
ALTER TABLE detalles_sesion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view detalles of their sesiones"
    ON detalles_sesion FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = detalles_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert detalles to their sesiones"
    ON detalles_sesion FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = detalles_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete detalles of their sesiones"
    ON detalles_sesion FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM sesiones
            WHERE sesiones.id = detalles_sesion.sesion_id
            AND sesiones.user_id = auth.uid()
        )
    );
