# Product Requirements Document (PRD) — merk2

- **Versión:** 1.0 (Especificación Oficial de Producto)
- **Fecha:** 2026-10-18
- **Roles del Equipo:**
  - **Product Owner & Ingeniería:** Desarrollo funcional, arquitectura, datos e IA.
  - **Branding, Personalidad & UI/UX:** Identidad visual, diseño de la Mascota (IA), sistema de diseño y experiencia de pantallas nativas (iOS / Android).
- **Estado:** Aprobado en sesión de descubrimiento (Rondas 1–4). Fuente única de verdad de producto.

---

## 1. Executive Summary

### Problem Statement
Cuando una familia, pareja o grupo hace mercado en varias tiendas (supermercados locales, tiendas de descuento como D1/Ara, carnicerías, fruvers o graneros de municipio), la lista suele enviarse como un texto plano por WhatsApp sin orden por tienda ni cantidades claras. Como consecuencia, se olvidan productos al salir de un local, dos personas que compran al mismo tiempo no ven el avance del otro, la mala señal dentro de los establecimientos bloquea las apps tradicionales, y quien arma la lista en casa no cambia fácilmente su hábito de escribir o hablar por WhatsApp.

### Proposed Solution
**merk2** es una aplicación móvil colaborativa (iOS y Android) multi-hogar que organiza las listas de mercado **por tienda**, funciona de forma instantánea incluso con mala señal (*optimistic/offline-first*), aprende automáticamente en qué tienda del hogar se compra cada producto, e incorpora un **Hub de IA encarnado por la Mascota de la marca** capaz de transformar un mensaje pegado de WhatsApp o un dictado por voz en una lista estructurada por tiendas en segundos.

### Success Criteria (KPIs Medibles)
1. **Retención y Hábito (North Star Metric):** `>= 60%` de los hogares activos en la beta cerrada completan **al menos 3 listas de mercado (ciclo completo: creación → compra → cierre)** dentro de sus primeros 30 días.
2. **Adopción Colaborativa por Hogar:** `>= 70%` de los hogares creados cuentan con **2 o más miembros activos** unidos mediante link de WhatsApp o código corto de 6 caracteres.
3. **Velocidad de Onboarding y Activación:** `>= 80%` de los nuevos usuarios completan el flujo de Onboarding de 4 pasos (perfilamiento + creación/unión a hogar + tiendas iniciales) en **menos de 60 segundos**.
4. **Eficiencia de la Memoria Producto → Tienda:** A partir de la **3.ª lista cerrada** de un hogar, `>= 65%` de los productos agregados reciben una sugerencia automática de tienda sin intervención manual.
5. **Latencia de Interacción en Tienda:** `100%` de las acciones críticas en pasillo (tachar/destachar ítem, filtrar por tienda, reasignar tienda) reflejan el cambio visual en la interfaz en **`< 50ms`** (actualización optimista local antes de red).

---

## 2. User Experience & Functionality

### 2.1 User Personas

1. **El Comprador Ejecutor ("El que va por las tiendas"):**
   - Va caminando con bolsas o carrito, usa el celular con **una sola mano** y entra a locales con señal móvil inestable.
   - Necesita filtrar qué le falta comprar exactamente en la tienda donde está parado, tachar con un toque y mover rápido un producto a otra tienda si hoy estaba agotado.
2. **El Organizador del Hogar ("La Mamá / Quien arma la lista en casa"):**
   - Conoce qué falta en la cocina, pero le da pereza llenar formularios largos campo por campo.
   - Prefiere dictar por voz lo que necesita o mandar un bloque de texto por WhatsApp; necesita una navegación clara, sin pantallas confusas ni registros tediosos.
3. **El Colaborador Multi-Hogar ("El Hijo / Pareja que apoya en varios frentes"):**
   - Hace mercado para su propio hogar, pero también ayuda con el mercado de la casa de sus papás o una salida con amigos.
   - Necesita cambiar entre hogares sin cerrar sesión y ver en tiempo real qué ya compró la otra persona.

