# Vicente Viajes — Plataforma turística Full Stack

Aplicación web completa para la gestión y promoción de excursiones, playas, ofertas y destinos turísticos. Incluye panel de administración privado y extracción de datos con IA. Los buscadores de vuelos y hoteles los sirve un proveedor externo (Conecta Turismo) directamente desde el servidor Apache, fuera de la aplicación React.

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura general](#arquitectura-general)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos del backend](#módulos-del-backend)
- [API REST](#api-rest)
- [Panel de administración](#panel-de-administración)
- [Extracción de carteles con IA](#extracción-de-carteles-con-ia)
- [Integración de vuelos y hoteles](#integración-de-vuelos-y-hoteles)
- [Cloudflare Images — gestión de imágenes](#cloudflare-images--gestión-de-imágenes)
- [Variables de entorno](#variables-de-entorno)
- [Instalación en desarrollo](#instalación-en-desarrollo)
- [Despliegue en producción](#despliegue-en-producción)
- [Página 404 personalizada](#página-404-personalizada)
- [Integración de proveedor externo en /hoteles y /vuelos](#integración-de-proveedor-externo-en-hoteles-y-vuelos)
- [Acceso para el proveedor externo (Conecta Turismo)](#acceso-para-el-proveedor-externo-conecta-turismo)

---

## Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 19 + Vite 7 | SPA principal |
| React Router DOM 7 | Enrutamiento |
| Tailwind CSS 3 | Estilos utilitarios |
| Framer Motion | Animaciones |
| Axios | Peticiones HTTP |
| Lucide React | Iconografía |
| Sonner | Notificaciones toast |

### Backend
| Tecnología | Uso |
|---|---|
| Python + Django 6 | Framework web |
| Django REST Framework | API REST |
| Token Authentication | Autenticación admin (expiry 8 h) |
| Cloudflare Images (storage backend propio) | Almacenamiento de imágenes |
| Anthropic Claude Opus 4.5 | OCR e extracción de datos con IA |
| Resend (opcional) | Envío de emails de contacto |
| PostgreSQL / SQLite | Base de datos (prod / dev) |
| Gunicorn | Servidor WSGI en producción |

### Infraestructura
| Servicio | Rol |
|---|---|
| Hostgator | Hosting del frontend estático en producción |
| Netlify | Entorno de pruebas/previews frontend |
| Render | Hosting del backend Django |
| Cloudflare Images | CDN de imágenes |

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (Hostgator / Netlify preview)                          │
│  React + Vite — SPA pública + panel /admin/*                    │
│                                                                  │
│  Páginas públicas:  /  /excursiones  /playas  /ofertas          │
│                     /contacto  /nosotros                        │
│  Panel admin:       /admin/login  /admin/excursiones  ...       │
│                                                                  │
│  /vuelos y /hoteles → NO son React: directorios físicos que     │
│  sirve Apache (Conecta Turismo). Ver sección de integración.    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / REST
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Render)                                                │
│  Django + DRF                                                    │
│                                                                  │
│  /api/excursiones/   /api/playas/   /api/ofertas/               │
│  /api/estados/       /api/contacto/ /api/ai/extract-poster/     │
└──────────┬───────────────────────┬──────────────────────────────┘
           │                       │
           ▼                       ▼
    PostgreSQL (Render)    Cloudflare Images CDN
                                   │
                           Anthropic API (Claude)
```

---

## Estructura del proyecto

```
vicente-viajes/
├── backend/                    # Django project
│   ├── backend/                # Módulo de configuración
│   │   ├── settings.py         # Configuración principal (env-driven)
│   │   ├── urls.py             # Router raíz
│   │   ├── ai_views.py         # Endpoint IA extracción de carteles
│   │   ├── authentication.py   # AdminTokenAuthentication (8 h expiry)
│   │   └── gallery.py          # Vista galería Cloudflare para admin
│   ├── excursiones/            # App tours/excursiones
│   ├── playas/                 # App playas y destinos costeros
│   ├── ofertas/                # App ofertas especiales
│   ├── estados/                # App estados de excursión (timeline)
│   ├── contacto/               # App formulario de contacto
│   ├── requirements.txt
│   └── .env                    # Variables locales (NO subir a git)
│
└── frontend/                   # React + Vite
    └── src/
        ├── pages/              # Una página por ruta
        ├── admin/              # Panel privado completo
        │   ├── Login.jsx
        │   ├── ExcursionForm.jsx   # Integra AIExtractButton
        │   ├── OfertaForm.jsx
        │   ├── PlayaForm.jsx
        │   └── EstadoForm.jsx
        ├── components/
        │   └── AIExtractButton.jsx # Botón OCR con Claude
        ├── context/
        │   └── AuthContext.jsx     # Estado de autenticación admin
        ├── routes/
        │   └── AppRouter.jsx       # Todas las rutas
        └── services/
            ├── api.js              # Helper base URL
            └── flightBridge.js     # Lógica del buscador de vuelos externo
```

---

## Módulos del backend

### excursiones
Modelo central de la plataforma. Gestiona tours con itinerario por días, fechas de salida/regreso, precio, rating, campos de incluye/no incluye y SEO.

Campos destacados: `title`, `slug`, `description`, `image` (Cloudflare Images), `location`, `price`, `departure_date`, `return_date`, `month`, `itinerary` (JSON), `includes`, `not_includes`, `is_featured`, `is_active`, `seo_title`, `seo_description`.

### playas
Destinos costeros con características propias. Campos: `title`, `slug`, `description`, `image`, `location`, `price`, `rating`, `group_size`, `characteristics`.

### ofertas
Paquetes con descuento. El porcentaje de descuento se calcula automáticamente en `Model.save()` comparando `price` con `original_price`. Soporta reordenamiento por `display_order`.

### estados
Publicaciones de estado/timeline de una excursión (cartel con fecha). Se desactivan automáticamente cuando `excursion_date` supera la fecha actual.

### contacto
Recibe mensajes del formulario público (`POST /api/contacto/enviar/`), los persiste en BD y los envía por email. Soporta dos proveedores configurables por variable de entorno:
- `CONTACT_EMAIL_PROVIDER=django` → SMTP estándar
- `CONTACT_EMAIL_PROVIDER=resend` → API de [Resend](https://resend.com)

**Protección anti-spam (3 capas)** en ese endpoint público:
1. **Honeypot** — el formulario incluye un campo oculto `website` que los humanos no ven ni llenan. Si llega con contenido, es un bot: el backend lo descarta en silencio (responde `201` falso, sin guardar ni enviar email).
2. **Rate limit por IP** — DRF `AnonRateThrottle` con scope `contacto` (`5/hour`, configurable en `REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']`). Nota: sin una caché compartida configurada, el conteo es por proceso.
3. **Cloudflare Turnstile** (CAPTCHA invisible) — el frontend genera un token (`cf_turnstile_response`) y el backend lo verifica contra Cloudflare (`_verify_turnstile` en `contacto/views.py`). Es **fail-open**: si no hay `TURNSTILE_SECRET_KEY` configurada o Cloudflare no responde, no bloquea (el honeypot queda como respaldo). Claves: `TURNSTILE_SECRET_KEY` (backend) y `VITE_TURNSTILE_SITE_KEY` (frontend, pública).

### backend (config)
- `authentication.py`: `AdminTokenAuthentication` extiende DRF `TokenAuthentication` añadiendo expiración configurable (por defecto 8 horas via `ADMIN_TOKEN_MAX_AGE_SECONDS`).
- `ai_views.py`: endpoint de extracción de datos con Claude (ver sección [Extracción de carteles con IA](#extracción-de-carteles-con-ia)).

---

## API REST

Base URL en desarrollo: `http://127.0.0.1:8000/api/`

### Endpoints públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/excursiones/` | Listar excursiones activas |
| GET | `/api/excursiones/<id>/` | Detalle de excursión |
| GET | `/api/playas/` | Listar playas activas |
| GET | `/api/playas/<id>/` | Detalle de playa |
| GET | `/api/ofertas/` | Listar ofertas activas |
| GET | `/api/estados/` | Listar estados activos |
| POST | `/api/contacto/enviar/` | Enviar mensaje de contacto (con anti-spam: honeypot + rate limit + Turnstile) |

### Endpoints de autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login/` | Login admin → devuelve token |
| POST | `/api/logout/` | Invalida el token actual |
| GET | `/api/me/` | Datos del usuario autenticado |
| POST | `/api/change-password/` | Cambio de contraseña |

### Endpoints protegidos (requieren `Authorization: Token <token>`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/excursiones/` | Crear excursión |
| PUT/PATCH | `/api/excursiones/<id>/` | Editar excursión |
| DELETE | `/api/excursiones/<id>/` | Eliminar excursión |
| POST/PUT/DELETE | `/api/playas/` | CRUD playas |
| POST/PUT/DELETE | `/api/ofertas/` | CRUD ofertas |
| POST/PUT/DELETE | `/api/estados/` | CRUD estados |
| POST | `/api/ai/extract-poster/` | Extraer datos de cartel con IA |
| GET | `/api/users/` | Listar usuarios (superuser) |
| POST | `/api/reset-password/` | Reset temporal de contraseña (superuser) |

---

## Panel de administración

Accesible en `/admin/login`. Requiere cuenta de usuario Django con `is_staff=True`.

**Características:**
- Sesión de 8 horas almacenada en `sessionStorage` (no persiste en nuevas pestañas ni al cerrar el navegador).
- El token también expira en el backend tras 8 horas.
- Roles: `superuser` (todo), `editor` (CRUD contenido), `viewer` (solo lectura).
- CRUD completo para excursiones, playas, ofertas y estados.
- Subida de imágenes directa a Cloudflare Images con drag & drop o selección desde galería.
- Reordenamiento de ofertas con drag & drop.
- Botón de extracción con IA en el formulario de excursiones.

**Gestión de usuarios (superuser):**
- Crear y listar usuarios desde el panel.
- Reset de contraseña temporal — el usuario debe cambiarla al primer login.

---

## Extracción de carteles con IA

El endpoint `POST /api/ai/extract-poster/` permite subir una imagen de un cartel turístico y obtener los campos del formulario rellenos automáticamente usando **Claude Opus 4.5**.

### Cómo funciona

1. El admin sube una imagen de cartel en el formulario (campo "Rellenar formulario con IA").
2. El frontend envía `multipart/form-data` con el campo `image` al endpoint.
3. El backend codifica la imagen en base64 y la envía a Claude junto con un prompt estructurado.
4. Claude detecta el tipo de contenido (excursión, oferta, playa, estado) y extrae todos los campos visibles.
5. La respuesta JSON se mapea automáticamente a los campos del formulario.
6. El admin revisa, ajusta si es necesario y guarda.

### Configuración necesaria

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

La clave se obtiene en [console.anthropic.com](https://console.anthropic.com). El modelo usa créditos de pago por uso (aproximadamente $0.015 por imagen analizada con Opus 4.5).

### Limitaciones
- Imágenes: JPEG, PNG, WEBP o GIF.
- Tamaño máximo: 5 MB.
- Solo accesible para usuarios admin autenticados.

### Extender a otros formularios

El componente `AIExtractButton` (`frontend/src/components/AIExtractButton.jsx`) es reutilizable. Para añadirlo a `OfertaForm`, `PlayaForm` o `EstadoForm`:

```jsx
import AIExtractButton from "../components/AIExtractButton";

// Dentro del JSX del formulario:
<AIExtractButton
  onExtracted={(fields) => {
    // fields contiene los campos extraídos por Claude
    // Mapeamos los relevantes al estado del formulario
    setData(prev => ({
      ...prev,
      title: fields.title || prev.title,
      destination: fields.destination || prev.destination,
      price: fields.price ? String(fields.price) : prev.price,
      // ... resto de campos
    }));
  }}
  className="mb-4"
/>
```

---

## Integración de vuelos y hoteles

Los buscadores de **vuelos** y **hoteles** los sirve un proveedor externo (**Conecta Turismo**) directamente desde el servidor Apache de Hostgator. **No son páginas de React.** Estado: **activo en producción** (jul 2026) en `vicenteviajes.com/vuelos/` y `/hoteles/`.

### Cómo funciona

El docroot real de `vicenteviajes.com` es **`/home3/elencue2/public_html/`** (ahí va el build de Vite: `index.html`, `assets/`, `.htaccess`). Los archivos del proveedor viven **fuera** del docroot, en `/home3/elencue2/motores/`, y se exponen dentro de `public_html/` con **enlaces simbólicos (symlinks)**:

```
public_html/vuelos   → symlink → /home3/elencue2/motores/aereo.vicenteviajes.com    (motor de vuelos)
public_html/hoteles  → symlink → /home3/elencue2/motores/hoteles.vicenteviajes.com  (motor de hoteles)
```

- Apache sirve esos symlinks tal cual; **React nunca se ejecuta** en esas URLs.
- **Por qué symlinks:** si se vacía o sincroniza `public_html`, solo se borra el enlace (un puntero), nunca el desarrollo del proveedor en `motores/`. Basta recrear el symlink. El proveedor sigue subiendo por FTP a `motores/` sin cambios.
- El proveedor sirve **la página completa**, replicando la cabecera y el pie del sitio. Para ello se le entrega un kit de diseño: `docs/kit-diseno-conecta-turismo.html`.
- El planteamiento anterior (incrustar el motor por iframe dentro de una página React con contenedores `#flight-search-root` / `#hotel-search-root`) quedó **descartado** porque el buscador del proveedor no admite incrustarse como iframe externo.

### Reglas en el frontend React

Para que Apache pueda servir esas rutas, React **no debe gestionarlas**:

1. **No** declarar `/vuelos` ni `/hoteles` como rutas en `routes/AppRouter.jsx`.
2. Enlazarlas **siempre con anchor nativo** `<a href="/vuelos">` / `<a href="/hoteles">`, **nunca** con `<Link to>` ni `navigate()`. Con `<Link>`, React Router intercepta el clic y hace navegación en cliente: el navegador no pide la URL al servidor y el motor externo no llega a cargarse (el usuario vería una pantalla en blanco o el 404 del SPA). Solo una carga completa de página funciona.
3. El `.htaccess` del docroot excluye ambas rutas del *fallback* del SPA:
   ```apache
   # Rutas gestionadas por Conecta Turismo — NO ELIMINAR
   RewriteRule ^(vuelos|hoteles)(/|$) - [L]
   ```

En desarrollo (`npm run dev`) esas URLs mostrarán el **404 del SPA**, porque los archivos del proveedor solo existen en el servidor de producción. Es el comportamiento esperado.

> **Nota:** `pages/Vuelos.jsx` y `pages/Hoteles.jsx` (las antiguas páginas contenedor) permanecen en el repositorio pero **están desconectadas del router**. Se archivarán cuando se confirme que el motor externo funciona en producción.

### Motor de vuelos propio (independiente de Conecta Turismo)

Además del buscador de Conecta Turismo, existe un **motor de vuelos propio anterior** que sigue en uso y **no forma parte** de la integración descrita arriba:

- Componente `frontend/src/components/FlightSearch.jsx` (se muestra en el Hero de la home).
- Lógica en `frontend/src/services/flightBridge.js`, que conecta con `QueryBridge.aspx` en `https://vuelos.vicenteviajes.com/`.
- Autocompletado de aeropuertos con base de datos local (`src/data/airports.json`).
- Genera un `searchToken` codificado en la URL y navega a la ruta React `/buscar/:searchToken` (`pages/BuscarVuelos.jsx`), que **sí** sigue gestionada por React.

Está pendiente de decisión del cliente si este motor propio se retira al entrar Conecta Turismo o si ambos conviven. Mientras tanto, **no se eliminan** `flightBridge.js`, `data/airports.json`, la ruta `/buscar/:searchToken` ni el subdominio `vuelos.vicenteviajes.com`.

---

## Cloudflare Images — gestión de imágenes

Todas las imágenes se almacenan en Cloudflare Images bajo la carpeta `Vicente Viajes/`:
- `Vicente Viajes/excursiones/`
- `Vicente Viajes/playas/`
- `Vicente Viajes/ofertas/`
- `Vicente Viajes/estados/`

La galería del admin está disponible en `/admin/gallery/` y permite seleccionar imágenes ya subidas sin volver a cargarlas.

Notas técnicas importantes:
- El backend usa `STORAGES` en `settings.py` (requisito en Django 5.1+; `DEFAULT_FILE_STORAGE` ya no aplica).
- El storage normaliza rutas antiguas tipo Cloudinary (`image/upload/v.../...`) para construir la URL final de Cloudflare y mantener compatibilidad con datos históricos.

---

## Variables de entorno

Archivo: `backend/.env` (no incluido en git)

```env
# Django
DJANGO_SECRET_KEY=clave-segura-de-50-chars
DJANGO_DEBUG=True                          # False en producción
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:5173

# Base de datos (omitir para usar SQLite en dev)
DATABASE_URL=postgresql://user:pass@host/db
DATABASE_CONN_MAX_AGE=600

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=info@vicenteviajes.com
EMAIL_HOST_PASSWORD=app-password
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=Vicente Viajes <info@vicenteviajes.com>

# Proveedor de email de contacto: django | resend
CONTACT_EMAIL_PROVIDER=django
CONTACT_RECIPIENT_EMAIL=info@vicenteviajes.com
RESEND_API_KEY=re_...                      # Solo si CONTACT_EMAIL_PROVIDER=resend
RESEND_FROM_EMAIL=no-reply@vicenteviajes.com

# Cloudflare Images
CLOUDFLARE_ACCOUNT_ID=tu_account_id
CLOUDFLARE_API_TOKEN=tu_api_token
CLOUDFLARE_IMAGES_ACCOUNT_HASH=tu_account_hash

# Anthropic / Claude IA
ANTHROPIC_API_KEY=sk-ant-api03-...

# Cloudflare Turnstile (anti-spam contacto) — secret privada, SOLO backend
TURNSTILE_SECRET_KEY=0x...   # vacío = no bloquea (fail-open)

# Sesión admin (segundos, por defecto 28800 = 8 horas)
ADMIN_TOKEN_MAX_AGE_SECONDS=28800
```
> En producción (**Render**), `TURNSTILE_SECRET_KEY` se configura en el dashboard de Render, no en el `.env` (que está gitignored y no llega al servidor).

Variables del frontend en `frontend/.env.local` / `.env.production`:
```env
VITE_API_URL=https://tu-backend.onrender.com/api
VITE_FLIGHTS_API_KEY=...        # Opcional, para motor de vuelos externo
VITE_TURNSTILE_SITE_KEY=0x...   # Site key pública de Cloudflare Turnstile (anti-spam contacto)
```

Importante para producción: `VITE_API_URL` debe incluir `/api` al final para evitar 404 en rutas como `/estados/`, `/ofertas/`, `/me/`.

---

## Instalación en desarrollo

### Requisitos previos
- Python 3.12+ y pip
- Node.js 20+ y npm

### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/WeltCode/vicente-viajes.git
cd vicente-viajes

# 2. Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/Mac

# 3. Instalar dependencias
cd backend
pip install -r requirements.txt

# 4. Crear backend/.env con las variables mínimas:
#    DJANGO_SECRET_KEY, CLOUDFLARE_*, ANTHROPIC_API_KEY

# 5. Migraciones y arranque
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

El backend queda disponible en `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

---

## Despliegue en producción

### Backend → Render
1. Crear un Web Service en Render apuntando a la carpeta `backend/`.
2. Build command recomendado: `pip install -r requirements.txt && python manage.py migrate`
3. Start command: `gunicorn backend.wsgi:application`
4. Configurar todas las variables de entorno del listado anterior (incluyendo `CLOUDFLARE_*`).
5. Crear un PostgreSQL en Render y añadir su URL a `DATABASE_URL`.

### Frontend → Hostgator (producción)
1. Generar build local desde `frontend/`:
  - PowerShell: `$env:VITE_API_URL="https://vicenteviajes-web.onrender.com/api"; npm run build`
2. Subir el contenido completo de `frontend/dist/` al hosting (incluyendo `.htaccess`).
3. Confirmar que exista fallback SPA en `.htaccess` para que rutas como `/excursiones` o cualquier 404 de React carguen `index.html`.

### Frontend → Netlify (preview/pruebas)
- Usar `netlify.toml` y/o `frontend/public/_redirects` para preview deployments.
- Si se quiere proxy en Netlify, mantener regla `/api/* -> https://vicenteviajes-web.onrender.com/api/:splat 200`.

### Cloudflare Images
Las credenciales de Cloudflare Images son compartidas entre entornos. Usar token separado por entorno si se requiere aislamiento.

---

## Página 404 personalizada

- Ruta definida en React Router con `path="*"` en `frontend/src/routes/AppRouter.jsx`.
- Componente: `frontend/src/pages/NotFound404.jsx`.
- Incluye Navbar y Footer del sitio para mantener navegación global en páginas no existentes.

---

## Integración de proveedor externo en `/hoteles` y `/vuelos`

El proveedor (**Conecta Turismo**) **no trabaja sobre el repositorio ni sobre la aplicación React**. Sube sus archivos por FTP a directorios físicos aislados del servidor Apache, y sirve la página completa replicando la cabecera y el pie del sitio.

### Directorios y cuentas FTP

| Servicio | Directorio | Cuenta FTP (enjaulada / chroot) |
|---|---|---|
| Vuelos  | `/vuelos`  | `vuelos@vicenteviajes.com`  |
| Hoteles | `/hoteles` | `hoteles@vicenteviajes.com` |

Cada cuenta FTP está enjaulada en su directorio: el proveedor no ve ni toca el resto del sitio.

### Kit de diseño

Para que la cabecera y el pie sean idénticos a los del sitio, se le entrega:

- Guía para el proveedor: [`.github/GUIA_INTEGRADOR_EXTERNO.md`](.github/GUIA_INTEGRADOR_EXTERNO.md)
- Kit de diseño (cabecera + pie en HTML/CSS plano, sin React ni Tailwind, listo para copiar): `docs/kit-diseno-conecta-turismo.html` + `docs/logo-navbar.png` + `docs/logo-footer.png` (entregable interno; `docs/` no se versiona en git, se comparte directamente con el proveedor).

> **Regla de oro:** el proveedor solo sube a su directorio (`/vuelos` o `/hoteles`). **No** toca `index.html`, `assets/` ni el `.htaccess` del docroot. Ver también la sección [Integración de vuelos y hoteles](#integración-de-vuelos-y-hoteles).

---

## Acceso para el proveedor externo (Conecta Turismo)

El proveedor de vuelos/hoteles **ya no necesita acceso al repositorio de GitHub**: su integración se despliega **por FTP** sobre directorios físicos del servidor (ver [Integración de proveedor externo](#integración-de-proveedor-externo-en-hoteles-y-vuelos)), no editando código React.

Lo que se le entrega:

1. **Credenciales FTP** de su directorio (`vuelos@vicenteviajes.com` o `hoteles@vicenteviajes.com`), enjaulado en `/vuelos` o `/hoteles`.
2. **Guía de integración**: [`.github/GUIA_INTEGRADOR_EXTERNO.md`](.github/GUIA_INTEGRADOR_EXTERNO.md)
3. **Kit de diseño** (cabecera + pie en HTML/CSS plano): `docs/kit-diseno-conecta-turismo.html` con `logo-navbar.png` y `logo-footer.png` (entregable interno en `docs/`, no versionado; se comparte directamente).

No se le concede acceso a `master` ni a ninguna rama del repositorio, ni sube nada al build de Vite.

> Si en el futuro un desarrollador externo necesitara **tocar el código React** (no es el caso de Conecta Turismo), el flujo de acceso por GitHub — colaborador temporal, rama dedicada y PR con revisión de CODEOWNERS — se documenta en la sección interna [Gestión de acceso para integradores externos](#gestión-de-acceso-para-integradores-externos-uso-interno--weltcode).

---

## Gestión de acceso para integradores externos (uso interno — WeltCode)

> Esta sección es para el dev principal (`WeltCode`). Documenta el flujo acordado para dar acceso temporal a desarrolladores externos.
>
> ⚠️ **La integración actual de vuelos/hoteles (Conecta Turismo) NO usa este flujo**: se despliega por FTP sobre directorios físicos del servidor, sin acceso al repositorio. Este mecanismo de colaborador + rama `integracion/motores-externos` + PR queda como referencia genérica por si en el futuro un dev externo necesita tocar el código React.

### Contexto del repo

| Cuenta | Rol | Acceso |
|---|---|---|
| `vicenteviajes` | Dueño (cliente) | Push directo a master |
| `WeltCode` | Dev principal | Push directo a master (colaborador Write) |
| Dev externo | Integrador temporal | Solo rama `integracion/motores-externos` → PR |

> El repo está en una cuenta personal gratuita. Los colaboradores Write no pueden bypasear branch protection. Por eso WeltCode trabaja sin regla de protección en master y solo se activa cuando hay un dev externo trabajando.

---

### Flujo normal (sin dev externo)

Trabajas libremente con push directo:

```bash
git add .
git commit -m "descripción del cambio"
git push origin master
```

---

### Cuando llega el dev externo — activar acceso

**1. Asegúrate de que el repo esté público**
`Settings → Manage visibility → Make public`

**2. Activa la protección de master**
`Settings → Branches → Add classic branch protection rule`

| Opción | Estado |
|---|---|
| Branch name pattern | `master` |
| Require a pull request before merging | ✅ |
| Required approvals | `1` |
| Require review from Code Owners | ✅ |
| Do not allow bypassing the above settings | ❌ (desactivado) |

**3. Añade al dev externo como colaborador**
`Settings → Collaborators → Add people` → su usuario de GitHub → rol **Write**

**4. Compártele la guía de integración**
```
https://github.com/vicenteviajes/vicenteviajes-web/blob/master/.github/GUIA_INTEGRADOR_EXTERNO.md
```

El dev trabaja en la rama `integracion/motores-externos` → abre PR hacia `master` → tú lo revisas y apruebas.

---

### Cuando termina el dev externo — desactivar acceso

**1. Elimina al colaborador**
`Settings → Collaborators → elimina su usuario`

**2. Elimina la regla de protección de master**
`Settings → Branches → Delete rule`

**3. Vuelve el repo a privado (opcional)**
`Settings → Manage visibility → Make private`

**4. Sincroniza tu máquina local**
```bash
git pull origin master
```

---

### Archivos clave del sistema de control de acceso

| Archivo | Propósito |
|---|---|
| `.github/CODEOWNERS` | Declara a `@vicenteviajes` como revisor requerido en todos los PR |
| `.github/GUIA_INTEGRADOR_EXTERNO.md` | Instrucciones para el dev externo |
| Rama `integracion/motores-externos` | Rama de trabajo del dev externo |

