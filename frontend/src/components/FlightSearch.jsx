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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSearch = () => {
    console.log("Buscar vuelos:", { tripType, ...formData });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTripType("round-trip")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tripType === "round-trip"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <ArrowRightLeft size={16} />
            Ida y Vuelta
          </button>

          <button
            onClick={() => setTripType("one-way")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tripType === "one-way"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <Plane size={16} />
            Solo Ida
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Origen */}
          <Input
            label="Origen"
            icon={<MapPin />}
            placeholder="Ciudad de origen"
            value={formData.origin}
            onChange={(e) => handleChange("origin", e.target.value)}
          />

          {/* Destino */}
          <Input
            label="Destino"
            icon={<MapPin className="text-emerald-500" />}
            placeholder="Ciudad de destino"
            value={formData.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
          />

          {/* Fecha salida */}
          <Input
            label="Fecha de salida"
            icon={<Calendar />}
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
          />

          {/* Fecha regreso */}
          <AnimatePresence>
            {tripType === "round-trip" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Input
                  label="Fecha de regreso"
                  icon={<Calendar className="text-emerald-500" />}
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) =>
                    handleChange("returnDate", e.target.value)
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Adultos */}
          <Select
            label="Adultos"
            icon={<Users />}
            value={formData.adults}
            onChange={(e) => handleChange("adults", e.target.value)}
            options={[1, 2, 3, 4, 5, 6, 7, 8]}
            suffix="Adulto"
          />

          {/* Niños */}
          <Select
            label="Niños (2-11 años)"
            icon={<Users className="text-orange-400" />}
            value={formData.children}
            onChange={(e) => handleChange("children", e.target.value)}
            options={[0, 1, 2, 3, 4, 5, 6]}
            suffix="Niño"
          />

          {/* Bebés */}
          <Select
            label="Bebés (0-2 años)"
            icon={<Baby className="text-emerald-500" />}
            value={formData.babies}
            onChange={(e) => handleChange("babies", e.target.value)}
            options={[0, 1, 2, 3, 4]}
            suffix="Bebé"
          />
        </div>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={handleSearch}
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl font-semibold shadow-lg"
          >
            <Search size={18} />
            Buscar vuelos
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ---------- Reusable Components ---------- */

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
  </div>
);

const Select = ({ label, icon, options, suffix, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
        {icon}
      </span>
      <select
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n} {suffix}{n !== 1 ? "s" : ""}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FlightSearch;
