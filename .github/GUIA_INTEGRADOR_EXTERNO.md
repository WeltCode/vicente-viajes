# Guía para el integrador externo — Vicente Viajes

## Acceso y flujo de trabajo

1. Solicita que te añadan como **Outside Collaborator** en el repositorio `vicenteviajes/vicenteviajes-web`.
2. Clona el repositorio y cambia a la rama de trabajo:
   ```bash
   git clone https://github.com/vicenteviajes/vicenteviajes-web.git
   cd vicente-viajes
   git checkout integracion/motores-externos
   ```
3. Realiza tus cambios **únicamente** en los archivos y zonas indicadas abajo.
4. Abre un **Pull Request** de `integracion/motores-externos` → `master` cuando termines. El propietario revisará y aprobará.

---

## Zonas de integración permitidas

### Motor de hoteles
**Archivo:** `frontend/src/pages/Hoteles.jsx`  
**Div de montaje:**
```jsx
<div
  id="hotel-search-root"
  data-integration="external-hotel-engine"
  ...
>
  {/* ← Tu integración va aquí */}
</div>
```

### Motor de vuelos
**Archivo:** `frontend/src/pages/Vuelos.jsx`  
**Div de montaje:**
```jsx
<div
  id="flight-search-root"
  data-integration="external-flight-engine"
  ...
>
  {/* ← Tu integración va aquí */}
</div>
```

---

## Restricciones importantes

- **No modificar** ningún otro archivo fuera de los dos indicados.
- **No modificar** el Navbar, Footer, `PageHeader`, `PageSeo`, ni ningún componente compartido.
- Cualquier dependencia npm adicional debe coordinarse con el propietario antes de instalarla.
- Todos los cambios pasan por revisión obligatoria antes de publicarse en producción.
