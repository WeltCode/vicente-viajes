import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Flame, MapPin, Camera, Calendar, Clock3,
  Hotel, CheckCircle, Info, X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";
import PageSeo from "../components/seo/PageSeo";
import { apiUrl } from "../services/api";
import { buildWhatsAppUrl } from "../services/siteContact";

const money = (value) => {
  const numeric = Number(value || 0);
  if (numeric <= 0) return null;
  return `€${numeric.toLocaleString("es-ES")}`;
};

const splitLines = (value) =>
  (Array.isArray(value) ? value : String(value || "").split("\n"))
    .map((s) => s.trim())
    .filter(Boolean);

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return value; }
};

const normalizeOffer = (item) => ({
  id: item.id,
  hot: Boolean(item.is_hot_deal),
  discount: String(item.discount || "0%"),
  title: item.title || "",
  city: item.city || "",
  destination: item.destination || "",
  nights: item.nights || "",
  price: money(item.price),
  priceChild: money(item.price_child),
  originalPrice: money(item.original_price),
  validity: item.validity || "",
  imagen: item.image_url || item.image || "",
  imageFormat: item.image_format || "A4",
  description: item.description || "",
  departureDate: formatDate(item.departure_date),
  month: item.month || "",
  returnTime: item.return_time || "",
  hotel: item.hotel || "",
  departureInfo: splitLines(item.departure_info),
  includes: splitLines(item.includes),
  notIncludes: splitLines(item.not_includes),
});

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (index) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: index * 0.08 },
  }),
};

