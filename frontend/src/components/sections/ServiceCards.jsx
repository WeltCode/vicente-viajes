import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Compass, Waves, Hotel, Tag, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Boletos Aéreos",
    description:
      "Vuelos nacionales e internacionales al mejor precio. Comparamos cientos de aerolíneas para encontrarte la tarifa perfecta.",
    cta: "Buscar vuelos",
    path: "/vuelos",
    accent: "#0ea5e9",
    accentLight: "#f0f9ff",
  },
  {
    icon: Compass,
    title: "Excursiones",
    description:
      "Tours guiados a los destinos más fascinantes. Experiencias únicas con grupos pequeños y guías locales expertos.",
    cta: "Ver excursiones",
    path: "/excursiones",
    accent: "#216869",
    accentLight: "#e3f2f1",
  },
  {
    icon: Waves,
    title: "Playas",
    description:
      "Las playas más paradisíacas a tu alcance. Arena blanca, aguas cristalinas y el descanso que tanto mereces.",
    cta: "Explorar playas",
    path: "/playas",
    accent: "#0891b2",
    accentLight: "#ecfeff",
  },
  {
    icon: Hotel,
    title: "Hoteles",
    description:
      "Hospedaje de calidad garantizada para todos los presupuestos. Desde resorts de lujo hasta cómodas opciones familiares.",
    cta: "Ver hoteles",
    path: "/hoteles",
    accent: "#d97706",
    accentLight: "#fffbeb",
  },
  {
    icon: Tag,
    title: "Ofertas Especiales",
    description:
      "Paquetes con descuentos exclusivos. Vuelo + hotel + traslado a precios que no encontrarás en ningún otro lugar.",
    cta: "Ver ofertas",
    path: "/ofertas",
    accent: "#e11d48",
    accentLight: "#fff1f2",
  },
];

const ServiceCards = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-teal/10 text-teal font-medium text-sm uppercase tracking-wider mb-4">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Todo lo que necesitas para viajar
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Organizamos tu viaje de principio a fin. Vuelos, excursiones,
            playas, hoteles y las mejores ofertas del mercado.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={service.path}
                  className="group flex flex-col h-full rounded-3xl bg-card border border-border/60 hover:shadow-elevated p-6 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle hover bg */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                    style={{ backgroundColor: service.accentLight }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm"
                      style={{ backgroundColor: service.accentLight }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: service.accent }}
                      />
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <div
                      className="mt-5 flex items-center gap-1 text-sm font-semibold group-hover:gap-2.5 transition-all duration-300"
                      style={{ color: service.accent }}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