---

### 2.2 Arquitectura de Navegación y Mapa de Pantallas (Insumo para UI/UX & Branding)

#### Lineamientos de Plataforma (iOS vs. Android)
- **Adaptación Nativa:** Los componentes de navegación del sistema respetan el lenguaje nativo de cada plataforma. En **iOS (iOS 26/27)** la barra de navegación inferior (Tabs) y botones de retroceso aprovechan el acabado nativo **Liquid Glass**; en **Android** utilizan el lenguaje visual propio definido por el diseño de marca de merk2.
- **Uso a una mano:** Las acciones frecuentes durante la compra (tachar, cambiar filtro de tienda, invocar a la mascota, mantener presionado un ítem) deben ser alcanzables con el pulgar.

#### Barra de Navegación Inferior (4 Destinos Principales)
1. **Inicio (Home):**
   - **Header superior:** Selector de Hogar activo (ej. *"Casa Mamá ▾"*) para alternar entre los hogares del usuario o crear/unirse a uno nuevo + acceso rápido para invitar miembros.
   - **Cuerpo:** Listas de mercado **abiertas/activas** del hogar actual (mostrando progreso de productos comprados vs. pendientes) y acción rápida para crear lista manual o gestionar las tiendas del hogar.
2. **Mascota / Hub de IA (Botón Central Destacado con Identidad de Marca):**
   - Representado visualmente por el icono de **la Mascota** del proyecto.
   - Al tocarlo, abre el espacio inteligente donde el usuario puede **Hablar por voz (dictado en vivo)** o **Pegar texto (ej. lista de WhatsApp)** para que la mascota arme la lista estructurada.
   - *Evolución por fases:* En **Fase Inicial**, la Mascota crea una **lista nueva** a partir del audio/texto. En **Fase Posterior**, también permitirá elegir si agregar/editar sobre una lista que ya esté abierta.
3. **Historial:**
   - Registro cronológico de todas las **listas cerradas** del hogar activo.
   - Permite consultar el detalle de quién compró cada producto, **Reutilizar/Duplicar** una lista pasada para crear el mercado de hoy en segundos, o **Reabrir** una lista cerrada por error.
4. **Perfil (Hogar + Perfil + Tuerca de Ajustes):**
   - **Vista Principal de Perfil/Hogar:** Datos del usuario, gestión de sus hogares, miembros del hogar activo, generación de **Link de invitación para WhatsApp** y **Código corto de 6 caracteres**, y acceso a **"Tiendas de este hogar"**.
   - **Botón de Tuerca / Configuración (Header superior derecho, estilo TikTok / Symmetry):** Abre la pantalla de **Ajustes y Configuración** organizada en bloques:
     - *Cuenta y Seguridad:* Editar perfil (nombre/apodo), correo, cambiar contraseña, métodos de acceso vinculados (Google), cerrar sesión y eliminar cuenta.
     - *Preferencias y Permisos:* Permisos de micrófono (para voz con IA) y notificaciones push.
     - *Soporte y Comunidad:* Informar de un error / enviar feedback, centro de ayuda/soporte, comunidad.
     - *Legal:* Términos de servicio y Política de privacidad.

####Dónde vive la Gestión de Tiendas (Sin ocupar un Tab inferior)
- **Acceso Contextual en Lista (Principal):** Dentro de cualquier lista de compra, en la barra de chips de tiendas aparece la acción `+ Tienda` para crear una tienda al vuelo, y al mantener presionado un chip de tienda permite renombrarla o eliminarla.
- **Acceso en Perfil/Hogar (Secundario):** Apartado *"Tiendas del hogar"* dentro de Perfil para organizarlas o limpiarlas cuando no se está en medio de una compra.

---

### 2.3 User Stories & Acceptance Criteria

#### Épica 1: Autenticación de Baja Fricción y Onboarding de Perfilamiento

