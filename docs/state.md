# Estado

Actualizar al cerrar cada unidad de trabajo: qué quedó hecho, qué sigue, qué
bloquea. La IA debe leer este archivo al iniciar sesión, junto con
`docs/project.md` y `docs/decisions.md`.

## Última actualización: 2026-10-12

Fase 1 (lista básica) **completa y pulida**: cuenta, crear lista, agregar
productos, tachar — todo con optimistic UI. Estructura auditada y limpia.
Commit `a6c5137` en `main`, sincronizado con `origin/main`.

Fase 2 (tiendas) **casi completa**: crear/borrar tiendas, asignar, vista
agrupada por tienda con conteo de pendientes, memoria producto→tienda con
sugerencia al agregar.

## Pendiente (orden sugerido)

1. Probar en dispositivo el primer login contra el RPC `ensure_hogar`
   (nuevo, sin uso real todavía).
2. Activar **Leaked Password Protection** en Supabase Dashboard → Auth
   (aviso del linter de seguridad, no se hace por código).
3. `npx expo install --fix` (5 patch dentro de SDK 57, riesgo mínimo).
4. Fase 3: hogar compartido — invitaciones + Realtime (`useItems` hoy solo
   hace `invalidateQueries`, sin suscripción a `postgres_changes`).
5. Fase 4: pegar lista de WhatsApp, UI de cantidad/unidad (columnas ya
   existen), historial real (hoy `two.tsx` es placeholder).
6. Diseño: iconos de tabs, dark mode completo (Hoy HeroUI + Theme coexisten).

## Deuda conocida (no urgente)

- Log `Uniwind Error - Invalid calc...` en dev: ruido del parser con el CSS de
  HeroUI/Tailwind, sin impacto funcional. No tocar.
- `useCerrarLista` no invalida el detalle; `useListas` trae abiertas y
  cerradas juntas (a propósito hasta que exista historial).
- Sin `scripts/`, sin CI, sin eslint.
