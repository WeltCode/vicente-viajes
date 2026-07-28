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
/home3/elencue2/public_html/vuelos     → motor de vuelos
/home3/elencue2/public_html/hoteles    → motor de hoteles
```

> **Docroot real (verificado en producción, jul 2026):**
> `/home3/elencue2/public_html/`. **NO** es `/home3/elencue2/vicenteviajes.com/`
> como se documentó antes (esa carpeta no la sirve el dominio). Todo lo que deba
> verse en `vicenteviajes.com/…` (incluido el build de Vite y los motores del
> proveedor) tiene que vivir **dentro de `public_html/`**.

Apache sirve esos directorios directamente. React **nunca** se ejecuta en esas
URLs. El proveedor replica por su cuenta la cabecera y el pie del sitio para
mantener la coherencia visual.

### Cómo se montan `/vuelos` y `/hoteles` (symlinks — HECHO)

> **Estado: CREADOS Y FUNCIONANDO (jul 2026).** Los symlinks ya existen y sirven
> el motor de Conecta Turismo en `vicenteviajes.com/vuelos/` y `/hoteles/`.
> Verificado en producción. Como la cuenta de Hostgator **no tiene shell SSH
> habilitado**, los symlinks se crearon con un **Cron Job temporal** (el comando
> `ln -s` corre igual por cron aunque el shell interactivo esté apagado); el cron
> se borró después. Conecta Turismo no necesitó accesos nuevos: sigue subiendo por
> FTP a `motores/` como siempre.

Los archivos reales del proveedor viven **fuera del docroot**, en
`/home3/elencue2/motores/`, y se exponen dentro de `public_html/` con
**enlaces simbólicos** (symlinks):

```bash
ln -s /home3/elencue2/motores/aereo.vicenteviajes.com   /home3/elencue2/public_html/vuelos
ln -s /home3/elencue2/motores/hoteles.vicenteviajes.com /home3/elencue2/public_html/hoteles
```

Motivo: si se vacía o sincroniza `public_html`, solo se borra el **enlace** (un
puntero), nunca el desarrollo real del proveedor en `motores/`. Basta recrear el
symlink. Conecta Turismo sigue subiendo por FTP a `motores/` sin cambios.

Requisitos: `Options +FollowSymLinks` activo (por defecto en Hostgator); cada
carpeta en `motores/` debe tener un `index.html`/`index.php` de entrada; y las
páginas del proveedor deben usar **rutas relativas** (o `<base href="/vuelos/">`
/ `"/hoteles/"`), porque ahora se sirven desde un subdirectorio, no desde la raíz
de un subdominio. La regla del `.htaccess` (`^(vuelos|hoteles)`) protege las
subrutas del motor para que no las capture el fallback del SPA.

### Acceso al servidor y operaciones (Hostgator) — clave para mantenimiento

> Conocimiento operativo aprendido en producción (jul 2026). No perderlo.

- **El shell SSH está DESHABILITADO** en la cuenta. La autenticación por clave
  funciona (host `mx64.hostgator.mx`, puerto `2222`, usuario `elencue2`), pero el
  servidor responde *"Shell access is not enabled on your account"*. Además, este
  cPanel **no tiene "Terminal"**. Para habilitar shell de verdad: activarlo en el
  portal de Hostgator o por ticket de soporte.
- **Cómo ejecutar comandos de shell SIN shell interactivo → Cron Job.** cPanel →
  *Trabajos de cron*: el comando corre igual aunque el shell esté apagado. Truco de
  verificación: redirigir la salida a un archivo dentro de `public_html` y leerlo por
  la web; luego **borrar el cron y el archivo**. Así se crearon los symlinks.
- **Recuperar los symlinks si se rompen** (p. ej. si un redeploy borra
  `public_html/vuelos` o `/hoteles`): recrearlos con un Cron Job que corra:
  ```bash
  ln -s /home3/elencue2/motores/aereo.vicenteviajes.com /home3/elencue2/public_html/vuelos
  ln -s /home3/elencue2/motores/hoteles.vicenteviajes.com /home3/elencue2/public_html/hoteles
  ```
  (`ln -s` no borra nada; si el enlace ya existe, solo falla. Reversible con `rm` del enlace.)
- **Verificar un deploy del frontend:** abrir
  `https://vicenteviajes.com/assets/index-<hash>.js` y confirmar el hash nuevo. Si
  `/index.html` sigue apuntando al hash viejo (revisar sin caché), **no se sobrescribió**:
  volver a subir `index.html` + `.htaccess` a `public_html/` con "mostrar archivos
  ocultos" activado (el `.htaccess` es oculto y los clientes FTP lo saltan).