- **US-01 (Acceso con Google y Correo):** `As a` nuevo usuario o familiar invitado, `I want to` registrarme con un solo toque usando "Continuar con Google" o iniciar sesión con mi correo y contraseña (incluyendo recuperar mi contraseña), `so that` no abandone el proceso por formularios largos.
  - **Acceptance Criteria:**
    - El registro principal ofrece botón directo **"Continuar con Google"** en Android e iOS.
    - El inicio de sesión soporta tanto Google como Correo + Contraseña.
    - Incluye flujo funcional de **"Olvidé mi contraseña"** con envío de enlace/código de recuperación al correo.
    - *(Nota de alcance: "Continuar con Apple" queda documentado para fase posterior previo a publicación en App Store).*

- **US-02 (Onboarding en 4 pasos — Conocer al usuario y arranque libre):** `As a` usuario recién registrado, `I want to` completar un onboarding rápido donde la app conozca mi contexto y configure mi primer hogar y mis tiendas locales, `so that` empiece a usar la app sin pantallas vacías.
  - **Acceptance Criteria:**
    - **Paso 1 (Identidad):** Captura nombre o apodo visible para el hogar (obligatorio, mín. 2 caracteres).
    - **Paso 2 (Perfilamiento para conocer al usuario):** Preguntas rápidas de selección visual (ej. *"¿Con quién haces mercado normalmente?"* y *"¿Cuál es tu principal reto al mercar?"*). Las respuestas se guardan asociadas al perfil para analítica de producto. Sin muros de pago.
    - **Paso 3 (Hogar Inicial):** Permite elegir entre **"Crear un hogar"** (definiendo su nombre, ej. *"Mi Casa"*) o **"Tengo un código de invitación"** (ingresando el código de 6 caracteres).
    - **Paso 4 (Creación libre de primeras tiendas):** Si creó un hogar nuevo, el usuario escribe libremente las tiendas donde suele comprar en su municipio o ciudad (con texto guía como *"Ej: Frutería, Carnicería, D1, Supermercado del barrio..."*), sin imponer chips de cadenas que quizá no existan en su localidad.
    - **Analítica de tiendas:** Cada tienda creada por los hogares se almacena de forma que a futuro el equipo pueda analizar cuáles son las tiendas más populares reales y ofrecer sugerencias basadas en datos.

---

#### Épica 2: Arquitectura Multi-Hogar, Invitaciones y Permisos

- **US-03 (Pertenencia Multi-Hogar):** `As a` usuario, `I want to` pertenecer a múltiples hogares al mismo tiempo (ej. mi apartamento, la casa de mi mamá, un paseo con amigos) y cambiar entre ellos desde el encabezado de Inicio, `so that` pueda gestionar distintos mercados sin mezclar listas ni tiendas.
  - **Acceptance Criteria:**
    - Un usuario puede crear o unirse a `N` hogares sin perder los anteriores.
    - Cambiar de hogar en el selector superior actualiza en `< 300ms` las listas activas, las tiendas, la memoria de productos y el historial correspondientes a ese hogar.

- **US-04 (Invitación por Link de WhatsApp y Código de 6 Caracteres):** `As a` miembro de un hogar, `I want to` invitar familiares compartiendo un enlace directo por WhatsApp o un código corto de 6 caracteres, `so that` puedan unirse sin tener que pedirles su correo electrónico.
  - **Acceptance Criteria:**
    - Botón **"Compartir por WhatsApp"** que envía un mensaje prearmado con el link de invitación y el código corto (ej. `MRK-482`).
    - Si el invitado tiene la app instalada, el link abre la app (Deep Link) y lo une al hogar; si aún no la tiene instalada, puede abrir la app tras instalarla e ingresar el código de 6 caracteres en *"Unirme con código"* (y cuando exista la web pública, el link mostrará la pantalla web de descarga con el código).

