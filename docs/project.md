# merk2 — memoria del proyecto

App móvil colaborativa: lista del mercado organizada **por tienda y por hogar**,
para que varias personas compren a la vez sin olvidar nada.
Documento de producto: `app-mercado-documento-mvp.md` (manda sobre este archivo
si hay contradicción).

## Stack

Expo SDK 57 + React 19 + RN 0.86 · Expo Router · TypeScript estricto ·
Supabase (Auth, Postgres, RLS) proyecto `merk2` · TanStack Query ·
HeroUI Native + Uniwind/Tailwind v4 · SecureStore (nativo) / AsyncStorage (web) ·
EAS Build (perfiles en `eas.json`).

## Estructura (convención vigente, no migrar a `src/`)

```
app/                 # SOLO rutas Expo Router (wrappers delgados que renderizan screens)
screens/             # cuerpos de pantalla: listas/, lista-detalle/, tiendas/, sesion/
features/            # dominio: listas/ y tiendas/, cada uno con schema + keys + queries + mutations
lib/                 # supabase.ts(.web.ts), auth.ts, query-client.ts, productos.ts
constants/           # Colors.ts (tint/text/bg por esquema) + theme.ts (tokens propios)
components/          # Themed.tsx, useColorScheme, useClientOnlyValue (quedó del template)
supabase/migrations/ # SQL versionado — la única fuente de verdad del backend
docs/                # esta memoria (project, decisions, state)
```

Reglas: `app/` no lleva lógica; estilos con `StyleSheet` al final del archivo
+ tokens de `constants/theme.ts` (no hardcodear colores); mutations de escritura
con optimistic update + rollback (mala señal en tiendas); alias `@/*` → raíz.

## Backend

Tablas: `hogares`, `hogar_miembros`, `tiendas`, `listas`, `items`,
`producto_memoria`. RLS activo en todas (miembros solo ven/gestionan lo suyo).
RPC `ensure_hogar` (atómico, `SECURITY DEFINER` solo para `authenticated`):
devuelve o crea hogar + membresía en una transacción.
La memoria producto→tienda normaliza sin tildes ni espacios extra
(`lib/productos.ts`).

## Flujo principal

Sesión → hogar auto-creado ("Mi hogar") → crear lista → agregar productos
(con sugerencia de tienda por memoria) → vista agrupada por tienda con
pendientes ("Te faltan N") → tachar → cerrar lista → historial (pendiente).
