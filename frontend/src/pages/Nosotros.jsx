import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, Users, Globe, Heart, Target, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/sections/PageHeader";
import WhatsAppButton from "../components/WhatsAppButton";

const team = [
  {
    name: "Vicente Garcia",
    role: "Fundador & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Maria Lopez",
    role: "Directora de Operaciones",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    name: "Carlos Ruiz",
    role: "Jefe de Ventas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Ana Martinez",
    role: "Especialista en Destinos",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
];

const stats = [
  { icon: Users, value: "15,000+", label: "Viajeros Felices" },
  { icon: Globe, value: "500+", label: "Destinos" },
  { icon: Award, value: "25", label: "Anos de Experiencia" },
  { icon: Heart, value: "98%", label: "Satisfaccion" },
];

export default function Nosotros() {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

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
          subtitle="Mas de 25 anos haciendo realidad los suenos de viaje de miles de personas. Conoce la historia detras de nuestra pasion por los viajes."
        />

      <section className="py-16 bg-teal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 text-white/80 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/75">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Nuestra Historia
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Vicente Viajes nacio en 1999 con un sueno simple: hacer que viajar sea accesible
                y memorable para todos. Comenzamos como una pequena agencia familiar y hoy somos
                una de las agencias de viajes mas reconocidas del pais.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Nuestro fundador, Vicente Garcia, comenzo este viaje con la vision de crear
                experiencias unicas que transformaran la vida de las personas. Hoy, esa vision
                sigue viva en cada viaje que planificamos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Con mas de 25 anos de experiencia, hemos ayudado a mas de 15,000 viajeros a
                descubrir el mundo, creando recuerdos que duran toda la vida.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                alt="Nuestro equipo"
                className="rounded-2xl shadow-elevated"
              />
              <div className="absolute -bottom-6 -right-6 bg-teal text-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm opacity-90">Anos de Experiencia</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand">
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
              Mision y Vision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 rounded-2xl shadow-card"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Nuestra Mision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Crear experiencias de viaje inolvidables que transformen la vida de nuestros
                clientes, ofreciendo un servicio personalizado, seguro y de alta calidad a
                precios accesibles.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card p-8 rounded-2xl shadow-card"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sunset to-coral flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Nuestra Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la agencia de viajes lider en Latinoamerica, reconocida por nuestra
                excelencia en servicio, innovacion tecnologica y compromiso con la
                sostenibilidad turistica.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
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
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group card-travel"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <div className="relative flex items-center justify-center gap-4">
              {/* Left Button */}
              <button
                onClick={handleTeamPrev}
                className="absolute left-0 z-10 bg-teal text-white p-2 rounded-full hover:bg-teal/90 transition-colors"
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
                      <div className="text-center group card-travel">
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-teal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                          <p className="text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Button */}
              <button
                onClick={handleTeamNext}
                className="absolute right-0 z-10 bg-teal text-white p-2 rounded-full hover:bg-teal/90 transition-colors"
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

      <WhatsAppButton />
      </main>
      <Footer />
    </div>
  );
}