- **US-05 (Permisos Democráticos con Creador Protegido):** `As a` creador (Admin) de un hogar, `I want to` que todos los miembros puedan gestionar listas, productos y tiendas libremente, pero que solo yo pueda eliminar el hogar o remover miembros, `so that` nadie borre el hogar familiar por accidente.
  - **Acceptance Criteria:**
    - Cualquier miembro del hogar puede: crear/cerrar listas, agregar/editar/tachar productos y crear/editar tiendas.
    - Solo el usuario con rol `admin` (creador del hogar) puede: cambiar el nombre del hogar, eliminar el hogar por completo o expulsar a otro miembro.
    - Cualquier miembro invitado tiene disponible la acción **"Salir del hogar"**.

---

#### Épica 3: Creación de Listas, Productos, Tiendas y Memoria Inteligente

- **US-06 (Anatomía Simple de Producto y Autocompletado):** `As a` usuario armando una lista, `I want to` agregar productos indicando su nombre, tienda opcional y un campo corto de cantidad/detalle (ej. *"2 bolsas"*, *"1 lb"*, *"bolsa roja"*), `so that` anote especificaciones claras sin llenar múltiples campos separados.
  - **Acceptance Criteria:**
    - Al escribir el nombre de un producto, la app normaliza el texto (ignorando mayúsculas, tildes y espacios dobles) y consulta la **Memoria del Hogar** (`producto_memoria`) para preseleccionar automáticamente la tienda donde suele comprarse.
    - El detalle/cantidad se maneja en una sola línea ligera (sin obligar a usar selectores separados de número y unidad).

- **US-07 (Protección al Eliminar o Renombrar Tiendas):** `As a` miembro del hogar, `I want to` que si elimino una tienda que tiene productos en una lista activa, esos productos pasen a "Sin tienda" en lugar de borrarse, `so that` nunca se pierda nada de lo que necesitamos comprar.
  - **Acceptance Criteria:**
    - Antes de eliminar una tienda con productos asignados, se muestra un diálogo de confirmación avisando que los productos pasarán a **"Sin tienda asignada"**.
    - Al confirmar, `tienda_id` de esos productos pasa a `null` y ningún ítem de la lista se pierde.
    - Se permite renombrar cualquier tienda existente y el cambio se refleja de inmediato en todas las listas del hogar.

---

#### Épica 4: La Mascota — Hub de IA (Texto de WhatsApp y Dictado por Voz)

- **US-08 (Creación de Lista con la Mascota IA por Voz o Texto Pegado):** `As a` usuario que recibió una lista desordenada por WhatsApp o quiere dictarla hablando, `I want to` entrar al botón de la Mascota (IA), pegar el texto o grabar mi voz (hasta 60 segundos), y ver una previsualización estructurada antes de crear la lista, `so that` arme el mercado completo en segundos sin errores.
  - **Acceptance Criteria:**
    - **Entrada Dual:** Soporta pegar un bloque de texto libre o grabar audio hablado directamente en la app con una duración máxima de **60 segundos** por grabación.
    - **Cruce Inteligente de Tiendas (Optimización de costos):**
      1. Si el usuario menciona explícitamente una tienda en su voz o texto (ej. *"...en la Carnicería"*), la IA extrae esa tienda.
      2. Si la tienda mencionada ya existe en el hogar, se asigna a esa tienda.
      3. **Caso borde — Tienda nueva mencionada (`US-08b`):** Si la tienda mencionada NO existe aún en el hogar (ej. *"pan en Panadería La Espiga"*), en la previsualización aparece marcada como **"✨ Nueva tienda: Panadería La Espiga (se creará al confirmar)"**, permitiendo aceptarla o cambiarla.
      4. Si el usuario NO menciona tienda para un producto, el sistema cruza localmente el producto contra la **Memoria del Hogar** (`producto_memoria`) sin gastar tokens adicionales de IA.
    - **Previsualización Obligatoria:** Antes de guardar, muestra la lista de productos detectados (con nombre, cantidad/detalle y tienda) permitiendo editar, desmarcar o corregir cualquier ítem y confirmar con un toque.
    - **Alcance por Fase del Hub IA:**
      - *Fase 1 del Hub IA (MVP):* Desde el tab de la Mascota se **crean listas nuevas**.
      - *Fase 2 del Hub IA (Iteración siguiente):* Permitir elegir si los productos detectados se agregan/editan dentro de una **lista existente abierta** o como lista nueva.

