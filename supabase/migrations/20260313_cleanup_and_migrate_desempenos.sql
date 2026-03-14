-- Migration: Cleanup and migrate desempenos_precisados back to desempenos
-- Date: 2026-03-13

-- 1. Create a temporary table to hold the new IDs
CREATE TEMP TABLE temp_new_desempenos (id UUID);

-- 2. Insert the records from desempenos_precisados into desempenos as new records
WITH new_rows AS (
    INSERT INTO desempenos (capacidad_id, grado_id, codigo, descripcion)
    SELECT d.capacidad_id, d.grado_id, d.codigo, dp.descripcion 
    FROM desempenos_precisados dp 
    JOIN desempenos d ON dp.desempeno_id = d.id
    RETURNING id
)
INSERT INTO temp_new_desempenos (id)
SELECT id FROM new_rows;

-- 3. Drop the desempenos_precisados table, which removes the foreign key dependency
DROP TABLE IF EXISTS desempenos_precisados CASCADE;

-- 4. Delete all old generic desempenos (any desempeno not just inserted)
DELETE FROM desempenos WHERE id NOT IN (SELECT id FROM temp_new_desempenos);

-- 5. Drop the temporary table
DROP TABLE temp_new_desempenos;
