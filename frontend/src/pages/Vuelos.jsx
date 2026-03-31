import React from "react";
import { motion } from "framer-motion";
import { Plane, Code2, ShieldCheck } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";
import PageSeo from "../components/seo/PageSeo";

export default function Vuelos() {
  return (
    <div className="min-h-screen bg-mist">
      <PageSeo
        title="Vuelos"
        description="Consulta opciones para buscar vuelos con Vicente Viajes y recibe apoyo personalizado para organizar tu próximo trayecto al mejor precio."
        path="/vuelos"
      />
      <Navbar />

      <PageHeader
        badge="✈️ Búsqueda de vuelos"
        title="Tu próximo vuelo empieza aquí"
        subtitle="Esta página está preparada para conectar un motor externo de vuelos manteniendo intacto el estilo visual de Vicente Viajes."
      />

      <main className="py-12 md:py-16 bg-mist">
        <div className="container mx-auto px-4">
          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-forest/10 bg-white shadow-elevated overflow-hidden"
          >
            <div className="border-b border-forest/10 bg-gradient-to-r from-teal/8 via-sage/10 to-teal/8 px-6 py-5 md:px-8">
              <div className="flex flex-wrap items-center gap-3 text-forest">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
                  <Plane className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Zona de integración del motor</h2>
                  <p className="text-sm md:text-base text-forest/70">
                    Área lista para que un desarrollador externo implemente su buscador de vuelos.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div
                id="flight-search-root"
                data-integration="external-flight-engine"
                className="relative overflow-hidden rounded-2xl border-2 border-dashed border-teal/25 bg-mist/40 p-6 md:p-8"
              >
                <motion.div
                  aria-hidden="true"
                  initial={{ x: "-130%" }}
                  animate={{ x: "130%" }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute left-0 top-0 h-[3px] w-1/2 bg-gradient-to-r from-transparent via-teal to-transparent"
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <article className="rounded-xl bg-white px-4 py-4 shadow-card ring-1 ring-black/5">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
                      <Code2 className="h-4 w-4" />
                      Punto de montaje
                    </p>
                    <p className="mt-2 text-sm text-forest/70">
                      Inserta aquí el componente o script del proveedor externo.
                    </p>
                  </article>

                  <article className="rounded-xl bg-white px-4 py-4 shadow-card ring-1 ring-black/5">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
                      <ShieldCheck className="h-4 w-4" />
                      Diseño protegido
                    </p>
                    <p className="mt-2 text-sm text-forest/70">
                      Se mantiene el mismo ecosistema visual: navbar, espaciado, fondo y footer.
                    </p>
                  </article>

                  <article className="rounded-xl bg-white px-4 py-4 shadow-card ring-1 ring-black/5">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
                      <Plane className="h-4 w-4" />
                      Área flexible
                    </p>
                    <p className="mt-2 text-sm text-forest/70">
                      Preparada para widgets embebidos, iframes o interfaces completas de resultados.
                    </p>
                  </article>
                </div>

                <div className="mt-6 rounded-xl border border-forest/10 bg-white px-4 py-4 text-sm text-forest/65 md:px-5">
                  <p>
                    Este bloque tiene <span className="font-semibold text-forest">id=&quot;flight-search-root&quot;</span> para montar la integración sin modificar componentes globales.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
