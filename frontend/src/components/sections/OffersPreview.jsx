import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, Clock3, Flame, MapPin } from "lucide-react";

const money = (value) => {
  const numeric = Number(value || 0);
  if (!numeric) return null;
  return `€${numeric.toLocaleString("es-ES")}`;
};

export default function OffersPreview() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/ofertas/")
      .then((res) => {
        const active = (res.data || []).filter((o) => o.is_active);
        setOffers(active.slice(0, 3));
      })
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !offers.length) return null;

  return (
    <section className="py-20 bg-mist">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-medium text-sm uppercase tracking-wider mb-4">
              <Flame className="h-3.5 w-3.5" />
              Ofertas Exclusivas
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
              Viaja por menos,
              <br />
              <span className="text-teal">vive por más</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg">
              Descuentos increíbles en los destinos más deseados. ¡Plazas
              limitadas — reserva antes de que se agoten!
            </p>
          </div>
          <Link
            to="/ofertas"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-teal/40 bg-white px-5 py-2.5 text-sm font-semibold text-teal shadow-sm transition hover:bg-teal hover:text-white"
          >
            Ver todas las ofertas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white/60 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.title || "Oferta"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-teal/30 to-sage/30 flex items-center justify-center">
                      <span className="text-5xl">✈️</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {offer.is_hot_deal && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                        <Flame className="h-3 w-3" />
                        Hot Deal
                      </span>
                    )}
                  </div>
                  {offer.discount && (
                    <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-rose-600 shadow">
                      -{offer.discount}
                    </span>
                  )}

                  {/* City on image bottom */}
                  {offer.city && (
                    <div className="absolute bottom-3 left-4 flex items-center gap-1 text-white text-sm font-semibold">
                      <MapPin className="h-3.5 w-3.5" />
                      {offer.city}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-bold text-foreground text-lg leading-snug mb-2 line-clamp-2">
                    {offer.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" />
                    {offer.nights ? `${offer.nights} noches` : "Duración variable"}
                    {offer.destination && (
                      <>
                        <span className="mx-1">·</span>
                        {offer.destination}
                      </>
                    )}
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div>
                      {money(offer.original_price) && (
                        <span className="text-sm line-through text-muted-foreground mr-1.5">
                          {money(offer.original_price)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-forest">
                        {money(offer.price) || "Consultar"}
                      </span>
                      {money(offer.price) && (
                        <span className="text-xs text-muted-foreground ml-1">
                          / persona
                        </span>
                      )}
                    </div>

                    <Link
                      to="/ofertas"
                      className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal transition hover:bg-teal hover:text-white"
                    >
                      Ver oferta
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
