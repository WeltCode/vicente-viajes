import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import logo from "../../assets/images/vicentelogo.png";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Excursiones", path: "/excursiones" },
  { name: "Playas", path: "/playas" },
  { name: "Hoteles", path: "/hoteles" },
  { name: "Ofertas", path: "/ofertas" },
  { name: "Nosotros", path: "/nosotros" },
  { name: "Contacto", path: "/contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Vicente Viajes"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${
                    isActive ? "text-teal" : "text-black/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link
              to="/contacto"
              className="px-5 py-2.5 rounded-full bg-teal text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] hover:bg-teal-dark transition-all"
            >
              Reservar ahora
            </Link>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-black/10"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-teal text-white"
                        : "text-black/70 hover:text-teal hover:bg-teal/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <Link
                to="/contacto"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-center px-5 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
              >
                Reservar ahora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
