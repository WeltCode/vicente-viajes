# 🌴 Vicente Viajes - Plataforma de Agencia de Turismo

Una plataforma digital moderna para la gestión y promoción de excursiones y tours turísticos. Combina un portal informativo atractivo con un catálogo completo de experiencias.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Setup e Instalación](#setup-e-instalación)
- [Cómo Correr el Proyecto](#cómo-correr-el-proyecto)
- [API Endpoints](#api-endpoints)
- [Estructura de Base de Datos](#estructura-de-base-de-datos)
- [Notas Importantes](#notas-importantes)

---

## 🎯 Descripción General

**Vicente Viajes** es una aplicación full-stack que permite:

- 📍 **Catálogo de Excursiones**: Visualizar tours con detalles, precios, itinerarios y disponibilidad
- 🏠 **Portal de Marketing**: Página de inicio con destinos destacados, testimonios y razones para elegir
- 💬 **Contacto Directo**: Integración con WhatsApp para consultas inmediatas
- 🎨 **Interfaz Moderna**: Diseño responsivo y atractivo con animaciones

**Stack:**
- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Django 5.1 + Django REST Framework
- **Base de Datos**: SQLite3
- **Deploy**: Netlify (frontend)

---

## 🛠️ Tecnologías

### Frontend
```json
{
  "React": "19.2.3",
  "Vite": "6.0.9",
  "TailwindCSS": "3.4.1",
  "React Router": "7.0.0",
  "Framer Motion": "última",
  "Axios": "1.4.0",
  "Lucide React": "iconografía"
}
```

### Backend
```python
Django==5.1.7
djangorestframework==3.14.0
# Pendiente: django-cors-headers, python-decouple
```

---

## 📁 Estructura del Proyecto

```
vicente-viajes/
├── frontend/                  # Aplicación React con Vite
│   ├── src/
│   │   ├── pages/            # Componentes de páginas principales
│   │   │   ├── Home.jsx
│   │   │   ├── Excursiones.jsx
│   │   │   └── Playas.jsx
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── excursions/   # Componentes específicos de excursiones
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── sections/     # Secciones de páginas
│   │   │   └── ui/
│   │   ├── routes/           # Configuración de rutas
│   │   ├── services/         # Servicios API
│   │   ├── context/          # Context API global
│   │   ├── hooks/            # Hooks personalizados
│   │   └── styles/           # Estilos globales
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                  # Aplicación Django
│   ├── backend/             # Configuración principal
│   │   ├── settings.py      # Configuración de Django
│   │   ├── urls.py          # Rutas principales
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── excursiones/         # App principal de Django
│   │   ├── models.py        # Modelo Excursion
│   │   ├── views.py         # ViewSets API
│   │   ├── serializers.py   # Serialización JSON
│   │   ├── urls.py          # Rutas de la app
│   │   ├── admin.py         # Panel administrativo
│   │   └── migrations/
│   │
│   ├── manage.py
│   └── db.sqlite3           # Base de datos
│
└── netlify.toml             # Configuración de deploy en Netlify
```

---

## 🚀 Setup e Instalación

### Requisitos Previos
- Python 3.9+
- Node.js 18+
- Git

### 1. Clonar el Repositorio
```bash
git clone <tu-repo>
cd vicente-viajes
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt  # Si existe
# O instalar manualmente:
pip install django djangorestframework django-cors-headers python-decouple

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (opcional, para admin)
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
# El backend estará en http://localhost:8000
```

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
# El frontend estará en http://localhost:5173
```

---

## 🎮 Cómo Correr el Proyecto

### Desarrollo Local

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate  # En Windows: venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Accede a `http://localhost:5173` en tu navegador.

### Build para Producción

**Frontend:**
```bash
cd frontend
npm run build  # Genera carpeta dist/
```

**Backend:**
```bash
# Recolectar archivos estáticos
python manage.py collectstatic
```

---

## 📡 API Endpoints

### Excursiones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/excursiones/` | Lista todas las excursiones |
| `GET` | `/api/excursiones/<id>/` | Detalle de una excursión |
| `POST` | `/api/excursiones/` | Crear excursión (requiere permisos) |
| `PUT` | `/api/excursiones/<id>/` | Actualizar excursión |
| `DELETE` | `/api/excursiones/<id>/` | Eliminar excursión |

Además del catálogo público, se ha añadido una pequeña interfaz de administración accesible
desde el frontend en `http://localhost:5173/admin`. El usuario por defecto es
`dedsec` con contraseña `dedsec` y puede crear/editar/eliminar tanto excursiones como playas.
Nota: al iniciar el servidor Django se crean automáticamente entradas de ejemplo para
la tabla de excursiones y playas, y se configura un token de autenticación para el usuario.

**Ejemplo de Respuesta:**
```json
{
  "id": 1,
  "titulo": "Tour por las Playas del Caribe",
  "slug": "tour-playas-caribe",
  "descripcion_corta": "Disfruta de las mejores playas",
  "descripcion_completa": "...",
  "ubicacion": "Cancún, México",
  "duracion": "3 días",
  "precio": 299.99,
  "moneda": "USD",
  "imagen_url": "...",
  "es_destacada": true,
  "created_at": "2026-03-10T10:00:00Z"
}
```

---

## 🗄️ Estructura de Base de Datos

### Modelo: Excursion

```python
class Excursion:
    - titulo (CharField, 200)
    - slug (SlugField, único)
    - descripcion_corta (TextField)
    - descripcion_completa (TextField)
    - ubicacion (CharField, 255)
    - duracion (CharField, 50)  # Ej: "3 días"
    - precio (DecimalField)
    - moneda (CharField)
    - imagen_url (URLField)
    - que_incluye (TextField)  # Items separados por líneas
    - que_no_incluye (TextField)
    - es_destacada (BooleanField, default=False)
    - is_active (BooleanField, default=True)
    - seo_title (CharField)
    - seo_description (TextField)
    - created_at (DateTimeField, auto_now_add=True)
    - updated_at (DateTimeField, auto_now=True)
```

---

## ⚠️ Notas Importantes

### Problemas Conocidos / TODO

- [ ] **CORS no configurado**: Instalar y configurar `django-cors-headers`
  ```python
  # En settings.py
  INSTALLED_APPS += ['corsheaders']
  MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')
  CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "https://tudominio.com"]
  ```

- [ ] **DEBUG = True**: Cambiar a `False` en producción
  ```python
  DEBUG = os.getenv('DEBUG', 'False') == 'True'
  ```

- [ ] **SECRET_KEY expuesta**: Usar variables de entorno
  ```bash
  # Crear .env
  SECRET_KEY=tu-clave-secreta-aqui
  DEBUG=False
  ```

- [ ] **Frontend sin integración API**: Las excursiones están hardcodeadas
  - Implementar llamadas a `/api/excursiones/`
  - Usar axios en `services/api.js`

- [ ] **ALLOWED_HOSTS vacío**: Configurar para producción
  ```python
  ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
  ```

### Variables de Entorno Necesarias

Crear archivo `.env` en la raíz de `backend/`:
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,tudominio.com
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://tudominio.com
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 📚 Recursos Útiles

- [Documentación Django](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

---

## 👥 Colaboración

1. **Crear rama**: `git checkout -b feature/nueva-funcionalidad`
2. **Hacer cambios** y commitear: `git commit -m "Descripción clara"`
3. **Push**: `git push origin feature/nueva-funcionalidad`
4. **Pull Request**: Describir cambios claramente

---

## 📝 Licencia

Especificar según corresponda

---

**Última actualización**: Marzo 2026
**Mantenedor**: [Tu nombre o equipo]
