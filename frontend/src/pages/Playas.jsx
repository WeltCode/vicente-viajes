import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { MapPin, ArrowRight, Camera, Calendar, Users, CheckCircle, Info, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";
import PageSeo from "../components/seo/PageSeo";
import { apiUrl } from "../services/api";
import { buildWhatsAppUrl } from "../services/siteContact";

const normalizeGroupSize = (value) => {
  const str = String(value || "").trim();
  if (!str || str === "-") return null;
  if (/^\d+$/.test(str)) return `${str} personas`;
  return str;
};

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return value; }
};

const splitLines = (value) =>
  (Array.isArray(value) ? value : String(value || "").split("\n"))
    .map((s) => s.trim())
    .filter(Boolean);

const normalizeBeach = (b) => {
  const price = Number(b.price);
  const priceChild = b.price_child != null ? Number(b.price_child) : null;
  return {
    id: b.id,
    name: b.title,
    location: b.location,
    price: Number.isNaN(price) ? null : price,
    priceChild: priceChild != null && !Number.isNaN(priceChild) ? priceChild : null,
    image: b.image_url || b.image,
    description: b.description || b.short_description || "",
    groupSize: normalizeGroupSize(b.group_size),
    departure_date: b.departure_date || null,
    month: b.month || null,
    departureDate: formatDate(b.departure_date),
    departure_info: splitLines(b.departure_info),
    includes: splitLines(b.includes),
    not_includes: splitLines(b.not_includes),
    is_active: Boolean(b.is_active),
    is_featured: Boolean(b.is_featured),
  };
};

