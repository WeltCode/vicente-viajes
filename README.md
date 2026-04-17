# 🌴 Vicente Viajes - Plataforma de Turismo Full Stack

**Plataforma completa de gestión y promoción de actividades turísticas, excursiones, playas y ofertas especiales con sistemas de reserva, administración y contacto.**

---

## 📋 Tabla de Contenidos
- [Visión General](#-visión-general)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Ramas y Despliegue](#-ramas-y-despliegue)
- [Módulos del Backend](#-módulos-del-backend)
- [API REST](#-api-rest)
- [Instalación y Setup](#-instalación-y-setup)
- [Estructura de Carpetas](#-estructura-de-carpetas)

---

## 🎯 Visión General

Vicente Viajes es una **aplicación turística full-stack** que permite:

✅ **Usuarios públicos:**
- Explorar excursiones disponibles
- Ver playas y destinos
- Consultar ofertas especiales
- Buscar y reservar vuelos (integración externa)
- Enviar mensajes de contacto

<<<<<<< HEAD
✅ **Administradores:**
- Panel CRUD completo de contenido
- Gestión de estados de excursiones
- Reordenamiento de ofertas (drag & drop)
- Visualización de mensajes de contacto
- Autenticación tokenizada

## Integración Cloudinary

El proyecto incluye integración completa con Cloudinary para gestión de imágenes:

### Configuración
1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Obtener credenciales: Cloud Name, API Key, API Secret
3. Configurar variables de entorno en `.env`:
  ```
  CLOUDINARY_CLOUD_NAME=tu_cloud_name
  CLOUDINARY_API_KEY=tu_api_key
  CLOUDINARY_API_SECRET=tu_api_secret
  ```

### Funcionalidades
- **Widget de subida**: Formularios admin con widget Cloudinary para subir imágenes directamente
- **Organización automática**: Imágenes se guardan en carpetas específicas (excursiones/, playas/, ofertas/, estados/)
- **Optimización**: Transformaciones automáticas (redimensionamiento, compresión, formato webp)
- **Galería admin**: Vista `/admin/gallery/` para ver todas las imágenes organizadas por tipo
- **Vista previa**: Miniaturas en el admin con enlaces directos a edición

### Modelos con imágenes
- `Excursion.image`: CloudinaryField(folder='excursiones')
- `Playa.image`: CloudinaryField(folder='playas')
- `Oferta.image`: CloudinaryField(folder='ofertas')
- `Estado.image`: CloudinaryField(folder='estados')

### Testing
Ejecutar `python test_cloudinary.py` para verificar configuración y crear carpetas automáticamente.

## Rutas API Principales

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENTE (Frontend)                         │
│  React + Vite + TypeScript + Tailwind CSS + Framer Motion    │
│  ├─ Web Pública (viajes, playas, ofertas)                   │
│  ├─ Panel Administrativo                                     │
│  └─ Buscador de Vuelos (QueryBridge)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              API REST (Backend - Django)                     │
│  Django + Django REST Framework + Token Authentication       │
│  ├─ /api/excursiones/      (Tours, actividades)            │
│  ├─ /api/playas/           (Playas y destinos)             │
│  ├─ /api/ofertas/          (Ofertas especiales)            │
│  ├─ /api/estados/          (Estados de excursiones)        │
│  ├─ /api/contacto/         (Mensajes de contacto)          │
│  └─ /api/users/            (Autenticación)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           BASE DE DATOS (PostgreSQL - Render)                │
│  • Excursiones y tours disponibles                           │
│  • Playas y destinos turísticos                              │
│  • Ofertas y promociones                                     │
│  • Estados de disponibilidad                                 │
│  • Usuarios y perfiles                                       │
│  • Mensajes de contacto                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Backend
| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Django | 6.0+ |
| API REST | Django REST Framework | Latest |
| Autenticación | Token Authentication | Built-in |
| BD | PostgreSQL | 15+ |
| Email | SMTP (Gmail) | Native |
| Almacenamiento | Cloudinary | (Próximo) |

### Frontend
| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | React | 18+ |
| Build Tool | Vite | Latest |
| Lenguaje | TypeScript/JavaScript | Latest |
| UI Framework | Tailwind CSS | 3+ |
| Animaciones | Framer Motion | 10+ |
| Routing | React Router v6 | Latest |
| HTTP Client | Axios | Latest |

### DevOps & Deployment
| Servicio | Función |
|---------|---------|
| **Render** | Backend (Django) + PostgreSQL |
| **Netlify** | Frontend staging & producción |
| **GitHub** | Control de versiones |
| **Cloudinary** | CDN de imágenes (próximo) |

---

## 🌿 Ramas y Despliegue

### Estrategia de Ramas (Git Flow)

```
                    ┌─────── staging-nouvicenteviajes.netlify.app
                    │        (Rama: develop)
    github.com      │        Backend: SQLite / Staging
                    │        DEBUG=True
                    │
                ┌───┴────────────────────────────────────┐
                │                                        │
    DEVELOP ────┼─── Testing y Staging                   │
    MASTER ─────┼─── Producción                          │
                │                                        │
                ├─────── nouvicenteviajes.netlify.app
                │        (Rama: master)
                │        Backend: PostgreSQL / Render
                │        DEBUG=False
                │
                └─────── Render Backend API
                         https://api-vicenteviajes.render.com
```

### Configuración por Rama

| Rama | Entorno | BD | DEBUG | Frontend | Backend |
|------|---------|-----|-------|---------|---------|
| **develop** | Staging | SQLite (local) | True | `staging-nouvicenteviajes.netlify.app` | `.env.staging` |
| **master** | Producción | PostgreSQL (Render) | False | `nouvicenteviajes.netlify.app` | `.env.production` |

### Flujo de Deploy

```
1. Desarrollo en rama develop
   ↓
2. git push origin develop
   ↓
3. Netlify construye → staging-nouvicenteviajes.netlify.app
   ↓
4. Pruebas en staging
   ↓
5. git merge develop → master / git push origin master
   ↓
6. Netlify construye → nouvicenteviajes.netlify.app
   ↓
7. Render actualiza backend automáticamente
```

---

## 📦 Módulos del Backend

### 1. **Excursiones** (`/api/excursiones/`)
Gestión de tours y actividades turísticas.

**Campos:**
- `title` - Nombre del tour
- `description` - Descripción detallada
- `price` - Precio en USD
- `departure_date` - Fecha de salida
- `group_size` - Tamaño del grupo
- `duration` - Duración (horas)
- `slug` - URL amigable
- `image` - Imagen principal

**Endpoints:**
```
GET    /api/excursiones/           → Lista de tours activos
POST   /api/excursiones/           → Crear tour (admin)
GET    /api/excursiones/{id}/      → Detalles
PUT    /api/excursiones/{id}/      → Actualizar (admin)
DELETE /api/excursiones/{id}/      → Eliminar (admin)
```

---

### 2. **Playas** (`/api/playas/`)
Catálogo de playas y destinos.

**Campos:**
- `name` - Nombre de la playa
- `description` - Descripción
- `location` - Ubicación geográfica
- `characteristics` - Array de características
- `image` - Foto de la playa
- `slug` - URL amigable

**Endpoints:**
```
GET    /api/playas/                → Lista de playas
POST   /api/playas/                → Crear playa (admin)
GET    /api/playas/{id}/           → Detalles
PUT    /api/playas/{id}/           → Actualizar (admin)
DELETE /api/playas/{id}/           → Eliminar (admin)
```

---

### 3. **Ofertas** (`/api/ofertas/`)
Promociones y ofertas especiales con reordenamiento visual.

**Campos:**
- `title` - Título de la oferta
- `description` - Descripción
- `discount_percentage` - % de descuento
- `display_order` - Orden de visualización (drag & drop)
- `image` - Imagen de la oferta
- `is_active` - Activo/Inactivo

**Endpoints:**
```
GET    /api/ofertas/                → Lista de ofertas
POST   /api/ofertas/                → Crear oferta (admin)
PUT    /api/ofertas/{id}/           → Actualizar (admin)
DELETE /api/ofertas/{id}/           → Eliminar (admin)
POST   /api/ofertas/reorder/        → Reordenar (admin)
```

**Reordenamiento (Drag & Drop):**
```json
POST /api/ofertas/reorder/
{
  "order": [3, 1, 2, 5, 4]  // IDs en nuevo orden
}
```

---

### 4. **Estados** (`/api/estados/`)
Estados o regiones disponibles con excursiones asociadas.

**Campos:**
- `name` - Nombre del estado
- `description` - Descripción
- `image` - Imagen representativa
- `subtitle` - Subtítulo
- `excursion_date` - Fecha de la excursión
- `is_active` - Activo/Inactivo

**Lógica especial:**
- Auto-desactiva Estados cuya fecha ha pasado (middleware)
- Limpieza automática de datos vencidos

---

### 5. **Contacto** (`/api/contacto/`)
Sistema de mensajes de contacto con envío de email.

**Campos:**
- `name` - Nombre del remitente
- `email` - Email de contacto
- `message` - Mensaje
- `created_at` - Timestamp

**Endpoints:**
```
POST   /api/contacto/enviar/       → Enviar mensaje
GET    /api/contacto/mensajes/     → Listar (admin)
```

**Funcionalidades:**
- ✅ Validación de email
- ✅ Envío automático SMTP a `info@vicenteviajes.com`
- ✅ Almacenamiento en BD
- ✅ Notificación al admin

---

### 6. **Usuarios** (`/usuarios/`, `/api/login/`)
Autenticación y gestión de perfiles.

**Campos de User:**
- `username` - Usuario único
- `email` - Email
- `password` - Hash bcrypt
- `is_staff` - Es administrador
- `is_active` - Activo/Inactivo

**Endpoints:**
```
POST   /api/login/                 → Autenticación (devuelve token)
GET    /api/users/profile/         → Perfil del usuario (auth)
PUT    /api/users/profile/         → Actualizar perfil (auth)
```

---

## 🔌 API REST - Referencia Completa

### Autenticación

```
POST /api/login/
{
  "username": "admin_user",
  "password": "secret_password"
}

Respuesta:
{
  "token": "abc123xyz789...",
  "user": {
    "id": 1,
    "username": "admin_user",
    "email": "admin@vicenteviajes.com"
  }
}
```

**Uso del Token:**
```javascript
// Axios configuración automática:
headers: {
  "Authorization": "Token abc123xyz789..."
}
```

---

### Headers Requeridos

| Acción | Header | Requerido |
|--------|--------|----------|
| Lectura pública | - | No |
| Escritura/Admin | `Authorization: Token <token>` | Sí |
| CORS | `Origin: https://nouvicenteviajes.netlify.app` | Automático |

---

### Códigos HTTP

| Código | Significado |
|--------|------------|
| `200` | OK - Exitoso |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Error de validación |
| `401` | Unauthorized - Falta autenticación |
| `403` | Forbidden - No autorizado |
| `404` | Not Found - Recurso no existe |
| `500` | Server Error - Error interno |

---

## 💾 Estructura de Carpetas

```
vicente-viajes/
│
├── 📁 backend/                    # API REST (Django)
│   ├── backend/
│   │   ├── settings.py           # Configuración (carga .env)
│   │   ├── urls.py               # Rutas principales
│   │   └── wsgi.py               # Aplicación WSGI
│   │
│   ├── excursiones/              # Módulo de Tours
│   │   ├── models.py             # Modelo Excursion
│   │   ├── serializers.py        # Serializadores DRF
│   │   ├── views.py              # ViewSets
│   │   ├── urls.py               # Rutas
│   │   └── migrations/           # Migraciones BD
│   │
│   ├── playas/                   # Módulo de Playas
│   ├── ofertas/                  # Módulo de Ofertas
│   ├── estados/                  # Módulo de Estados
│   ├── contacto/                 # Módulo de Contacto
│   │
│   ├── .env.production           # Secrets producción
│   ├── .env.staging              # Secrets staging
│   ├── manage.py                 # CLI Django
│   └── db.sqlite3                # BD local (staging)
│
├── 📁 frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── pages/                # Páginas
│   │   ├── admin/                # Panel administrativo
│   │   ├── services/             # API calls (axios)
│   │   ├── styles/               # CSS/Tailwind
│   │   └── App.jsx               # Componente raíz
│   │
│   ├── public/                   # Assets estáticos
│   ├── index.html                # HTML principal
│   └── package.json              # Dependencias
│
├── 📄 netlify.toml               # Configuración deploy
├── 📄 README.md                  # Este archivo
└── 📄 .gitignore                 # Archivos ignorados

```

---

## ⚙️ Instalación y Setup

### Requisitos Previos
- Python 3.10+
- Node.js 16+
- PostgreSQL 13+ (producción)
- Git

### Backend (Django)

```bash
# 1. Clonar repositorio
git clone https://github.com/WeltCode/vicente-viajes.git
cd vicente-viajes/backend

# 2. Crear entorno virtual
python -m venv .venv

# 3. Activar entorno (Windows)
.venv\Scripts\activate
# O (Mac/Linux)
source .venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar variables de entorno
cp .env.example .env.staging
# Editar .env.staging con tus credenciales

# 6. Ejecutar migraciones
python manage.py migrate

# 7. Crear superusuario
python manage.py createsuperuser
# username: admin
# email: info@vicenteviajes.com
# password: (tu contraseña)

# 8. Iniciar servidor
python manage.py runserver
# http://localhost:8000
```

### Frontend (React)

```bash
# 1. Ir a carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
echo "VITE_API_URL=http://localhost:8000" > .env

# 4. Iniciar servidor desarrollo
npm run dev
# http://localhost:5173
```

### Panel Administrativo

```
URL: http://localhost:8000/admin/
Usuario: admin
Contraseña: (la que creaste)
```

---

## 🔐 Variables de Entorno

### `.env.staging` (Desarrollo)
```env
DJANGO_SECRET_KEY=dev-key-unsafe
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=              # SQLite (vacío)
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173
EMAIL_HOST=                # Console output (desarrollo)
```

### `.env.production`
```env
DJANGO_SECRET_KEY=<tu-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=nouvicenteviajes.netlify.app,api.vicenteviajes.com
DATABASE_URL=postgresql://usuario:password@host:5432/db_vicenteviajes
DJANGO_CORS_ALLOWED_ORIGINS=https://nouvicenteviajes.netlify.app
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=info@vicenteviajes.com
EMAIL_HOST_PASSWORD=<app-password>
```

---

## 📧 Sistema de Contacto

El formulario de contacto envía emails automáticamente:

**Flujo:**
1. Usuario completa formulario en web
2. Frontend envía POST a `/api/contacto/enviar/`
3. Backend valida datos
4. Envía email SMTP a `info@vicenteviajes.com`
5. Guarda mensaje en BD para histórico

**Email plantilla:**
```
De: Usuario <usuario@email.com>
Para: info@vicenteviajes.com
Asunto: Nuevo mensaje de contacto
Cuerpo: [Mensaje del usuario]
```

---

## 🚀 Próximas Mejoras

- [ ] Integración Cloudinary para imágenes
- [ ] Sistema de reservas y pagos
- [ ] Notificaciones en tiempo real (WebSocket)
- [ ] Análisis y reportes
- [ ] App móvil (React Native)

---

## 📞 Soporte

Para reportes de bugs o sugerencias:
- **Email:** info@vicenteviajes.com
- **GitHub Issues:** [WeltCode/vicente-viajes](https://github.com/WeltCode/vicente-viajes/issues)

---

## 📄 Licencia

Proyecto propietario de Vicente Viajes. Todos los derechos reservados © 2026.

## Flujo del Buscador de Vuelos

Descripcion tecnica completa (inicio a fin):

1. El usuario completa el formulario en `frontend/src/components/FlightSearch.jsx`:
	- Origen y destino con autocompletado sobre `frontend/src/data/airports.json`.
	- Tipo de viaje: ida y vuelta o solo ida.
	- Fechas y pasajeros (adultos, ninos, bebes).

2. Al escribir en origen/destino:
	- `searchAirports(query)` en `frontend/src/services/flightBridge.js` normaliza texto (sin acentos, lowercase) y devuelve sugerencias rankeadas.
	- Si el usuario selecciona una sugerencia, se guarda el objeto aeropuerto completo (id IATA + ciudad + texto visible).

3. Al enviar el formulario (`handleSearch`):
	- Se validan reglas de negocio:
	  - origen valido
	  - destino valido
	  - origen != destino
	  - fecha de salida obligatoria
	  - si es ida/vuelta, fecha de regreso obligatoria
	  - fecha regreso >= fecha salida
	  - bebes <= adultos
	- Si falla una regla, no se navega y se muestra error local.

4. Resolucion final de aeropuertos:
	- `validateAndResolveAirport` prioriza aeropuerto seleccionado.
	- Si no hay seleccion, usa `resolveAirport(texto)` para intentar match exacto por IATA o valor completo.

5. Construccion del payload externo:
	- `buildFlightBridgePayload(...)` traduce datos UI a contrato QueryBridge.
	- `formatBridgeDate(YYYY-MM-DD)` -> `YYYYMMDD`.

6. Serializacion para ruta interna:
	- El payload JSON se codifica con `encodeFlightSearchPayload` (base64url).
	- Se navega a `frontend/src/pages/BuscarVuelos.jsx` via ruta `/buscar/:searchToken`.

7. Carga de pagina de resultados interna:
	- `BuscarVuelos` lee `searchToken` desde URL.
	- `decodeFlightSearchPayload` decodifica y parsea JSON.
	- Si token invalido/manipulado: estado `error` y mensaje al usuario.

8. Envio real al motor de vuelos:
	- `submitFlightBridge(payload, { target: IFRAME_NAME })` crea un `form` HTML oculto.
	- El formulario hace `POST` a `https://vuelos.vicenteviajes.com/wtc/vv/vuelos/QueryBridge.aspx`.
	- Se inyectan todos los campos como `input hidden`.
	- Se ejecuta `form.submit()` apuntando al `iframe` interno.

9. Render de resultados:
	- El motor externo responde dentro del `iframe` nombrado `vicente-flight-results-frame`.
	- Navbar y Footer del sitio permanecen visibles porque la pagina host es interna.

10. Fallback y navegacion auxiliar:
	- Boton "Abrir en pestana nueva": reusa `submitFlightBridge` con `target: _blank`.
	- Boton "Nueva busqueda": vuelve a `/` para reiniciar el flujo.

11. Consideraciones de seguridad/compatibilidad:
	- Si el proveedor externo impone bloqueo de iframe (cabeceras), el fallback funcional es "Abrir en pestana nueva".
	- No renombrar claves del payload (contrato externo fijo).

Campos enviados al motor externo:

- `startPt`, `endPt`, `startPtCode`, `endPtCode`
- `startDt`, `endDt`
- `flightType` (`1` ida y vuelta, `0` solo ida)
- `adults`, `children`, `infants`

Ejemplo de payload final enviado por POST:

```json
{
  "startPt": "Madrid",
  "endPt": "Punta Cana",
  "startPtCode": "MAD",
  "endPtCode": "PUJ",
  "startDt": "20260415",
  "endDt": "20260425",
  "flightType": "1",
  "adults": "2",
  "children": "1",
  "infants": "0"
}
```

## Variables de Entorno Backend

Archivo de referencia: `backend/.env.example`

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `DATABASE_URL`
- `DATABASE_CONN_MAX_AGE`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
- `EMAIL_USE_TLS`, `EMAIL_USE_SSL`, `EMAIL_TIMEOUT`
- `DEFAULT_FROM_EMAIL`
- `CONTACT_EMAIL_LOGO_URL`
- `CONTACT_RECIPIENT_EMAIL`

Comportamiento email:

- Si SMTP esta configurado, usa backend SMTP real.
- Si faltan credenciales, usa backend de consola para desarrollo.
- `CONTACT_EMAIL_LOGO_URL` permite mostrar un logo remoto en el correo HTML sin inflar el mensaje con base64.

Base de datos:

- Si `DATABASE_URL` esta vacia, Django usa `backend/db.sqlite3`.
- Si `DATABASE_URL` apunta a PostgreSQL, Django usa esa base para el entorno actual.

## Separacion de Entornos

Objetivo recomendado:

- `master` -> Produccion
- `develop` -> Staging
- Backend y frontend separados por entorno
- Base de datos separada por entorno

Configuracion sugerida:

- Backend produccion: servicio Render separado, rama `master`, `DATABASE_URL` de produccion.
- Backend staging: servicio Render separado, rama `develop`, `DATABASE_URL` de staging.
- Frontend produccion: despliegue separado que apunte al backend de produccion.
- Frontend staging: despliegue separado que apunte al backend de staging.

Variables clave para el frontend desplegado:

- `NETLIFY_API_PROXY_TARGET`: URL base del backend del entorno actual.
- `VITE_API_URL=/api`: mantiene al frontend consumiendo la API via proxy.

Flujo recomendado:

1. Desarrollar y probar en `develop` sobre staging.
2. Validar cambios en frontend y backend de staging.
3. Hacer merge de `develop` a `master` cuando el cambio este aprobado.
4. Desplegar `master` solo en produccion.

Regla importante:

- El merge mueve codigo, no datos. Los datos de produccion se conservan si produccion sigue apuntando a su propia base persistente.

## Buenas prácticas de entornos y datos

- **Producción** (`https://nouvicenteviajes.netlify.app/`): usa PostgreSQL (Render). Solo recibe código validado desde staging. Nunca se suben datos ni archivos desde staging/local.
- **Staging** (`https://staging-nouvicenteviajes.netlify.app/`): usa SQLite. Aquí se prueban cambios, subidas y ediciones de archivos y datos.
- **Localhost**: usa SQLite. Desarrollo y pruebas inmediatas.

### Cambio de entorno backend

- Para producción:
  ```powershell
  Copy-Item "backend/.env.production" "backend/.env" -Force
  ```
- Para staging/desarrollo:
  ```powershell
  Copy-Item "backend/.env.staging" "backend/.env" -Force
  ```

### Importante

- Nunca subas `db.sqlite3` ni la carpeta `media/` de staging/local a producción.
- Solo el código se sube a producción, no los datos.
- Si necesitas migrar datos, hazlo manualmente y con cuidado.

### Visual del flujo

```mermaid
flowchart TD
    Localhost -- push código --> Staging
    Staging -- push código validado --> Producción
    Staging -- pruebas, subidas, ediciones --> Staging
    Localhost -- pruebas, subidas, ediciones --> Localhost
    Producción -- solo código validado --> Producción
```

## Instalacion y Ejecucion Local

### 1) Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver
```

Backend por defecto en: `http://localhost:8000`

Si quieres probar PostgreSQL local o una base remota:

```bash
# ejemplo
DATABASE_URL=postgresql://usuario:password@host:5432/basedatos
python manage.py migrate
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend por defecto en: `http://localhost:5173`

## Panel Administrativo Frontend

Ruta: `/admin`

Secciones actuales:

- Dashboard
- Gestion de Excursiones
- Gestion de Playas
- Gestion de Ofertas (incluye drag and drop y persistencia de orden)

## Convenciones Importantes del Proyecto

- No cambiar nombres de campos del payload de vuelos: son contrato externo.
- `Oferta.discount` se recalcula en backend al guardar para evitar inconsistencias.
- `ofertas/reorder/` espera lista de objetos con `id` y `display_order`.
- El frontend usa tokens en localStorage para continuidad de sesion admin.

## Riesgos y Consideraciones

- Si el proveedor externo de vuelos bloquea iframe por cabeceras de seguridad, el boton "Abrir en pestana nueva" es el fallback.
- SQLite es valido para desarrollo; para produccion se recomienda PostgreSQL.
- Revisar `SECRET_KEY` y `DEBUG` antes de desplegar.

## Estado Funcional Actual

- CRUD completo de excursiones, playas y ofertas.
- Contacto funcional con persistencia y envio de correo.
- Busqueda de vuelos integrada con pagina interna `/buscar/:searchToken`.
- UI alineada al diseno general del sitio (navbar/footer/header visual consistente).
