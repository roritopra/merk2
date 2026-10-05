# App de mercado: documento de producto y técnico (MVP)

Estado: borrador v0.1 · Se ajusta antes de programar.

## 1. Visión

App móvil colaborativa para organizar la lista del mercado por tienda, para que nada se olvide y varias personas puedan comprar a la vez viendo el avance del otro.

Primero se usa con familia y amigos. Si funciona, se piensa en publicarla en Play Store y en una suscripción.

## 2. Problemas de usuario

1. La lista llega plana (por WhatsApp) y sin orden por tienda.
2. Se olvidan productos por no estar agrupados (ejemplo: el plátano).
3. Las cantidades son vagas o no existen.
4. Dos personas compran en lugares distintos sin ver el avance del otro.
5. Se olvida tachar lo comprado.
6. Mala señal y uso con una mano mientras se camina por la tienda.
7. Quien arma la lista (la mamá) no cambiará de hábito fácilmente.

## 3. Alcance

**Dentro del MVP:** listas, productos, tiendas, tachar, compartir en tiempo real, historial básico.

**Fuera del MVP (aparcado):** precios, totales, escaneo de facturas, similitud con IA, suscripción, publicación en Play Store.

## 4. Stack

| Capa | Tecnología | Motivo |
|---|---|---|
| App móvil | Expo + React Native + TypeScript | Dominio del equipo |
| Navegación | Expo Router | Estándar de Expo |
| Estilos | NativeWind | Tailwind en React Native |
| Backend | Supabase (Auth, Postgres, Realtime, RLS) | Todo en un solo lugar |
| Datos en la app | TanStack Query | Caché y actualización inmediata |
| Compilación | EAS Build | APK para pruebas |

Nota técnica: tachar un producto debe verse al instante en pantalla y sincronizarse después, por la mala señal en tiendas.

## 5. Modelo de datos (conceptual)

- **Usuario:** persona con cuenta.
- **Hogar:** grupo de usuarios que comparten listas.
- **Tienda:** nombre, pertenece a un hogar.
- **Lista:** una compra, con estado abierta o cerrada.
- **Ítem:** nombre, tienda (opcional), cantidad (opcional), unidad (opcional), comprado sí/no, quién lo compró.
- **Memoria de producto:** relación producto → tienda, para sugerir la tienda la próxima vez.

## 6. Fases

| Fase | Contenido |
|---|---|
| 1. Lista básica | Cuenta, crear lista, agregar productos, tacharlos |
| 2. Tiendas | Crear tiendas, asignar productos, ver la lista agrupada por tienda |
| 3. Compartir | Hogar, invitar familiares, cambios en tiempo real |
| 4. Comodidad | Pegar lista de WhatsApp, cantidades y unidades, aviso de pendientes por tienda, historial |

Decisión pendiente: confirmar si "Tiendas" va como Fase 2, antes de compartir.

## 7. Flujo principal

1. Abrir la app y ver las listas.
2. Crear una lista nueva.
3. Agregar productos (a mano o pegando texto).
4. Asignar o confirmar la tienda de cada producto.
5. En el supermercado, abrir la vista por tienda y marcar lo comprado.
6. Al salir de una tienda, ver qué falta de esa tienda.
7. Cerrar la lista; queda en el historial.

## 8. Pendientes por definir

- Entrada de la lista: pegar texto de WhatsApp, compartir desde WhatsApp, o escribir directo.
- Flujo de invitación al hogar.
- Pantallas y wireframes.
- Backlog detallado por fase.
