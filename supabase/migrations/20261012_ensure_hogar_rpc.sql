-- Migración: RPC atómico para obtener o crear el hogar del usuario.
-- Aplicada vía MCP el 2026-10-12. No editar: crear una nueva migración.
--
-- Por qué existe: el cliente hacía leer → insertar hogar → insertar miembro
-- en 3 viajes. Dos dispositivos a la vez podían crear dos hogares.
-- La función serializa por usuario con un advisory lock y hace todo en
-- una sola transacción como SECURITY DEFINER (salta RLS, pero solo opera
-- sobre auth.uid(), así que nadie puede tocar hogares ajenos).

create or replace function public.ensure_hogar(p_nombre text default 'Mi hogar')
returns public.hogares
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hogar public.hogares%rowtype;
begin
  -- Serializa por usuario: dos dispositivos creando a la vez no duplican hogar.
  perform pg_advisory_xact_lock(hashtext(auth.uid()::text));

  select h.* into v_hogar
  from public.hogares h
  join public.hogar_miembros m on m.hogar_id = h.id
  where m.user_id = auth.uid()
  order by h.created_at asc
  limit 1;

  if found then
    return v_hogar;
  end if;

  insert into public.hogares (nombre, created_by)
  values (coalesce(nullif(trim(p_nombre), ''), 'Mi hogar'), auth.uid())
  returning * into v_hogar;

  insert into public.hogar_miembros (hogar_id, user_id)
  values (v_hogar.id, auth.uid())
  on conflict do nothing;

  return v_hogar;
end;
$$;

grant execute on function public.ensure_hogar(text) to authenticated;
