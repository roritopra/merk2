# Decisiones

Registro vivo. Nueva decisión → nueva entrada arriba con fecha. Lo táctico y
pequeño no entra aquí, solo lo que una IA futura (o tú en 3 meses) necesitaría
para no romper nada.

## 2026-10-12 — Memoria en el repo, no Codebase Memory MCP ni Obsidian

Se evaluó Codebase Memory MCP (índice de código) vs Obsidian (memoria curada).
Para este tamaño (~30 fuentes) el índice aporta poco; lo que ahorra tokens es
memoria de contexto. Decisión: `docs/` versionado en git. Reevaluar si el repo
crece mucho o se trabaja multi-repo grande.

## 2026-10-12 — `ensure_hogar` como RPC atómico

El cliente hacía leer → insertar hogar → insertar miembro (3 viajes, con
carrera entre dispositivos). Ahora `supabase.rpc('ensure_hogar')` con advisory
lock por usuario. `SECURITY DEFINER` es intencional y está cerrado a
`authenticated` (ver `supabase/migrations/`).

## 2026-10-12 — Optimistic UI en toda escritura de Fase 1

Crear lista, agregar ítem, tachar, asignar tienda: actualizan caché primero y
revierten en error. Requisito del producto por mala señal en tiendas.

## 2026-10-12 — No migrar a `src/`

La skill expo-project-structure es solo para proyectos nuevos. Este ya tiene
layout en `app/` raíz: se respeta. Tampoco renombrar `lib/` ni `components/`.

## 2026-10-12 — Tema en dos capas

`constants/Colors.ts` (template, por esquema) + `constants/theme.ts` (tokens
propios: border, error, info, link, radius, spacing). Nada de colores
hardcodeados en pantallas nuevas. HeroUI trae su propio tema, no mezclar.

## 2026-10-12 — Limpieza de template

Fuera: `modal`, `heroui-test`, `_layout.web` duplicado, `EditScreenInfo`,
`ExternalLink`, `StyledText`. Se conserva `+html` (raíz web) y `+not-found`
(404): son legítimos. Iconos de tabs siguen genéricos, pendiente de diseño.

## 2026-10-12 — Sin tests por ahora

Decisión del dueño: no escribir tests en esta etapa. No proponerlos hasta que
lo pida. `typecheck` (`npm run typecheck`) sí es obligatorio antes de dar por
hecho cualquier cambio.

## 2026-10-12 — Commits en inglés, estilo `feat: ...`

Mensajes cortos tipo `feat: polish phase 1 with ...`. Un commit por unidad de
trabajo terminada; push solo si se pide.
