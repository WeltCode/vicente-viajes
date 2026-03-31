import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, LoaderCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";
import PageSeo from "../components/seo/PageSeo";
import {
  decodeFlightSearchPayload,
  submitFlightBridge,
} from "../services/flightBridge";

const IFRAME_NAME = "vicente-flight-results-frame";

// Convierte YYYYMMDD a formato legible para subtitulo.
const fmtDate = (d) =>
  d ? `${d.slice(6)}/${d.slice(4, 6)}/${d.slice(0, 4)}` : "";

export default function BuscarVuelos() {
  const { searchToken } = useParams();
  const location = useLocation();
  const [status, setStatus] = useState("loading");

  const payload = useMemo(
    // Decodifica token de la URL; si falla, se fuerza estado de error.
    () => decodeFlightSearchPayload(searchToken),
    [searchToken]
  );

  useEffect(() => {
    if (!payload) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const timer = window.setTimeout(() => {
      // POST directo al iframe para mantener navbar/footer dentro del sitio.
      submitFlightBridge(payload, { target: IFRAME_NAME });
      setStatus("ready");
    }, 50);
    return () => window.clearTimeout(timer);
  }, [payload]);

  const handleOpenExternal = () => {
    if (!payload) return;
    // Fallback para abrir resultados fuera del iframe.
    submitFlightBridge(payload, { target: "_blank" });
  };

  const subtitle = payload
    ? [
        fmtDate(payload.startDt),
        payload.endDt ? `Regreso ${fmtDate(payload.endDt)}` : "Solo ida",
        `${payload.adults} adulto${payload.adults > 1 ? "s" : ""}`,
        payload.children > 0
          ? `${payload.children} niño${payload.children > 1 ? "s" : ""}`
          : null,
        payload.infants > 0
          ? `${payload.infants} bebé${payload.infants > 1 ? "s" : ""}`
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Motor de vuelos de Vicente Viajes";

  return (
    <div className="min-h-screen bg-sand">
      <PageSeo
        title={payload ? `Resultados de vuelos ${payload.startPt} a ${payload.endPt}` : "Resultados de vuelos"}
        description="Resultados de búsqueda de vuelos generados desde el motor de Vicente Viajes."
        path={location.pathname}
        noIndex
      />
      <Navbar />

      <PageHeader
        badge="✈️ Buscador de vuelos"
        title={
          payload ? `${payload.startPt} → ${payload.endPt}` : "Resultados de vuelos"
        }
        subtitle={subtitle}
      >
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="cursor-pointer rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            ← Nueva búsqueda
          </Link>
          <button
            type="button"
            onClick={handleOpenExternal}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-teal transition hover:bg-white/90 shadow-card"
          >
            Abrir en pestaña nueva
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </PageHeader>

      <main className="bg-sand py-10 md:py-14">
        <div className="container mx-auto px-4">
          {status === "error" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white px-8 py-16 text-center shadow-card"
            >
              <p className="text-xl font-semibold text-red-700">
                No fue posible cargar esta búsqueda.
              </p>
              <p className="mt-3 text-sm text-forest/65">
                El enlace no contiene una búsqueda válida o fue modificado.
              </p>
              <Link
                to="/"
                className="mt-6 inline-block rounded-xl bg-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-dark transition"
              >
                Volver al inicio
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-elevated"
            >
              {status === "loading" && (
                <div className="flex items-center justify-center gap-3 border-b border-forest/5 bg-mist/50 px-6 py-4 text-sm font-medium text-forest/70">
                  <LoaderCircle className="h-4 w-4 animate-spin text-teal" />
                  Cargando resultados del motor de vuelos…
                </div>
              )}
              <iframe
                title="Resultados de vuelos"
                name={IFRAME_NAME}
                className="w-full bg-white"
                style={{ height: "calc(100vh - 120px)", minHeight: "860px" }}
              />
            </motion.div>
          )}
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
