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
- [Cloudinary — gestión de imágenes](#cloudinary--gestión-de-imágenes)
- [Variables de entorno](#variables-de-entorno)
- [Instalación en desarrollo](#instalación-en-desarrollo)
- [Despliegue en producción](#despliegue-en-producción)

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
| Python + Django 5 | Framework web |
| Django REST Framework | API REST |
| Token Authentication | Autenticación admin (expiry 8 h) |
| Cloudinary + django-cloudinary-storage | Almacenamiento de imágenes |
| Anthropic Claude Opus 4.5 | OCR e extracción de datos con IA |
| Resend (opcional) | Envío de emails de contacto |
| PostgreSQL / SQLite | Base de datos (prod / dev) |
| Gunicorn | Servidor WSGI en producción |

### Infraestructura
| Servicio | Rol |
|---|---|
| Netlify | Hosting del frontend estático |
| Render | Hosting del backend Django |
| Cloudinary | CDN de imágenes |

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (Netlify)                                              │
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
    PostgreSQL (Render)    Cloudinary CDN
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
│   │   └── gallery.py          # Vista galería Cloudinary para admin
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

Campos destacados: `title`, `slug`, `description`, `image` (Cloudinary), `location`, `price`, `departure_date`, `return_date`, `month`, `itinerary` (JSON), `includes`, `not_includes`, `is_featured`, `is_active`, `seo_title`, `seo_description`.

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
- Subida de imágenes directa a Cloudinary con drag & drop o selección desde galería.
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

## Cloudinary — gestión de imágenes

Todas las imágenes se almacenan en Cloudinary bajo la carpeta `Vicente Viajes/`:
- `Vicente Viajes/excursiones/`
- `Vicente Viajes/playas/`
- `Vicente Viajes/ofertas/`
- `Vicente Viajes/estados/`

La galería del admin está disponible en `/admin/gallery/` y permite seleccionar imágenes ya subidas sin volver a cargarlas.

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

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

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
#    DJANGO_SECRET_KEY, CLOUDINARY_*, ANTHROPIC_API_KEY

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

### Frontend → Netlify
El archivo `netlify.toml` incluye build command, headers de seguridad (HSTS, CSP, X-Frame-Options) y redirect SPA. Solo hay que conectar el repositorio en Netlify y configurar la variable de entorno `VITE_API_URL`.

### Backend → Render
1. Crear un Web Service en Render apuntando a la carpeta `backend/`.
2. Start command: `gunicorn backend.wsgi:application`
3. Configurar todas las variables de entorno del listado anterior.
4. Crear un PostgreSQL en Render y añadir su URL a `DATABASE_URL`.

### Cloudinary
Las credenciales de Cloudinary son compartidas entre entornos. Usar una cuenta separada para desarrollo si se quiere aislar los assets.

