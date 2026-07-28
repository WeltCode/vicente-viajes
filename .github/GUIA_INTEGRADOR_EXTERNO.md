# Guía de integración — Motores externos de Vuelos y Hoteles

> **Vicente Viajes** · Integración con **Conecta Turismo**

---

> ⚠️ **ESTE DOCUMENTO SUSTITUYE POR COMPLETO A LA VERSIÓN ANTERIOR.**
>
> El planteamiento previo (clonar el repositorio, trabajar en la rama
> `integracion/motores-externos` y editar `Hoteles.jsx` / `Vuelos.jsx`
> insertando el motor dentro de contenedores `#hotel-search-root` /
> `#flight-search-root` por iframe) quedó **DESCARTADO**: el buscador del
> proveedor no puede incrustarse como iframe externo.
>
> **Si estabas trabajando con las instrucciones antiguas, detente y lee esto.**
> Ya no se toca la aplicación React para nada.

---

## Cómo funciona ahora

`/vuelos` y `/hoteles` **ya no pertenecen a la aplicación React**. Los sirve
directamente el servidor Apache de Hostgator desde tus archivos. React nunca se
ejecuta en esas URLs. **Estado: activo en producción** (jul 2026).

Tú subes tu motor por FTP a tu carpeta en `/home3/elencue2/motores/` (igual que
siempre). El equipo de Vicente Viajes la expone dentro del docroot con un
**enlace simbólico (symlink)**:

```
Docroot del sitio:  /home3/elencue2/public_html/   ← build de React (index.html + assets/)

public_html/vuelos   → symlink → /home3/elencue2/motores/aereo.vicenteviajes.com    (tu motor de vuelos)
public_html/hoteles  → symlink → /home3/elencue2/motores/hoteles.vicenteviajes.com  (tu motor de hoteles)
```

**Para ti no cambia nada:** sigues subiendo a tu carpeta en `motores/` por FTP.
El symlink hace que se vea en `vicenteviajes.com/vuelos/` y `/hoteles/`. Ventaja:
si el sitio principal se re-despliega, no se toca tu desarrollo.

El `.htaccess` del docroot excluye esas dos rutas del *fallback* del SPA, de
modo que Apache las sirve tal cual y no las reescribe a `index.html`:

```apache
# Rutas gestionadas por Conecta Turismo — NO ELIMINAR
RewriteRule ^(vuelos|hoteles)(/|$) - [L]
```

Como tu buscador sirve **la página completa** (no se incrusta dentro del
diseño React), **eres tú quien replica la cabecera y el pie** del sitio para
mantener la coherencia visual. Para eso se te entrega el **kit de diseño**
(ver más abajo).

> ⚠️ **Importante:** como ahora sirves desde un **subdirectorio** (`/vuelos/`,
> `/hoteles/`) y no desde la raíz de un subdominio, usa **rutas relativas** para
> tus CSS/JS/imágenes (o `<base href="/vuelos/">` / `"/hoteles/"`). Las rutas
> absolutas desde raíz (`/css/...`) apuntarían a los archivos de React y se
> romperían. Mantén también tu propio `.htaccess` **dentro** de tu carpeta para
> las rutas internas de tu buscador.

---

## Qué tienes que hacer

1. **Subir tu motor por FTP** al directorio que te corresponde. Tienes una
   cuenta FTP *enjaulada* (chroot) apuntando directamente a tu carpeta, así
   que no ves ni tocas el resto del sitio:

   | Servicio | Tu carpeta FTP (en `motores/`) | Se ve en la web |
   |---|---|---|
   | Vuelos  | `aereo.vicenteviajes.com`   | `vicenteviajes.com/vuelos/`  |
   | Hoteles | `hoteles.vicenteviajes.com` | `vicenteviajes.com/hoteles/` |

2. **Replicar la cabecera (Navbar) y el pie (Footer)** del sitio en tus
   páginas, usando el kit de diseño entregado. El objetivo es que un visitante
   no note la diferencia entre la web principal y tu buscador. **Usa siempre la
   última versión del kit** (la cabecera/pie cambian con el tiempo: teléfono,
   email, menú, etc.).

