import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsAppButton";
import PageHeader from "../sections/PageHeader";

/** Tarjeta de sección reutilizable dentro de las páginas legales */
export function LegalSection({ icon: Icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.42 }}
      className="bg-white rounded-2xl shadow-card border border-forest/5 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-teal to-sage flex-shrink-0" />
        {Icon && <Icon className="h-5 w-5 text-teal flex-shrink-0" />}
        <h2 className="text-lg md:text-xl font-bold text-forest">{title}</h2>
      </div>
      <div className="text-sm md:text-base text-forest/70 space-y-3 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}

/** Elemento de lista con viñeta teal */
export function LegalItem({ children }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 h-2 w-2 rounded-full bg-teal flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

/** Tabla simple para franquicias de equipaje u otros datos tabulares */
export function LegalTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-forest/10 mt-3">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-teal/10 to-sage/10">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-forest/80 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-mist/40"}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-forest/70 border-t border-forest/5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Wrapper principal de página legal */
export default function LegalLayout({ badge, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <PageHeader badge={badge} title={title} subtitle={subtitle} />
      <main className="py-10 md:py-14 bg-mist">
        <div className="container mx-auto px-4 max-w-4xl space-y-5">
          {children}
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
