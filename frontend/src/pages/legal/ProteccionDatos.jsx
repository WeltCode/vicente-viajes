import React from "react";
import { Shield, Database, Users, Lock, Mail, Globe, AlertCircle } from "lucide-react";
import LegalLayout, { LegalSection, LegalItem } from "../../components/layout/LegalLayout";

export default function ProteccionDatos() {
  return (
    <LegalLayout
      badge="🔒 Privacidad"
      title="Protección de Datos"
      subtitle="Información sobre el tratamiento de sus datos personales conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018."
    >

      <LegalSection icon={Shield} title="1. Responsable del Tratamiento">
        <ul className="space-y-2">
          <LegalItem><strong>Razón social:</strong> Vicente &amp; Viajes S.L.</LegalItem>
          <LegalItem><strong>CIF:</strong> B88482856</LegalItem>
          <LegalItem><strong>Domicilio:</strong> Avenida del Marqués de Corbera 46, Local 1, 28017 Madrid</LegalItem>
          <LegalItem><strong>Email de contacto:</strong> reservas@vicenteviajes.com</LegalItem>
          <LegalItem><strong>Teléfono:</strong> +34 612 47 78 10</LegalItem>
          <LegalItem><strong>Inscripción:</strong> Registro Mercantil de Madrid</LegalItem>
        </ul>
        <p className="mt-4">
          El tratamiento de sus datos se rige por el{" "}
          <strong className="text-forest">Reglamento (UE) 2016/679 del Parlamento Europeo
          y del Consejo (RGPD)</strong> y por la{" "}
          <strong className="text-forest">Ley Orgánica 3/2018, de 5 de diciembre,
          de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)</strong>.
        </p>
      </LegalSection>

      <LegalSection icon={Database} title="2. Datos que Recopilamos y Finalidades">
        <p>Recopilamos los siguientes datos según la finalidad del tratamiento:</p>
        <div className="mt-3 space-y-4">
          <div className="rounded-xl bg-teal/5 border border-teal/15 p-4">
            <p className="font-semibold text-forest mb-2">Gestión de reservas y prestación de servicios</p>
            <p className="text-sm">Nombre completo, DNI/pasaporte, fecha de nacimiento, nacionalidad, datos
            de contacto, preferencias de viaje, datos de tarjeta de crédito (solo para el pago,
            no almacenamos datos completos de tarjeta).</p>
            <p className="text-xs text-forest/50 mt-1">Base jurídica: Art. 6.1.b RGPD — ejecución de contrato.</p>
          </div>
          <div className="rounded-xl bg-sage/5 border border-sage/15 p-4">
            <p className="font-semibold text-forest mb-2">Obligaciones legales y fiscales</p>
            <p className="text-sm">NIF/NIE, datos de facturación, datos de pasajero requeridos por
            aerolíneas (API - Advance Passenger Information) exigidos por normativa internacional.</p>
            <p className="text-xs text-forest/50 mt-1">Base jurídica: Art. 6.1.c RGPD — obligación legal.</p>
          </div>
          <div className="rounded-xl bg-teal/5 border border-teal/15 p-4">
            <p className="font-semibold text-forest mb-2">Comunicaciones comerciales</p>
            <p className="text-sm">Email, nombre y preferencias de destino, únicamente si ha dado su
            consentimiento expreso.</p>
            <p className="text-xs text-forest/50 mt-1">Base jurídica: Art. 6.1.a RGPD — consentimiento del interesado. Puede retirar el consentimiento en cualquier momento.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection icon={Users} title="3. Destinatarios (Comunicación a Terceros)">
        <p>
          Sus datos podrán ser comunicados a los siguientes terceros <strong className="text-forest">estrictamente
          necesarios</strong> para la prestación del servicio contratado:
        </p>
        <ul className="space-y-2 mt-3">
          <LegalItem>
            <strong>Aerolíneas UE:</strong> Iberia (Grupo IAG), Vueling Airlines, Air Europa,
            Ryanair DAC, easyJet plc, Wizz Air Holdings — para emisión de billetes y cumplimiento
            de requisitos API/PNR conforme al Reglamento UE 2016/681 (PNR).
          </LegalItem>
          <LegalItem>
            <strong>Aerolíneas LATAM:</strong> LATAM Airlines Group, Avianca S.A., Copa Airlines,
            Aeroméxico — para vuelos con origen o destino en América Latina.
          </LegalItem>
          <LegalItem>
            <strong>Establecimientos hoteleros</strong> y proveedores de alojamiento en destino.
          </LegalItem>
          <LegalItem>
            <strong>Compañías aseguradoras</strong> si contrata un seguro de viaje a través de Vicente Viajes.
          </LegalItem>
          <LegalItem>
            <strong>Autoridades migratorias y aduaneras</strong> de los países de destino cuando
            la normativa local lo exija (ej. ESTA para EEUU, eVisitor para Australia).
          </LegalItem>
          <LegalItem>
            <strong>Entidades bancarias y pasarelas de pago</strong> para el procesamiento seguro
            de transacciones.
          </LegalItem>
        </ul>
        <p className="mt-3">
          Estos destinatarios actúan como responsables independientes o encargados del tratamiento
          y disponen de sus propias políticas de privacidad. No cedemos sus datos a terceros para
          fines publicitarios sin su consentimiento expreso.
        </p>
      </LegalSection>

      <LegalSection icon={Globe} title="4. Transferencias Internacionales">
        <p>
          Algunos de nuestros proveedores (aerolíneas LATAM, sistemas GDS como Amadeus o Sabre)
          pueden implicar transferencia de datos a países fuera del EEE. En tales casos:
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>
            Se aplican las garantías adecuadas del Art. 46 RGPD (cláusulas contractuales tipo
            aprobadas por la Comisión Europea).
          </LegalItem>
          <LegalItem>
            Para destinos con decisión de adecuación (Art. 45 RGPD) como Reino Unido, Suiza,
            Argentina, Uruguay o Japón, la transferencia está autorizada directamente.
          </LegalItem>
          <LegalItem>
            Para EEUU: transferencias amparadas en el Marco de Privacidad UE-EEUU adoptado
            en julio de 2023 (Decisión de Adecuación de la Comisión Europea).
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={Lock} title="5. Plazo de Conservación">
        <ul className="space-y-2">
          <LegalItem>
            <strong>Datos de reservas y contratos:</strong> durante la vigencia de la relación
            contractual y hasta 6 años tras su finalización (art. 30 Cco y obligaciones fiscales).
          </LegalItem>
          <LegalItem>
            <strong>Datos de facturación:</strong> 5 años conforme a la normativa fiscal española
            (Ley 58/2003 General Tributaria).
          </LegalItem>
          <LegalItem>
            <strong>Comunicaciones comerciales:</strong> hasta que retire su consentimiento.
          </LegalItem>
          <LegalItem>
            <strong>Datos de navegación web (cookies):</strong> máximo 13 meses desde la última visita.
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={AlertCircle} title="6. Sus Derechos">
        <p>
          Conforme a los artículos 15 a 22 del RGPD y la LOPDGDD, puede ejercer los siguientes
          derechos dirigiendo un escrito a reservas@vicenteviajes.com con copia de su DNI/pasaporte:
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem><strong>Acceso:</strong> conocer qué datos tratamos sobre usted.</LegalItem>
          <LegalItem><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</LegalItem>
          <LegalItem><strong>Supresión («derecho al olvido»):</strong> solicitar la eliminación cuando ya no sean necesarios.</LegalItem>
          <LegalItem><strong>Oposición:</strong> oponerse al tratamiento para fines de marketing directo.</LegalItem>
          <LegalItem><strong>Limitación:</strong> solicitar la suspensión del tratamiento en determinados supuestos.</LegalItem>
          <LegalItem><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y de uso común.</LegalItem>
        </ul>
        <p className="mt-3">
          Tiene derecho a presentar reclamación ante la{" "}
          <strong className="text-forest">Agencia Española de Protección de Datos (AEPD)</strong>{" "}
          en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">www.aepd.es</a>.
        </p>
        <p className="text-xs text-forest/50 mt-3">
          Última actualización: marzo 2026 · Marco legal: RGPD (UE) 2016/679 · LOPDGDD 3/2018.
        </p>
      </LegalSection>

    </LegalLayout>
  );
}