// ─── Tarjeta individual ────────────────────────────────────────────────────────
function OfertaCard({ item, index, onOpen }) {
  const isA4 = item.imageFormat !== "1:1";

  return (
    <motion.article
      key={item.id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      onClick={() => onOpen(item)}
      className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all cursor-pointer group"
    >
      {/* Imagen — altura según formato */}
      <div className={`relative overflow-hidden ${isA4 ? "aspect-[3/4]" : "aspect-square"}`}>
        <img
          src={item.imagen}
          alt={item.title}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />

        {/* Badges arriba — solo Hot Deal */}
        <div className="absolute left-3 top-3">
          {item.hot && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Flame className="h-3.5 w-3.5" />Hot Deal
            </span>
          )}
        </div>

        {/* Título sobre imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          {item.city && (
            <p className="text-sm text-white/80 flex items-center gap-1 mb-0.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />{item.city}
            </p>
          )}
          <h2 className="text-xl font-display font-bold leading-tight line-clamp-2">{item.title}</h2>
          {(item.departureDate || item.month) && (
            <p className="mt-1 text-sm text-white/80 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {item.departureDate || item.month}
            </p>
          )}
        </div>
      </div>

      {/* Info bajo imagen */}
      <div className="p-4">
        {item.nights && (
          <p className="text-xs text-forest/60 flex items-center gap-1 mb-2">
            <Clock3 className="h-3.5 w-3.5" />{item.nights}
          </p>
        )}
        <div className="flex items-end justify-between gap-2">
          <div>
            {item.price && (
              <>
                <span className="text-xs text-forest/60 block">Adulto</span>
                <p className="text-2xl font-bold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                  {item.price}
                </p>
              </>
            )}
            {item.priceChild && (
              <>
                <span className="text-xs text-forest/60 block mt-1">Niño / Mayor 65</span>
                <p className="text-lg font-semibold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                  {item.priceChild}
                </p>
              </>
            )}
            {item.originalPrice && item.price && item.originalPrice !== item.price && (
              <p className="text-xs text-forest/40 line-through">{item.originalPrice}</p>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal to-sage px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
          >
            Ver más <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {item.validity && (
          <p className="mt-2 text-xs text-sage font-medium">{item.validity}</p>
        )}
      </div>
    </motion.article>
  );
}

// ─── Modal de detalle ──────────────────────────────────────────────────────────
function OfertaModal({ item, onClose }) {
  const isA4 = item.imageFormat !== "1:1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Imagen */}
        <div className={`relative overflow-hidden ${isA4 ? "aspect-[3/4] max-h-96" : "aspect-[16/9]"}`}>
          <img src={item.imagen} alt={item.title}
            className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
          {/* Ver imagen completa */}
          <a
            href={item.imagen}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white/90 hover:text-white text-xs px-2.5 py-1.5 rounded-full transition-all border border-white/20"
          >
            <Camera className="h-3.5 w-3.5" />
            Ver imagen completa
          </a>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {item.city && (
              <p className="text-sm text-white/80 flex items-center gap-1 mb-1">
                <MapPin className="h-4 w-4" />{item.city}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-display font-bold leading-tight">{item.title}</h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {item.hot && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold text-sage">
                <Flame className="h-3.5 w-3.5" />Hot Deal
              </span>
            )}
            {item.nights && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
                <Clock3 className="h-3.5 w-3.5" />{item.nights}
              </span>
            )}
            {(item.departureDate || item.month) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                <Calendar className="h-3.5 w-3.5" />{item.departureDate || item.month}
                {item.returnTime && ` · Regreso ${item.returnTime}`}
              </span>
            )}
          </div>

          {/* Precios */}
          <div className="flex flex-wrap gap-4 rounded-xl bg-mist p-4">
            {item.price && (
              <div>
                <p className="text-xs text-forest/60 mb-0.5">Adulto</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                  {item.price}
                </p>
                {item.originalPrice && item.originalPrice !== item.price && (
                  <p className="text-sm text-forest/40 line-through">{item.originalPrice}</p>
                )}
              </div>
            )}
            {item.priceChild && (
              <div>
                <p className="text-xs text-forest/60 mb-0.5">Niño / Mayor 65 / Discapacidad</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                  {item.priceChild}
                </p>
              </div>
            )}
          </div>

          {/* Hotel */}
          {item.hotel && (
            <p className="flex items-center gap-2 text-sm text-forest font-medium">
              <Hotel className="h-4 w-4 text-teal shrink-0" />{item.hotel}
            </p>
          )}

          {/* Descripción */}
          {item.description && (
            <p className="text-sm text-forest/70 leading-relaxed">{item.description}</p>
          )}

          {/* Puntos de salida */}
          {item.departureInfo.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-forest mb-2">
                <MapPin className="h-4 w-4 text-teal" />Puntos de salida
              </h4>
              <ul className="space-y-1">
                {item.departureInfo.map((s, i) => (
                  <li key={i} className="text-sm text-forest/70 pl-2 border-l-2 border-teal/30">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Incluye / No incluye */}
          {(item.includes.length > 0 || item.notIncludes.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.includes.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-forest mb-2">
                    <CheckCircle className="h-4 w-4 text-teal" />Incluye
                  </h4>
                  <ul className="space-y-1">
                    {item.includes.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-forest/70">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.notIncludes.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-forest mb-2">
                    <Info className="h-4 w-4 text-sage" />No incluye
                  </h4>
                  <ul className="space-y-1">
                    {item.notIncludes.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-forest/70">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Vigencia */}
          {item.validity && (
            <p className="text-sm font-medium text-sage">{item.validity}</p>
          )}

          {/* CTAs */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
            <Link
              to={`/contacto?origen=oferta&titulo=${encodeURIComponent(item.title)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-sage px-5 py-3 text-sm font-semibold text-white transition hover:shadow-elevated"
            >
              Reservar <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildWhatsAppUrl(`Hola Vicente Viajes, me interesa la oferta *${item.title}*. ¿Podrían darme más detalles para reservar?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
            >
              WhatsApp <FaWhatsapp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get(apiUrl("ofertas/"))
      .then((res) =>
        setOfertas(
          (res.data || [])
            .filter((item) => item.is_active)
            .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0))
            .map(normalizeOffer)
        )
      )
      .catch(() => setOfertas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-mist">
      <PageSeo
        title="Ofertas de viaje"
        description="Consulta ofertas exclusivas de viaje con descuentos especiales, paquetes destacados y plazas limitadas para tus próximas vacaciones."
        path="/ofertas"
      />
      <Navbar />

      <PageHeader
        badge="🔥 Ofertas Exclusivas"
        title="Las Mejores Ofertas"
        subtitle="Descuentos increíbles en los destinos más deseados. No te pierdas estas oportunidades únicas de viajar por menos."
      />

      <main>
        <section className="py-12 md:py-16 bg-mist">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="py-16 text-center text-forest/60">Cargando ofertas...</p>
            ) : ofertas.length === 0 ? (
              <p className="py-16 text-center text-forest/60">No hay ofertas disponibles en este momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                {ofertas.map((item, index) => (
                  <OfertaCard key={item.id} item={item} index={index} onOpen={setSelected} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal detalle */}
      <AnimatePresence>
        {selected && (
          <OfertaModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
