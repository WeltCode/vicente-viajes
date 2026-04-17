import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import { apiUrl } from "../services/api";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wide text-[#344443] mb-1";
const inputCls =
  "w-full rounded-xl border border-[#d7dfdc] bg-[#dbe1de] px-3 py-2 text-sm text-[#1a2632] outline-none transition placeholder:text-[#8fa09f] focus:border-[#1f7770]";

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const PlayaForm = ({ initialData, onSaved, onCancel }) => {
  const { token } = useAuth();
  const isEdit = Boolean(initialData?.id);
  const [data, setData] = useState({
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
    characteristics: "",
    is_active: true,
    ...initialData,
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image_url || initialData?.image || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(initialData?.image || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile, initialData?.image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const ratingNum = Math.min(5, Math.max(0, Number(data.rating) || 0));
      const durationRaw = String(data.duration || "").replace(/\D/g, "");
      const finalData = {
        ...data,
        slug: data.slug || generateSlug(data.title),
        rating: ratingNum,
        price: parseFloat(data.price) || 0,
        duration: durationRaw ? `${durationRaw} días` : "",
        short_description:
          data.short_description ||
          data.description?.slice(0, 255) ||
          data.title,
      };

      const formData = new FormData();
      formData.append("title", finalData.title || "");
      formData.append("slug", finalData.slug || "");
      formData.append("short_description", finalData.short_description || "");
      formData.append("description", finalData.description || "");
      formData.append("location", finalData.location || "");
      formData.append("duration", finalData.duration || "");
      formData.append("price", finalData.price);
      formData.append("rating", finalData.rating);
      formData.append("group_size", finalData.group_size || "");
      formData.append("characteristics", finalData.characteristics || "");
      formData.append("is_active", String(Boolean(finalData.is_active)));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${token}`,
      };

      if (finalData.id) {
        await axios.put(
          apiUrl(`playas/${finalData.id}/`),
          formData,
          { headers }
        );
      } else {
        await axios.post(apiUrl("playas/"), formData, {
          headers,
        });
      }
      onSaved();
    } catch (err) {
      const errData = err.response?.data;
      setError(
        errData?.detail ||
          (errData && typeof errData === "object"
            ? JSON.stringify(errData)
            : err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-[570px] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8e6] px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-[#1a2632]">
            {isEdit ? "Editar Playa" : "Nueva Playa"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-[#5f7070] transition hover:bg-[#e8ecea]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <form
          id="playa-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
        >
          {error && (
            <div className="rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}

          {/* Nombre + Ubicación */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="Playa del Carmen"
              />
            </div>
            <div>
              <label className={labelCls}>Ubicación *</label>
              <input
                name="location"
                value={data.location}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="México"
              />
            </div>
          </div>

          {/* Precio + Rating */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Precio (€) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={data.price}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="799"
              />
            </div>
            <div>
              <label className={labelCls}>Rating (0-5)</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={data.rating}
                onChange={handleChange}
                className={inputCls}
                placeholder="4.9"
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className={labelCls}>Imagen *</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required={!isEdit}
              className="hidden"
            />
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setImageFile(e.dataTransfer.files?.[0] || null);
                setIsDragOver(false);
              }}
              className={`rounded-2xl border-2 border-dashed p-5 transition cursor-pointer ${
                isDragOver
                  ? "border-[#1f7770] bg-[#e7f3f0]"
                  : "border-[#c8d4d0] bg-[#f5f8f7] hover:border-[#1f7770]/60 hover:bg-[#edf4f2]"
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1f7770] shadow-sm">
                  <span className="text-xl font-semibold">+</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#1a2632]">
                  Arrastra una imagen aquí o haz click para seleccionarla
                </p>
                <p className="mt-1 text-xs text-[#60706f]">
                  JPG, PNG, WEBP. Formato recomendado 16:9 o similar.
                </p>
              </div>
            </div>
            {previewUrl && (
               <img
                 key={previewUrl}
                 src={previewUrl}
                 alt={data.title || "Playa"}
                 className="mt-3 h-44 w-full rounded-lg object-cover border border-[#d7dfdc]"
               />
            )}
            {imageFile && (
              <p className="mt-2 text-xs text-[#60706f]">Archivo: {imageFile.name}</p>
            )}
            {!isEdit && !imageFile && (
              <p className="mt-2 text-xs text-[#9e3f3f]">Se requiere una imagen para crear la playa.</p>
            )}
          </div>

          {/* Duración + Tamaño de grupo */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>
                Duración{" "}
                <span className="normal-case font-normal text-[#8fa09f]">
                  (días)
                </span>
              </label>
              <input
                name="duration"
                type="number"
                min="1"
                step="1"
                value={String(data.duration || "").replace(/\D/g, "")}
                onChange={(e) =>
                  setData((p) => ({ ...p, duration: e.target.value }))
                }
                className={inputCls}
                placeholder="7"
              />
            </div>
            <div>
              <label className={labelCls}>Ideal para</label>
              <input
                name="group_size"
                value={data.group_size}
                onChange={handleChange}
                className={inputCls}
                placeholder="Grupos desde 2 personas"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Describe la playa..."
            />
          </div>

          {/* Características */}
          <div>
            <label className={labelCls}>
              Características{" "}
              <span className="normal-case font-normal text-[#8fa09f]">
                (separadas por coma)
              </span>
            </label>
            <input
              name="characteristics"
              value={data.characteristics}
              onChange={handleChange}
              className={inputCls}
              placeholder="Arena blanca, Snorkel, Vida nocturna"
            />
          </div>

          {/* Activo toggle */}
          <div className="flex items-center gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3">
            <button
              type="button"
              role="switch"
              aria-checked={data.is_active}
              onClick={() =>
                setData((p) => ({ ...p, is_active: !p.is_active }))
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
              {data.is_active
                ? "Activa — visible en el sitio"
                : "Desactivada — no se muestra"}
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#e2e8e6] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-[#cdd6d3] px-5 py-2 text-sm font-semibold text-[#344443] transition hover:bg-[#f0f3f2] sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="playa-form"
            disabled={saving}
            className="w-full rounded-xl bg-[#1f7770] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1a6862] disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayaForm;