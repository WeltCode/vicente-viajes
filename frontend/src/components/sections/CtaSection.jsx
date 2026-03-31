import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MoveRight, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CtaSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-teal to-sage" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white font-medium text-sm uppercase tracking-wider mb-6">
            ¿Listo para despegar?
          </span>

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-5 leading-tight">
            Tu próximo viaje empieza
            <br />
            <span className="text-white/75">con una llamada</span>
          </h2>

          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Nuestros expertos en viajes te ayudan a planificar el itinerario
            perfecto — vuelos, hoteles, excursiones y mucho más. Sin costes
            ocultos, sin sorpresas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-bold text-forest shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Reservar ahora
              <MoveRight className="h-5 w-5" />
            </Link>

            <a
              href="https://wa.me/34612477810"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <FaWhatsapp className="h-5 w-5" />
              WhatsApp
            </a>
          </div>

          {/* Contact info strip */}
          <div className="inline-flex items-center gap-6 flex-wrap justify-center text-white/60 text-sm">
            <a
              href="tel:+34612477810"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              +34 612 47 78 10
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/25" />
            <a
              href="mailto:reservas@vicenteviajes.com"
              className="hover:text-white transition-colors"
            >
              reservas@vicenteviajes.com
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/25" />
            <span>Av. Marqués de Corbera 46, Madrid</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
