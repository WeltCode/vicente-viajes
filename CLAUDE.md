# CLAUDE.md — Vicente Viajes

> Contexto permanente del proyecto. Este archivo se carga automáticamente al
> trabajar en esta carpeta. **No confundir con recipeForge** (otro proyecto del
> mismo usuario). Aquí siempre trabajas sobre **Vicente Viajes**.

## Idioma
Responder **siempre en español**.

## Qué es
Plataforma turística full stack para gestión y promoción de **excursiones,
playas, ofertas y destinos**. Incluye panel de administración privado y
extracción de datos de carteles con IA (Claude). Los buscadores de vuelos y
hoteles los sirve un proveedor externo directamente desde el servidor
(ver sección "Integración vuelos/hoteles").

## Stack
- **Frontend**: React 19 + Vite 7, React Router DOM 7, Tailwind CSS 3, Framer
  Motion, Axios, Lucide React, Sonner. SPA pública + panel `/admin/*`.
- **Backend**: Django 6 (settings dicen 5.1.7 base) + Django REST Framework.
  Auth por Token con expiración (`AdminTokenAuthentication`, 8 h en prod).
  Gunicorn como WSGI en producción.

## Hechos críticos de infraestructura (NO equivocarse)
- **Imágenes → Cloudflare Images**, NO Cloudinary.
  - Storage backend propio: `backend/backend/cloudflare_storage.py`
    (`CloudflareImagesStorage`), registrado en `STORAGES` de `settings.py`
    (Django 5.1+ eliminó `DEFAULT_FILE_STORAGE`).
  - URL de entrega: `https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/public`
  - API: `https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1` (y `/v2` para listar la galería).
  - Carpetas (custom IDs): `Vicente Viajes/{excursiones,playas,ofertas,estados,Usuarios}/`.
  - **Cloudinary solo es legado**: el método `url()` normaliza paths antiguos
    `image/upload/v.../...` por compatibilidad con datos históricos. El SDK de
    Cloudinary ya fue eliminado (commit "migración: Cloudinary → Cloudflare Images").
- **Base de datos de producción → PostgreSQL en Render.**
  - Se activa vía `DATABASE_URL` (`postgresql://...`). Si está vacía, cae a
    SQLite local (`backend/db.sqlite3`) para desarrollo.
  - Parsing en `settings.py` → `_build_database_config_from_url()`.
- **Backend hospedado en Render**; frontend en **Hostgator** (producción) y
  **Netlify** (previews). CDN de imágenes en Cloudflare.

## Git — IMPORTANTE
- **La rama de producción/por defecto es `master`, NO `main`.** Otras ramas:
  `develop` (staging) e `integracion/motores-externos` (devs externos).
- Dos remotos:
  - `dedsec` → `git@github.com:WeltCode/vicente-viajes.git` (dev principal)
  - `origin` → `https://github.com/vicenteviajes/vicenteviajes-web.git` (cliente)
- `settings.py` detecta la rama leyendo `.git/HEAD` y carga el `.env` según ella:
  `develop` → `.env.staging`; cualquier otra → `.env.production`; fallback `.env`.

## Estructura
```
backend/
  backend/            # módulo de config
    settings.py       # env-driven, multi-rama, STORAGES Cloudflare
    urls.py
    authentication.py # AdminTokenAuthentication (expiry configurable)
    ai_views.py       # POST /api/ai/extract-poster/ (Claude OCR)
    gallery.py        # galería admin Cloudflare
    cloudflare_storage.py
  excursiones/  playas/  ofertas/  estados/  contacto/
frontend/src/
  pages/  admin/  components/AIExtractButton.jsx
  context/AuthContext.jsx  routes/AppRouter.jsx
  services/api.js  services/flightBridge.js  data/airports.json
```

## Apps backend
- **excursiones**: modelo central; itinerario JSON, fechas, precio, includes/
  not_includes, SEO, `is_featured`, `is_active`.
