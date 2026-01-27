import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { MapPin, Star, Waves, Sun, ArrowRight } from "lucide-react";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";

const beaches = [
  {
    id: 1,
    name: "Playa del Carmen",
    location: "México",
    price: "desde $799",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    features: ["Arena blanca", "Snorkel", "Vida nocturna"],
    description: "Uno de los destinos de playa más populares de México con una vibrante vida nocturna y aguas turquesas.",
    duration: "7 días",
    groupSize: "Grupos desde 2 personas",
  },
  {
    id: 2,
    name: "Playa Bávaro",
    location: "República Dominicana",
    price: "desde $699",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80",
    features: ["Todo incluido", "Palmeras", "Aguas cristalinas"],
    description: "Paradise Beach con resorts de lujo frente al mar y playas de arena blanca interminable.",
    duration: "5-10 días",
    groupSize: "Familias y parejas",
  },
  {
    id: 3,
    name: "Phi Phi Islands",
    location: "Tailandia",
    price: "desde $999",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&q=80",
    features: ["Kayak", "Buceo", "Paisajes únicos"],
    description: "Islas tropicales con acantilados espectaculares, cuevas y arrecifes de coral únicos.",
    duration: "4-8 días",
    groupSize: "Aventureros",
  },
  {
    id: 4,
    name: "Bora Bora",
    location: "Polinesia Francesa",
    price: "desde $2,499",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=800&q=80",
    features: ["Bungalows", "Luna de miel", "Exclusivo"],
    description: "Destino de lujo con bungalows privados sobre agua cristalina y servicio impecable.",
    duration: "7-14 días",
    groupSize: "Parejas",
  },
  {
    id: 5,
    name: "Varadero",
    location: "Cuba",
    price: "desde $599",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    features: ["20km playa", "Cultura", "Música"],
    description: "La playa más larga de Cuba con una atmósfera auténtica y cultura vibrante.",
    duration: "5-7 días",
    groupSize: "Todos",
  },
  {
    id: 6,
    name: "Zanzibar",
    location: "Tanzania",
    price: "desde $1,199",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1586285299890-b09c9a3a63a2?w=800&q=80",
    features: ["Especias", "Cultura Swahili", "Atardeceres"],
    description: "Isla histórica con playas exóticas, mercados de especias y atardeceres mágicos.",
    duration: "6-9 días",
    groupSize: "Viajeros culturales",
  },
];

const Playas = () => {
  const [selectedBeach, setSelectedBeach] = useState(null);

  return (
    <div className="min-h-screen bg-mist">
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
                className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {/* Image Container */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/30 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1 bg-white rounded-lg px-2.5 md:px-3 py-1 md:py-1.5 shadow-md">
                    <Star className="w-4 h-4 text-sunset fill-sunset" />
                    <span className="font-semibold text-sm text-forest">
                      {beach.rating}
                    </span>
                  </div>

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
                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {beach.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 md:px-3 py-1 bg-teal/10 text-teal rounded-full text-xs md:text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Info & Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs md:text-sm text-forest/60 block">
                        Desde
                      </span>
                      <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                        {beach.price}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-teal to-sage text-white font-semibold px-4 md:px-6 py-2 rounded-lg text-sm hover:shadow-lg transition-shadow"
                    >
                      Reservar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beach Detail Modal */}
      {selectedBeach && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedBeach(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={selectedBeach.image}
                alt={selectedBeach.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedBeach(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-forest mb-2">
                    {selectedBeach.name}
                  </h2>
                  <div className="flex items-center gap-2 text-forest/70 mb-4">
                    <MapPin className="w-5 h-5" />
                    {selectedBeach.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-sunset/10 px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-sunset fill-sunset" />
                  <span className="font-semibold text-sunset">
                    {selectedBeach.rating}
                  </span>
                </div>
              </div>

              <p className="text-forest/70 mb-6">{selectedBeach.description}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-teal/5 p-4 rounded-lg">
                  <p className="text-sm text-forest/60 mb-1">Duración</p>
                  <p className="font-semibold text-forest">{selectedBeach.duration}</p>
                </div>
                <div className="bg-sage/5 p-4 rounded-lg">
                  <p className="text-sm text-forest/60 mb-1">Ideal para</p>
                  <p className="font-semibold text-forest">
                    {selectedBeach.groupSize}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-bold text-forest mb-3">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBeach.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 bg-teal/10 text-teal rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-forest/60">Precio</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal to-sage bg-clip-text text-transparent">
                    {selectedBeach.price}
                  </p>
                </div>
                <a
                  href={`https://wa.me/?text=Hola, quisiera más información sobre ${selectedBeach.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-gradient-to-r from-teal to-sage text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  Consultar <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
        <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Playas;
