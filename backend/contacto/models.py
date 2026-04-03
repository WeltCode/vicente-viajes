from django.db import models

class mensaje_contacto(models.Model):
    objects = models.Manager()

    # Registro persistente de mensajes enviados desde el formulario publico.
    nombre = models.CharField(max_length=255)
    email = models.EmailField()
    telefono = models.CharField(max_length=20, blank=True)
    asunto = models.CharField(max_length=255)
    mensaje = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    class Meta:
        # Prioriza mensajes nuevos en panel administrativo.
        ordering = ['-fecha_creacion']
        verbose_name = "Mensaje de Contacto"
        verbose_name_plural = "Mensajes de Contacto"

    def __str__(self):
        # Identificador corto para listados de admin.
        return f"{self.nombre} - {self.asunto}"