- **playas**: destinos costeros (características, group_size, rating).
- **ofertas**: descuento calculado en `save()` (price vs original_price);
  reordenables por `display_order`.
- **estados**: timeline/carteles; se desactivan al pasar `excursion_date`
  (middleware `estados.middleware.EstadoExpirySyncMiddleware`).
- **contacto**: email del formulario; proveedor `django` (SMTP) o `resend`
  según `CONTACT_EMAIL_PROVIDER`.

## API (base dev `http://127.0.0.1:8000/api/`)
- Público GET: `/excursiones/ /playas/ /ofertas/ /estados/`; POST `/contacto/`.
- Auth: `/login/ /logout/ /me/ /change-password/`.
- Protegido (`Authorization: Token <token>`): CRUD de las 4 entidades,
  `/ai/extract-poster/`, `/users/`, `/reset-password/` (superuser).
- DRF: `IsAuthenticatedOrReadOnly` por defecto (lectura pública, escritura auth).

## IA — extracción de carteles
`POST /api/ai/extract-poster/` sube imagen (≤5 MB, JPEG/PNG/WEBP/GIF), la manda
a **Claude Opus 4.5** con prompt estructurado y devuelve los campos del
formulario. Componente reutilizable: `frontend/src/components/AIExtractButton.jsx`.
Requiere `ANTHROPIC_API_KEY`.

## Frontend — API base URL
`services/api.js`: usa `VITE_API_URL` (debe terminar en `/api`) o cae a `/api`.
En prod: `VITE_API_URL=https://vicenteviajes-web.onrender.com/api`.

---

## Integración vuelos/hoteles — Conecta Turismo

> **Esta sección sustituye por completo al planteamiento anterior de
> "contenedores cerrados con puntos de montaje". Ese enfoque quedó
> DESCARTADO.** Leer entera antes de tocar nada relacionado con `/vuelos`
> o `/hoteles`.

### Regla crítica

`/vuelos` y `/hoteles` **NO pertenecen a esta aplicación React**. Las sirve un
proveedor externo (**Conecta Turismo**) desde **directorios físicos reales** en
el servidor de Hostgator:

```
/home3/elencue2/vicenteviajes.com/vuelos     → motor de vuelos
/home3/elencue2/vicenteviajes.com/hoteles    → motor de hoteles
```

Apache sirve esos directorios directamente. React **nunca** se ejecuta en esas
URLs. El proveedor replica por su cuenta la cabecera y el pie del sitio para
mantener la coherencia visual.

### Reglas permanentes

1. **No definir** `/vuelos` ni `/hoteles` como rutas en `AppRouter.jsx` ni en
   ninguna otra configuración de React Router.
2. **Enlazarlas siempre con anchor nativo**: `<a href="/vuelos">`.
   **Nunca** con `<Link to="/vuelos">` ni con `navigate("/vuelos")`.
   Motivo: React Router intercepta el clic y hace navegación en cliente; el
   navegador no pide la URL al servidor y el motor externo nunca carga. El
   usuario ve una pantalla en blanco o el 404 del SPA.
   Aplica a **cualquier** componente: navbar, menú móvil, footer, hero, cards,
   CTAs, banners, breadcrumbs.
3. **No incluir** esas carpetas en ningún build, deploy, limpieza o
   sincronización.
4. **No modificar** el bloque del `.htaccess` marcado como
   "Rutas gestionadas por Conecta Turismo".

### Estado de la migración

Estado actual: **pendiente de aplicar en el código.** La infraestructura de
servidor ya está lista; el frontend todavía tiene las rutas antiguas.

- [ ] Eliminar las rutas `/vuelos` y `/hoteles` de `routes/AppRouter.jsx`.
- [ ] Sustituir todos los `<Link to="/vuelos">` / `<Link to="/hoteles">` por
      `<a href="...">` en todo el proyecto.
- [ ] Buscar cualquier otra referencia a esas rutas: arrays de navegación,
      constantes, `navigate()` programático, sitemap, tests.