- **Pendiente de seguridad:** la clave SSH `id_vicente` (generada y autorizada en cPanel
  durante la puesta en marcha) quedó expuesta → conviene **borrarla/regenerarla** en
  cPanel → *Administrar claves SSH*.

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

Estado actual: **COMPLETADA y en producción (jul 2026).** React ya no gestiona
`/vuelos` ni `/hoteles`; Apache las sirve vía symlink desde `motores/` y el motor
de Conecta Turismo está activo en `vicenteviajes.com/vuelos/` y `/hoteles/`.

- [x] Eliminadas las rutas `/vuelos` y `/hoteles` de `routes/AppRouter.jsx`.
- [x] Sustituidos los `<Link to="/vuelos">` / `<Link to="/hoteles">` por
      `<a href="...">` (navbar desktop/móvil y cards de servicios).
- [x] Revisadas otras referencias (navbar, footer, netlify, `.htaccess`). El
      `.htaccess` de `public_html` lleva la regla `^(vuelos|hoteles)`.
- [x] `pages/Vuelos.jsx` y `pages/Hoteles.jsx` **desconectados** del router (no
      borrados; siguen en el repo para archivarse más adelante).
- [x] `services/flightBridge.js` y `data/airports.json` **se conservan** (motor
      de vuelos propio, ruta `/buscar/:searchToken` sigue en React).
- [x] Verificado el resto del SPA (build OK; home, excursiones, playas, ofertas,
      legales y buscador propio del hero funcionando).
- [x] Symlinks creados y sirviendo el motor del proveedor (ver sección de arriba).

**Pendiente (del lado de Conecta Turismo, no del repo):** su cabecera/pie
replicados son de una versión antigua del sitio (teléfono/email/copyright
desactualizados). Deben aplicar el **kit de diseño** (`docs/kit-diseno-conecta-turismo.html`)
para que coincidan con el sitio actual.

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
| **Docroot de `vicenteviajes.com`** | `/home3/elencue2/public_html/` — aquí va el build de Vite (`index.html`, `assets/`, `.htaccess`) |
| `vicenteviajes.com/vuelos` | ✅ **Activo.** `public_html/vuelos` es un **symlink** → `motores/aereo.vicenteviajes.com` (motor de vuelos de Conecta Turismo) |
| `vicenteviajes.com/hoteles` | ✅ **Activo.** `public_html/hoteles` es un **symlink** → `motores/hoteles.vicenteviajes.com` (motor de hoteles de Conecta Turismo) |
| FTP `vuelos@vicenteviajes.com` | Enjaulada en `motores/aereo.vicenteviajes.com` (el symlink la expone en `public_html/vuelos`) |
| FTP `hoteles@vicenteviajes.com` | Enjaulada en `motores/hoteles.vicenteviajes.com` (el symlink la expone en `public_html/hoteles`) |
| `/home3/elencue2/motores/` | **Fuera del docroot.** Contiene `aereo.vicenteviajes.com` y `hoteles.vicenteviajes.com` (docroots de subdominios del planteamiento iframe, descartado). Un directorio aquí **no** se sirve en `vicenteviajes.com/vuelos`; para exponerlo hay que moverlo a `public_html/` o enlazarlo con symlink. Ventaja: aislado de los cambios en `public_html`. |
| Subdominios `aereo.` y `hoteles.` | Legado del iframe; vacíos o a eliminar |
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

El docroot es **`/home3/elencue2/public_html/`** (no `vicenteviajes.com/`). Ahí
van `index.html`, `assets/` y `.htaccess`. Los directorios `vuelos/` y
`hoteles/` viven (o deben vivir) **dentro de ese mismo docroot**, junto a
`index.html`. Contienen archivos del proveedor externo que **no están en este
repositorio** y no se pueden regenerar.

- Subir por FTP a `public_html/` **solo** `index.html`, `assets/` y `.htaccess`
  (sobrescribiendo). Verificar tras subir que `index.html` referencia el hash de
  JS nuevo (p. ej. abrir `https://vicenteviajes.com/assets/index-<hash>.js`).
- Subir a la carpeta correcta: si los archivos acaban fuera de `public_html/`
  (p. ej. en `/home3/elencue2/vicenteviajes.com/`), el sitio **no cambia**.
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
