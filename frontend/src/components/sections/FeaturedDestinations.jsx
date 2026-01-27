import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import WaveDivider from "./WaveDivider";

const destinations = [
  {
    id: 1,
    name: "Cancún",
    country: "México",
    price: "desde $899",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80",
  },
  {
    id: 2,
    name: "Maldivas",
    country: "Asia",
    price: "desde $1,599",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
  },
  {
    id: 3,
    name: "París",
    country: "Francia",
    price: "desde $1,199",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  },
  {
    id: 4,
    name: "Santorini",
    country: "Grecia",
    price: "desde $999",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="relative py-24 bg-mist overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-teal/5 blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-sage/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-teal/10 text-teal font-medium text-sm uppercase tracking-wider mb-4">
            Explora el Mundo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-forest mb-6 font-display">
            Destinos Destacados
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Descubre los lugares más increíbles del mundo con nuestras ofertas exclusivas
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer overflow-hidden rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300 bg-white flex flex-col h-96"
            >
              {/* Image Container */}
              <div className="relative flex-1 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/20 to-transparent" />

                {/* Star Rating - Top Right */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 px-3 py-1.5 rounded-full text-sm shadow-md">
                  <Star className="w-4 h-4 text-sunset fill-sunset" />
                  <span className="font-semibold text-forest">{dest.rating}</span>
                </div>

                {/* Location and Name - Bottom Left */}
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-1 text-xs text-white/80 mb-1">
                    <MapPin className="w-3 h-3" />
                    {dest.country}
                  </div>
                  <h3 className="text-2xl font-bold font-display">{dest.name}</h3>
                </div>
              </div>

              {/* Price and Action Container */}
              <div className="p-6 bg-white flex items-center justify-between border-t border-muted-foreground/10">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Desde</span>
                  <p className="text-lg font-bold text-teal">{dest.price}</p>
                </div>

                <motion.div
                  whileHover={{ x: 5, scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-sage flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow flex-shrink-0"
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            to="/ofertas"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-dark shadow-elevated hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Ver todos los destinos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Wave Divider Bottom */}
      <WaveDivider position="bottom" fillColor="#e3f2f1" />
    </section>
  );
};

export default FeaturedDestinations;
