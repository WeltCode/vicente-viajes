## Vicente Viajes - Estado Actual del Proyecto

Aplicacion full stack para mostrar y administrar contenido turistico (excursiones, playas, ofertas), recibir mensajes de contacto y ejecutar busquedas de vuelos contra un motor externo.

## Stack Tecnologico

- Backend: Django + Django REST Framework + Token Auth
- Frontend: React + Vite + React Router + Tailwind CSS + Framer Motion
- Base de datos: SQLite (desarrollo)
- Integracion externa: motor de vuelos por POST (QueryBridge)

## Estructura General

- backend/: API REST, autenticacion y logica de negocio
- frontend/: web publica, panel admin y buscador de vuelos
- netlify.toml / _redirects: soporte de despliegue frontend

## Modulos Backend

- excursiones: CRUD de excursiones + endpoint de login por token
- playas: CRUD de playas
- ofertas: CRUD de ofertas + reordenamiento drag and drop
- contacto: recepcion de formulario y envio de correo SMTP

## Rutas API Principales

Base: `http://localhost:8000/api/`

- POST `login/` -> devuelve token para admin
- GET/POST `excursiones/`
- GET/PUT/DELETE `excursiones/<id>/`
- GET/POST `playas/`
- GET/PUT/DELETE `playas/<id>/`
- GET/POST `ofertas/`
- GET/PUT/DELETE `ofertas/<id>/`
- POST `ofertas/reorder/` -> persiste nuevo orden visual
- POST `contacto/enviar/` -> guarda mensaje y envia email

Notas de permisos:

- Lectura publica: usuarios anonimos solo ven registros activos en listados publicos.
- Escritura y acceso administrativo: requiere token o credenciales validas.

## Flujo de Autenticacion Admin

1. Frontend envia usuario/password a `POST /api/login/`.
2. Backend valida credenciales y responde `{ token }`.
3. Frontend guarda token en localStorage.
4. Axios agrega `Authorization: Token <token>` automaticamente.

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
