import React from "react";
import { Eye, Cookie, BarChart2, Shield, Mail, Settings } from "lucide-react";
import LegalLayout, { LegalSection, LegalItem } from "../../components/layout/LegalLayout";

export default function PoliticaPrivacidad() {
  return (
    <LegalLayout
      badge="👁️ Privacidad Web"
      title="Política de Privacidad"
      subtitle="Cómo recopilamos, usamos y protegemos la información generada durante su navegación en vicenteviajes.com, conforme al RGPD y la LSSI-CE."
    >

      <LegalSection icon={Eye} title="1. Información General">
        <p>
          La presente Política de Privacidad regula el tratamiento de los datos personales
          recabados a través del sitio web <strong className="text-forest">vicenteviajes.com</strong> y sus
          subdominios, gestionados por <strong className="text-forest">Vicente &amp; Viajes S.L.</strong>{" "}
          (CIF B88482856), en cumplimiento del Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica
          3/2018 (LOPDGDD) y la Ley 34/2002 de Servicios de la Sociedad de la Información y
          Comercio Electrónico (LSSI-CE).
        </p>
        <p>
          Al utilizar este sitio web, el usuario acepta las condiciones descritas en la
          presente política. Si no está de acuerdo, le rogamos que no utilice el sitio.
        </p>
      </LegalSection>

      <LegalSection icon={BarChart2} title="2. Datos Recogidos en la Navegación">
        <p>Durante su visita, podemos recopilar automáticamente la siguiente información:</p>
        <ul className="space-y-2 mt-2">
          <LegalItem>Dirección IP (anonimizada conforme al RGPD).</LegalItem>
          <LegalItem>Tipo de navegador y sistema operativo.</LegalItem>
          <LegalItem>Páginas visitadas, tiempo de permanencia y rutas de navegación.</LegalItem>
          <LegalItem>Origen de la visita (buscador, enlace externo, acceso directo).</LegalItem>
          <LegalItem>Resolución de pantalla y dispositivo utilizado.</LegalItem>
        </ul>
        <p className="mt-3">
          Estos datos se tratan de forma agregada y anonimizada con fines estadísticos.
          Base jurídica: Art. 6.1.f RGPD — interés legítimo del responsable para mejorar la
          experiencia del usuario.
        </p>
      </LegalSection>

      <LegalSection icon={Settings} title="3. Formularios y Datos Voluntarios">
        <p>
          Cuando contacta con nosotros mediante formularios web (contacto, solicitud de
          presupuesto, suscripción a newsletter), recopilamos los datos que usted facilita
          voluntariamente: nombre, email, teléfono y mensaje.
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>
            <strong>Formulario de contacto:</strong> base jurídica Art. 6.1.b RGPD (atención
            de consulta precontractual) o Art. 6.1.f (interés legítimo de respuesta al usuario).
          </LegalItem>
          <LegalItem>
            <strong>Newsletter:</strong> base jurídica Art. 6.1.a (consentimiento expreso
            con casilla de verificación activa). Se puede dar de baja en cualquier momento
            desde el enlace incluido en cada comunicación.
          </LegalItem>
        </ul>
        <p className="mt-3">
          No utilizamos técnicas de perfilado automatizado ni toma de decisiones automatizadas
          que produzcan efectos jurídicos o similares sobre los usuarios.
        </p>
      </LegalSection>

      <LegalSection icon={Cookie} title="4. Política de Cookies">
        <p>
          Este sitio web utiliza cookies conforme a la Ley 34/2002 LSSI-CE y las directrices
          de la AEPD. Las cookies son pequeños archivos de texto que se almacenan en su
          dispositivo para mejorar la funcionalidad y analítica del sitio.
        </p>
        <div className="mt-3 space-y-3">
          <div className="rounded-xl bg-teal/5 border border-teal/15 p-4">
            <p className="font-semibold text-forest text-sm mb-1">Cookies técnicas / estrictamente necesarias</p>
            <p className="text-sm">Imprescindibles para el funcionamiento del sitio (sesión, carrito, preferencias de idioma). No requieren consentimiento.</p>
          </div>
          <div className="rounded-xl bg-sage/5 border border-sage/15 p-4">
            <p className="font-semibold text-forest text-sm mb-1">Cookies analíticas</p>
            <p className="text-sm">Google Analytics 4 (con IP anonimizada). Miden el uso del sitio para mejorarlo. Requieren consentimiento. Datos retenidos máximo 14 meses.</p>
          </div>
          <div className="rounded-xl bg-teal/5 border border-teal/15 p-4">
            <p className="font-semibold text-forest text-sm mb-1">Cookies de preferencias</p>
            <p className="text-sm">Guardan las elecciones del usuario (idioma, moneda, destinos recientes). Caducan a los 12 meses.</p>
          </div>
        </div>
        <p className="mt-3">
          Puede gestionar o revocar el consentimiento en cualquier momento desde el panel
          de configuración de cookies accesible en el pie de página, o configurando su
          navegador para rechazarlas (tenga en cuenta que esto puede afectar a la
          funcionalidad del sitio).
        </p>
      </LegalSection>

      <LegalSection icon={Shield} title="5. Medidas de Seguridad">
        <p>
          Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar
          la seguridad de sus datos personales y evitar su alteración, pérdida, tratamiento
          o acceso no autorizado, conforme al Art. 32 RGPD:
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>Conexión cifrada mediante protocolo HTTPS/TLS 1.3.</LegalItem>
          <LegalItem>Acceso restringido a datos personales por personal autorizado mediante principio de mínimo privilegio.</LegalItem>
          <LegalItem>Contraseñas almacenadas con hash bcrypt; datos de pago procesados mediante pasarela PCI DSS.</LegalItem>
          <LegalItem>Copias de seguridad cifradas con periodicidad diaria.</LegalItem>
          <LegalItem>Registro de accesos y auditorías periódicas de seguridad.</LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={Mail} title="6. Sus Derechos y Contacto DPO">
        <p>
          Puede ejercer sus derechos de acceso, rectificación, supresión, oposición,
          limitación y portabilidad escribiendo a{" "}
          <a href="mailto:reservas@vicenteviajes.com" className="text-teal underline hover:text-sage transition-colors">
            reservas@vicenteviajes.com
          </a>{" "}
          indicando en el asunto «Ejercicio de derechos RGPD» y adjuntando copia de su
          documento de identidad.
        </p>
        <p className="mt-2">
          Si considera que el tratamiento no es conforme a la normativa, puede presentar
          reclamación ante la{" "}
          <strong className="text-forest">Agencia Española de Protección de Datos</strong>{" "}
          (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">www.aepd.es</a>).
        </p>
        <p className="text-xs text-forest/50 mt-4">
          Última actualización: marzo 2026 · Marco legal: RGPD (UE) 2016/679 · LOPDGDD 3/2018 · LSSI-CE 34/2002.
        </p>
      </LegalSection>

    </LegalLayout>
  );
}
