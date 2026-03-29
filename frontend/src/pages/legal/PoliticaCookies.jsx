import React from "react";
import {
  Cookie,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  Megaphone,
  Settings,
  Globe,
  Clock3,
} from "lucide-react";
import LegalLayout, {
  LegalSection,
  LegalItem,
  LegalTable,
} from "../../components/layout/LegalLayout";
import { openCookieSettings } from "../../services/cookieConsent";

export default function PoliticaCookies() {
  return (
    <LegalLayout
      badge="🍪 Cookies"
      title="Política de Cookies"
      subtitle="Información detallada sobre el uso de cookies y tecnologías similares en vicenteviajes.com, en cumplimiento de la LSSI-CE, RGPD y Guía de Cookies de la AEPD."
    >
      <LegalSection icon={Cookie} title="1. Qué son las cookies y para qué se usan">
        <p>
          Las cookies son archivos pequeños que se almacenan en su dispositivo al visitar
          una web. Permiten recordar información sobre su navegación para mejorar la
          experiencia de uso, reforzar la seguridad del sitio y generar estadísticas
          agregadas.
        </p>
        <p>
          Este sitio utiliza cookies propias y, en su caso, cookies de terceros, siempre
          bajo un modelo de consentimiento previo para categorías no necesarias.
        </p>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="2. Base legal y normativa aplicable">
        <ul className="space-y-2">
          <LegalItem>Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE), art. 22.2.</LegalItem>
          <LegalItem>Reglamento (UE) 2016/679 (RGPD), artículos 6 y 7 sobre consentimiento.</LegalItem>
          <LegalItem>Ley Orgánica 3/2018 (LOPDGDD).</LegalItem>
          <LegalItem>Guía sobre el uso de cookies de la Agencia Española de Protección de Datos (AEPD).</LegalItem>
        </ul>
        <p className="mt-3">
          Solo se instalan cookies opcionales (preferencias, analítica o marketing) cuando
          el usuario otorga consentimiento explícito mediante el panel de configuración.
        </p>
      </LegalSection>

      <LegalSection icon={Settings} title="3. Panel de configuración y revocación">
        <p>
          Puede cambiar o retirar su consentimiento en cualquier momento desde el enlace
          <strong className="text-forest"> Configurar cookies</strong> disponible en el pie de página.
        </p>
        <div className="mt-3">
          <button
            type="button"
            onClick={openCookieSettings}
            className="px-4 py-2 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
          >
            Abrir configuración de cookies
          </button>
        </div>
        <p className="text-xs text-forest/50 mt-3">
          La retirada del consentimiento no afecta a la licitud del tratamiento previo basado
          en el consentimiento otorgado con anterioridad.
        </p>
      </LegalSection>

      <LegalSection icon={Globe} title="4. Tipos de cookies que utilizamos">
        <LegalTable
          headers={[
            "Categoría",
            "Finalidad",
            "Base jurídica",
            "Instalación",
          ]}
          rows={[
            [
              "Necesarias y seguridad",
              "Funcionamiento básico, protección de sesión y seguridad técnica",
              "Interés legítimo / obligación técnica",
              "Siempre activas",
            ],
            [
              "Preferencias",
              "Recordar idioma y opciones de experiencia",
              "Consentimiento (art. 6.1.a RGPD)",
              "Solo con aceptación",
            ],
            [
              "Analíticas",
              "Medición agregada de uso para mejorar contenidos y UX",
              "Consentimiento (art. 6.1.a RGPD)",
              "Solo con aceptación",
            ],
            [
              "Marketing",
              "Personalización y medición publicitaria",
              "Consentimiento (art. 6.1.a RGPD)",
              "Solo con aceptación",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection icon={Clock3} title="5. Cookies técnicas utilizadas actualmente">
        <LegalTable
          headers={[
            "Nombre",
            "Proveedor",
            "Tipo",
            "Finalidad",
            "Duración",
          ]}
          rows={[
            [
              "vv_cookie_consent",
              "Vicente Viajes",
              "Propia · necesaria",
              "Guardar su decisión de consentimiento por categorías",
              "180 días",
            ],
            [
              "vv_cookie_consent (localStorage)",
              "Vicente Viajes",
              "Almacenamiento local",
              "Persistir preferencias para reaplicar consentimiento",
              "Hasta revocación",
            ],
          ]}
        />
        <p className="text-xs text-forest/50 mt-3">
          Nota: cuando se habilite GA4 en producción, esta tabla se actualizará para incluir
          las cookies analíticas efectivamente desplegadas y sus plazos de conservación.
        </p>
      </LegalSection>

      <LegalSection icon={Clock3} title="6. Conservación y prueba de consentimiento">
        <ul className="space-y-2">
          <LegalItem>
            La decisión de consentimiento se conserva durante un máximo de
            <strong className="text-forest"> 180 días</strong>, tras lo cual se solicitará de nuevo.
          </LegalItem>
          <LegalItem>
            El estado de consentimiento se almacena en cookie propia y almacenamiento local,
            exclusivamente para gestionar su preferencia por categorías.
          </LegalItem>
          <LegalItem>
            Puede modificar o retirar su consentimiento en cualquier momento desde el enlace
            «Configurar cookies» en el pie de página.
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={BarChart3} title="7. Cookies analíticas (cuando el usuario acepta)">
        <p>
          Si acepta la categoría analítica, se podrá activar Google Analytics 4 con
          configuración orientada a minimización de datos (por ejemplo, IP anonimizada).
          Si no hay consentimiento, el almacenamiento analítico se mantiene denegado.
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>No se activa analítica sin consentimiento previo.</LegalItem>
          <LegalItem>Se respeta el estado de consentimiento en cada visita.</LegalItem>
          <LegalItem>Puede revocar el consentimiento en cualquier momento desde el footer.</LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={SlidersHorizontal} title="8. Gestión desde el navegador">
        <p>
          También puede bloquear o eliminar cookies desde la configuración de su navegador.
          Esta acción puede afectar al correcto funcionamiento de algunas funcionalidades
          del sitio.
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <p>
            Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.
          </p>
          <p>
            Firefox: Ajustes &gt; Privacidad y seguridad &gt; Cookies y datos del sitio.
          </p>
          <p>
            Safari: Preferencias &gt; Privacidad &gt; Gestionar datos del sitio web.
          </p>
          <p>
            Edge: Configuración &gt; Cookies y permisos de sitio.
          </p>
        </div>
      </LegalSection>

      <LegalSection icon={Megaphone} title="9. Contacto y actualizaciones">
        <p>
          Para cualquier duda sobre esta Política de Cookies o sobre el tratamiento de datos,
          puede escribirnos a{" "}
          <a
            href="mailto:reservas@vicenteviajes.com"
            className="text-teal underline hover:text-sage transition-colors"
          >
            reservas@vicenteviajes.com
          </a>
          .
        </p>
        <p className="text-xs text-forest/50 mt-3">
          Última actualización: marzo 2026.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