3. **Enlazar de vuelta al sitio principal** con URLs absolutas normales
   (`https://vicenteviajes.com/`, `/excursiones`, `/contacto`, etc.). Los
   enlaces de tu cabecera y pie deben apuntar a las mismas rutas que el sitio
   original (ver la lista en el kit).

---

## Kit de diseño (cabecera y pie)

Se te entrega un archivo **`kit-diseno-conecta-turismo.html`** autocontenido.
Ábrelo en el navegador y verás la cabecera y el pie **exactamente** como se
ven en producción, con el HTML y el CSS ya en plano (sin React ni Tailwind),
listos para copiar. Incluye:

- **Cabecera y pie** en HTML + CSS plano (sin dependencias de build).
- **Botón flotante de WhatsApp** (esquina inferior derecha).
- **Paleta de colores** con los hex exactos.
- **Tipografía**: Poppins (Google Fonts), con el enlace de carga.
- **Enlaces del menú** y del pie (legales, redes, contacto).
- **Datos completos del pie**: dirección, teléfono, email, CIF, C.I.C.M.A. y
  el sello "Powered by WeltBrave".
- **Logotipos** (referenciados como `logo-navbar.png` y `logo-footer.png`;
  se entregan junto al HTML).

> El kit se te comparte **directamente** (no necesitas el repositorio): es un
> archivo HTML junto con dos imágenes de logo (`logo-navbar.png` y
> `logo-footer.png`). Ábrelo en el navegador y copia lo que necesites.

---

## Reglas importantes

| ✅ Haz esto | ✗ No hagas esto |
|---|---|
| Sube tus archivos solo a `/vuelos` o `/hoteles` | Subir nada fuera de tu directorio enjaulado |
| Replica cabecera y pie con el kit entregado | Modificar `index.html`, `assets/` o el `.htaccess` del docroot |
| Usa rutas absolutas al enlazar al sitio (`/excursiones`, `/contacto`…) | Tocar la aplicación React o su repositorio |
| Mantén tu propio `.htaccess` **dentro** de tu carpeta si lo necesitas | Vaciar o "sincronizar" el docroot completo |

> **Nota sobre el `.htaccess`**: el `.htaccess` del docroot pertenece a Vicente
> Viajes y contiene la regla que hace que tu carpeta funcione. **No lo
> modifiques ni lo elimines.** Si necesitas reglas de reescritura propias,
> ponlas en un `.htaccess` **dentro** de `/vuelos` o `/hoteles`.

---

## Coordinación

Antes de nada, coordina con el equipo de Vicente Viajes:

- Confirmación de las credenciales FTP y el directorio asignado.
- Dominio y subdominios: la web principal **no es WordPress**; es una SPA React
  con despliegue manual. No asumas actualizaciones automáticas ni estructura de
  WordPress.
- Cualquier necesidad de datos del backend (API, CORS): el backend es Django y
  está en otro host (Render); habla con el equipo antes de depender de él.

---

## Preguntas frecuentes

**¿Puedo usar iframe hacia mi propio dominio dentro de la carpeta?**
Dentro de tu carpeta sirves lo que quieras (HTML, JS, iframe hacia tu sistema…).
Lo que quedó descartado es incrustar tu buscador como iframe **dentro** de una
página React del sitio principal.

**¿Por qué debo replicar la cabecera y el pie en vez de reutilizar los del
sitio?**
Porque tus páginas las sirve Apache directamente, no React. No hay forma de
"heredar" el Navbar/Footer de la SPA. El kit te da el markup y el CSS ya
resueltos para que la copia sea fiel y rápida.

**¿Qué pasa si el diseño del sitio cambia?**
El equipo de Vicente Viajes te hará llegar una versión actualizada del kit.
Mientras tanto, usa siempre la última versión que te hayan compartido.
