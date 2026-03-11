import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Trash2 } from "lucide-react";

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
          // convert arrays back to textarea-friendly strings
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
          slug: "",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // legacy handler left in case we need raw JSON textarea anywhere
  const handleItineraryChange = (e) => {
    const { value } = e.target;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        setData((prev) => ({
          ...prev,
          itinerary: parsed,
        }));
      }
    } catch (err) {
      // ignore parse errors until submission
    }
  };

  // helpers for new itinerary UI
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
      // re-number days
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

  // Auto-generate slug from title if not filled
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Preparar datos finales
      const finalData = {
        ...data,
        slug: data.slug || generateSlug(data.title),
        // Normalize includes / not_includes back to newline-separated strings
        includes: Array.isArray(data.includes)
          ? data.includes.join("\n")
          : data.includes,
        not_includes: Array.isArray(data.not_includes)
          ? data.not_includes.join("\n")
          : data.not_includes,
        // Convert itinerary entries
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
        // Convertir strings vacíos a null donde sea necesario
        departure_date: data.departure_date || null,
        return_date: data.return_date || null,
        rating: data.rating ? parseFloat(data.rating) : 0,
        price: parseFloat(data.price),
      };

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      };

      if (finalData.id) {
        await axios.put(`http://localhost:8000/api/excursiones/${finalData.id}/`, finalData, { headers });
      } else {
        await axios.post("http://localhost:8000/api/excursiones/", finalData, { headers });
      }
      onSaved();
    } catch (err) {
      console.error("Error completo:", err.response?.data);
      const errorMessage = 
        err.response?.data?.detail || 
        (err.response?.data && typeof err.response.data === 'object'
          ? JSON.stringify(err.response.data)
          : err.message);
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-auto max-h-[95vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">
            {data.id ? "Editar Excursión" : "Nueva Excursión"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-2xl font-bold text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Fila 1: Título y Destino */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Título *</label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                required
                placeholder="Tour Machu Picchu"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Destino / Ubicación *</label>
              <input
                name="location"
                value={data.location}
                onChange={handleChange}
                required
                placeholder="Perú"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Fila 2: Slug y Mes (dropdown) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Slug (auto-generado)</label>
              <input
                name="slug"
                value={data.slug}
                onChange={handleChange}
                placeholder="tour-machu-picchu"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Mes</label>
              <select
                name="month"
                value={data.month}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                <option value="">-- Selecciona un mes --</option>
                {MESES.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 3: Fechas de salida y regreso */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Fecha de Salida</label>
              <input
                name="departure_date"
                type="date"
                value={data.departure_date || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fecha de Regreso</label>
              <input
                name="return_date"
                type="date"
                value={data.return_date || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Fila 4: Duración y Tamaño de grupo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Duración</label>
              <input
                name="duration"
                value={data.duration}
                onChange={handleChange}
                placeholder="5 días"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tamaño de Grupo</label>
              <input
                name="group_size"
                value={data.group_size}
                onChange={handleChange}
                placeholder="Máx 15 personas"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Fila 5: Precio y Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Precio *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={data.price}
                onChange={handleChange}
                required
                placeholder="1299"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Rating (0-5)</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={data.rating}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block font-semibold mb-1">Descripción Corta *</label>
            <input
              name="short_description"
              value={data.short_description}
              onChange={handleChange}
              required
              placeholder="Descubre la maravilla del mundo antiguo..."
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          {/* Descripción completa */}
          <div>
            <label className="block font-semibold mb-1">Descripción Completa *</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              placeholder="Descripción detallada de la excursión..."
              className="w-full border border-gray-300 px-3 py-2 rounded"
              rows={4}
            />
          </div>

          {/* Imagen URL */}
          <div>
            <label className="block font-semibold mb-1">URL de Imagen *</label>
            <input
              name="image"
              value={data.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          {/* Incluye */}
          <div>
            <label className="block font-semibold mb-1">Incluye (separado por líneas)</label>
            <textarea
              name="includes"
              value={data.includes}
              onChange={handleChange}
              placeholder="Vuelos&#10;Hoteles&#10;Desayunos..."
              className="w-full border border-gray-300 px-3 py-2 rounded"
              rows={3}
            />
          </div>

          {/* No incluye */}
          <div>
            <label className="block font-semibold mb-1">No Incluye (separado por líneas)</label>
            <textarea
              name="not_includes"
              value={data.not_includes}
              onChange={handleChange}
              placeholder="Propinas&#10;Gastos personales..."
              className="w-full border border-gray-300 px-3 py-2 rounded"
              rows={3}
            />
          </div>

          {/* Itinerario JSON */}
              <div>
            <label className="block font-semibold mb-1">Itinerario</label>
            <button
              type="button"
              onClick={addDay}
              className="mb-2 inline-block text-sm text-blue-600 hover:underline"
            >
              + Añadir día
            </button>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {data.itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="relative border border-gray-200 rounded-lg p-4 pt-8"
                >
                  <button
                    type="button"
                    onClick={() => removeDay(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold">
                    Día {day.day}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Título del día"
                      value={day.title}
                      onChange={(e) => handleDayChange(idx, "title", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Highlights (coma)"
                      value={day.highlights}
                      onChange={(e) => handleDayChange(idx, "highlights", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1 rounded"
                    />
                    <textarea
                      placeholder="Descripción del día"
                      value={day.description}
                      onChange={(e) => handleDayChange(idx, "description", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1 rounded"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                name="is_featured"
                type="checkbox"
                checked={data.is_featured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">Destacado</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                name="is_active"
                type="checkbox"
                checked={data.is_active}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">Activo</span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            >
              Guardar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExcursionForm;