- [ ] **No borrar** `pages/Vuelos.jsx` ni `pages/Hoteles.jsx`: solo
      desconectarlos del router. Se archivan más adelante.
- [ ] Decidir el futuro de `services/flightBridge.js` (ver aviso abajo).
- [ ] Verificar que el resto del SPA sigue funcionando.

Antes de aplicar, mostrar un resumen de los archivos que se van a tocar.

### AVISO — `flightBridge.js` y `vuelos.vicenteviajes.com`

`services/flightBridge.js` conecta con `QueryBridge.aspx` en
`vuelos.vicenteviajes.com`. Es un **motor de vuelos propio anterior**, distinto
del de Conecta Turismo.

**Pendiente de decisión del cliente**: si ese motor se retira al entrar Conecta
Turismo, o si sigue en uso en algún otro punto del sitio.

Hasta que se aclare:
- **No eliminar** `flightBridge.js` ni `data/airports.json`.
- **No eliminar** el subdominio `vuelos.vicenteviajes.com` del hosting.
- Si `flightBridge.js` solo se usa desde `pages/Vuelos.jsx`, quedará huérfano al
  desconectar la ruta: dejarlo en el repo, señalarlo en el resumen, no borrarlo.

### Historial de la decisión

1. **Primera propuesta**: motores en subdominios (`aereo.vicenteviajes.com`,
   `hoteles.vicenteviajes.com`), con los archivos fuera del docroot en
   `/home3/elencue2/motores/`, e incrustarlos por **iframe** dentro de páginas
   React que conservaran el diseño del sitio (de ahí los contenedores
   `#flight-search-root` / `#hotel-search-root`). Se llegó a montar toda esa
   infraestructura: subdominios, cuentas FTP, AutoSSL.
2. **Descartada**: el proveedor confirmó que su buscador **no puede
   incrustarse como iframe externo** por motivos funcionales.
3. **Solución final**: los archivos se mueven a directorios reales dentro del
   docroot (`/vuelos` y `/hoteles`), su sistema sirve la página completa
   replicando cabecera y pie, y React deja de gestionar esas dos rutas.

Requisitos que impuso el proveedor (Juan, responsable de integración):
- Su sistema no funciona desde repositorio; los archivos van directamente sobre
  el hosting.
- Cada motor en su propio directorio vacío e independiente, con una cuenta FTP
  apuntando directamente a él, para que ningún sistema pise a otro.
- No admiten iframe desde dominio externo.

Nota: el proveedor asume que la web principal es WordPress con actualizaciones
automáticas. **No lo es**, es esta SPA con despliegue manual.

### Estado de la infraestructura en Hostgator

| Elemento | Estado |
|---|---|
| `vicenteviajes.com/vuelos` | Directorio real, motor de vuelos de Conecta Turismo |
| `vicenteviajes.com/hoteles` | Directorio real, motor de hoteles de Conecta Turismo |
| FTP `vuelos@vicenteviajes.com` | Enjaulada en `/vuelos` |
| FTP `hoteles@vicenteviajes.com` | Enjaulada en `/hoteles` |
| `/home3/elencue2/motores/` | Vacío, resto del planteamiento con iframe |
| Subdominios `aereo.` y `hoteles.` | Vacíos; redirigen a `/vuelos` y `/hoteles`, o eliminados |
| `vuelos.vicenteviajes.com` | **EN USO** por `flightBridge.js` — no tocar |
| `billetes.`, `pagos.`, `reserva-vuelos.` | Pendientes de revisar (probables restos de un WordPress anterior) |

### Kit de diseño entregado al proveedor

Para que repliquen fielmente cabecera y pie se les entrega: HTML renderizado
del header y del footer (markup final, no JSX), CSS compilado de esos bloques
(Tailwind no les sirve como configuración), logotipo en SVG y PNG, paleta de
colores con hex exactos, tipografías con sus enlaces, enlaces del menú, datos
completos del pie (dirección, teléfono, email, CIF, C.I.C.M.A., enlaces
legales, "Powered by WeltBrave"), botón flotante de WhatsApp y capturas de
referencia en escritorio y móvil.

