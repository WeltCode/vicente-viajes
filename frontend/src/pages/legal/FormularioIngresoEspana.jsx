import React from "react";
import { FileCheck, Globe, ClipboardList, Users, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import LegalLayout, { LegalSection, LegalItem, LegalTable } from "../../components/layout/LegalLayout";

export default function FormularioIngresoEspana() {
  return (
    <LegalLayout
      badge="🇪🇸 Entrada a España"
      title="Formulario de Ingreso a España"
      subtitle="Requisitos de entrada, sistemas de control fronterizo y documentación necesaria para viajar a España y al espacio Schengen, según normativa vigente en 2026."
    >

      <LegalSection icon={ShieldCheck} title="1. Requisitos Generales de Entrada">
        <p>
          España forma parte del <strong className="text-forest">Espacio Schengen</strong>, que agrupa
          a 27 países europeos con libre circulación interna. La entrada a España está regulada
          por el <strong className="text-forest">Reglamento (UE) 2016/399 (Código de Fronteras Schengen)</strong>,
          complementado por normativa nacional.
        </p>
        <LegalTable
          headers={["Perfil del viajero", "Documentos requeridos", "Visado"]}
          rows={[
            ["Ciudadano UE / EEE / Suiza", "DNI o pasaporte en vigor", "No requerido"],
            ["Ciudadano con tarjeta de residencia UE", "Tarjeta de residencia + pasaporte", "No requerido"],
            ["Nacional de país exento de visado (ver lista)", "Pasaporte válido 3 meses tras la estancia + ETIAS desde 2024", "No (ETIAS obligatorio desde 2026)"],
            ["Nacional de país con visado requerido", "Pasaporte + visado Schengen tipo C o D", "Sí — tramitar en embajada española"],
            ["Menor de edad solo / con un progenitor", "Pasaporte + autorización notarial del/de los progenitor/es ausente/s", "Según nacionalidad"],
          ]}
        />
      </LegalSection>

      <LegalSection icon={Globe} title="2. ETIAS — Autorización de Viaje Europea">
        <div className="p-4 rounded-xl bg-teal/8 border border-teal/20 mb-4">
          <p className="font-semibold text-forest mb-1">¿Qué es ETIAS?</p>
          <p className="text-sm">
            El <strong>European Travel Information and Authorisation System</strong> es un
            sistema de preautorización de viaje, similar al ESTA de EEUU, obligatorio desde
            2024 para nacionales de más de 60 países exentos de visado que deseen entrar en
            el Espacio Schengen.
          </p>
        </div>
        <ul className="space-y-2">
          <LegalItem>
            <strong>¿A quién afecta?</strong> Ciudadanos de países latinoamericanos exentos de
            visado Schengen: Colombia, Argentina, Brasil, Chile, Ecuador, Perú, Uruguay, Costa Rica, México (entre otros).
          </LegalItem>
          <LegalItem>
            <strong>¿Cómo solicitarlo?</strong> Online en{" "}
            <a href="https://travel-europe.europa.eu/etias_es" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors inline-flex items-center gap-1">
              travel-europe.europa.eu <ExternalLink className="h-3 w-3" />
            </a>
            , con tarjeta de crédito/débito.
          </LegalItem>
          <LegalItem><strong>Coste:</strong> €7 por solicitante (menores de 18 y mayores de 70 años, gratuito).</LegalItem>
          <LegalItem><strong>Validez:</strong> 3 años o hasta la caducidad del pasaporte; estancias de hasta 90 días en cualquier período de 180 días.</LegalItem>
          <LegalItem><strong>Tiempo de resolución:</strong> habitualmente en minutos; puede tardar hasta 4 días. Se recomienda solicitarlo con antelación.</LegalItem>
          <LegalItem><strong>Vinculado al pasaporte:</strong> si renueva el pasaporte deberá solicitar un nuevo ETIAS aunque el anterior siga vigente.</LegalItem>
        </ul>
        <p className="mt-3 text-xs text-forest/50">
          Base legal: Reglamento (UE) 2018/1240 del Parlamento Europeo y del Consejo.
        </p>
      </LegalSection>

      <LegalSection icon={ClipboardList} title="3. EES — Sistema de Entradas y Salidas">
        <div className="p-4 rounded-xl bg-sage/8 border border-sage/20 mb-4">
          <p className="font-semibold text-forest mb-1">¿Qué es el EES?</p>
          <p className="text-sm">
            El <strong>Entry/Exit System</strong> es una base de datos biométrica de la UE que
            registra las entradas y salidas de nacionales de terceros países en el Espacio Schengen,
            sustituyendo al sellado manual de pasaportes.
          </p>
        </div>
        <ul className="space-y-2">
          <LegalItem>
            <strong>¿A quién afecta?</strong> A todos los nacionales de terceros países (incluidos
            los que tienen ETIAS o visado) que crucen la frontera exterior Schengen.
          </LegalItem>
          <LegalItem>
            <strong>Datos registrados:</strong> nombre, tipo de documento, huella dactilar e
            imagen facial.
          </LegalItem>
          <LegalItem>
            <strong>Objetivo:</strong> controlar el cumplimiento del límite de 90/180 días y
            detectar estancias irregulares («overstay»).
          </LegalItem>
          <LegalItem>
            <strong>Conservación de datos:</strong> 3 años desde el último cruce (7 años si se
            detecta infracción).
          </LegalItem>
          <LegalItem>
            <strong>Derechos:</strong> puede consultar y solicitar corrección de sus datos conforme
            al RGPD ante la Autoridad Nacional de Protección de Datos de cualquier Estado Schengen.
          </LegalItem>
        </ul>
        <p className="mt-3 text-xs text-forest/50">
          Base legal: Reglamento (UE) 2017/2226.
        </p>
      </LegalSection>

      <LegalSection icon={FileCheck} title="4. Visados Schengen — Países que los Requieren">
        <p>
          Los nacionales de los siguientes países latinoamericanos requieren visado tipo C
          (corta estancia) para entrar a España / Espacio Schengen:
        </p>
        <LegalTable
          headers={["País", "Tipo de visado requerido", "Dónde tramitarlo"]}
          rows={[
            ["Bolivia", "Visado Schengen tipo C", "Embajada/Consulado de España"],
            ["Cuba", "Visado Schengen tipo C", "Embajada/Consulado de España"],
            ["República Dominicana", "Visado Schengen tipo C", "Embajada/Consulado de España / Francia"],
            ["Haití", "Visado Schengen tipo C", "Embajada/Consulado de España / Francia"],
            ["Nicaragua", "Visado Schengen tipo C", "Embajada/Consulado de España"],
            ["Venezuela", "Visado Schengen tipo C", "Embajada/Consulado de España"],
            ["Guinea Ecuador", "Visado Schengen tipo C", "Embajada de España"],
          ]}
        />
        <p className="mt-3">
          Para larga estancia (&gt;90 días) o trabajo, se requiere visado tipo D (nacional),
          tramitable exclusivamente en el consulado español del país de residencia.
        </p>
        <p className="mt-2">
          Consulte la lista completa actualizada en{" "}
          <a href="https://www.exteriores.gob.es" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors inline-flex items-center gap-1">
            exteriores.gob.es <ExternalLink className="h-3 w-3" />
          </a>.
        </p>
      </LegalSection>

      <LegalSection icon={Users} title="5. Menores de Edad Viajando a España">
        <p>
          Para menores de 18 años que viajen solos o acompañados por un solo progenitor:
        </p>
        <ul className="space-y-2 mt-2">
          <LegalItem>
            <strong>Viaje solo:</strong> autorización notarial de ambos progenitores o tutores
            legales, con apostilla de La Haya si proviene de país firmante del Convenio de 1961.
          </LegalItem>
          <LegalItem>
            <strong>Con un progenitor:</strong> autorización notarial del progenitor ausente o
            resolución judicial de guarda y custodia.
          </LegalItem>
          <LegalItem>
            <strong>Ciudadanos españoles:</strong> para salir de España con un menor, se aplica
            el artículo 224 bis del Código Penal; se recomienda llevar siempre autorización del
            otro progenitor.
          </LegalItem>
          <LegalItem>
            <strong>Pasaporte propio:</strong> todos los menores, sin excepción, deben viajar
            con su propio pasaporte o DNI individual (no puede figurar en el documento del adulto).
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={AlertTriangle} title="6. Requisitos Sanitarios y Seguro de Viaje">
        <ul className="space-y-2">
          <LegalItem>
            <strong>Tarjeta Sanitaria Europea (TSE):</strong> obligatoria para ciudadanos UE/EEE
            que viajan dentro de la UE; cubre asistencia médica pública de urgencias.
          </LegalItem>
          <LegalItem>
            <strong>Seguro de viaje:</strong> aunque no es obligatorio para ciudadanos UE, es
            <strong className="text-forest"> altamente recomendable</strong> para cubrir repatriación,
            cancelación y gastos médicos adicionales. Para visado Schengen es <strong className="text-forest">obligatorio</strong> un seguro con cobertura mínima de €30.000.
          </LegalItem>
          <LegalItem>
            <strong>Vacunaciones:</strong> no se requieren certificados de vacunación para entrada
            a España desde ningún país (salvo fiebre amarilla en procedentes de zonas endémicas,
            a criterio del médico inspector de sanidad exterior).
          </LegalItem>
          <LegalItem>
            <strong>Declaración aduanera:</strong> obligatoria para cantidades de efectivo superiores
            a €10.000 al entrar o salir del espacio UE (Reglamento UE 2018/1672).
          </LegalItem>
        </ul>
      </LegalSection>

      <LegalSection icon={ExternalLink} title="7. Recursos Oficiales">
        <ul className="space-y-3 mt-1">
          <LegalItem>
            <a href="https://travel-europe.europa.eu/etias_es" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">
              Portal oficial ETIAS — travel-europe.europa.eu
            </a>
          </LegalItem>
          <LegalItem>
            <a href="https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/visados.aspx" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">
              Visados — Ministerio de Asuntos Exteriores de España
            </a>
          </LegalItem>
          <LegalItem>
            <a href="https://www.interior.gob.es/opencms/es/temas/extranjeria/" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">
              Extranjería — Ministerio del Interior de España
            </a>
          </LegalItem>
          <LegalItem>
            <a href="https://ec.europa.eu/home-affairs/what-we-do/policies/borders-and-visas/smart-borders/entry-exit-system_en" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-sage transition-colors">
              Sistema EES — Comisión Europea
            </a>
          </LegalItem>
        </ul>
        <p className="text-xs text-forest/50 mt-4">
          Información actualizada: marzo 2026. Los requisitos pueden cambiar; consulte siempre
          fuentes oficiales antes de viajar. Vicente Viajes no se responsabiliza de cambios
          normativos posteriores a la fecha de publicación.
          Marco legal: Reglamento (UE) 2016/399 · Reglamento (UE) 2018/1240 (ETIAS) · Reglamento (UE) 2017/2226 (EES).
        </p>
      </LegalSection>

    </LegalLayout>
  );
}
