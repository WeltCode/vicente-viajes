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

import logo from "../../assets/images/vicentelogo.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img
                src={logo}
                alt="Vicente Viajes"
                className="h-14 w-auto"
              />
            </Link>

            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Tu agencia de viajes de confianza. Diseñamos experiencias únicas
              para que descubras el mundo con comodidad, seguridad y estilo.
            </p>

            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Explorar</h3>
            <ul className="space-y-3 text-sm">
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
            <h3 className="text-lg font-semibold mb-6">Destinos Populares</h3>
            <ul className="space-y-3 text-sm">
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
            <h3 className="text-lg font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4 text-sm">
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
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            © {new Date().getFullYear()} Vicente Viajes. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6">
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
