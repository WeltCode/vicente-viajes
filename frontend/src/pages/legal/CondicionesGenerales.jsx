import React from "react";
import { FileText, Scale, CreditCard, AlertCircle, UserCheck, Phone } from "lucide-react";
import LegalLayout, { LegalSection, LegalItem } from "../../components/layout/LegalLayout";

export default function CondicionesGenerales() {
  return (
    <LegalLayout
      badge="📋 Marco Legal"
      title="Condiciones Generales"
      subtitle="Condiciones aplicables a la contratación de servicios de viaje combinado y asistidos con Vicente & Viajes S.L., conforme a la legislación española y europea vigente."
    >

      <LegalSection icon={FileText} title="1. Objeto y Ámbito de Aplicación">
        <p>
          Las presentes Condiciones Generales de Contratación regulan la relación entre
          <strong className="text-forest"> Vicente &amp; Viajes S.L.</strong> (C.I.C.M.A. nº 4371,
          CIF: B88482856), con domicilio en Avenida del Marqués de Corbera 46, Local 1,
          28017 Madrid, en adelante «el Organizador», y el viajero que contrate cualquiera
          de los productos turísticos ofrecidos.
        </p>
        <p>
          Son de aplicación el <strong className="text-forest">Real Decreto Legislativo 1/2007</strong> de 16
          de noviembre (TRLGDCU), el <strong className="text-forest">Real Decreto 106/2019</strong> de 1 de
          marzo por el que se regulan los viajes combinados y los servicios de viaje vinculados
          (trasposición de la Directiva UE 2015/2302), así como la normativa de protección al
          consumidor vigente en España y la Unión Europea.
        </p>
      </LegalSection>

      <LegalSection icon={Scale} title="2. Definiciones">
        <ul className="space-y-2">
          <LegalItem>
            <strong>Viaje combinado:</strong> combinación de al menos dos tipos distintos de
            servicios de viaje (transporte, alojamiento, alquiler de vehículos u otros)
            para el mismo viaje o vacación con una duración superior a 24 horas.
          </LegalItem>
          <LegalItem>
            <strong>Organizador:</strong> Vicente &amp; Viajes S.L., que combina y vende o
            pone a la venta los viajes combinados, directamente o a través de un minorista.
          </LegalItem>
          <LegalItem>
            <strong>Viajero:</strong> cualquier persona que desee celebrar un contrato o que
            tenga derecho a viajar en virtud de un contrato ya celebrado.
          </LegalItem>
          <LegalItem>
            <strong>Precio total:</strong> importe íntegro del viaje combinado, incluidos
            todos los impuestos, tasas e impuestos aeroportuarios aplicables en el momento
            de la reserva.
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={CreditCard} title="3. Formación del Contrato y Precios">
        <p>
          El contrato se perfecciona en el momento en que el viajero recibe la confirmación
          escrita de la reserva por parte del Organizador. El precio indicado incluye los
          servicios descritos en el programa y está sujeto a disponibilidad hasta la
          confirmación formal.
        </p>
        <p>
          Los precios publicados pueden estar sujetos a variaciones motivadas por cambios en
          los precios del combustible, tasas gubernamentales o tipos de cambio de divisas,
          conforme al Art. 158 RD 106/2019. En ningún caso se podrá incrementar el precio
          en los <strong className="text-forest">20 días naturales</strong> anteriores a la fecha de partida.
          Si la revisión supera el 8 % del precio total, el viajero tendrá derecho a resolver
          el contrato sin penalización.
        </p>
        <p>
          En el momento de la reserva se abonará una señal (generalmente el 30 % del importe
          total). El pago del saldo deberá realizarse en los plazos indicados en la confirmación,
          normalmente entre 30 y 45 días antes de la salida.
        </p>
      </LegalSection>

      <LegalSection icon={FileText} title="4. Documentación de Viaje">
        <p>
          El viajero es responsable de disponer de la documentación personal válida requerida
          (pasaporte, DNI, visados, vacunación) para los destinos contratados.
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>Ciudadanos UE/Schengen: DNI o pasaporte en vigor para destinos dentro del espacio Schengen.</LegalItem>
          <LegalItem>Para destinos fuera de la UE: pasaporte con vigencia mínima de 6 meses desde la fecha de regreso.</LegalItem>
          <LegalItem>Menores de edad no acompañados: autorización notarial de ambos progenitores o tutores legales.</LegalItem>
          <LegalItem>ETIAS (desde 2025): requerido para nacionales de terceros países exentos de visado que viajan a la UE.</LegalItem>
        </ul>
        <p className="mt-3">
          Vicente Viajes no asume responsabilidad por denegación de entrada derivada de
          documentación incorrecta o insuficiente aportada por el viajero.
        </p>
      </LegalSection>

      <LegalSection icon={UserCheck} title="5. Obligaciones del Viajero">
        <ul className="space-y-2">
          <LegalItem>Facilitar información veraz y completa en el momento de la reserva.</LegalItem>
          <LegalItem>Abonar el precio en los plazos convenidos.</LegalItem>
          <LegalItem>Presentarse con antelación suficiente en los puntos de salida indicados.</LegalItem>
          <LegalItem>Respetar las normas de conducta y convivencia propias del destino.</LegalItem>
          <LegalItem>Comunicar cualquier necesidad especial (dietas, accesibilidad, alergias) en el momento de la reserva.</LegalItem>
          <LegalItem>Contratar un seguro de viaje adecuado; Vicente Viajes ofrece pólizas opcionales.</LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={Scale} title="6. Responsabilidad del Organizador">
        <p>
          Conforme al Art. 164 RD 106/2019, el Organizador responde frente al viajero del
          correcto cumplimiento de todos los servicios incluidos en el contrato de viaje
          combinado, independientemente de si esos servicios los ejecuta directamente o a
          través de terceros proveedores.
        </p>
        <p>
          El Organizador quedará exonerado de responsabilidad cuando la falta de conformidad
          sea imputable al viajero, a un tercero ajeno a la prestación de servicios o a
          circunstancias inevitables y extraordinarias (fuerza mayor).
        </p>
        <p>
          En caso de no conformidad significativa, el Organizador ofrecerá, sin coste adicional,
          soluciones alternativas adecuadas o, si no fuera posible, reducción del precio y/o
          indemnización de daños y perjuicios, conforme a los límites del Convenio de Montreal 1999
          y el Convenio de Atenas 1974 para transporte marítimo.
        </p>
      </LegalSection>

      <LegalSection icon={AlertCircle} title="7. Reclamaciones y Resolución de Disputas">
        <p>
          Cualquier falta de conformidad durante la ejecución del viaje deberá comunicarse
          por escrito al Organizador o al prestador del servicio <strong className="text-forest">sin demora injustificada</strong>.
        </p>
        <p>
          Las reclamaciones posteriores al viaje deberán presentarse por escrito en el plazo
          máximo de <strong className="text-forest">30 días naturales</strong> desde la fecha de regreso, dirigidas a:
          reservas@vicenteviajes.com o en nuestra oficina de Madrid.
        </p>
        <p>
          En caso de litigio, las partes podrán acudir a los sistemas de resolución alternativa
          de conflictos (RAC) de la Junta Arbitral de Consumo competente. La legislación
          aplicable es la española y la jurisdicción competente la de Madrid capital, sin
          perjuicio de los derechos de consumidor irrenunciables conforme al TRLGDCU.
        </p>
      </LegalSection>

      <LegalSection icon={Phone} title="8. Contacto">
        <p>Para cualquier consulta relativa a estas condiciones:</p>
        <ul className="space-y-2 mt-2">
          <LegalItem><strong>Dirección:</strong> Avenida del Marqués de Corbera 46, Local 1, 28017 Madrid</LegalItem>
          <LegalItem><strong>Teléfono:</strong> +34 612 47 78 10</LegalItem>
          <LegalItem><strong>Email:</strong> reservas@vicenteviajes.com</LegalItem>
          <LegalItem><strong>Horario:</strong> Lunes a Viernes de 9:00 a 19:00 h (hora peninsular española)</LegalItem>
        </ul>
        <p className="mt-3 text-xs text-forest/50">
          Última actualización: marzo de 2026 · Marco legal: RD 106/2019, TRLGDCU (RDLeg 1/2007),
          Directiva UE 2015/2302.
        </p>
      </LegalSection>

    </LegalLayout>
  );
}
