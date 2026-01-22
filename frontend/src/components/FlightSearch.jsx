import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  Baby,
  Search,
  ArrowRightLeft,
} from "lucide-react";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("round-trip");

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: "1",
    children: "0",
    babies: "0",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Searching flights:", { tripType, ...formData });
    // Aquí conectaremos la API de vuelos
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="glass rounded-3xl p-6 md:p-8 shadow-elevated">
        {/* Trip Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTripType("round-trip")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              tripType === "round-trip"
                ? "bg-primary text-white shadow-soft"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Ida y Vuelta
          </button>

          <button
            onClick={() => setTripType("one-way")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              tripType === "one-way"
                ? "bg-primary text-white shadow-soft"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <Plane className="w-4 h-4" />
            Solo Ida
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Origen */}
          <div>
            <label className="text-sm font-medium mb-2 block">Origen</label>
            <div className="relative">
              <MapPin className="icon-input" />
              <input
                type="text"
                placeholder="Ciudad de origen"
                value={formData.origin}
                onChange={(e) =>
                  handleInputChange("origin", e.target.value)
                }
                className="search-input"
              />
            </div>
          </div>

          {/* Destino */}
          <div>
            <label className="text-sm font-medium mb-2 block">Destino</label>
            <div className="relative">
              <MapPin className="icon-input text-coral" />
              <input
                type="text"
                placeholder="Ciudad de destino"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange("destination", e.target.value)
                }
                className="search-input"
              />
            </div>
          </div>

          {/* Fecha salida */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Fecha de salida
            </label>
            <div className="relative">
              <Calendar className="icon-input" />
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) =>
                  handleInputChange("departureDate", e.target.value)
                }
                className="search-input"
              />
            </div>
          </div>

          {/* Fecha regreso */}
          <AnimatePresence>
            {tripType === "round-trip" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <label className="text-sm font-medium mb-2 block">
                  Fecha de regreso
                </label>
                <div className="relative">
                  <Calendar className="icon-input text-coral" />
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) =>
                      handleInputChange("returnDate", e.target.value)
                    }
                    className="search-input"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Adultos */}
          <div>
            <label className="text-sm font-medium mb-2 block">Adultos</label>
            <div className="relative">
              <Users className="icon-input" />
              <select
                value={formData.adults}
                onChange={(e) =>
                  handleInputChange("adults", e.target.value)
                }
                className="search-input bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Adulto" : "Adultos"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Niños */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Niños (2-11)
            </label>
            <div className="relative">
              <Users className="icon-input text-sunset" />
              <select
                value={formData.children}
                onChange={(e) =>
                  handleInputChange("children", e.target.value)
                }
                className="search-input bg-white"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bebés */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Bebés (0-2)
            </label>
            <div className="relative">
              <Baby className="icon-input text-coral" />
              <select
                value={formData.babies}
                onChange={(e) =>
                  handleInputChange("babies", e.target.value)
                }
                className="search-input bg-white"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <motion.div
          className="mt-6 flex justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={handleSearch}
            className="btn-hero w-full md:w-auto min-w-[250px] flex items-center justify-center gap-3"
          >
            <Search className="w-5 h-5" />
            Buscar vuelos
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FlightSearch;
