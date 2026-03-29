import React from "react";
import { Luggage, Plane, AlertTriangle, Info, Ban } from "lucide-react";
import LegalLayout, { LegalSection, LegalItem, LegalTable } from "../../components/layout/LegalLayout";

export default function EquipajePermitido() {
  return (
    <LegalLayout
      badge="🧳 Equipaje"
      title="Equipaje Permitido"
      subtitle="Franquicias y restricciones de equipaje en las principales aerolíneas con las que operamos en la Unión Europea y América Latina. Información orientativa — consulte siempre con la aerolínea antes de volar."
    >

      <LegalSection icon={Info} title="Nota Importante">
        <p>
          Las políticas de equipaje varían según la <strong className="text-forest">tarifa contratada</strong>,
          la ruta, la fecha de compra y el programa de fidelización del pasajero. Las franquicias
          indicadas corresponden a tarifas estándar (economy básica / light). Las tarifas Flex,
          Business o Plus habitualmente incluyen mayor franquicia.
        </p>
        <p>
          Toda pieza de equipaje de bodega cuyo peso supere el límite contratado estará sujeta
          a una tasa de exceso de equipaje que varía entre <strong className="text-forest">€12 y €80</strong> por
          pieza, dependiendo de la aerolínea y el momento de pago (online es siempre más barato
          que en aeropuerto).
        </p>
      </LegalSection>

      <LegalSection icon={Plane} title="Aerolíneas Europeas — Equipaje de Mano">
        <LegalTable
          headers={["Aerolínea", "Artículo personal", "Equipaje de mano (cabina)", "Dimensiones máx.", "Peso"]}
          rows={[
            ["Iberia", "Incluido", "Incluido en todas las tarifas", "56 × 45 × 25 cm", "10 kg"],
            ["Vueling", "Incluido (bajo asiento)", "Tarifa Optima o superior", "55 × 40 × 20 cm", "10 kg"],
            ["Air Europa", "Incluido", "Incluido en todas las tarifas", "55 × 35 × 25 cm", "10 kg"],
            ["Ryanair", "1 bolsa gratuita", "Con tarifa Priority / Plus", "55 × 40 × 20 cm", "10 kg"],
            ["easyJet", "1 bolsa gratuita", "Con tarifa FLEXI o Hands-free", "56 × 45 × 25 cm", "15 kg"],
            ["Wizz Air", "1 bolsa gratuita", "Con tarifa WIZZ GO o superior", "55 × 40 × 23 cm", "10 kg"],
            ["Iberia Express", "Incluido", "Incluido en todas las tarifas", "56 × 45 × 25 cm", "10 kg"],
          ]}
        />
      </LegalSection>

      <LegalSection icon={Luggage} title="Aerolíneas Europeas — Equipaje Facturado (Bodega)">
        <LegalTable
          headers={["Aerolínea", "Piezas incluidas (basic)", "Peso máx. por pieza", "Dimensiones máx.", "Coste por pieza adicional (aprox.)"]}
          rows={[
            ["Iberia", "1 (tarifas Clasica+)", "23 kg", "158 cm lineales", "€20-€60 online"],
            ["Vueling", "No incluida en Basic", "23 kg", "158 cm lineales", "€18-€55 online"],
            ["Air Europa", "1 (tarifas Optima+)", "23 kg", "158 cm lineales", "€18-€50 online"],
            ["Ryanair", "No incluida en Basic", "20 kg", "81 × 119 × 119 cm", "€12-€40 online"],
            ["easyJet", "No incluida en Basic", "23 kg", "275 cm lineales", "€15-€45 online"],
            ["Wizz Air", "No incluida en Basic", "20-32 kg", "149 cm lineales", "€15-€40 online"],
          ]}
        />
        <p className="mt-3 text-xs text-forest/50">
          *Los precios de equipaje adicional son orientativos y varían según la ruta, anticipación
          de compra y temporada. Equipaje especial (deportivo, instrumental, silla de ruedas)
          requiere reserva previa.
        </p>
      </LegalSection>

      <LegalSection icon={Plane} title="Aerolíneas LATAM — Equipaje de Mano">
        <LegalTable
          headers={["Aerolínea", "Artículo personal", "Equipaje de mano", "Dimensiones máx.", "Peso"]}
          rows={[
            ["LATAM Airlines", "Incluido", "Incluido (tarifas Plus+)", "55 × 35 × 25 cm", "10 kg"],
            ["Avianca", "Incluido", "Incluido en todas las tarifas", "55 × 38 × 20 cm", "10 kg"],
            ["Copa Airlines", "Incluido", "Incluido en todas las tarifas", "56 × 46 × 25 cm", "14 kg"],
            ["Aeromexico", "Incluido", "Incluido en todas las tarifas", "55 × 40 × 25 cm", "10 kg"],
            ["Sky Airline", "1 bolsa gratuita", "Con tarifas Plus / Full", "55 × 35 × 25 cm", "8 kg"],
          ]}
        />
      </LegalSection>

      <LegalSection icon={Luggage} title="Aerolíneas LATAM — Equipaje Facturado (Bodega)">
        <LegalTable
          headers={["Aerolínea", "Piezas incluidas (basic)", "Peso máx. por pieza", "Dimensiones máx.", "Coste adicional (aprox.)"]}
          rows={[
            ["LATAM Airlines", "1 (tarifas Plus+) / 2 (Premium Business)", "23 kg", "158 cm lineales", "USD 25-50 online"],
            ["Avianca", "1 (tarifas Classic+)", "23 kg", "158 cm lineales", "USD 25-40 online"],
            ["Copa Airlines", "1 pieza (todas las tarifas)", "23 kg", "158 cm lineales", "USD 30-60 online"],
            ["Aeromexico", "1 (Clásica+) / 2 (AM Plus)", "25 kg", "158 cm lineales", "USD 20-50 online"],
            ["Sky Airline", "No incluida en tarifa Base", "23 kg", "158 cm lineales", "USD 15-40 online"],
          ]}
        />
      </LegalSection>

      <LegalSection icon={Ban} title="Objetos Prohibidos en Cabina y Bodega">
        <p className="font-medium text-forest/80 mb-2">Siempre prohibidos (cabina y bodega):</p>
        <ul className="space-y-1.5">
          <LegalItem>Explosivos, munición y artificios pirotécnicos de cualquier tipo.</LegalItem>
          <LegalItem>Gases: butano, propano, oxígeno a presión (excepto uso médico preautorizado).</LegalItem>
          <LegalItem>Sustancias corrosivas (ácidos, bases fuertes, mercurio).</LegalItem>
          <LegalItem>Materiales radiactivos no preaprobados.</LegalItem>
          <LegalItem>Materiales magnéticos intenses que puedan interferir con los sistemas de navegación.</LegalItem>
        </ul>

        <p className="font-medium text-forest/80 mt-4 mb-2">Prohibidos en cabina (solo permitidos en bodega):</p>
        <ul className="space-y-1.5">
          <LegalItem>Líquidos en envases superiores a 100 ml (la bolsa de plástico transparente 1L admite envases individuales ≤100 ml).</LegalItem>
          <LegalItem>Objetos cortantes o punzantes: tijeras (&gt;6 cm desde el pivote), navajas, cuchillos.</LegalItem>
          <LegalItem>Bates de béisbol, palos de golf, instrumentos contundentes.</LegalItem>
          <LegalItem>Baterías de litio &gt;100 Wh (requieren aprobación aerolínea); &gt;160 Wh prohibidas en cualquier zona.</LegalItem>
        </ul>

        <p className="mt-3 text-xs text-forest/50">
          Normativa aplicable: Reglamento (CE) 300/2008 sobre seguridad de la aviación civil,
          Reglamento (UE) 185/2010, instrucciones técnicas OACI y regulaciones IATA-DGR
          para mercancías peligrosas. Para vuelos internacionales, consultar también la
          normativa del país de destino.
        </p>
      </LegalSection>

      <LegalSection icon={AlertTriangle} title="Artículos Especiales y Recomendaciones">
        <ul className="space-y-2">
          <LegalItem>
            <strong>Artículos de valor</strong> (joyas, equipos electrónicos, dinero en efectivo,
            documentos): siempre en equipaje de mano; nunca en bodega, ya que las aerolíneas no
            se responsabilizan de su pérdida o daño conforme al Convenio de Montreal 1999.
          </LegalItem>
          <LegalItem>
            <strong>Medicamentos:</strong> llevar en cabina con receta médica visible; si son
            líquidos en cantidad superior a 100 ml, presentar documentación médica en el control.
          </LegalItem>
          <LegalItem>
            <strong>Equipos deportivos</strong> (bicicletas, tablas de surf, esquís): comunicar
            con antelación mínima de 48 h; sujetos a tasas específicas (€30-€120 según aerolínea).
          </LegalItem>
          <LegalItem>
            <strong>Animales de compañía:</strong> en cabina solo mascotas de pequeño tamaño
            (&lt;8 kg con transportín); en bodega con requisitos sanitarios según país de destino.
          </LegalItem>
          <LegalItem>
            <strong>Artículos adquiridos en tiendas Duty-Free:</strong> permitidos en cabina en
            bolsa sellada y con recibo de compra; en vuelos con transbordo, revisar normativa
            del aeropuerto de conexión.
          </LegalItem>
        </ul>
      </LegalSection>

    </LegalLayout>
  );
}
