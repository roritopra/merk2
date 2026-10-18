# Estado

Actualizar al cerrar cada unidad de trabajo: qué quedó hecho, qué sigue, qué
bloquea. La IA debe leer este archivo al iniciar sesión, junto con
`docs/project.md` y `docs/decisions.md`.

## Última actualización: 2026-10-18

- **PRD Oficial v1.0 completado y documentado en `docs/prd.md`** tras sesión de descubrimiento de producto (21 decisiones cerradas). `app-mercado-documento-mvp.md` ahora apunta a `docs/prd.md`.
- Prototipo técnico actual tiene Fase 1 (lista básica) y gran parte de Fase 2 (tiendas básicas) funcionando bajo la estructura previa de 3 tabs.
- Con el nuevo PRD v1.0 se define la hoja de ruta en 4 fases (ver sección 5.1 de `docs/prd.md`) para alinear el desarrollo funcional con el trabajo de Branding, Personalidad (Mascota IA) y UI/UX.

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
