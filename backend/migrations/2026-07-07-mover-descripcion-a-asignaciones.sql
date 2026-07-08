-- Migracion: mover la "Descripcion de la tarea" al modulo Asignar Servicios
-- Fecha: 2026-07-07
--
-- 1. Nueva columna descripcion en asignar_servicio (nullable: las
--    asignaciones creadas antes de este campo no la tienen).
-- 2. tareas.descripcion deja de ser NOT NULL: las tareas nuevas ya no
--    la reciben (la descripcion se toma de su asignacion).
--
-- Nota: el backend usa TypeORM con synchronize: true, por lo que estos
-- cambios tambien se aplican solos al levantar el servidor; este script
-- permite aplicarlos de forma explicita y controlada.

ALTER TABLE asignar_servicio ADD COLUMN IF NOT EXISTS descripcion VARCHAR(255);

ALTER TABLE tareas ALTER COLUMN descripcion DROP NOT NULL;
