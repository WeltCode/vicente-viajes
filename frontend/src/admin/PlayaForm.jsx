import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PlayaForm = ({ initialData, onSaved, onCancel }) => {
  const { token } = useAuth();
  const [data, setData] = useState(
    initialData || {
      title: "",
      slug: "",
      short_description: "",
      description: "",
      image: "",
      location: "",
      duration: "",
      price: "",
      rating: "",
      group_size: "",
      is_active: true,
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
      // Auto-generate slug if empty
      const finalData = {
        ...data,
        slug: data.slug || generateSlug(data.title),
        rating: data.rating ? parseFloat(data.rating) : 0,
        price: parseFloat(data.price),
      };
      
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      };

      if (finalData.id) {
        await axios.put(`http://localhost:8000/api/playas/${finalData.id}/`, finalData, { headers });
      } else {
        await axios.post("http://localhost:8000/api/playas/", finalData, { headers });
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
        className="bg-white p-6 rounded-lg w-full max-w-lg overflow-auto max-h-[90vh]"
      >
        <h3 className="text-xl mb-4">
          {data.id ? "Editar Playa" : "Nueva Playa"}
        </h3>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label>Título *</label>
            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Slug (auto-generado si está vacío)</label>
            <input
              name="slug"
              value={data.slug}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Ubicación *</label>
            <input
              name="location"
              value={data.location}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Precio *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={data.price}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Descripción corta *</label>
            <input
              name="short_description"
              value={data.short_description}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Descripción completa *</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
              rows={4}
            />
          </div>
          <div>
            <label>Imagen URL *</label>
            <input
              name="image"
              value={data.image}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Duración</label>
            <input
              name="duration"
              value={data.duration}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Calificación</label>
            <input
              name="rating"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={data.rating}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Tamaño de grupo</label>
            <input
              name="group_size"
              value={data.group_size}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>
              <input
                name="is_active"
                type="checkbox"
                checked={data.is_active}
                onChange={handleChange}
              />
              {" "}Activo
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlayaForm;