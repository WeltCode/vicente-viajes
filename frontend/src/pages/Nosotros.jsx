import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import {
  Award,
  Users,
  Globe,
  Heart,
  Target,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plane,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/sections/PageHeader";
import WhatsAppButton from "../components/WhatsAppButton";

const team = [
  {
    name: "Vicente Garcia",
    role: "Fundador & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    specialty: "Estrategia Comercial",
  },
  {
    name: "Maria Lopez",
    role: "Directora de Operaciones",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    specialty: "Operacion de Grupos",
  },
  {
    name: "Carlos Ruiz",
    role: "Jefe de Ventas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialty: "Paquetes a Medida",
  },
  {
    name: "Ana Martinez",
    role: "Especialista en Destinos",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    specialty: "Experiencias Premium",
  },
];

const stats = [
  { icon: Users, value: "15,000+", label: "Viajeros Felices" },
  { icon: Globe, value: "500+", label: "Destinos" },
  { icon: Award, value: "25", label: "Anos de Experiencia" },
  { icon: Heart, value: "98%", label: "Satisfaccion" },
];

const differentiators = [
  {
    icon: ShieldCheck,
    title: "Seguridad y respaldo",
    desc: "Acompanamiento antes, durante y despues de cada viaje.",
    tone: "from-cyan-500/30 to-cyan-300/10",
  },
  {
    icon: Plane,
    title: "Paquetes a medida",
    desc: "Combinamos vuelos, hotel y experiencias segun tu presupuesto.",
    tone: "from-teal/30 to-sage/10",
  },
  {
    icon: Sparkles,
    title: "Atencion cercana",
    desc: "Trato humano y recomendaciones reales para cada destino.",
    tone: "from-emerald-500/30 to-emerald-300/10",
  },
];

const teamGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const teamCardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Nosotros() {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const whatsappUrl =
    "https://wa.me/34600750758?text=%C2%A1Hola%20Vicente%20Viajes!%20Me%20gustaria%20recibir%20asesoria%20para%20mi%20proximo%20viaje.";

  const handleTeamPrev = () => {
    setCurrentTeamIndex((prev) => (prev === 0 ? team.length - 1 : prev - 1));
  };

  const handleTeamNext = () => {
    setCurrentTeamIndex((prev) => (prev === team.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main className="pt-20">
        <PageHeader
          badge="Nuestra Historia"
          title="Sobre Vicente Viajes"
          subtitle="Mas de 25 anos creando experiencias de viaje memorables con un servicio humano, cercano y profesional."
        />

        <section className="relative overflow-hidden bg-white py-16 md:py-20">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sage/10 blur-3xl" />

          <div className="container relative z-10 mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.article
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-2xl border border-[#d4e4df] bg-[#f7fbfa] p-5 text-center shadow-sm"
                >
                  <stat.icon className="mx-auto mb-3 h-8 w-8 text-teal md:h-10 md:w-10" />
                  <p className="mb-1 text-2xl font-bold text-foreground md:text-4xl">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground md:text-sm">{stat.label}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20">
          <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-teal">
                Nuestra Historia
              </span>
              <h2 className="mt-4 text-3xl font-display font-bold text-foreground md:text-5xl">
                Una agencia que nacio para hacerte viajar mejor
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Vicente Viajes nacio en 1999 con un objetivo claro: que viajar sea mas simple,
                mas seguro y mucho mas emocionante para cada cliente. De una pequena oficina
                familiar, evolucionamos a un equipo experto en disenar viajes a medida.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Hoy combinamos experiencia, tecnologia y trato humano para que cada ruta,
                excursion y escapada tenga calidad premium y cero estres para ti.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[360px] justify-self-center lg:justify-self-end"
            >
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&q=80"
                alt="Equipo Vicente Viajes"
                className="w-full rounded-3xl shadow-elevated"
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-teal font-semibold text-sm uppercase tracking-[0.2em]">
                Principios
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
                Mision, Vision y Diferencia
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-card p-8 shadow-card"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-sage">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">Nuestra Mision</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Crear experiencias de viaje inolvidables con servicio personalizado, seguro y de alta calidad, para que cada cliente viaje con total confianza.
                </p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="rounded-3xl bg-card p-8 shadow-card"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sunset to-coral">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">Nuestra Vision</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Ser la agencia lider en el mercado hispano, reconocida por excelencia, innovacion y compromiso real con la experiencia del viajero.
                </p>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="rounded-3xl border border-[#d7e8e2] bg-[#f4fbf9] p-8 shadow-card"
              >
                <h3 className="mb-5 text-2xl font-bold text-foreground">Por que elegirnos</h3>
                <div className="space-y-4">
                  {differentiators.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.tone}`}>
                          <item.icon className="h-5 w-5 text-forest" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 bg-background">
        <div className="absolute top-12 left-0 h-52 w-52 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute bottom-8 right-8 h-64 w-64 rounded-full bg-sage/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal font-semibold text-sm uppercase tracking-[0.2em]">
              Nuestro Equipo
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#102a2b] mt-2">
              Conoce al Equipo
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Profesionales apasionados por convertir cada viaje en una experiencia memorable.
            </p>
          </motion.div>

          {/* Desktop Grid */}
          <motion.div
            className="hidden lg:grid grid-cols-4 gap-6"
            variants={teamGridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={teamCardVariants}
                className="group relative overflow-hidden rounded-3xl border border-[#d6e5e0] bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-elevated"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425]/80 via-[#0f2425]/20 to-transparent opacity-80" />
                  <p className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-xs text-white backdrop-blur-sm">
                    {member.specialty}
                  </p>
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-teal font-medium">{member.role}</p>
                  <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-teal to-sage" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <div className="relative flex items-center justify-center gap-4">
              {/* Left Button */}
              <button
                onClick={handleTeamPrev}
                className="absolute left-0 z-10 rounded-full border border-teal/20 bg-white/90 p-2 text-teal shadow-md transition hover:bg-teal hover:text-white"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Carousel */}
              <div className="w-full overflow-hidden">
                <motion.div
                  animate={{ x: -currentTeamIndex * 100 + "%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex"
                >
                  {team.map((member) => (
                    <motion.div
                      key={member.name}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="group overflow-hidden rounded-3xl border border-[#d6e5e0] bg-white shadow-card">
                        <div className="relative overflow-hidden">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425]/80 via-[#0f2425]/20 to-transparent opacity-80" />
                        </div>

                        <div className="p-5 text-center">
                          <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                          <p className="text-sm text-teal font-medium">{member.role}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{member.specialty}</p>
                          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-teal to-sage" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Button */}
              <button
                onClick={handleTeamNext}
                className="absolute right-0 z-10 rounded-full border border-teal/20 bg-white/90 p-2 text-teal shadow-md transition hover:bg-teal hover:text-white"
                aria-label="Siguiente"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTeamIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTeamIndex ? "bg-teal" : "bg-teal/30"
                  }`}
                  aria-label={`Ir a miembro ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

        <section className="py-20 bg-mist">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-r from-forest via-teal to-sage px-6 py-12 text-center shadow-elevated md:px-12"
            >
              <h2 className="text-3xl font-display font-bold text-white md:text-5xl">
                Listo para planear tu proximo viaje?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/80">
                Cuentanos que destino tienes en mente y te ayudamos a crear una experiencia personalizada.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-forest transition hover:scale-[1.03]"
                >
                  Solicitar asesoria
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Escribir por WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <WhatsAppButton />
      </main>
      <Footer />
    </div>
  );
}