// WhatsAppButton.jsx
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = "+34600750758";
  const recipientName = "Vicente Viajes";
  
  // Mensaje codificado para URL
  const message = encodeURIComponent(
    `¡Hola ${recipientName}! 👋 Estoy interesado/a en contratar un viaje con ustedes. ¿Podrías proporcionarme más información sobre tus servicios, precios y disponibilidad? ¡Gracias!`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 hover:shadow-xl group"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8 text-white" />
      
      {/* Tooltip o mensaje flotante */}
      <div className="absolute right-20 bottom-1/2 translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        <span className="text-sm font-medium">
          ¡Viajemos Juntos!
        </span>
        <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
      </div>

      {/* Efecto de pulso */}
      <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
    </a>
  );
};

export default WhatsAppButton;