-- Migración: cerrar ensure_hogar a usuarios autenticados.
-- Aplicada vía MCP el 2026-10-12. No editar: crear una nueva migración.
--
-- Las funciones se exponen a PUBLIC por defecto en Postgres; esto deja
-- EXECUTE solo al rol authenticated (el linter de seguridad lo exige
-- para funciones SECURITY DEFINER).

revoke all on function public.ensure_hogar(text) from public, anon;
grant execute on function public.ensure_hogar(text) to authenticated;
