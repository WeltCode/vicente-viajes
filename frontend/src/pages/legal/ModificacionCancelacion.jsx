import React from "react";
import { RefreshCw, XCircle, Plane, AlertCircle, DollarSign, Phone } from "lucide-react";
import LegalLayout, { LegalSection, LegalItem, LegalTable } from "../../components/layout/LegalLayout";

export default function ModificacionCancelacion() {
  return (
    <LegalLayout
      badge="🔄 Cambios y Cancelaciones"
      title="Modificación y Cancelación"
      subtitle="Sus derechos y las condiciones aplicables a cambios y cancelaciones de viajes, conforme al RD 106/2019, el Reglamento (CE) 261/2004 y el Convenio de Montreal 1999."
    >

      <LegalSection icon={RefreshCw} title="1. Modificaciones Solicitadas por el Viajero">
        <p>
          El viajero podrá solicitar modificaciones en el contrato de viaje combinado
          (cambio de fechas, participantes, categoría de alojamiento, etc.) sujeto a
          disponibilidad y a los siguientes cargos de gestión:
        </p>
        <LegalTable
          headers={["Tipo de modificación", "Coste de gestión", "Condición"]}
          rows={[
            ["Cambio de nombre de pasajero", "€30 / pasajero", "Sujeto a políticas de la aerolínea; antes de 72 h de salida"],
            ["Cambio de fecha (mismo destino)", "€50 / pasajero + diferencia de tarifa", "Sujeto a disponibilidad"],
            ["Cambio de destino", "Tratado como cancelación + nueva reserva", "Ver tabla de cancelación"],
            ["Cambio de categoría de hotel", "€20 gestión + diferencia de precio", "Según disponibilidad en destino"],
            ["Reducción de participantes", "Penalización sobre importe del pasajero que cancela", "Ver tabla de cancelación"],
          ]}
        />
        <p className="mt-3">
          Los cambios deben solicitarse <strong className="text-forest">por escrito</strong> a
          reservas@vicenteviajes.com o en nuestra oficina. No se garantizan modificaciones
          con menos de 72 horas de antelación a la salida.
        </p>
      </LegalSection>

      <LegalSection icon={XCircle} title="2. Cancelación por el Viajero (Viaje Combinado)">
        <p>
          Conforme al Art. 160 RD 106/2019, en caso de resolución del contrato de viaje
          combinado por el viajero, se aplicarán los siguientes cargos de cancelación:
        </p>
        <LegalTable
          headers={["Antelación a la salida", "Penalización"]}
          rows={[
            ["Más de 60 días", "Pérdida del importe de la señal (máx. 25%)"],
            ["De 45 a 59 días", "25% del precio total del viaje"],
            ["De 30 a 44 días", "40% del precio total del viaje"],
            ["De 15 a 29 días", "60% del precio total del viaje"],
            ["De 7 a 14 días", "80% del precio total del viaje"],
            ["Menos de 7 días o no presentación", "100% del precio total del viaje"],
          ]}
        />
        <p className="mt-3 p-4 bg-teal/5 rounded-xl border border-teal/20">
          <strong className="text-teal">Circunstancias extraordinarias e inevitables en destino:</strong>{" "}
          Si el viaje no puede realizarse por causas de fuerza mayor en el lugar de destino
          (conflicto bélico, catástrofe natural, pandemia declarada por la OMS), el viajero
          tiene derecho a la <strong className="text-forest">resolución sin penalización</strong> y al
          reembolso íntegro del importe pagado en un plazo máximo de 14 días (Art. 160.3 RD 106/2019).
        </p>
      </LegalSection>

      <LegalSection icon={XCircle} title="3. Cancelación por Vicente Viajes">
        <p>
          Si el Organizador cancela el viaje combinado antes de la fecha de salida, el viajero
          tendrá derecho a (Art. 161 RD 106/2019):
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>
            Un viaje combinado alternativo de calidad equivalente o superior, si el Organizador
            puede ofrecerlo.
          </LegalItem>
          <LegalItem>
            La resolución del contrato con reembolso íntegro del precio pagado en un plazo
            máximo de <strong className="text-forest">14 días naturales</strong>.
          </LegalItem>
          <LegalItem>
            Indemnización adicional por daños y perjuicios salvo que la cancelación sea
            imputable a circunstancias inevitables y extraordinarias o al número mínimo
            de participantes no alcanzado (comunicado 20 días antes para viajes &gt;6 días).
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={Plane} title="4. Cancelación de Vuelo por la Aerolínea (Reg. CE 261/2004)">
        <p>
          El <strong className="text-forest">Reglamento (CE) nº 261/2004</strong> establece derechos
          de compensación para vuelos operados desde aeropuertos de la UE o hacia la UE por
          aerolíneas comunitarias (aplica también a aerolíneas LATAM en vuelos con origen UE):
        </p>
        <LegalTable
          headers={["Distancia del vuelo", "Compensación por cancelación o denegación"]}
          rows={[
            ["Vuelos ≤1.500 km", "€250 por pasajero"],
            ["Vuelos intracomunitarios >1.500 km y otros de 1.500 a 3.500 km", "€400 por pasajero"],
            ["Vuelos >3.500 km (intercontinentales)", "€600 por pasajero"],
          ]}
        />
        <p className="mt-3">
          La aerolínea queda exonerada si la cancelación se debe a{" "}
          <strong className="text-forest">circunstancias extraordinarias</strong> que no habrían
          podido evitarse aunque se hubieran adoptado todas las medidas razonables (huelgas
          de control aéreo, condiciones meteorológicas extremas, inestabilidad política, etc.).
        </p>
        <p className="mt-2">
          Adicionalmente, en caso de cancelación la aerolínea debe ofrecer:
        </p>
        <ul className="space-y-1.5 mt-2">
          <LegalItem>Reembolso completo del billete en 7 días, o transporte alternativo al destino final.</LegalItem>
          <LegalItem>Atención: comidas/refrigerios proporcionales, llamadas de teléfono o email.</LegalItem>
          <LegalItem>Alojamiento si es necesaria una noche de espera, y transporte al hotel.</LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={AlertCircle} title="5. Retrasos de Vuelo">
        <p>
          Conforme al Reglamento (CE) 261/2004, en caso de retraso en la salida:
        </p>
        <LegalTable
          headers={["Distancia", "Retraso mínimo", "Derecho a atención"]}
          rows={[
            ["≤1.500 km", "≥2 horas", "Comidas/refrigerios, 2 llamadas o emails"],
            ["1.500-3.500 km", "≥3 horas", "Comidas/refrigerios, 2 llamadas o emails"],
            [">3.500 km", "≥4 horas", "Comidas/refrigerios, 2 llamadas o emails; alojamiento si implica noche"],
            ["Cualquier distancia", "≥5 horas", "Derecho a desistir y reembolso completo"],
          ]}
        />
        <p className="mt-3">
          Si el retraso supera <strong className="text-forest">3 horas en el destino final</strong>,
          el pasajero puede reclamar la misma compensación económica que por cancelación, siempre
          que no se deba a circunstancias extraordinarias (TJUE, asunto Sturgeon).
        </p>
      </LegalSection>

      <LegalSection icon={DollarSign} title="6. Denegación de Embarque (Overbooking)">
        <p>
          Cuando una aerolínea prevea denegar el embarque por exceso de reservas, debe solicitar
          voluntarios en primer lugar. Si no hay suficientes, podrá denegar el embarque contra
          su voluntad, pero deberá ofrecer:
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>Las mismas compensaciones económicas que por cancelación (€250 / €400 / €600).</LegalItem>
          <LegalItem>Derecho a reembolso o transporte alternativo al destino.</LegalItem>
          <LegalItem>Atención (comidas, alojamiento si necesario).</LegalItem>
        </ul>
        <p className="mt-3">
          La compensación podrá reducirse un 50% si la aerolínea ofrece un vuelo alternativo
          que llega al destino final con un retraso no superior a 2/3/4 horas según la distancia.
        </p>
      </LegalSection>

      <LegalSection icon={Phone} title="7. Cómo Reclamar">
        <p>
          Si considera que tiene derecho a compensación o indemnización:
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>
            <strong>Paso 1:</strong> Solicite en el mostrador de la aerolínea un justificante
            escrito del retraso/cancelación y conserve todos los documentos (tarjeta de embarque,
            recibos de gastos).
          </LegalItem>
          <LegalItem>
            <strong>Paso 2:</strong> Presente reclamación por escrito directamente a la aerolínea
            en un plazo máximo de 1 año.
          </LegalItem>
          <LegalItem>
            <strong>Paso 3:</strong> Si la aerolínea no responde en 2 meses, diríjase a la{" "}
            <strong className="text-forest">Agencia Estatal de Seguridad Aérea (AESA)</strong>{" "}
            <a href="https://www.seguridadaerea.gob.es" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">www.seguridadaerea.gob.es</a>.
          </LegalItem>
          <LegalItem>
            <strong>Apoyo de Vicente Viajes:</strong> si su vuelo fue reservado a través de
            nosotros, contacte a reservas@vicenteviajes.com y le ayudaremos con el proceso.
          </LegalItem>
        </ul>
        <p className="text-xs text-forest/50 mt-4">
          Marco legal: Reglamento (CE) 261/2004 · RD 106/2019 · Convenio de Montreal 1999 ·
          TRLGDCU (RDLeg 1/2007).
        </p>
      </LegalSection>

    </LegalLayout>
  );
}
