# Checklist de salida a producción

## 1. Bloqueantes antes de publicar

- [ ] Eliminar defaults inseguros en Django: sin secret key hardcodeada y sin DEBUG por defecto en producción.
- [ ] Corregir CORS y CSRF para usar dominios reales de producción, no listas fijas de localhost.
- [ ] Revisar autenticación del panel admin y confirmar que la sesión no persiste indefinidamente.
- [ ] Sustituir o retirar las páginas placeholder de vuelos y hoteles hasta tener integración real.
- [ ] Limpiar contenido demo o de prueba visible en ofertas, excursiones y demás listados públicos.
- [ ] Confirmar que el formulario de contacto envía emails reales por SMTP en staging y producción.

## 2. Seguridad backend

- [ ] Configurar DJANGO_SECRET_KEY únicamente por entorno seguro.
- [ ] Configurar DJANGO_DEBUG=False en producción.
- [ ] Definir DJANGO_ALLOWED_HOSTS con dominios finales exactos.
- [ ] Definir DJANGO_CSRF_TRUSTED_ORIGINS con dominios https finales.
- [ ] Aplicar cookies seguras y cabeceras de proxy si el backend va detrás de Render u otro reverse proxy.
- [ ] Revisar si TokenAuthentication cubre el nivel de seguridad esperado para el panel admin.
- [ ] Confirmar estrategia de serving de media en producción sin depender de disco local.

## 3. Frontend público

- [ ] Verificar copy final de home, ofertas, contacto, nosotros y legales.
- [ ] Sustituir enlaces sociales placeholder por URLs reales o retirarlos.
- [ ] Confirmar que vuelos y hoteles tengan integración funcional o no aparezcan en navegación pública.
- [ ] Revisar estados vacíos, loaders y errores de red en todas las páginas públicas.
- [ ] Comprobar responsive real en móvil, tablet y escritorio.

## 4. Panel admin

- [ ] Validar login, logout y expiración de sesión con pruebas manuales reales.
- [ ] Validar permisos por rol: superusuario, editor y solo lectura.
- [ ] Revisar todos los CRUD con alta, edición, borrado y subida de imágenes.
- [ ] Verificar restablecimiento de contraseña temporal y sustitución obligatoria por parte del usuario.

## 5. Datos y contenido

- [ ] Revisar que no queden registros con títulos como test, lorem o placeholders.
- [ ] Revisar imágenes rotas, duplicadas o de baja calidad.
- [ ] Confirmar precios, destinos, teléfonos, email comercial y textos legales.
- [ ] Verificar consistencia entre datos del footer, contacto y panel.

## 6. Operación y observabilidad

- [ ] Preparar entorno staging equivalente a producción.
- [ ] Registrar errores backend y frontend con una solución de monitoring.
- [ ] Definir backups de base de datos y plan de rollback.
- [ ] Documentar despliegue, variables de entorno y recuperación ante fallos.

## 7. Validación final previa a go-live

- [ ] Navegación completa de la web pública sin errores visibles.
- [ ] Formulario de contacto funcionando extremo a extremo.
- [ ] Panel admin usable extremo a extremo con usuarios reales de prueba.
- [ ] Lighthouse y revisión básica de accesibilidad en páginas clave.
- [ ] Revisión legal final de cookies, privacidad y textos corporativos.

## Estado actual resumido

- Base visual sólida y panel admin funcional.
- No listo todavía para producción sin cerrar seguridad, contenido final e integraciones clave.