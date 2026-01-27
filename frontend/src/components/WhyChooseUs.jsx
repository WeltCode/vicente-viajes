import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  HeartHandshake,
  Wallet,
  Globe,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Viajes Seguros",
    description:
      "Tu seguridad es nuestra prioridad. Todos nuestros viajes incluyen seguro de viajero.",
  },
  {
    icon: Wallet,
    title: "Mejores Precios",
    description:
      "Garantizamos los mejores precios del mercado con opciones flexibles de pago.",
  },
  {
    icon: Globe,
    title: "500+ Destinos",
    description:
      "Acceso a más de 500 destinos en todo el mundo para que elijas tu aventura ideal.",
  },
  {
    icon: Clock,
    title: "Reserva Fácil",
    description:
      "Proceso de reserva simple y rápido. Confirma tu viaje en minutos.",
  },
  {
    icon: HeartHandshake,
    title: "Atención Personalizada",
    description:
      "Nuestros expertos en viajes te acompañan en cada paso de tu aventura.",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description:
      "Estamos disponibles las 24 horas para resolver cualquier duda o emergencia.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-teal/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-sage/5 blur-3xl" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--forest)) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-teal/10 text-primary font-medium text-sm uppercase tracking-wider mb-4">
            ¿Por Qué Elegirnos?
          </span>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            La Experiencia Vicente Viajes
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Más de 25 años haciendo realidad los sueños de miles de viajeros
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-teal/30 hover:shadow-elevated transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-sage flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-br from-teal/10 to-sage/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
