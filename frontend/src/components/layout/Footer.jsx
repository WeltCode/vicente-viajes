import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

import logo from "../../assets/images/vicentelogo.png";

/* ✅ Animación mínima para WeltBrave */
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="bg-black text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4 md:mb-6">
              <img
                src={logo}
                alt="Vicente Viajes"
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            <p className="text-xs md:text-sm text-white/60 mb-4 md:mb-6 leading-relaxed">
              Tu agencia de viajes de confianza. Diseñamos experiencias únicas
              para que descubras el mundo con comodidad, seguridad y estilo.
            </p>

            <div className="flex gap-2 md:gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                >
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Explorar</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {[
                { name: "Excursiones", path: "/excursiones" },
                { name: "Playas", path: "/playas" },
                { name: "Hoteles", path: "/hoteles" },
                { name: "Ofertas", path: "/ofertas" },
                { name: "Nosotros", path: "/nosotros" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinos */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Destinos Populares</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {["Cancún", "Maldivas", "París", "Nueva York", "Tokio"].map(
                (dest) => (
                  <li key={dest}>
                    <span className="hover:text-primary transition-colors cursor-pointer">
                      {dest}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Contacto</h3>
            <ul className="space-y-3 text-xs md:text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span>Calle Principal 123, Ciudad</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-primary" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-primary" />
                <span>info@vicenteviajes.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 md:mt-14 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-xs md:text-sm text-white/40">
          {/* Left - Copyright */}
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} Vicente Viajes.
          </p>

          {/* Center - Powered by WeltBrave */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <a 
              href="https://weltbrave.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <motion.div className="flex items-center space-x-3 bg-[#303030]/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-[#E33C09]/10 whitespace-nowrap hover:bg-[#303030]/70 transition-colors">
                <span className="text-[#A9A9A9] text-sm">Powered by</span>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="font-bold inline-flex items-center space-x-2"
                >
                  <span className="cursor-pointer text-[#E33C09]">
                    Welt<span className="text-[#E0E0E0]">Brave</span>
                  </span>

                  <motion.img
                    src="https://res.cloudinary.com/da6ggvegj/image/upload/v1760310551/solo_logo_nv0q0b.png"
                    alt="WeltBrave Logo"
                    className="w-5 h-5 rounded-sm"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            </a>
          </motion.div>

          {/* Right - Legal Links */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 whitespace-nowrap text-center md:text-right text-xs md:text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
