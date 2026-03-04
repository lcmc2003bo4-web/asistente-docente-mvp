-- Añadir columna para almacenar el JSON crudo generado por la IA para tener registro y poder re-renderizar las 3 tablas idénticas requeridas
ALTER TABLE sesiones
ADD COLUMN contenido_ia JSONB;
