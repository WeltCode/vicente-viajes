import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

// Cloudflare Turnstile (CAPTCHA invisible). Si no hay site key configurada, el
// widget no se muestra y el envío funciona igual (la validación real la decide
// el backend). La secret key vive solo en el backend, nunca aquí.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/sections/PageHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import PageSeo from "../components/seo/PageSeo";
import { apiUrl } from "../services/api";
import { siteContact } from "../services/siteContact";

const contactInfo = [
  {
    icon: MapPin,
    title: "Dirección",
    details: [siteContact.addressLine1, siteContact.addressLine2],
  },
  {
    icon: Phone,
    title: "Teléfono",
    details: [siteContact.phoneDisplay],
  },
  {
    icon: Mail,
    title: "Email",
    details: [siteContact.email],
  },
  {
    icon: Clock,
    title: "Horario",
    details: ["Lun - Vie: 9:00 - 19:00", "Sáb: 10:00 - 14:00"],
  },
];

const faqItems = [
  {
    q: "¿Cuánto tiempo antes debo reservar mi viaje?",
    a: "Recomendamos reservar con al menos 2-3 meses de anticipación para destinos internacionales y 1 mes para destinos nacionales.",
  },
  {
    q: "¿Ofrecen planes de pago?",
    a: "Sí, ofrecemos diversos planes de financiamiento sin intereses. Consulta con nuestros asesores las opciones disponibles.",
  },
  {
    q: "¿Qué incluyen los paquetes todo incluido?",
    a: "Los paquetes todo incluido generalmente incluyen vuelos, hospedaje, alimentación, bebidas y algunas actividades. Los detalles varían según el destino.",
  },
  {
    q: "¿Tienen seguro de viaje?",
    a: "Sí, todos nuestros paquetes incluyen un seguro de viaje básico. También ofrecemos opciones de cobertura ampliada.",
  },
];

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
    website: "", // Honeypot anti-spam: debe quedar vacío (los humanos no lo ven).
  });
  const [cargando, setCargando] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Carga el script de Turnstile y renderiza el widget (render explícito).
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return; // sin clave -> no se monta el widget

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current != null) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
    }

    return () => {
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (widgetIdRef.current != null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si Turnstile está activo, exige la verificación antes de enviar.
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      toast.error("Completa la verificación anti-spam antes de enviar.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(apiUrl("contacto/enviar/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, cf_turnstile_response: turnstileToken }),
      });

      if (response.ok) {
        toast.success("¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.");
        setFormData({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "", website: "" });
        resetTurnstile();
      } else {
        let errorMessage = "Error al enviar el mensaje. Intenta nuevamente.";
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        }
        toast.error(errorMessage);
        resetTurnstile();
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta nuevamente.");
      console.error("Error:", error);
      resetTurnstile();
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-mist">
      <PageSeo
        title="Contacto"
        description="Contacta con Vicente Viajes en Madrid por teléfono, email o formulario para planificar vuelos, excursiones, hoteles y viajes a medida."
        path="/contacto"
      />
      <Navbar />
      <main className="overflow-x-hidden pt-20">
        <PageHeader
          badge="Ponte en Contacto"
          title="Contáctanos"
          subtitle="¿Tienes alguna pregunta o quieres planificar tu próximo viaje? Nuestro equipo de expertos está listo para ayudarte."
        />

        {/* Contact Section */}
        <section className="overflow-hidden bg-background py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <h2 className="text-2xl font-bold text-foreground mb-8">Información de Contacto</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal/10">
                        <info.icon className="h-6 w-6 text-teal" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="mb-1 font-semibold text-foreground">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="break-words text-sm text-muted-foreground">{detail}</p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="mt-8 rounded-2xl overflow-hidden h-64 bg-muted shadow-card">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.4896123456!2d-3.6290567!3d40.3978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422284e9e6d3e1%3A0x1234567890abcd!2sAv.%20del%20Marqu%C3%A9s%20de%20Corbera%2046%2C%2028017%20Madrid!5e0!3m2!1ses!2ses!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <div className="bg-card rounded-2xl shadow-card p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Envíanos un mensaje</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot anti-spam: oculto para humanos; si un bot lo llena,
                        el backend descarta el envío en silencio. No quitar. */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                      <label htmlFor="website">No rellenar este campo</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
                          placeholder={siteContact.phoneDisplay}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Asunto *
                        </label>
                        <select
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="reserva">Hacer una reserva</option>
                          <option value="informacion">Solicitar información</option>
                          <option value="cotizacion">Solicitar cotización</option>
                          <option value="queja">Quejas y sugerencias</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mensaje *
                      </label>
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg border border-white/10 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition resize-none"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                      />
                    </div>
                    {/* Widget Cloudflare Turnstile (se monta solo si hay site key) */}
                    {TURNSTILE_SITE_KEY && (
                      <div ref={turnstileRef} className="flex justify-center md:justify-start" />
                    )}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={cargando}
                      className="w-full md:w-auto px-8 py-3 bg-teal text-white rounded-lg font-semibold hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-card"
                    >
                      <Send className="w-5 h-5" />
                      {cargando ? "Enviando..." : "Enviar Mensaje"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="overflow-hidden bg-sand py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-teal font-semibold text-sm uppercase tracking-[0.2em]">
                Dudas Comunes
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
                Preguntas Frecuentes
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card"
                >
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <WhatsAppButton />
      </main>
      <Footer />
    </div>
  );
}
