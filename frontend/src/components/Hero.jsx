import React from "react";
import { motion } from "framer-motion";
import FlightSearch from "./FlightSearch";
import heroImage from "../assets/images/hero-beach.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Destino paradisíaco"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-teal/30 to-forest/80" />
      </div>

      {/* Animated Planet with Orbiting Plane */}
      <div className="absolute top-32 right-10 md:right-20 lg:right-32 pointer-events-none">
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 animate-float">
          {/* Planet Sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal via-sage to-sage-light shadow-2xl overflow-hidden">
            {/* Continents */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute w-16 h-20 bg-forest rounded-[40%_60%_70%_30%] top-8 left-8 blur-sm" />
              <div className="absolute w-24 h-16 bg-forest rounded-[30%_70%_40%_60%] top-16 right-12 blur-sm" />
              <div className="absolute w-20 h-24 bg-forest rounded-[60%_40%_50%_50%] bottom-8 left-16 blur-sm" />
              <div className="absolute w-12 h-12 bg-forest rounded-full top-20 left-24 blur-sm" />
            </div>
            {/* Ocean shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25" />
            {/* Atmosphere glow */}
            <div className="absolute -inset-4 rounded-full bg-teal/20 blur-2xl" />
          </div>

          {/* Orbiting Plane */}
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-plane-orbit">
            <div
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translateX(140px) translateY(-50%)",
              }}
            >
              <div className="relative">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  className="text-white drop-shadow-lg transform -rotate-45"
                >
                  <path
                    fill="currentColor"
                    d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                  />
                </svg>
                {/* Plane trail */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-l from-transparent via-white/60 to-white/80 rounded-full blur-[1px]" />
              </div>
            </div>
          </div>

          {/* Cloud layers */}
          <div
            className="absolute inset-4 rounded-full animate-spin-slow"
            style={{ animationDuration: "60s" }}
          >
            <div className="absolute w-10 h-4 bg-white/25 rounded-full top-4 left-12 blur-sm" />
            <div className="absolute w-14 h-5 bg-white/20 rounded-full top-14 right-8 blur-sm" />
            <div className="absolute w-8 h-3 bg-white/30 rounded-full bottom-10 left-10 blur-sm" />
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-sage-light/30"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1000),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, Math.random() * -300 - 100],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-6"
          >
            ✈️ Descubre el mundo con nosotros
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            Tu próxima aventura
            <br />
            <span className="text-gradient-light">comienza aquí</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            En Vicente Viajes hacemos realidad tus sueños de viajar. Encuentra los
            mejores destinos, ofertas exclusivas y experiencias inolvidables.
          </motion.p>
        </div>

        {/* Flight Search Component */}
        <FlightSearch />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "15K+", label: "Viajeros felices" },
            { value: "500+", label: "Destinos" },
            { value: "25", label: "Años de experiencia" },
            { value: "4.9★", label: "Calificación" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Curved Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
