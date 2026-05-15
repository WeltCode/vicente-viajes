# Guía de integración — Motores externos de Vuelos y Hoteles

> **Vicente Viajes** · Repositorio: [vicenteviajes/vicenteviajes-web](https://github.com/vicenteviajes/vicenteviajes-web)

---

## ¿Cuál es tu rol?

Eres el responsable de implementar los motores externos de búsqueda de **vuelos** y **hoteles** dentro del sitio web de Vicente Viajes.

El equipo de Vicente Viajes ya ha preparado exactamente el espacio donde debe ir cada motor. **Tu trabajo consiste únicamente en colocar tu integración dentro de esos dos contenedores reservados.** El resto del sitio (diseño, navegación, estructura) no debe modificarse.

---

## Visión general — qué puedes y no puedes tocar

```
vicenteviajes.com
│
├── /hoteles                          ← página de hoteles
│   ├── Navbar                        ✗ NO TOCAR
│   ├── Cabecera de página            ✗ NO TOCAR
│   ├── ┌─────────────────────────┐
│   │   │  id="hotel-search-root" │   ✅ AQUÍ VA TU MOTOR DE HOTELES
│   │   └─────────────────────────┘
│   └── Footer                        ✗ NO TOCAR
│
└── /vuelos                           ← página de vuelos
    ├── Navbar                        ✗ NO TOCAR
    ├── Cabecera de página            ✗ NO TOCAR
    ├── ┌──────────────────────────┐
    │   │ id="flight-search-root"  │   ✅ AQUÍ VA TU MOTOR DE VUELOS
    │   └──────────────────────────┘
    └── Footer                        ✗ NO TOCAR
```

---

## Archivos que puedes modificar (solo estos dos)

| Archivo | Página | ID del contenedor |
|---|---|---|
| `frontend/src/pages/Hoteles.jsx` | `/hoteles` | `hotel-search-root` |
| `frontend/src/pages/Vuelos.jsx` | `/vuelos` | `flight-search-root` |

Cualquier otro archivo del repositorio está **fuera de tu alcance** y será rechazado en la revisión.

---

## Configuración inicial

### 1. Clona el repositorio y cambia a la rama de trabajo

```bash
git clone https://github.com/vicenteviajes/vicenteviajes-web.git
cd vicenteviajes-web
git checkout integracion/motores-externos
```

> ⚠️ Trabaja **siempre** en la rama `integracion/motores-externos`, nunca en `master`.

### 2. Instala las dependencias del frontend

```bash
cd frontend
npm install
npm run dev
```

El sitio arranca en `http://localhost:5173`. Navega a `/hoteles` o `/vuelos` para ver el área de integración.

---

## Dónde exactamente va tu código

### Motor de hoteles — `frontend/src/pages/Hoteles.jsx`

Localiza este bloque en el archivo:

```jsx
<div
  id="hotel-search-root"
  data-integration="external-hotel-engine"
  className="relative overflow-hidden rounded-2xl ..."
>
  {/* 
    ════════════════════════════════════════
    ✅  TU INTEGRACIÓN VA AQUÍ DENTRO
        Puedes sustituir el contenido de
        este div por tu widget, iframe,
        script o componente React.
    ════════════════════════════════════════
  */}
</div>
```

### Motor de vuelos — `frontend/src/pages/Vuelos.jsx`

Localiza este bloque en el archivo:

```jsx
<div
  id="flight-search-root"
  data-integration="external-flight-engine"
  className="relative overflow-hidden rounded-2xl ..."
>
  {/* 
    ════════════════════════════════════════
    ✅  TU INTEGRACIÓN VA AQUÍ DENTRO
        Puedes sustituir el contenido de
        este div por tu widget, iframe,
        script o componente React.
    ════════════════════════════════════════
  */}
</div>
```

---

## Reglas de integración

| ✅ Permitido | ✗ No permitido |
|---|---|
| Modificar el contenido de `hotel-search-root` | Modificar Navbar, Footer o cualquier componente compartido |
| Modificar el contenido de `flight-search-root` | Cambiar estilos globales (`index.css`, `tailwind.config.js`) |
| Añadir imports en `Hoteles.jsx` o `Vuelos.jsx` | Tocar archivos de configuración (`vite.config`, `package.json`, etc.) |
| Usar iframes, widgets o componentes React propios | Modificar rutas, contextos o servicios existentes |
| Añadir dependencias npm **previa consulta** | Subir código directamente a `master` |

---

## Cómo entregar tu trabajo

El flujo es simple: trabajas en tu rama y abres un Pull Request. El propietario lo revisa antes de publicarlo en producción.

```
Tu rama local                GitHub                        Producción
──────────────               ──────────────────────────    ──────────
integracion/                 Pull Request                  master
motores-externos  ─── push ─→ (revisión del propietario) ─→ (merge si OK)
```

### Pasos concretos

```bash
# 1. Guarda tus cambios
git add frontend/src/pages/Hoteles.jsx
git add frontend/src/pages/Vuelos.jsx

# 2. Crea un commit descriptivo
git commit -m "feat: integrate hotel and flight search engines"

# 3. Sube tu rama
git push origin integracion/motores-externos
```

Luego ve a `https://github.com/vicenteviajes/vicenteviajes-web` y verás el botón **"Compare & pull request"**. Abre el PR hacia `master` y el propietario recibirá la notificación automáticamente.

> El PR será **rechazado automáticamente** si incluye cambios en archivos fuera de `Hoteles.jsx` y `Vuelos.jsx`.

---

## ¿Dudas o necesitas coordinar algo?

Contacta al propietario del repositorio antes de:
- Añadir cualquier dependencia npm nueva
- Necesitar cambios en la estructura del contenedor
- Tener problemas con CORS u otras restricciones del backend
