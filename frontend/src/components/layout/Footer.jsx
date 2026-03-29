import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/images/vicentelogo.png";
import { openCookieSettings } from "../../services/cookieConsent";

const legalLinks = [
  { label: "Condiciones Generales",          path: "/condiciones-generales" },
  { label: "Protección de datos",             path: "/proteccion-de-datos" },
  { label: "Política de Privacidad",          path: "/politica-de-privacidad" },
  { label: "Política de Cookies",             path: "/politica-de-cookies" },
  { label: "Equipaje permitido",              path: "/equipaje-permitido" },
  { label: "Modificacion / Cancelacion",      path: "/modificacion-cancelacion" },
  { label: "Formulario de ingreso a España",  path: "/formulario-ingreso-espana" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    bg: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0  },
};

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/80">

      {/* ── Banda superior: dirección · logo · síguenos ── */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

          {/* Izquierda – datos de contacto */}
          <div className="text-center md:text-left space-y-1.5">
            <p className="text-sm font-medium text-white/90 leading-relaxed uppercase tracking-wide">
              Avenida del Marqués de Corbera 46, Local 1,<br />
              28017 Madrid
            </p>
            <p className="text-sm text-white/60">
              +34 612 47 78 10 / reservas@vicenteviajes.com
            </p>
          </div>

          {/* Centro – logotipo */}
          <div className="flex justify-center">
            <Link to="/">
              <img
                src={logo}
                alt="Vicente Viajes"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Derecha – redes sociales */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-xs font-bold tracking-[0.25em] text-white uppercase">
              Síguenos
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                  style={{ background: s.bg }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Divisor ── */}
      <div className="border-t border-white/10" />

      {/* ── Banda inferior: copyright · CIF · links legales ── */}
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col items-center gap-3 text-center">

        {/* Copyright */}
        <p className="text-sm text-white/60">
          Copyright © {new Date().getFullYear()} Vicente Viajes
        </p>

        {/* Powered by WeltBrave */}
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

        {/* CIF */}
        <p className="text-xs text-white/50">
          Vicente &amp; Viajes S.L. C.I.C.M.A. nº4371 &nbsp;·&nbsp; CIF: B88482856
        </p>

        {/* Links legales separados por | */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-xs text-white/40">
          {legalLinks.map((link, i) => (
            <React.Fragment key={link.path}>
              <Link
                to={link.path}
                className="hover:text-white/70 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
              {i < legalLinks.length - 1 && (
                <span className="text-white/20 select-none">|</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-white/20 select-none">|</span>
          <button
            type="button"
            onClick={openCookieSettings}
            className="hover:text-white/70 transition-colors whitespace-nowrap"
          >
            Configurar cookies
          </button>
        </div>

      </div>
    </footer>
  );
}
