import React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PageHeader from "../components/sections/PageHeader";
import { MapPin, Clock, Users, Star, ArrowRight, X, Calendar, CheckCircle, Plane, Hotel, Utensils, Camera } from "lucide-react";

const excursions = [
  {
    id: 1,
    title: "Tour Machu Picchu",
    location: "Perú",
    duration: "5 días",
    groupSize: "Max 15 personas",
    price: "$1,299",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    description: "Descubre la maravilla del mundo antiguo con nuestro tour completo.",
    month: "Enero",
    departureDate: "15 de Enero, 2025",
    returnDate: "20 de Enero, 2025",
    itinerary: [
      { day: 1, title: "Llegada a Lima", description: "Recepción en el aeropuerto y traslado al hotel. Tour panorámico por Lima.", highlights: ["Aeropuerto Jorge Chávez", "Centro histórico de Lima", "Cena de bienvenida"] },
      { day: 2, title: "Lima - Cusco", description: "Vuelo a Cusco, aclimatación y tour por la ciudad imperial.", highlights: ["Plaza de Armas", "Catedral de Cusco", "Sacsayhuamán"] },
      { day: 3, title: "Valle Sagrado", description: "Excursión al Valle Sagrado de los Incas.", highlights: ["Pisac", "Ollantaytambo", "Mercado artesanal"] },
      { day: 4, title: "Machu Picchu", description: "El día más esperado: visita a Machu Picchu.", highlights: ["Tren panorámico", "Ciudadela Inca", "Huayna Picchu opcional"] },
      { day: 5, title: "Regreso", description: "Traslado al aeropuerto y despedida.", highlights: ["Desayuno buffet", "Transfer al aeropuerto"] },
    ],
    includes: ["Vuelos internos", "Hoteles 4 estrellas", "Desayunos diarios", "Guía profesional", "Entradas a sitios"],
    notIncludes: ["Vuelos internacionales", "Propinas", "Gastos personales"],
  },
  {
    id: 2,
    title: "Safari en África",
    location: "Kenia",
    duration: "7 días",
    groupSize: "Max 12 personas",
    price: "$2,499",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    description: "Vive la experiencia única de ver los Big Five en su hábitat natural.",
    month: "Febrero",
    departureDate: "10 de Febrero, 2025",
    returnDate: "17 de Febrero, 2025",
    itinerary: [
      { day: 1, title: "Llegada a Nairobi", description: "Bienvenida y traslado al lodge.", highlights: ["Aeropuerto Jomo Kenyatta", "Karen Blixen Museum", "Cena tradicional"] },
      { day: 2, title: "Masai Mara", description: "Safari en el parque más famoso de África.", highlights: ["Game drive matutino", "Leones y elefantes", "Puesta de sol en la sabana"] },
      { day: 3, title: "Masai Mara", description: "Safari completo con picnic en la sabana.", highlights: ["Big Five", "Río Mara", "Visita aldea Masai"] },
      { day: 4, title: "Lago Nakuru", description: "Traslado al lago de los flamencos.", highlights: ["Miles de flamencos", "Rinocerontes", "Bosque de acacias"] },
      { day: 5, title: "Amboseli", description: "Parque con vistas al Kilimanjaro.", highlights: ["Monte Kilimanjaro", "Elefantes gigantes", "Atardecer épico"] },
      { day: 6, title: "Amboseli", description: "Safari final y tiempo libre.", highlights: ["Safari al amanecer", "Fotografía wildlife", "Lodge de lujo"] },
      { day: 7, title: "Regreso", description: "Traslado a Nairobi y vuelo de regreso.", highlights: ["Compras artesanías", "Aeropuerto"] },
    ],
    includes: ["Safaris en 4x4", "Lodges de lujo", "Pensión completa", "Guía experto", "Parques nacionales"],
    notIncludes: ["Vuelos internacionales", "Visado", "Seguro de viaje"],
  },
  {
    id: 3,
    title: "Aventura en Islandia",
    location: "Islandia",
    duration: "6 días",
    groupSize: "Max 10 personas",
    price: "$1,899",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&q=80",
    description: "Glaciares, auroras boreales y paisajes únicos te esperan.",
    month: "Marzo",
    departureDate: "5 de Marzo, 2025",
    returnDate: "11 de Marzo, 2025",
    itinerary: [
      { day: 1, title: "Reykjavik", description: "Llegada y exploración de la capital.", highlights: ["Hallgrímskirkja", "Puerto viejo", "Blue Lagoon"] },
      { day: 2, title: "Círculo Dorado", description: "Ruta clásica islandesa.", highlights: ["Thingvellir", "Geysir", "Gullfoss"] },
      { day: 3, title: "Costa Sur", description: "Cascadas y playas de arena negra.", highlights: ["Seljalandsfoss", "Skógafoss", "Reynisfjara"] },
      { day: 4, title: "Glaciares", description: "Caminata sobre glaciar y laguna.", highlights: ["Vatnajökull", "Jökulsárlón", "Diamond Beach"] },
      { day: 5, title: "Auroras Boreales", description: "Caza de auroras y aguas termales.", highlights: ["Northern Lights", "Hot springs", "Fotografía nocturna"] },
      { day: 6, title: "Regreso", description: "Tiempo libre y vuelo de regreso.", highlights: ["Compras", "Aeropuerto Keflavik"] },
    ],
    includes: ["Transporte 4x4", "Hoteles 3-4 estrellas", "Desayunos", "Guía local", "Equipo glacier"],
    notIncludes: ["Vuelos", "Almuerzos y cenas", "Blue Lagoon entrada"],
  },
  {
    id: 4,
    title: "Ruta del Vino",
    location: "España",
    duration: "4 días",
    groupSize: "Max 20 personas",
    price: "$899",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
    description: "Recorre las mejores bodegas de La Rioja y Ribera del Duero.",
    month: "Abril",
    departureDate: "12 de Abril, 2025",
    returnDate: "16 de Abril, 2025",
    itinerary: [
      { day: 1, title: "Madrid - La Rioja", description: "Traslado y primera bodega.", highlights: ["Viñedos Rioja", "Cata de vinos", "Cena maridaje"] },
      { day: 2, title: "Bodegas La Rioja", description: "Visita a bodegas legendarias.", highlights: ["López de Heredia", "Marqués de Riscal", "Almuerzo tradicional"] },
      { day: 3, title: "Ribera del Duero", description: "Traslado y bodegas de Ribera.", highlights: ["Vega Sicilia", "Pesquera", "Cena estrella Michelin"] },
      { day: 4, title: "Regreso Madrid", description: "Última bodega y regreso.", highlights: ["Protos", "Compra de vinos", "Traslado Madrid"] },
    ],
    includes: ["Transporte de lujo", "Hoteles boutique", "Todas las catas", "Comidas gourmet", "Guía sommelier"],
    notIncludes: ["Vuelos", "Bebidas extra", "Propinas"],
  },
  {
    id: 5,
    title: "Templos de Angkor",
    location: "Camboya",
    duration: "5 días",
    groupSize: "Max 15 personas",
    price: "$1,199",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=800&q=80",
    description: "Explora los antiguos templos de la civilización Khmer.",
    month: "Mayo",
    departureDate: "8 de Mayo, 2025",
    returnDate: "13 de Mayo, 2025",
    itinerary: [
      { day: 1, title: "Siem Reap", description: "Llegada y paseo por la ciudad.", highlights: ["Old Market", "Pub Street", "Cena khmer"] },
      { day: 2, title: "Angkor Wat", description: "Amanecer en el templo más famoso.", highlights: ["Sunrise Angkor Wat", "Bayon", "Ta Prohm"] },
      { day: 3, title: "Templos lejanos", description: "Circuito grande de templos.", highlights: ["Banteay Srei", "Kbal Spean", "Preah Khan"] },
      { day: 4, title: "Lago Tonle Sap", description: "Aldeas flotantes y cultura local.", highlights: ["Kompong Khleang", "Puesta de sol lago", "Taller artesanía"] },
      { day: 5, title: "Regreso", description: "Tiempo libre y vuelo.", highlights: ["Spa khmer", "Aeropuerto"] },
    ],
    includes: ["Hoteles 4 estrellas", "Guía historiador", "Entradas templos", "Desayunos", "Transporte tuk-tuk"],
    notIncludes: ["Vuelos", "Visado", "Propinas"],
  },
  {
    id: 6,
    title: "Patagonia Extrema",
    location: "Argentina/Chile",
    duration: "8 días",
    groupSize: "Max 12 personas",
    price: "$2,199",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
    description: "Glaciares, montañas y naturaleza salvaje en el fin del mundo.",
    month: "Junio",
    departureDate: "15 de Junio, 2025",
    returnDate: "23 de Junio, 2025",
    itinerary: [
      { day: 1, title: "Buenos Aires", description: "Llegada y city tour.", highlights: ["La Boca", "San Telmo", "Tango show"] },
      { day: 2, title: "El Calafate", description: "Vuelo y lago Argentino.", highlights: ["Lago Argentino", "Glaciarium", "Cena patagónica"] },
      { day: 3, title: "Perito Moreno", description: "El glaciar más impresionante.", highlights: ["Pasarelas glaciar", "Navegación icebergs", "Desprendimientos"] },
      { day: 4, title: "El Chaltén", description: "Capital del trekking.", highlights: ["Fitz Roy", "Laguna de los Tres", "Caminatas"] },
      { day: 5, title: "El Chaltén", description: "Día completo de senderismo.", highlights: ["Cerro Torre", "Glaciar Viedma", "Naturaleza virgen"] },
      { day: 6, title: "Torres del Paine", description: "Cruce a Chile.", highlights: ["Parque Nacional", "Cuernos del Paine", "Lago Grey"] },
      { day: 7, title: "Torres del Paine", description: "Trekking a las Torres.", highlights: ["Base de las Torres", "Flora y fauna", "Amanecer épico"] },
      { day: 8, title: "Regreso", description: "Vuelo Punta Arenas - Santiago.", highlights: ["Aeropuerto", "Fin del viaje"] },
    ],
    includes: ["Vuelos internos", "Hoteles y refugios", "Guía de montaña", "Comidas en trek", "Parques nacionales"],
    notIncludes: ["Vuelos internacionales", "Equipo personal", "Propinas"],
  },
  {
    id: 7,
    title: "Japón Tradicional",
    location: "Japón",
    duration: "10 días",
    groupSize: "Max 14 personas",
    price: "$3,299",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    description: "Descubre la magia del país del sol naciente.",
    month: "Julio",
    departureDate: "1 de Julio, 2025",
    returnDate: "11 de Julio, 2025",
    itinerary: [
      { day: 1, title: "Tokyo", description: "Llegada a la metrópolis.", highlights: ["Shibuya", "Shinjuku", "Robot Restaurant"] },
      { day: 2, title: "Tokyo", description: "Tradición y modernidad.", highlights: ["Senso-ji", "Akihabara", "Tokyo Tower"] },
      { day: 3, title: "Nikko", description: "Templos patrimonio UNESCO.", highlights: ["Toshogu Shrine", "Cascada Kegon", "Onsen"] },
      { day: 4, title: "Hakone", description: "Monte Fuji y aguas termales.", highlights: ["Vista Fuji-san", "Lago Ashi", "Ryokan tradicional"] },
      { day: 5, title: "Kyoto", description: "Antigua capital imperial.", highlights: ["Fushimi Inari", "Gion", "Geishas"] },
      { day: 6, title: "Kyoto", description: "Templos y jardines zen.", highlights: ["Kinkaku-ji", "Arashiyama", "Ceremonia del té"] },
      { day: 7, title: "Nara", description: "Ciervos y el gran Buda.", highlights: ["Todai-ji", "Ciervos sagrados", "Parque de Nara"] },
      { day: 8, title: "Osaka", description: "La cocina de Japón.", highlights: ["Dotonbori", "Street food tour", "Castillo de Osaka"] },
      { day: 9, title: "Hiroshima", description: "Historia y paz.", highlights: ["Museo de la Paz", "Miyajima", "Torii flotante"] },
      { day: 10, title: "Regreso", description: "Shinkansen a Tokyo y vuelo.", highlights: ["Tren bala", "Aeropuerto Narita"] },
    ],
    includes: ["JR Pass", "Hoteles y ryokan", "Desayunos", "Guía bilingüe", "Actividades culturales"],
    notIncludes: ["Vuelos internacionales", "Almuerzos y cenas", "Gastos personales"],
  },
  {
    id: 8,
    title: "Crucero por Grecia",
    location: "Grecia",
    duration: "7 días",
    groupSize: "Max 30 personas",
    price: "$1,899",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    description: "Navega por las islas más hermosas del Mediterráneo.",
    month: "Agosto",
    departureDate: "20 de Agosto, 2025",
    returnDate: "27 de Agosto, 2025",
    itinerary: [
      { day: 1, title: "Atenas", description: "Embarque y Acrópolis.", highlights: ["Partenón", "Plaka", "Embarque crucero"] },
      { day: 2, title: "Mykonos", description: "La isla cosmopolita.", highlights: ["Molinos de viento", "Little Venice", "Playas"] },
      { day: 3, title: "Santorini", description: "La joya del Egeo.", highlights: ["Oia", "Puesta de sol", "Vino volcánico"] },
      { day: 4, title: "Creta", description: "La isla más grande.", highlights: ["Knossos", "Heraklion", "Gastronomía cretense"] },
      { day: 5, title: "Rodas", description: "Ciudad medieval.", highlights: ["Casco antiguo", "Acrópolis de Lindos", "Playas"] },
      { day: 6, title: "Navegación", description: "Día a bordo.", highlights: ["Spa", "Piscina", "Entretenimiento"] },
      { day: 7, title: "Atenas", description: "Desembarque.", highlights: ["Museo Arqueológico", "Aeropuerto"] },
    ],
    includes: ["Crucero camarote exterior", "Pensión completa", "Excursiones en puerto", "Guía", "Entretenimiento"],
    notIncludes: ["Vuelos", "Bebidas premium", "Propinas tripulación"],
  },
  {
    id: 9,
    title: "Aurora Boreal Finlandia",
    location: "Finlandia",
    duration: "5 días",
    groupSize: "Max 12 personas",
    price: "$2,299",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    description: "Vive la magia de las luces del norte en Laponia.",
    month: "Septiembre",
    departureDate: "15 de Septiembre, 2025",
    returnDate: "20 de Septiembre, 2025",
    itinerary: [
      { day: 1, title: "Helsinki - Rovaniemi", description: "Vuelo al Círculo Polar.", highlights: ["Santa Claus Village", "Cruce Círculo Polar", "Cena lapona"] },
      { day: 2, title: "Huskies", description: "Safari en trineo de perros.", highlights: ["Husky safari", "Naturaleza ártica", "Caza auroras"] },
      { day: 3, title: "Renos", description: "Granja de renos y cultura Sami.", highlights: ["Paseo en reno", "Cultura Sami", "Iglú de cristal"] },
      { day: 4, title: "Motos de nieve", description: "Aventura en la nieve.", highlights: ["Safari motonieve", "Pesca en hielo", "Sauna finlandesa"] },
      { day: 5, title: "Regreso", description: "Vuelo Helsinki y conexión.", highlights: ["Desayuno", "Aeropuerto"] },
    ],
    includes: ["Vuelos internos", "Hotel iglú", "Pensión completa", "Actividades árticas", "Ropa térmica"],
    notIncludes: ["Vuelos internacionales", "Bebidas", "Extras opcionales"],
  },
  {
    id: 10,
    title: "Nueva York Halloween",
    location: "Estados Unidos",
    duration: "5 días",
    groupSize: "Max 25 personas",
    price: "$1,599",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    description: "Vive Halloween en la Gran Manzana.",
    month: "Octubre",
    departureDate: "28 de Octubre, 2025",
    returnDate: "2 de Noviembre, 2025",
    itinerary: [
      { day: 1, title: "Llegada NYC", description: "Bienvenida a la ciudad.", highlights: ["Times Square", "Broadway", "Decoraciones Halloween"] },
      { day: 2, title: "Manhattan", description: "Lo mejor de la isla.", highlights: ["Estatua Libertad", "9/11 Memorial", "Wall Street"] },
      { day: 3, title: "Halloween", description: "Desfile y fiesta.", highlights: ["Village Halloween Parade", "Disfraces", "Fiesta exclusiva"] },
      { day: 4, title: "Central Park", description: "Día de otoño.", highlights: ["Central Park", "MOMA", "Top of the Rock"] },
      { day: 5, title: "Regreso", description: "Compras y vuelo.", highlights: ["Fifth Avenue", "Aeropuerto JFK"] },
    ],
    includes: ["Hotel Manhattan", "Desayunos", "Entrada desfile VIP", "Guía local", "Metro ilimitado"],
    notIncludes: ["Vuelos", "Comidas", "Entradas museos"],
  },
  {
    id: 11,
    title: "Tailandia Completa",
    location: "Tailandia",
    duration: "12 días",
    groupSize: "Max 16 personas",
    price: "$2,199",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    description: "Templos, playas y cultura del país de las sonrisas.",
    month: "Noviembre",
    departureDate: "5 de Noviembre, 2025",
    returnDate: "17 de Noviembre, 2025",
    itinerary: [
      { day: 1, title: "Bangkok", description: "Llegada a la capital.", highlights: ["Khao San Road", "Street food", "Tuk-tuk tour"] },
      { day: 2, title: "Bangkok", description: "Templos y palacios.", highlights: ["Gran Palacio", "Wat Pho", "Wat Arun"] },
      { day: 3, title: "Ayutthaya", description: "Antigua capital.", highlights: ["Ruinas UNESCO", "Buda cabeza árbol", "Río Chao Phraya"] },
      { day: 4, title: "Chiang Mai", description: "Norte de Tailandia.", highlights: ["Vuelo interno", "Night Bazaar", "Cena kantoke"] },
      { day: 5, title: "Chiang Mai", description: "Templos y elefantes.", highlights: ["Doi Suthep", "Santuario elefantes", "Cocina thai"] },
      { day: 6, title: "Chiang Rai", description: "Templo Blanco.", highlights: ["White Temple", "Blue Temple", "Triángulo Dorado"] },
      { day: 7, title: "Krabi", description: "Vuelo a las playas.", highlights: ["Ao Nang", "Playa Railay", "Kayak"] },
      { day: 8, title: "Islas Phi Phi", description: "Paradiso tropical.", highlights: ["Phi Phi Don", "Maya Bay", "Snorkel"] },
      { day: 9, title: "Krabi", description: "Día de relax.", highlights: ["Spa thai", "Templo del Tigre", "Atardecer"] },
      { day: 10, title: "Phuket", description: "La isla más grande.", highlights: ["Patong", "Big Buddha", "Vida nocturna"] },
      { day: 11, title: "Phuket", description: "Playas y ocio.", highlights: ["Kata Beach", "Phang Nga Bay", "James Bond Island"] },
      { day: 12, title: "Regreso", description: "Vuelo internacional.", highlights: ["Aeropuerto Phuket"] },
    ],
    includes: ["Vuelos internos", "Hoteles 4 estrellas", "Desayunos", "Guía español", "Excursiones"],
    notIncludes: ["Vuelos internacionales", "Visado si aplica", "Gastos personales"],
  },
  {
    id: 12,
    title: "Navidad en Viena",
    location: "Austria",
    duration: "5 días",
    groupSize: "Max 20 personas",
    price: "$1,299",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=800&q=80",
    description: "Mercados navideños y música clásica en la capital imperial.",
    month: "Diciembre",
    departureDate: "20 de Diciembre, 2025",
    returnDate: "25 de Diciembre, 2025",
    itinerary: [
      { day: 1, title: "Llegada Viena", description: "Bienvenida imperial.", highlights: ["Ringstrasse", "Café vienés", "Mercado Rathausplatz"] },
      { day: 2, title: "Palacios", description: "Schönbrunn y Hofburg.", highlights: ["Schönbrunn", "Sisi Museum", "Mercado Schönbrunn"] },
      { day: 3, title: "Música", description: "La ciudad de Mozart.", highlights: ["Ópera de Viena", "Casa Mozart", "Concierto de Navidad"] },
      { day: 4, title: "Salzburgo", description: "Excursión de día completo.", highlights: ["Fortaleza", "Catedral", "Mercados navideños"] },
      { day: 5, title: "Navidad", description: "Celebración y regreso.", highlights: ["Misa de Navidad", "Cena especial", "Aeropuerto"] },
    ],
    includes: ["Hotel 4 estrellas", "Desayunos buffet", "Concierto Navidad", "Guía local", "Transporte"],
    notIncludes: ["Vuelos", "Almuerzos y cenas", "Entradas extra"],
  },
  {
    id: 13,
    title: "Frio en Montserrat",
    location: "Barcelona, España",
    duration: "2 días",
    groupSize: "Max 20 personas",
    price: "$700",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1650964836750-d70bf63fe27e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Alturas impresionantes y vistas panorámicas en Montserrat.",
    month: "Enero",
    departureDate: "20 de Enero, 2025",
    returnDate: "22 de Enero, 2025",
    itinerary: [
      { day: 1, title: "Llegada Barcelona", description: "Bienvenida imperial.", highlights: ["Ringstrasse", "Café vienés", "Mercado La Boqueria"] },
      { day: 2, title: "Ascenso a Montserrat", description: "Schönbrunn y Hofburg.", highlights: ["Schönbrunn", "Sisi Museum", "Mercado Schönbrunn"] },
    ],
    includes: ["Hotel 4 estrellas", "Desayunos buffet", "Concierto Navidad", "Guía local", "Transporte"],
    notIncludes: ["Vuelos", "Almuerzos y cenas", "Entradas extra", "Gastos personales"],
  },
];

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const Excursiones = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [startX, setStartX] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsPressed(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
  };

  const handleMouseMove = (e) => {
    if (!isPressed) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft -= walk;
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const filteredExcursions = selectedMonth
    ? excursions.filter((e) => e.month === selectedMonth)
    : excursions;

  const groupedByMonth = months.reduce((acc, month) => {
    const monthExcursions = excursions.filter((e) => e.month === month);
    if (monthExcursions.length > 0) {
      acc[month] = monthExcursions;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with PageHeader */}
      <PageHeader
        badge="✨ Aventuras Únicas"
        title="Excursiones Inolvidables"
        subtitle="Vive experiencias únicas con nuestras excursiones guiadas por expertos. Descubre culturas, paisajes y aventuras que recordarás para siempre."
      />

      {/* Month Filter */}
      <section className="py-8 bg-card/80 backdrop-blur-md border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex lg:flex-wrap lg:justify-center gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            <button
              onClick={() => setSelectedMonth(null)}
              className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                selectedMonth === null
                  ? "bg-gradient-to-r from-teal to-sage text-white shadow-lg"
                  : "bg-mist text-muted-foreground hover:bg-teal/10 hover:text-teal"
              }`}
            >
              Todos
            </button>
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedMonth === month
                    ? "bg-gradient-to-r from-teal to-sage text-white shadow-lg"
                    : "bg-mist text-muted-foreground hover:bg-teal/10 hover:text-teal"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Excursions by Month */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-20 left-0 w-96 h-96 rounded-full bg-teal/5 blur-3xl" />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-sage/5 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          {selectedMonth ? (
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-display font-bold text-foreground mb-10 flex items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-sage flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Excursiones en {selectedMonth}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExcursions.map((excursion, index) => (
                  <ExcursionCard
                    key={excursion.id}
                    excursion={excursion}
                    index={index}
                    onViewDetails={() => setSelectedExcursion(excursion)}
                  />
                ))}
              </div>
            </div>
          ) : (
            Object.entries(groupedByMonth).map(([month, monthExcursions]) => (
              <div key={month} className="mb-20">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-display font-bold text-foreground mb-10 flex items-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-sage flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  {month}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {monthExcursions.map((excursion, index) => (
                    <ExcursionCard
                      key={excursion.id}
                      excursion={excursion}
                      index={index}
                      onViewDetails={() => setSelectedExcursion(excursion)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Excursion Details Modal */}
      <AnimatePresence>
        {selectedExcursion && (
          <ExcursionModal
            excursion={selectedExcursion}
            onClose={() => setSelectedExcursion(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const ExcursionCard = ({ excursion, index, onViewDetails }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8 }}
    className="bg-card rounded-3xl shadow-card hover:shadow-elevated transition-all duration-500 overflow-hidden border border-gray-200/50 group"
  >
    <div className="relative h-60 overflow-hidden">
      <img
        src={excursion.image}
        alt={excursion.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full text-sm shadow-lg">
        <Star className="w-4 h-4 text-sunset fill-sunset" />
        <span className="font-semibold text-forest">{excursion.rating}</span>
      </div>
      <div className="absolute top-4 left-4 bg-gradient-to-r from-teal to-sage text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
        {excursion.price}
      </div>
      <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/30">
        {excursion.month}
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <MapPin className="w-4 h-4 text-teal" />
        {excursion.location}
      </div>
      <h3 className="text-xl font-display font-bold text-foreground mb-2">{excursion.title}</h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{excursion.description}</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
        <span className="flex items-center gap-1.5 bg-mist px-3 py-1.5 rounded-full">
          <Clock className="w-4 h-4 text-teal" />
          {excursion.duration}
        </span>
        <span className="flex items-center gap-1.5 bg-mist px-3 py-1.5 rounded-full">
          <Users className="w-4 h-4 text-teal" />
          {excursion.groupSize}
        </span>
      </div>
      <button
        onClick={onViewDetails}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal to-sage text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
      >
        Ver Detalles
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

const ExcursionModal = ({ excursion, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-card rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Image */}
      <div className="relative h-64">
        <img
          src={excursion.image}
          alt={excursion.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            {excursion.location}
          </div>
          <h2 className="text-3xl font-display font-bold text-white">{excursion.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Salida</p>
            <p className="font-semibold text-sm">{excursion.departureDate}</p>
          </div>
          <div className="bg-sage/10 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-sage mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Regreso</p>
            <p className="font-semibold text-sm">{excursion.returnDate}</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Duración</p>
            <p className="font-semibold text-sm">{excursion.duration}</p>
          </div>
          <div className="bg-sage/10 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-sage mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Grupo</p>
            <p className="font-semibold text-sm">{excursion.groupSize}</p>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-primary to-sage p-6 rounded-2xl mb-8 text-white text-center">
          <p className="text-sm opacity-80 mb-1">Precio por persona</p>
          <p className="text-4xl font-bold">{excursion.price}</p>
        </div>

        {/* Itinerary */}
        <div className="mb-8">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary" />
            Itinerario Detallado
          </h3>
          <div className="space-y-4">
            {excursion.itinerary.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-4 border-l-2 border-primary/30 last:border-l-0"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {day.day}
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-bold text-foreground mb-1">{day.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {day.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        <Camera className="w-3 h-3" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Incluye
            </h4>
            <ul className="space-y-2">
              {excursion.includes.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-sage" />
              No Incluye
            </h4>
            <ul className="space-y-2">
              {excursion.notIncludes.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-teal to-sage text-white font-semibold px-8 py-4 rounded-xl shadow-elevated hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <Hotel className="w-5 h-5" />
            Reservar Ahora
          </button>
          <a
            href={`https://wa.me/34600750758?text=Hola, me interesa la excursión ${excursion.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 rounded-xl bg-[#25D366] text-white font-semibold flex items-center gap-2 hover:bg-[#128C7E] transition-colors"
          >
            <Utensils className="w-5 h-5" />
            Consultar
          </a>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default Excursiones;