Si se pide ayuda para preparar este kit: extraer el markup y el CSS de los
componentes `Navbar` y `Footer` en versión plana, sin dependencias de Tailwind
ni de React.

---

## `.htaccess` en producción (docroot Hostgator)

```apache
Options -MultiViews
RewriteEngine On

# Redirige www a no-www (HTTPS)
RewriteCond %{HTTP_HOST} ^www\.vicenteviajes\.com$ [NC]
RewriteRule ^ https://vicenteviajes.com%{REQUEST_URI} [R=301,L]

# Fuerza HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Rutas gestionadas por Conecta Turismo — no tocar
RewriteRule ^(vuelos|hoteles)(/|$) - [L]

# SPA fallback: todas las rutas sirven index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [QSA,L]
```

La exclusión de `vuelos|hoteles` es necesaria porque el `.htaccess` se hereda
en subdirectorios: sin ella, una URL interna del motor que no corresponda a un
fichero físico (p. ej. `/hoteles/buscar?destino=...`) acabaría reescrita a
`index.html` y rompería su navegación.

Notas:
- El archivo `_redirects` del docroot es de Netlify y no hace nada en Apache.
- Si se activa el proxy de Cloudflare (nube naranja), el SSL debe estar en
  **Full (strict)**. Con "Flexible" la regla de forzar HTTPS entra en bucle de
  redirección. Alternativa: `RewriteCond %{HTTP:X-Forwarded-Proto} !https`.

## Variables de entorno clave (`backend/.env*`)
`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`,
`DJANGO_CORS_ALLOWED_ORIGINS`, `DJANGO_CSRF_TRUSTED_ORIGINS`,
`DATABASE_URL` (+`DATABASE_CONN_MAX_AGE`), email/`RESEND_*`,
`CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_IMAGES_ACCOUNT_HASH`,
`ANTHROPIC_API_KEY`, `ADMIN_TOKEN_MAX_AGE_SECONDS` (28800 = 8 h).
Frontend (`frontend/.env.local`): `VITE_API_URL`, `VITE_FLIGHTS_API_KEY`.

## Despliegue
- Backend → Render: build `pip install -r requirements.txt && python manage.py migrate`; start `gunicorn backend.wsgi:application`; PostgreSQL de Render en `DATABASE_URL`.
- Frontend prod → Hostgator: `npm run build` con `VITE_API_URL` apuntando a Render; subir `dist/` por FTP con `.htaccess` (fallback SPA).
- Frontend preview → Netlify (`netlify.toml` / `_redirects`).

### PELIGRO al desplegar el frontend

Los directorios `vuelos/` y `hoteles/` viven **dentro del docroot**, junto a
`index.html` y `assets/`. Contienen archivos del proveedor externo que **no
están en este repositorio** y no se pueden regenerar.

- Subir por FTP **solo** `index.html`, `assets/` y `.htaccess`.
- **Nunca** usar "sincronizar directorios", "espejo" ni vaciar el docroot antes
  de subir: borraría los motores de Conecta Turismo.
- Si algún día se automatiza con `rsync`, obligatorio
  `--exclude=vuelos --exclude=hoteles`.
- Si se configura Git Version Control de cPanel, revisar que el `.cpanel.yml`
  no haga copia limpia del docroot.

## Comandos dev
```
# Backend (desde backend/)
python manage.py migrate
python manage.py runserver        # http://127.0.0.1:8000
# Frontend (desde frontend/)
npm install && npm run dev        # http://localhost:5173
```

## Convenciones
- Código y comentarios en español donde ya lo estén; no traducir lo existente.
- Antes de cambios amplios, mostrar resumen de archivos afectados.
- No introducir dependencias nuevas sin consultarlo.
- No tocar la configuración de build de Vite sin motivo justificado.
