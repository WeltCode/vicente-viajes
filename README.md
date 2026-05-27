# Vicente Viajes — Plataforma turística Full Stack

Aplicación web completa para la gestión y promoción de excursiones, playas, ofertas y destinos turísticos. Incluye panel de administración privado, extracción de datos con IA y soporte para integración de motores externos de vuelos y hoteles.

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
- [Cómo solicitar acceso al repositorio (dev externo)](#cómo-solicitar-acceso-al-repositorio-dev-externo--integración-hoteles-o-vuelos)

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
│                     /vuelos  /hoteles  /contacto  /nosotros     │
│  Panel admin:       /admin/login  /admin/excursiones  ...       │
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
Recibe mensajes del formulario público y los envía por email. Soporta dos proveedores configurables por variable de entorno:
- `CONTACT_EMAIL_PROVIDER=django` → SMTP estándar
- `CONTACT_EMAIL_PROVIDER=resend` → API de [Resend](https://resend.com)

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
| POST | `/api/contacto/` | Enviar mensaje de contacto |

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

Ambas páginas (`/vuelos` y `/hoteles`) están diseñadas como **contenedores de integración** — mantienen el diseño visual del sitio y exponen puntos de montaje para motores externos.

### `/vuelos` — Motor de búsqueda de vuelos

**Punto de montaje HTML:**
```html
<div
  id="flight-search-root"
  data-integration="external-flight-engine"
>
  <!-- El proveedor externo inyecta aquí su widget -->
</div>
```

**Motor actual:** el buscador propio de Vicente Viajes conecta con `QueryBridge.aspx` en `https://vuelos.vicenteviajes.com/wtc/vv/vuelos/`. La lógica se encuentra en `frontend/src/services/flightBridge.js` e incluye:
- Autocompletado de aeropuertos con base de datos local (`src/data/airports.json`).
- Normalización tolerante a acentos y mayúsculas.
- Generación de `searchToken` codificado en la URL para preservar la búsqueda al navegar a `/buscar/:searchToken`.

**Sustituir o añadir un proveedor alternativo:**

Opción A — widget de terceros con `<script>`:
```jsx
// En Vuelos.jsx, dentro del <div id="flight-search-root">
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://proveedor-vuelos.com/widget.js";
  script.dataset.container = "flight-search-root";
  script.dataset.apiKey = "TU_API_KEY";
  document.getElementById("flight-search-root").appendChild(script);
}, []);
```

Opción B — iframe del proveedor:
```jsx
// En Vuelos.jsx, sustituir el contenido de <div id="flight-search-root"> por:
<iframe
  src="https://proveedor-vuelos.com/embed?apiKey=TU_KEY"
  className="w-full min-h-[600px] rounded-2xl border-0"
  title="Buscador de vuelos"
  allow="payment"
/>
```

Opción C — componente React del proveedor:
```jsx
import { FlightSearchWidget } from "@proveedor/react-sdk";

// Dentro del contenedor:
<FlightSearchWidget
  apiKey={import.meta.env.VITE_FLIGHTS_API_KEY}
  locale="es"
  currency="EUR"
  onBooking={(booking) => console.log(booking)}
/>
```

> La variable de entorno se añade en `frontend/.env.local`: `VITE_FLIGHTS_API_KEY=tu_clave`

---

### `/hoteles` — Motor de búsqueda de hoteles

**Punto de montaje HTML:**
```html
<div
  id="hotel-search-root"
  data-integration="external-hotel-engine"
>
  <!-- El proveedor externo inyecta aquí su widget -->
</div>
```

El patrón de integración es idéntico al de vuelos. Ejemplos con proveedores comunes:

**Booking.com Affiliate:**
```jsx
<iframe
  src="https://www.booking.com/searchresults.es.html?aid=TU_AFFILIATE_ID&label=search"
  className="w-full min-h-[700px] rounded-2xl border-0"
  title="Buscador de hoteles"
/>
```

**Hotelbeds / Amadeus:**
```jsx
import { HotelSearch } from "@amadeus-it-group/hotel-widget";

<HotelSearch
  clientId={import.meta.env.VITE_AMADEUS_CLIENT_ID}
  language="es"
  currency="EUR"
/>
```

**Nota de seguridad:** nunca expongas claves secretas de API en el frontend. Usa claves públicas/client-side del proveedor, o crea un endpoint proxy en el backend Django.

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

# Sesión admin (segundos, por defecto 28800 = 8 horas)
ADMIN_TOKEN_MAX_AGE_SECONDS=28800
```

Variables del frontend en `frontend/.env.local`:
```env
VITE_API_URL=https://tu-backend.onrender.com/api
VITE_FLIGHTS_API_KEY=...   # Opcional, para motor de vuelos externo
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

Las páginas `/hoteles` y `/vuelos` son **contenedores de integración cerrados**: tienen el Navbar, Footer y estilos de Vicente Viajes ya montados. El proveedor externo **solo toca el bloque interior** delimitado por su `id`, sin acceso al resto del código.

### Puntos de montaje disponibles

| Página | ID del contenedor | Atributo de integración |
|--------|-------------------|------------------------|
| `/hoteles` | `hotel-search-root` | `data-integration="external-hotel-engine"` |
| `/vuelos` | `flight-search-root` | `data-integration="external-flight-engine"` |

El proveedor puede inyectar su widget de tres formas (ver ejemplos completos en [Integración de vuelos y hoteles](#integración-de-vuelos-y-hoteles)):
- **Opción A** — `<script>` externo montado con `useEffect`
- **Opción B** — `<iframe>` apuntando al motor del proveedor
- **Opción C** — Componente React del SDK del proveedor

La variable de entorno del proveedor se añade en `frontend/.env.local`:
```env
VITE_FLIGHTS_API_KEY=tu_clave_publica
VITE_HOTELS_API_KEY=tu_clave_publica
```

> **Regla de oro:** Solo se editan los archivos `frontend/src/pages/Vuelos.jsx` y/o `frontend/src/pages/Hoteles.jsx`. Cualquier otra modificación queda fuera del alcance del proveedor.

---

## Cómo solicitar acceso al repositorio (dev externo — integración `/hoteles` o `/vuelos`)

> Esta sección está dirigida a **desarrolladores de terceros** que quieren integrar su motor de búsqueda en Vicente Viajes.

### Paso 1 — Contactar con el equipo

Envía un correo a **info@vicenteviajes.com** o escribe por WhatsApp al número de Vicente Barahona con el asunto:

```
[Integración Web] Solicitud de acceso – /hoteles o /vuelos
```

Incluye en el mensaje:
- Nombre completo y empresa
- Servicio a integrar (hoteles / vuelos / ambos)
- Nombre de usuario de GitHub con el que quieres acceder
- Breve descripción técnica de cómo funciona tu widget (iframe, script, SDK React, etc.)

### Paso 2 — Acceso de colaborador en GitHub

El equipo de WeltBrave añadirá tu usuario de GitHub al repositorio [WeltCode/vicente-viajes](https://github.com/WeltCode/vicente-viajes) con el rol **Collaborator** de solo escritura en la rama designada.

Se te creará una rama dedicada:
```
integration/hoteles-<tu-empresa>
integration/vuelos-<tu-empresa>
```

Solo tendrás permisos de push sobre esa rama. **No se concede acceso a `master` ni a ninguna otra rama.**

### Paso 3 — Archivos que puedes modificar

Con el acceso concedido, tus cambios deben limitarse estrictamente a:

```
frontend/src/pages/Hoteles.jsx    ← si integras hoteles
frontend/src/pages/Vuelos.jsx     ← si integras vuelos
frontend/.env.local               ← añadir tu VITE_*_API_KEY (no se sube a git)
```

Cualquier cambio fuera de estos archivos será rechazado en la Pull Request.

### Paso 4 — Pull Request y revisión

Una vez lista tu integración:

1. Abre una **Pull Request** desde tu rama `integration/...` hacia `master`.
2. Describe qué motor has integrado y cómo probarlo localmente.
3. El equipo de WeltBrave revisará que no rompa el diseño ni el resto de la web.
4. Si todo está correcto, se aprueba y fusiona.

### Paso 5 — Despliegue

El merge a `master` dispara automáticamente el despliegue en Netlify. El proveedor recibirá confirmación cuando la integración esté en producción.

---

### Preguntas frecuentes para el proveedor externo

**¿Puedo ver el código antes de que me den acceso?**
No. El repositorio es privado. Se facilita esta documentación y, si es necesario, una demo en entorno de staging.

**¿Qué versión de React/Node necesito?**
React 19, Node.js 20+. Ver el `package.json` del frontend para dependencias exactas una vez tengas acceso.

**¿Cómo pruebo localmente?**
```bash
git clone https://github.com/WeltCode/vicente-viajes.git
cd frontend
npm install
# Crea frontend/.env.local con VITE_API_URL y tu VITE_*_API_KEY
npm run dev
# Abre http://localhost:5173/hoteles o /vuelos
```

**¿Hay entorno de staging?**
Consulta con WeltBrave. Se puede montar un preview en Netlify para validar antes de ir a producción.

**¿Qué pasa si mi widget necesita un proxy backend?**
Contacta con WeltBrave para valorar añadir un endpoint proxy en Django que no exponga tu clave secreta en el frontend.

---

## Gestión de acceso para integradores externos (uso interno — WeltCode)

> Esta sección es para el dev principal (`WeltCode`). Documenta el flujo acordado para dar acceso temporal a desarrolladores externos.

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