---

#### Épica 5: Modo Compra en el Supermercado, Reasignación y Cierre de Lista

- **US-09 (Vista por Tienda, Filtro Rápido y Uso sin Señal):** `As a` comprador dentro de un local, `I want to` filtrar la lista por la tienda en la que estoy, ver cuántos pendientes me faltan en esa tienda y tachar productos al instante aunque no tenga señal, `so that` compre con una sola mano sin olvidar nada antes de pagar.
  - **Acceptance Criteria:**
    - Muestra chips superiores por cada tienda presente en la lista con el conteo de pendientes (ej. `D1 (3)` · `Fruver (2)` · `Sin tienda (1)`).
    - Al tocar un chip de tienda, filtra la vista mostrando únicamente los productos de esa tienda y un indicador claro: **"Te faltan N productos en [Tienda]"**.
    - Tachar o destachar aplica **Optimistic UI** inmediato y encola la sincronización si no hay conexión; al recuperar señal, sincroniza con el servidor y muestra la inicial/nombre de quién compró cada ítem en tiempo real para los demás miembros.

- **US-10 (Reasignación Rápida con Long-Press: "Mover solo por hoy" vs. "Asignar para el futuro"):** `As a` comprador que descubre que un producto está agotado o caro en la tienda actual, `I want to` mantener presionado (*long-press*) el producto para moverlo a otra tienda del mercado eligiendo si el cambio es solo por hoy o permanente, `so that` no se me olvide comprarlo en la siguiente parada sin dañar la memoria habitual del hogar.
  - **Acceptance Criteria:**
    - Mantener presionado un producto despliega acciones rápidas, incluyendo **"Mover de tienda"**.
    - Al seleccionar la nueva tienda destino, un diálogo ofrece dos opciones claras:
      1. **"Mover solo por hoy"**: Cambia `tienda_id` únicamente en el ítem de la lista actual; **NO** modifica `producto_memoria`.
      2. **"Asignar también para futuras listas"**: Cambia `tienda_id` en el ítem actual **Y** actualiza `producto_memoria` del hogar para ese producto.

- **US-11 (Cierre Inteligente de Lista y Manejo de Pendientes):** `As a` usuario terminando el mercado, `I want to` recibir un aviso para cerrar la lista cuando todo esté comprado, o decidir qué hacer con los productos pendientes si cierro antes, `so that` la lista quede limpia en el historial.
  - **Acceptance Criteria:**
    - **Cuando el 100% de los ítems están marcados como comprados:** Aparece un aviso destacado en la lista: *"¡Todo está comprado! Ya puedes cerrar la lista"* con botón de cierre directo.
    - **Cuando el usuario toca "Cerrar lista" pero aún quedan `N` productos sin tachar:** Se muestra un diálogo advirtiendo *"Tienes N productos pendientes"* con dos acciones:
      1. **"Descartar pendientes y cerrar"**: Elimina/descarta los ítems que no se compraron (porque ya no se necesitaban) y cierra la lista.
      2. **"Marcar todos como comprados y cerrar"**: Marca con check los `N` ítems restantes (porque sí se compraron pero se olvidó tacharlos) y cierra la lista.

---

#### Épica 6: Historial y Notificaciones Colaborativas

- **US-12 (Historial con Reutilización y Reapertura):** `As a` miembro del hogar, `I want to` ver las listas cerradas en el Historial, poder crear una nueva lista a partir de una anterior o reabrir una lista cerrada por error, `so that` armar el mercado quincenal sea inmediato.
  - **Acceptance Criteria:**
    - Lista cronológica de listas con `estado = 'cerrada'` del hogar activo.
    - Acción **"Crear nueva lista desde esta"**: Crea una lista abierta nueva copiando los productos de la lista histórica (todos en estado no comprado y respetando su tienda).
    - Acción **"Reabrir lista"**: Devuelve la lista a `estado = 'abierta'` y la regresa al tab de Inicio.

