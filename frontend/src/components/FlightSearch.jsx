import React, { useDeferredValue, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  Baby,
  Search,
  ArrowRightLeft,
  AlertCircle,
} from "lucide-react";
import {
  buildFlightBridgePayload,
  encodeFlightSearchPayload,
  resolveAirport,
  searchAirports,
} from "../services/flightBridge";

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round-trip");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: "1",
    children: "0",
    babies: "0",
  });
  const [selectedAirports, setSelectedAirports] = useState({
    origin: null,
    destination: null,
  });
  const [focusedField, setFocusedField] = useState("");

  const deferredOrigin = useDeferredValue(formData.origin);
  const deferredDestination = useDeferredValue(formData.destination);

  const originSuggestions = useMemo(
    () => searchAirports(deferredOrigin),
    [deferredOrigin]
  );
  const destinationSuggestions = useMemo(
    () => searchAirports(deferredDestination),
    [deferredDestination]
  );

  const handleChange = (field, value) => {
    setError("");
    setFormData({ ...formData, [field]: value });
    if (field === "origin" || field === "destination") {
      // Si el usuario edita texto manualmente, se invalida la seleccion previa.
      setSelectedAirports((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSelectAirport = (field, airport) => {
    setFormData((prev) => ({ ...prev, [field]: airport.value }));
    setSelectedAirports((prev) => ({ ...prev, [field]: airport }));
    setFocusedField("");
    setError("");
  };

  const handleSwapRoute = () => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setSelectedAirports((prev) => ({
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const validateAndResolveAirport = (field) => {
    // Prioriza aeropuerto ya seleccionado; fallback a resolucion por texto libre.
    if (selectedAirports[field]) return selectedAirports[field];
    return resolveAirport(formData[field]);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setError("");

    const originAirport = validateAndResolveAirport("origin");
    const destinationAirport = validateAndResolveAirport("destination");

    if (!originAirport) {
      setError("Selecciona un aeropuerto de origen valido desde la lista.");
      return;
    }
    if (!destinationAirport) {
      setError("Selecciona un aeropuerto de destino valido desde la lista.");
      return;
    }
    if (originAirport.id === destinationAirport.id) {
      setError("El origen y el destino no pueden ser el mismo aeropuerto.");
      return;
    }
    if (!formData.departureDate) {
      setError("Selecciona una fecha de salida.");
      return;
    }
    if (tripType === "round-trip" && !formData.returnDate) {
      setError("Selecciona una fecha de regreso para ida y vuelta.");
      return;
    }
    if (
      tripType === "round-trip" &&
      formData.returnDate &&
      formData.returnDate < formData.departureDate
    ) {
      setError("La fecha de regreso no puede ser anterior a la fecha de salida.");
      return;
    }
    if (Number(formData.babies) > Number(formData.adults)) {
      setError("La cantidad de bebes no puede superar la cantidad de adultos.");
      return;
    }

    const payload = buildFlightBridgePayload({
      tripType,
      originAirport,
      destinationAirport,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      adults: formData.adults,
      children: formData.children,
      babies: formData.babies,
    });

    // Navega a vista interna, donde se reconstruye y envia el POST al motor externo.
    navigate(`/buscar/${encodeFlightSearchPayload(payload)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/40">

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTripType("round-trip")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tripType === "round-trip"
                ? "bg-teal text-white shadow-md"
                : "bg-forest/5 text-forest/70 hover:bg-forest/10"
            }`}
          >
            <ArrowRightLeft size={15} />
            Ida y Vuelta
          </button>
          <button
            type="button"
            onClick={() => setTripType("one-way")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tripType === "one-way"
                ? "bg-teal text-white shadow-md"
                : "bg-forest/5 text-forest/70 hover:bg-forest/10"
            }`}
          >
            <Plane size={15} />
            Solo Ida
          </button>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch}>
          {/* ── Fila 1: Origen + Swap + Destino ── */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            <AirportInput
              label="Origen"
              icon={<MapPin size={17} className="text-teal" />}
              placeholder="Ciudad o aeropuerto"
              value={formData.origin}
              onChange={(e) => handleChange("origin", e.target.value)}
              onFocus={() => setFocusedField("origin")}
              onBlur={() => setTimeout(() => setFocusedField(""), 120)}
              suggestions={originSuggestions}
              showSuggestions={focusedField === "origin"}
              onSelect={(airport) => handleSelectAirport("origin", airport)}
            />

            {/* Swap button — centrado entre ambos inputs en escritorio */}
            <div className="flex justify-center md:absolute md:left-1/2 md:top-[2.55rem] md:z-20 md:-translate-x-1/2">
              <button
                type="button"
                onClick={handleSwapRoute}
                title="Intercambiar origen y destino"
                className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-teal/30 bg-white text-teal shadow-md transition-all duration-200 hover:bg-teal hover:text-white hover:border-teal hover:scale-110 active:scale-95"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            <AirportInput
              label="Destino"
              icon={<MapPin size={17} className="text-sage" />}
              placeholder="Ciudad o aeropuerto"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              onFocus={() => setFocusedField("destination")}
              onBlur={() => setTimeout(() => setFocusedField(""), 120)}
              suggestions={destinationSuggestions}
              showSuggestions={focusedField === "destination"}
              onSelect={(airport) => handleSelectAirport("destination", airport)}
            />
          </div>

          {/* ── Fila 2: Fechas + Pasajeros ── */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Fecha de salida"
              icon={<Calendar size={17} className="text-teal" />}
              type="date"
              value={formData.departureDate}
              onChange={(e) => handleChange("departureDate", e.target.value)}
            />

            <AnimatePresence>
              {tripType === "round-trip" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Input
                    label="Fecha de regreso"
                    icon={<Calendar size={17} className="text-sage" />}
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => handleChange("returnDate", e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Select
              label="Adultos"
              icon={<Users size={17} className="text-teal" />}
              value={formData.adults}
              onChange={(e) => handleChange("adults", e.target.value)}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
              suffix="Adulto"
            />

            <Select
              label="Niños (2-11 años)"
              icon={<Users size={17} className="text-sage" />}
              value={formData.children}
              onChange={(e) => handleChange("children", e.target.value)}
              options={[0, 1, 2, 3, 4, 5, 6]}
              suffix="Niño"
            />

            <Select
              label="Bebés (0-1 año)"
              icon={<Baby size={17} className="text-teal" />}
              value={formData.babies}
              onChange={(e) => handleChange("babies", e.target.value)}
              options={[0, 1, 2]}
              suffix="Bebé"
            />
          </div>

          {/* ── Botón Buscar ── */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 flex justify-center"
          >
            <button
              type="submit"
              className="inline-flex items-center gap-3 bg-teal hover:bg-teal-dark text-white px-10 py-3 rounded-xl font-semibold shadow-elevated transition-colors duration-200"
            >
              <Search size={18} />
              Buscar vuelos
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

/* ────────────────────────────────────────────
   Reusable sub-components
──────────────────────────────────────────── */

const AirportInput = ({
  label,
  icon,
  suggestions,
  showSuggestions,
  onSelect,
  ...props
}) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-forest/70 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <input
        {...props}
        autoComplete="off"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest/15 bg-mist/40 text-forest placeholder-forest/35 focus:ring-2 focus:ring-teal/40 focus:border-teal outline-none transition"
      />
    </div>

    {showSuggestions && suggestions.length > 0 && (
      <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-teal/15 bg-white p-2 shadow-2xl">
        {suggestions.map((airport) => (
          <button
            key={`${airport.id}-${airport.value}`}
            type="button"
            onClick={() => onSelect(airport)}
            className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-teal/5"
          >
            <div>
              <p className="text-sm font-semibold text-forest">{airport.value}</p>
              <p className="text-xs text-forest/55">{airport.ciudad}</p>
            </div>
            <span className="rounded-full bg-teal/10 px-2 py-1 text-xs font-semibold text-teal">
              {airport.id}
            </span>
          </button>
        ))}
      </div>
    )}
  </div>
);

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-forest/70 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest/15 bg-mist/40 text-forest focus:ring-2 focus:ring-teal/40 focus:border-teal outline-none transition"
      />
    </div>
  </div>
);

const Select = ({ label, icon, options, suffix, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-forest/70 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <select
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest/15 bg-mist/40 text-forest focus:ring-2 focus:ring-teal/40 focus:border-teal outline-none transition appearance-none"
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