const Playas = () => {
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBeach, setSelectedBeach] = useState(null);

  useEffect(() => {
    axios
      .get(apiUrl("playas/"))
      .then((res) => {
        const data = (res.data || [])
          .map(normalizeBeach)
          .filter((b) => b.is_active)
          .sort((a, b) => {
            if (!a.departure_date && !b.departure_date) return 0;
            if (!a.departure_date) return 1;
            if (!b.departure_date) return -1;
            return new Date(a.departure_date) - new Date(b.departure_date);
          });
        setBeaches(data);
      })
      .catch(() => setBeaches([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-mist">
      <PageSeo
        title="Playas paradisíacas"
        description="Explora escapadas a playas paradisíacas con precios desde origen, destinos destacados y asesoría de Vicente Viajes para reservar sin complicaciones."
        path="/playas"
      />
      <Navbar />

      {/* Hero Section with PageHeader */}
      <PageHeader
        badge="🌊 Paraíso Tropical"
        title="Playas Paradisíacas"
        subtitle="Escapa a las playas más hermosas del mundo. Arena blanca, aguas cristalinas y el paraíso que siempre soñaste."
      />

      {/* Beaches Grid */}
      <section className="py-12 md:py-16 bg-mist">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-forest/60 py-16">Cargando playas...</p>
          ) : beaches.length === 0 ? (
            <p className="text-center text-forest/60 py-16">No hay playas disponibles en este momento.</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {beaches.map((beach, index) => (
              <motion.div
                key={beach.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedBeach(beach)}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-500 cursor-pointer group border border-gray-200/50"
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />

                  {beach.is_featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Destacada
                    </div>
                  )}

                  {beach.price != null && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-teal to-sage text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      desde €{beach.price.toLocaleString("es-ES")}
                    </div>
                  )}

                  {beach.month && (
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/30">
                      {beach.month}
                    </div>
                  )}

                  {/* Location & Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-1 text-sm text-white/80 mb-1">
                      <MapPin className="w-4 h-4" />
                      {beach.location}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">{beach.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  {beach.departureDate && (
                    <div className="flex items-center gap-1.5 text-xs text-forest/60 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-teal" />
                      Salida: {beach.departureDate}
                    </div>
                  )}
                  <div className="flex items-end justify-between">
                    <div>
                      {beach.price != null && (
                        <>
                          <span className="text-xs text-forest/60 block">Adulto</span>
                          <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                            €{beach.price.toLocaleString("es-ES")}
                          </p>
                        </>
                      )}
                      {beach.priceChild != null && (
                        <p className="text-xs text-forest/60 mt-0.5">
                          Niño/Mayor65: €{beach.priceChild.toLocaleString("es-ES")}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-teal to-sage text-white font-semibold px-4 md:px-6 py-2 rounded-lg text-sm hover:shadow-lg transition-shadow"
                    >
                      Ver más
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Beach Detail Modal */}
      <AnimatePresence>
      {selectedBeach && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedBeach(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Modal Header Image */}
            <div className="relative h-72 overflow-hidden">
              <img
                src={selectedBeach.image}
                alt={selectedBeach.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
              {/* Ver imagen completa */}
              <a
                href={selectedBeach.image}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white/90 hover:text-white text-xs px-2.5 py-1.5 rounded-full transition-all border border-white/20"
              >
                <Camera className="w-3.5 h-3.5" />
                Ver imagen completa
              </a>
              <button
                onClick={() => setSelectedBeach(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {selectedBeach.location}
                </div>
                <h2 className="text-3xl font-bold text-white">{selectedBeach.name}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-18rem)]">

              {/* Quick info grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {selectedBeach.departureDate && (
                  <div className="bg-teal/5 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-teal mx-auto mb-1" />
                    <p className="text-xs text-forest/60">Fecha de salida</p>
                    <p className="font-semibold text-sm text-forest">{selectedBeach.departureDate}</p>
                  </div>
                )}
                {selectedBeach.groupSize && (
                  <div className="bg-sage/5 rounded-xl p-3 text-center">
                    <Users className="w-5 h-5 text-sage mx-auto mb-1" />
                    <p className="text-xs text-forest/60">Mínimo de personas</p>
                    <p className="font-semibold text-sm text-forest">{selectedBeach.groupSize}</p>
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className="bg-gradient-to-r from-teal to-sage p-5 rounded-2xl mb-6 text-white">
                <p className="text-sm opacity-80 mb-1 text-center">Precio por persona</p>
                <div className="flex items-center justify-center gap-6">
                  {selectedBeach.price != null && (
                    <div className="text-center">
                      <p className="text-3xl font-bold">€{selectedBeach.price.toLocaleString("es-ES")}</p>
                      <p className="text-xs opacity-80 mt-0.5">Adulto</p>
                    </div>
                  )}
                  {selectedBeach.priceChild != null && (
                    <>
                      <div className="h-10 w-px bg-white/30" />
                      <div className="text-center">
                        <p className="text-2xl font-bold">€{selectedBeach.priceChild.toLocaleString("es-ES")}</p>
                        <p className="text-xs opacity-80 mt-0.5">Niño / Mayor 65 / Discapacidad</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Descripción */}
              {selectedBeach.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-forest mb-3">Descripción</h3>
                  <p className="text-forest/70 leading-relaxed">{selectedBeach.description}</p>
                </div>
              )}

              {/* Itinerario / Puntos de salida */}
              {selectedBeach.departure_info.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-forest mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal" />
                    Itinerario / Puntos de salida
                  </h3>
                  <div className="space-y-2">
                    {selectedBeach.departure_info.map((stop, i) => (
                      <div key={i} className="relative pl-8 pb-2 border-l-2 border-teal/30 last:border-l-0">
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-sm text-forest">
                          {stop}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incluye + No incluye */}
              {(selectedBeach.includes.length > 0 || selectedBeach.not_includes.length > 0) && (
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  {selectedBeach.includes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-forest mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-teal" />
                        Incluye
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedBeach.includes.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-forest/80">
                            <div className="w-2 h-2 rounded-full bg-teal shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedBeach.not_includes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-forest mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-amber-500" />
                        Observaciones
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedBeach.not_includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-forest/70">
                            <div className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-amber-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3">
                <a
                  href={`/contacto?origen=playa&titulo=${encodeURIComponent(selectedBeach.name)}`}
                  className="flex-1 bg-gradient-to-r from-teal to-sage text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Reservar Ahora
                </a>
                <a
                  href={buildWhatsAppUrl(`Hola Vicente Viajes, me interesa la excursión a la playa ${selectedBeach.name}. ¿Podrían enviarme disponibilidad y condiciones de reserva?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold flex items-center gap-2 hover:bg-[#128C7E] transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
        <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Playas;