- **US-13 (Notificaciones Push Anti-Spam):** `As a` miembro de un hogar compartido, `I want to` recibir notificaciones puntuales cuando alguien crea una lista, agrega productos o cierra la lista, sin llenarme el celular de alertas por cada check en el supermercado, `so that` esté enterado de lo importante sin ruido.
  - **Acceptance Criteria:**
    - Se envían notificaciones push a los demás miembros del hogar únicamente en **3 eventos**:
      1. **Nueva lista creada** en el hogar.
      2. **Nuevos productos agregados** a una lista abierta (agrupados si se agregan en lote o con IA).
      3. **Lista cerrada/completada**.
    - Tachar o destachar productos individuales **NO** dispara notificaciones push (solo se actualiza en vivo en pantalla vía Realtime).

---

### 2.4 Estados de UI Obligatorios por Pantalla (Checklist para Diseño UI/UX)
Para cada pantalla principal (*Onboarding, Inicio, Detalle de Lista, Hub de la Mascota IA, Historial, Perfil y Ajustes*), el diseño UI/UX debe contemplar:
1. **Estado Vacío (*Empty State*):** Con ilustración/guiño de la Mascota y llamado a la acción claro (ej. *"Aún no hay listas abiertas en este hogar"*).
2. **Estado Cargando (*Skeleton / Loading*):** Especialmente mientras la Mascota IA procesa un audio o texto pegado.
3. **Estado Sin Señal (*Offline Banner sutil*):** Indicador tranquilo que transmite confianza (*"Sin señal — tus cambios se guardan y se sincronizarán al volver a conectarte"*).
4. **Estado Lista Completada (100% checks):** Celebración sutil y botón para cerrar la lista.

---

### 2.5 Non-Goals (Fuera del Alcance de este PRD)
Para proteger el foco y los tiempos de entrega, **NO** se construirá en esta versión:
1. **Precios, presupuestos ni cálculo de totales en dinero.**
2. **Escaneo óptico (OCR) de facturas físicas o códigos de barras.**
3. **Pasarela de pagos, muros de suscripción o cobros dentro de la app.**
4. **Subida de archivos de audio externos** (la voz en el Hub de IA es exclusivamente audio hablado/grabado en directo dentro de la app).
5. **Catálogo precargado rígido de supermercados nacionales** que ignore el contexto de municipios o comercios de barrio.

---

## 3. AI System Requirements (La Mascota — Hub de IA)

### 3.1 Tool & Model Requirements
1. **Procesamiento de Texto Pegado (WhatsApp → Lista):**
   - Modelo LLM ligero y rápido con salida estructurada JSON (`Structured Outputs`).
   - Entrada: Texto libre pegado por el usuario + lista de nombres de tiendas actuales del hogar.
   - Salida esperada por ítem:
     ```json
     {
       "nombre": "Leche deslactosada",
       "cantidad_detalle": "2 bolsas",
       "tienda_mencionada": "D1",
       "es_tienda_nueva": false
     }
     ```
2. **Procesamiento de Voz Hablada (Dictado en vivo → Lista):**
   - Captura de audio nativo en el dispositivo (`<= 60 segundos` por intervención).
   - Transcripción y extracción estructurada en un solo flujo (vía Edge Function segura en Supabase para no exponer llaves de API en el cliente móvil).
3. **Motor de Cruce Híbrido (Ahorro de Costos de IA):**
   - No se envía todo el historial de compras del hogar al prompt de IA.
   - La IA solo extrae lo que el usuario dijo/escribió y detecta si nombró alguna tienda. Si `tienda_mencionada` es `null`, la app cruza el nombre normalizado del producto contra la tabla `producto_memoria` del hogar para asignarle su tienda habitual con costo `$0` de tokens.
