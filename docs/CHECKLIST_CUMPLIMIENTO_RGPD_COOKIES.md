# Checklist de Cumplimiento RGPD + Cookies (UE)

Fecha: 30/03/2026  
Proyecto: Vicente Viajes

## 1. Gobernanza y base legal

- [x] Identificar responsable del tratamiento (razon social, CIF y contacto visible).
- [x] Publicar Politica de Privacidad accesible desde footer.
- [x] Publicar Politica de Cookies separada y detallada.
- [x] Incluir base legal por finalidad (consentimiento, interes legitimo, obligacion legal, ejecucion contractual).
- [ ] Revisar y formalizar contrato de encargado con todos los proveedores que traten datos.
- [ ] Mantener registro de actividades de tratamiento (RAT) actualizado.

## 2. Consentimiento de cookies (AEPD / LSSI-CE)

- [x] Primera capa con informacion clara y comprensible.
- [x] Botones: Aceptar, Rechazar y Configurar en primera capa.
- [x] Rechazar tan facil como aceptar (misma visibilidad funcional).
- [x] Sin cookies opcionales antes de consentimiento.
- [x] Consentimiento granular por categorias (preferencias, analitica, marketing).
- [x] Posibilidad de revocar/cambiar consentimiento en cualquier momento.
- [x] Caducidad del consentimiento configurada (180 dias).
- [x] Persistencia de decision en cookie propia + local storage.
- [ ] Implementar registro de pruebas de consentimiento en backend si se requiere evidencia fuerte por usuario autenticado.

## 3. Implementacion tecnica

- [x] Consent Mode inicial por defecto en "denied" para categorias opcionales.
- [x] Activacion condicional de analitica solo con consentimiento.
- [x] Preparacion para GA4 via variable de entorno (pendiente de activar).
- [x] Seguridad de cabeceras en despliegue (HSTS, CSP, XFO, XCTO, Referrer-Policy, Permissions-Policy).
- [ ] Ajustar CSP cuando se incorporen nuevos dominios de terceros para evitar bloqueos en produccion.
- [ ] Revisar politicas CORS del backend para dominios finales de produccion.

## 4. Seguridad y minimizacion de datos

- [x] Uso de HTTPS obligatorio en despliegue.
- [x] Restriccion de iframes (frame-ancestors none).
- [x] Bloqueo de MIME sniffing (X-Content-Type-Options nosniff).
- [ ] Revisar retencion de logs del servidor y anonimizar IP cuando aplique.
- [ ] Definir y documentar procedimiento de notificacion de brechas (max. 72h).

## 5. Derechos de los interesados

- [x] Canal de contacto para ejercer derechos RGPD visible.
- [x] Referencia a reclamacion ante AEPD.
- [ ] Procedimiento interno documentado para responder derechos (acceso, rectificacion, supresion, oposicion, limitacion, portabilidad) en plazo maximo de 1 mes.

## 6. Tareas pendientes recomendadas (prioridad alta)

1. Activar variable de entorno de GA4 en produccion y verificar que no carga sin consentimiento.
2. Revisar legalmente textos con asesoria (especialmente transferencias internacionales y terceros).
3. Publicar versionado de politicas (fecha y control de cambios).
4. Definir flujo de auditoria semestral de cookies y terceros.
5. Implementar script de comprobacion automatica (smoke test) para verificar estados de consentimiento.

## 7. Evidencias en codigo

- Banner y panel de consentimiento:
  - frontend/src/components/layout/CookieConsentBanner.jsx
- Motor de consentimiento y Consent Mode:
  - frontend/src/services/cookieConsent.js
- Inicializacion temprana de consentimiento:
  - frontend/src/main.jsx
- Politica de Cookies:
  - frontend/src/pages/legal/PoliticaCookies.jsx
- Politica de Privacidad:
  - frontend/src/pages/legal/PoliticaPrivacidad.jsx
- Configuracion de cabeceras seguras (Netlify):
  - netlify.toml

## 8. Nota legal

Este checklist es una guia operativa tecnica y de producto. No sustituye asesoramiento juridico profesional.
