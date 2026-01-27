import React from "react";
import { motion } from "framer-motion";

const PageHeader = ({ title, subtitle, badge, children }) => {
  return (
    <section className="relative pt-32 pb-40 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-teal to-sage">
        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-sage-light/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-teal-light/10 blur-2xl" />
        
        {/* Animated floating elements */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-1/4 w-20 h-20 rounded-full border border-white/10"
        />
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-1/4 w-32 h-32 rounded-full border border-white/5"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-4"
            >
              {badge}
            </motion.span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
          {children}
        </motion.div>
      </div>

      {/* Curved bottom with layered waves */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        {/* First wave layer */}
        <svg 
          viewBox="0 0 1440 180" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto relative z-10"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 180L48 168C96 156 192 132 288 126C384 120 480 132 576 144C672 156 768 168 864 162C960 156 1056 132 1152 120C1248 108 1344 108 1392 108L1440 108V180H1392C1344 180 1248 180 1152 180C1056 180 960 180 864 180C768 180 672 180 576 180C480 180 384 180 288 180C192 180 96 180 48 180H0Z" 
            className="fill-background"
          />
        </svg>
        
        {/* Second decorative wave */}
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto absolute bottom-12 left-0 right-0 opacity-30"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-sage-light"
          />
        </svg>
      </div>
    </section>
  );
};

export default PageHeader;