4. **Cuotas y Protección Financiera (Rate Limiting):**
   - Máximo **60 segundos** por grabación de voz.
   - Cuota de seguridad en el MVP: máximo **15 ejecuciones de IA por hogar al día** (sumando voz y pegado inteligente). Al alcanzar el límite diario, se informa amablemente al usuario y la creación/adición manual sigue 100% operativa.

### 3.2 Evaluation Strategy
- **Benchmark de Prueba:** Conjunto de 30 entradas reales (15 mensajes típicos de WhatsApp de mamás/familias colombianas con abreviaturas, saltos de línea o comas + 15 audios hablados con ruido ambiente moderado mencionando tiendas de barrio y cantidades coloquiales como *"una cubeta de huevos"*, *"dos manos de plátano"*).
- **Criterios de Aprobación:**
  - **Precisión de separación de ítems:** `>= 95%` de los productos mencionados se separan en renglones individuales correctos (sin fusionar dos productos distintos en uno solo).
  - **Extracción de cantidad/detalle y tienda dicha:** `>= 90%` de exactitud cuando el usuario especifica cantidad o tienda en la frase.
  - **Tiempo de respuesta hasta previsualización:** `< 4 segundos` para texto pegado y `< 7 segundos` para audios de hasta 60 segundos en conexión 4G/Wi-Fi.

---

## 4. Technical Specifications

### 4.1 Architecture Overview
- **Cliente Móvil:** Expo + React Native + TypeScript + Expo Router, con interfaz adaptativa iOS (*Liquid Glass* en navegación nativa) / Android (diseño de marca propio) y caché reactivo con **TanStack Query**.
- **Sincronización y Offline-First en Pasillo:** Todas las mutaciones de compra (tachar, crear ítem, mover de tienda) aplican actualización optimista inmediata en la caché local y se sincronizan con el backend; las listas activas escuchan eventos en tiempo real (`Supabase Realtime / postgres_changes`) para reflejar al instante lo que otro miembro del hogar tacha o agrega.
- **Backend (Supabase):**
  - **PostgreSQL + RLS:** Aislamiento estricto por `hogar_id` validando que `auth.uid()` pertenezca a `hogar_miembros`.
  - **Edge Functions:** Procesamiento seguro de IA (voz/texto), control de cuota diaria de 15 usos por hogar, y disparo de las 3 notificaciones push anti-spam (vía Expo Push Notifications).

### 4.2 Modelo de Datos Conceptual (Evolución para este PRD)
- **`perfiles_usuario`**: `user_id`, `nombre_apodo`, `respuestas_onboarding` (JSON con contexto del usuario), `push_token`, `created_at`.
- **`hogares`**: `id`, `nombre`, `codigo_invitacion` (único de 6 caracteres), `created_by`, `created_at`.
- **`hogar_miembros`**: `hogar_id`, `user_id`, `rol` (`'admin' | 'miembro'`), `joined_at`. *(Soporta N hogares por usuario).*
- **`tiendas`**: `id`, `hogar_id`, `nombre`, `created_at`. *(Además de registro analítico global de nombres de tiendas para futuros estudios de popularidad).*
- **`listas`**: `id`, `hogar_id`, `nombre`, `estado` (`'abierta' | 'cerrada'`), `created_by`, `created_at`, `closed_at`.
- **`items`**: `id`, `lista_id`, `nombre`, `cantidad_detalle` (texto corto unificado), `tienda_id` (`ON DELETE SET NULL` para no perder productos si se borra la tienda), `comprado`, `comprado_por`, `comprado_at`, `created_at`.
- **`producto_memoria`**: `hogar_id`, `producto` (normalizado), `tienda_id`, `updated_at`.
- **`uso_ia_hogar`**: Conteo diario por `hogar_id` y `fecha` para aplicar el límite de 15 ejecuciones/día.

