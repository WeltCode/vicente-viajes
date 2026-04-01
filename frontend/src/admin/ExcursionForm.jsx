import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Trash2, X } from "lucide-react";
import { apiUrl } from "../services/api";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const ExcursionForm = ({ initialData, onSaved, onCancel }) => {
  const { token } = useAuth();
  const [data, setData] = useState(
    initialData
      ? {
          ...initialData,
          duration: String(initialData.duration || "").replace(/\D/g, ""),
          includes: Array.isArray(initialData.includes)
            ? initialData.includes.join("\n")
            : initialData.includes,
          not_includes: Array.isArray(initialData.not_includes)
            ? initialData.not_includes.join("\n")
            : initialData.not_includes,
          itinerary: (initialData.itinerary || []).map((d, i) => ({
            day: d.day || i + 1,
            title: d.title || "",
            description: d.description || "",
            highlights: Array.isArray(d.highlights)
              ? d.highlights.join(", ")
              : d.highlights || "",
          })),
        }
      : {
          title: "",
          short_description: "",
          description: "",
          image: "",
          location: "",
          duration: "",
          price: "",
          currency: "€",
          includes: "",
          month: "",
          departure_date: "",
          return_date: "",
          group_size: "",
          rating: "",
          itinerary: [],
          not_includes: "",
          is_featured: false,
          is_active: true,
          seo_title: "",
          seo_description: "",
        }
  );
  const [error, setError] = useState(null);

  const formatIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDurationFromDates = (departureDate, returnDate) => {
    if (!departureDate || !returnDate) return "";

    const start = new Date(`${departureDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return "";
    }

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return String(Math.max(1, diffDays));
  };

  const syncDateWithMonth = (monthLabel, currentDateValue) => {
    const monthIndex = MESES.findIndex((mes) => mes === monthLabel);
    if (monthIndex === -1) return currentDateValue || "";

    const baseDate = currentDateValue
      ? new Date(`${currentDateValue}T00:00:00`)
      : new Date();

    if (Number.isNaN(baseDate.getTime())) {
      return "";
    }

    const today = new Date();
    const inferredYear = currentDateValue
      ? baseDate.getFullYear()
      : monthIndex < today.getMonth()
        ? today.getFullYear() + 1
        : today.getFullYear();

    const day = currentDateValue ? baseDate.getDate() : 1;
    const safeDay = Math.min(day, new Date(inferredYear, monthIndex + 1, 0).getDate());

    return formatIsoDate(new Date(inferredYear, monthIndex, safeDay));
  };

  const addDaysToDate = (isoDate, daysToAdd) => {
    if (!isoDate) return "";
    const date = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + Math.max(0, Number(daysToAdd) || 0));
    return formatIsoDate(date);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => {
      const nextData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "month") {
        const syncedDeparture = syncDateWithMonth(value, prev.departure_date);
        const syncedReturn = syncDateWithMonth(value, prev.return_date);

        if (syncedDeparture) {
          const previousDuration = Number(
            calculateDurationFromDates(prev.departure_date, prev.return_date) || prev.duration || 0
          );

          nextData.departure_date = syncedDeparture;

          if (prev.return_date) {
            nextData.return_date = addDaysToDate(syncedDeparture, previousDuration);
          } else if (syncedReturn) {
            nextData.return_date = syncedReturn;
          }
        } else if (syncedReturn) {
          nextData.return_date = syncedReturn;
        }
      }

      if (name === "departure_date" && value) {
        const selectedDate = new Date(`${value}T00:00:00`);
        if (!Number.isNaN(selectedDate.getTime())) {
          nextData.month = MESES[selectedDate.getMonth()] || nextData.month;
        }
        if (nextData.return_date && new Date(`${nextData.return_date}T00:00:00`) < selectedDate) {
          nextData.return_date = value;
        }
      }

      if ((name === "return_date" || name === "departure_date") && nextData.return_date && nextData.departure_date) {
        const departure = new Date(`${nextData.departure_date}T00:00:00`);
        const returning = new Date(`${nextData.return_date}T00:00:00`);
        if (!Number.isNaN(departure.getTime()) && !Number.isNaN(returning.getTime()) && returning < departure) {
          nextData.return_date = nextData.departure_date;
        }
      }

      if (name === "departure_date" || name === "return_date" || name === "month") {
        nextData.duration = calculateDurationFromDates(nextData.departure_date, nextData.return_date);
      }

      return nextData;
    });

    if (error) {
      setError(null);
    }
  };

  const addDay = () => {
    setData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", highlights: "", description: "" },
      ],
    }));
  };

  const removeDay = (index) => {
    setData((prev) => {
      const arr = [...prev.itinerary];
      arr.splice(index, 1);
      return {
        ...prev,
        itinerary: arr.map((d, i) => ({ ...d, day: i + 1 })),
      };
    });
  };

  const handleDayChange = (index, field, value) => {
    setData((prev) => {
      const arr = [...prev.itinerary];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, itinerary: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const autoDuration = calculateDurationFromDates(data.departure_date, data.return_date);

    if (data.departure_date && data.return_date && !autoDuration) {
      setError("La fecha de regreso debe ser igual o posterior a la fecha de salida.");
      return;
    }

    try {
      const finalData = {
        ...data,
        short_description:
          data.short_description?.trim() || data.description?.trim() || data.title?.trim() || "",
        includes: Array.isArray(data.includes)
          ? data.includes.join("\n")
          : data.includes,
        not_includes: Array.isArray(data.not_includes)
          ? data.not_includes.join("\n")
          : data.not_includes,
        itinerary: (data.itinerary || []).map((d) => ({
          day: d.day,
          title: d.title,
          description: d.description,
          highlights: d.highlights
            ? d.highlights
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
            : [],
        })),
        departure_date: data.departure_date || null,
        return_date: data.return_date || null,
        rating: data.rating ? Math.min(5, Math.max(0, parseFloat(data.rating))) : 0,
        duration: String(autoDuration || data.duration || "").replace(/\D/g, ""),
        price: parseFloat(data.price),
      };

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      };

      if (finalData.id) {
        await axios.put(apiUrl(`excursiones/${finalData.id}/`), finalData, { headers });
      } else {
        await axios.post(apiUrl("excursiones/"), finalData, { headers });
      }
      onSaved();
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        (err.response?.data && typeof err.response.data === "object"
          ? JSON.stringify(err.response.data)
          : err.message);
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-4 backdrop-blur-[2px]">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full max-w-[570px] flex-col overflow-hidden rounded-2xl border border-[#d7dfdc] bg-[#f5f7f6] shadow-[0_24px_52px_rgba(0,0,0,0.22)]"
      >
        <div className="flex items-center justify-between border-b border-[#d7dfdc] px-4 py-3 sm:px-5">
          <h3 className="font-display text-2xl font-semibold text-[#222f3a] sm:text-3xl">
            {data.id ? "Editar Excursión" : "Nueva Excursión"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#cdd4d2] text-[#3b4b4b] transition hover:bg-[#c0c9c6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {error && (
            <div className="mb-4 rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Título *</label>
                <input
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  required
                  placeholder="Tour Machu Picchu"
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Destino *</label>
                <input
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                  required
                  placeholder="Perú"
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Mes</label>
                <select
                  name="month"
                  value={data.month}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                >
                  <option value="">Selecciona</option>
                  {MESES.map((mes) => (
                    <option key={mes} value={mes}>
                      {mes}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-[#60706f]">Al elegir un mes, la fecha de salida se prepara en ese mismo mes.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Duración</label>
                <input
                  name="duration"
                  type="number"
                  min="1"
                  step="1"
                  value={data.duration}
                  onChange={handleChange}
                  readOnly
                  placeholder="Se calcula solo"
                  className="h-10 w-full cursor-not-allowed rounded-lg border border-[#c9d2cf] bg-[#edf1ef] px-3 text-sm text-[#364847] outline-none"
                />
                <p className="mt-1 text-xs text-[#60706f]">Este campo queda bloqueado y se calcula automáticamente al elegir salida y regreso.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Tamaño grupo</label>
                <input
                  name="group_size"
                  value={data.group_size}
                  onChange={handleChange}
                  placeholder="Máx 15 personas"
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Precio *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={handleChange}
                  required
                  placeholder="1299"
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Rating (0-5)</label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={data.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Fecha Salida</label>
                <input
                  name="departure_date"
                  type="date"
                  value={data.departure_date || ""}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Fecha Regreso</label>
                <input
                  name="return_date"
                  type="date"
                  value={data.return_date || ""}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                />
                <p className="mt-1 text-xs text-[#60706f]">También se sincroniza con el mes seleccionado.</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#344443]">URL de Imagen *</label>
              <input
                name="image"
                value={data.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
                className="h-10 w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#344443]">Descripción</label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                required
                placeholder="Descripción detallada de la excursión"
                className="w-full rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 py-2.5 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                rows={3}
              />
            </div>

            <div className="border-t border-[#d7dfdc] pt-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-2xl font-semibold text-[#24343a]">Itinerario</label>
                <button
                  type="button"
                  onClick={addDay}
                  className="rounded-xl border border-[#c9d2cf] bg-[#e5ebe8] px-3 py-1.5 text-sm font-semibold text-[#374a49] transition hover:bg-[#d9e1de]"
                >
                  + Añadir día
                </button>
              </div>

              <div className="space-y-3">
                {data.itinerary.map((day, idx) => (
                  <div key={idx} className="rounded-xl border border-[#cbd4d1] bg-[#dce2df] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#2f7770]">Día {day.day}</span>
                      <button
                        type="button"
                        onClick={() => removeDay(idx)}
                        className="text-[#d95f5f] transition hover:text-[#bf4646]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Título"
                        value={day.title}
                        onChange={(e) => handleDayChange(idx, "title", e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#c6cfcc] bg-[#e3e8e6] px-3 text-sm text-[#3a4c4b] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Highlights (coma)"
                        value={day.highlights}
                        onChange={(e) => handleDayChange(idx, "highlights", e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#c6cfcc] bg-[#e3e8e6] px-3 text-sm text-[#3a4c4b] outline-none"
                      />
                    </div>

                    <textarea
                      placeholder="Descripción del día"
                      value={day.description}
                      onChange={(e) => handleDayChange(idx, "description", e.target.value)}
                      className="mt-2 w-full rounded-lg border border-[#c6cfcc] bg-[#e3e8e6] px-3 py-2 text-sm text-[#3a4c4b] outline-none"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">Incluye (usa Enter para agregar cada elemento en una linea)</label>
                <textarea
                  name="includes"
                  value={data.includes}
                  onChange={handleChange}
                  placeholder={"Vuelos internos\nHoteles 4 estrellas\nDesayunos diarios\nGuia en espanol"}
                  className="h-28 w-full resize-none overflow-y-auto rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 py-2.5 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                  rows={4}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#344443]">No incluye (usa Enter para agregar cada elemento en una linea)</label>
                <textarea
                  name="not_includes"
                  value={data.not_includes}
                  onChange={handleChange}
                  placeholder={"Vuelos internacionales\nPropinas\nGastos personales\nSeguro de viaje"}
                  className="h-28 w-full resize-none overflow-y-auto rounded-lg border border-[#c9d2cf] bg-[#dbe1de] px-3 py-2.5 text-sm text-[#364847] outline-none focus:border-[#1f7770]"
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={data.is_featured}
                  onClick={() =>
                    setData((prev) => ({ ...prev, is_featured: !prev.is_featured }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    data.is_featured ? "bg-[#1f7770]" : "bg-[#c4ceca]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      data.is_featured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-[#1a2632]">
                  {data.is_featured ? "Destacado — visible como principal" : "No destacado"}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={data.is_active}
                  onClick={() =>
                    setData((prev) => ({ ...prev, is_active: !prev.is_active }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    data.is_active ? "bg-[#1f7770]" : "bg-[#c4ceca]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      data.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-[#1a2632]">
                  {data.is_active ? "Activa — visible en el sitio" : "Desactivada — no se muestra"}
                </span>
              </div>
            </div>

            <input
              type="hidden"
              name="short_description"
              value={data.short_description}
              onChange={handleChange}
            />
            <input
              type="hidden"
              name="seo_title"
              value={data.seo_title}
              onChange={handleChange}
            />
            <input
              type="hidden"
              name="seo_description"
              value={data.seo_description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#d7dfdc] bg-[#f2f5f4] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-[#c8d1ce] bg-[#ebefed] px-4 py-2 text-sm font-semibold text-[#334746] transition hover:bg-[#e0e7e4] sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#1f7770] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#196862] sm:w-auto"
          >
            {data.id ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExcursionForm;
