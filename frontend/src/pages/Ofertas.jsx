import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Flame, MapPin, Percent } from "lucide-react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";

const money = (value) => {
  const numeric = Number(value || 0);
  return `€${numeric.toLocaleString("es-ES")}`;
};

const normalizeOffer = (item) => ({
  id: item.id,
  hot: Boolean(item.is_hot_deal),
  discount: String(item.discount || "0%"),
  ciudad: item.city || "",
  titulo: item.title || "",
  noches: item.nights || "",
  destino: item.destination || "",
  precio: money(item.price),
  precioOriginal: money(item.original_price),
  vigencia: item.validity || "",
  imagen: item.image || "",
});

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.08 },
  }),
};

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/ofertas/")
      .then((res) =>
        setOfertas((res.data || []).filter((item) => item.is_active).map(normalizeOffer))
      )
      .catch(() => setOfertas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />

      <PageHeader
        badge="🔥 Ofertas Exclusivas"
        title="Las Mejores Ofertas"
        subtitle="Descuentos increibles en los destinos mas deseados. No te pierdas estas oportunidades unicas de viajar por menos."
      />

      <main>
        <section className="py-12 md:py-16 bg-mist">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="py-16 text-center text-forest/60">Cargando ofertas...</p>
            ) : ofertas.length === 0 ? (
              <p className="py-16 text-center text-forest/60">No hay ofertas disponibles en este momento.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {ofertas.map((item, index) => (
              <motion.article
                key={item.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -6 }}
                className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-forest/30 to-transparent" />

                  <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                    {item.hot ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        <Flame className="h-3.5 w-3.5" />
                        Hot Deal
                      </span>
                    ) : (
                      <span className="h-7" />
                    )}

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#d2a24c] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <Percent className="h-3.5 w-3.5" />
                      {item.discount}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm text-white/85">{item.ciudad}</p>
                    <h2 className="text-3xl leading-tight font-display font-bold">
                      {item.titulo}
                    </h2>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-forest/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      {item.noches}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {item.destino}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    <p className="text-4xl font-bold tracking-tight text-teal">{item.precio}</p>
                    <p className="pb-1 text-2xl text-forest/45 line-through">{item.precioOriginal}</p>
                  </div>

                  <p className="mt-2 text-base font-medium text-sage">{item.vigencia}</p>

                  <a
                    href="/contacto"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-sage px-4 py-3 text-base font-semibold text-white transition-all hover:shadow-elevated"
                  >
                    ¡Reservar Ahora!
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            ))}
            </div>
            )}
          </div>
        </section>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