### 4.3 Security & Privacy
- **Row Level Security (RLS):** Ningún usuario puede leer ni modificar listas, tiendas o ítems de un hogar del que no sea miembro activo en `hogar_miembros`.
- **Protección de Rol Admin:** Las operaciones de eliminar un hogar o expulsar un miembro se validan en base de datos exigiendo `rol = 'admin'` en ese hogar.
- **Privacidad de Voz:** Los fragmentos de audio enviados a la Mascota IA se usan exclusivamente para transcribir y estructurar la lista en curso y no se almacenan permanentemente ni se comparten con otros hogares.
- **Eliminación de Cuenta:** Desde *Perfil → Ajustes (Tuerca) → Cuenta y Seguridad*, el usuario puede solicitar la eliminación de su cuenta cumpliendo los requisitos de Google Play y App Store.

---

## 5. Risks & Roadmap

### 5.1 Phased Rollout (Hoja de Ruta de Construcción)

| Fase | Nombre | Alcance Funcional |
|---|---|---|
| **Fase 1 (Base & Tiendas)** | Lista y Tiendas por Hogar *(Prototipo actual + ajustes de cierre y reasignación)* | Flujo de lista abierta, agrupación y filtro por tienda ("Te faltan N"), campo de cantidad/detalle corto, **Long-Press para mover de tienda ("Solo por hoy" vs. "Para futuras listas")**, protección al borrar tiendas (`SET NULL`), y **Cierre inteligente de lista** (aviso al completar 100%, o diálogo de Descartar vs. Marcar como comprados si quedan pendientes). |
| **Fase 2 (Arquitectura Social & Rediseño UI/UX)** | Multi-Hogar, Onboarding, Historial y Nueva Navegación | Nueva navegación de 4 destinos (`Inicio`, `Mascota IA`, `Historial`, `Perfil + Tuerca de Ajustes`). Login con **Google** + Correo/Recuperación. **Onboarding en 4 pasos** (conocer al usuario + tiendas libres). Soporte **Multi-Hogar**, invitación por **Link de WhatsApp y Código de 6 caracteres**, permisos Admin/Miembro, **Realtime** en listas y **Historial** (reutilizar/reabrir). |
| **Fase 3 (La Mascota IA — v1)** | Creación de Listas por Voz y Pegado de WhatsApp | Apertura del Hub de la Mascota IA para **crear listas nuevas** pegando texto de WhatsApp o dictando por voz (máx. 60s), detección de tiendas nuevas mencionadas, cruce híbrido con memoria del hogar, previsualización editable y cuota de 15 usos/día por hogar. |
| **Fase 4 (Retención & IA v2)** | Notificaciones Push + Edición de Listas con IA | Las **3 notificaciones push anti-spam** (nueva lista, nuevos ítems, lista cerrada), ampliación del Hub de la Mascota IA para **agregar/editar sobre listas ya abiertas**, inicio de sesión con Apple, y página web puente para links de invitación de quienes aún no tienen la app instalada. |

### 5.2 Technical & Product Risks

1. **Riesgo de Costos de API de IA:**
   - *Mitigación:* Límite duro de 60s por audio y 15 usos diarios por hogar en el servidor, más cruce local de `producto_memoria` para reducir el tamaño de los prompts.
2. **Riesgo de Conflictos por Mala Señal en Supermercados:**
   - *Mitigación:* Operaciones idempotentes por ítem (`comprado = true/false`) con Optimistic UI; si dos personas tachan el mismo producto sin señal, prevalece el estado comprado sin duplicar renglones.
3. **Riesgo de Ruido Ambiental en el Dictado por Voz:**
   - *Mitigación:* Pantalla de previsualización obligatoria de 1 toque antes de crear la lista, donde el usuario puede corregir o quitar cualquier palabra mal interpretada antes de afectar la lista del hogar.
4. **Riesgo de Fricción en Usuarios No Tecnológicos (ej. la mamá):**
   - *Mitigación:* Registro en 1 toque con Google, unión al hogar mediante link directo de WhatsApp o código de 6 caracteres, y posibilidad de seguir escribiendo la lista en WhatsApp para que otro miembro la pegue en la Mascota IA en 3 segundos.
