import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { X, Trash2 } from "lucide-react";
import { apiUrl } from "../services/api";
import GallerySelect from "../components/GallerySelect";
import AIExtractButton from "../components/AIExtractButton";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-[#344443] mb-1";
const inputCls =
  "w-full rounded-xl border border-[#d7dfdc] bg-[#dbe1de] px-3 py-2 text-sm text-[#1a2632] outline-none transition placeholder:text-[#8fa09f] focus:border-[#1f7770]";

const generateSlug = (title) =>
  title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

const formatIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Si la fecha ya pasó (estrictamente antes de hoy), la mueve al año siguiente.
const fixDateYear = (isoDate) => {
  if (!isoDate) return isoDate;
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) d.setFullYear(d.getFullYear() + 1);
  return formatIsoDate(d);
};

const syncDateWithMonth = (monthLabel, currentDateValue) => {
  const monthIndex = MESES.findIndex((mes) => mes === monthLabel);
  if (monthIndex === -1) return currentDateValue || "";
  const baseDate = currentDateValue ? new Date(`${currentDateValue}T00:00:00`) : new Date();
  if (Number.isNaN(baseDate.getTime())) return "";
  const day = currentDateValue ? baseDate.getDate() : 1;
  const safeDay = Math.min(day, new Date(2000, monthIndex + 1, 0).getDate());
  // Si hay fecha base con año explícito, respetarlo; si no, inferir año correcto.
  const inferredYear = currentDateValue
    ? baseDate.getFullYear()
    : (() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const candidate = new Date(today.getFullYear(), monthIndex, safeDay);
        return candidate < today ? today.getFullYear() + 1 : today.getFullYear();
      })();
  return formatIsoDate(new Date(inferredYear, monthIndex, safeDay));
};

const EMPTY = {
  title: "", slug: "", short_description: "", description: "",
  image: "", location: "", price: "", price_child: "",
  departure_date: "", month: "", departure_info: [],
  includes: "", not_includes: "", group_size: "",
  is_featured: false, is_active: true,
};

const PlayaForm = ({ initialData, onSaved, onCancel }) => {
  const { token } = useAuth();
  const isEdit = Boolean(initialData?.id);

  const [data, setData] = useState(
    initialData
      ? {
          ...EMPTY, ...initialData,
          price: String(initialData.price ?? ""),
          price_child: initialData.price_child != null ? String(initialData.price_child) : "",
          includes: Array.isArray(initialData.includes) ? initialData.includes.join("\n") : initialData.includes || "",
          not_includes: Array.isArray(initialData.not_includes) ? initialData.not_includes.join("\n") : initialData.not_includes || "",
          departure_info: typeof initialData.departure_info === "string"
            ? initialData.departure_info.split("\n").filter(Boolean)
            : Array.isArray(initialData.departure_info) ? initialData.departure_info : [],
        }
      : { ...EMPTY }
  );

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [galleryUrl, setGalleryUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(initialData?.image_url || initialData?.image || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (imageFile) {
      setGalleryUrl("");
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (galleryUrl) {
      setPreviewUrl(galleryUrl);
    } else {
      setPreviewUrl(initialData?.image_url || initialData?.image || "");
    }
    // eslint-disable-next-line
  }, [imageFile, galleryUrl, initialData?.image_url, initialData?.image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "month") {
        const synced = syncDateWithMonth(value, prev.departure_date);
        if (synced) next.departure_date = synced;
      }
      if (name === "departure_date" && value) {
        const d = new Date(`${value}T00:00:00`);
        if (!Number.isNaN(d.getTime())) next.month = MESES[d.getMonth()] || next.month;
      }
      return next;
    });
    if (error) setError(null);
  };

  const addStop = () => setData((p) => ({ ...p, departure_info: [...p.departure_info, ""] }));
  const removeStop = (idx) => setData((p) => ({ ...p, departure_info: p.departure_info.filter((_, i) => i !== idx) }));
  const handleStopChange = (idx, value) =>
    setData((p) => { const arr = [...p.departure_info]; arr[idx] = value; return { ...p, departure_info: arr }; });

  const handleAIExtract = (fields) => {
    setData((prev) => {
      const next = { ...prev };
      if (fields.title)             next.title             = fields.title;
      if (fields.short_description) next.short_description = fields.short_description;
      if (fields.description)       next.description       = fields.description;
      if (fields.location)          next.location          = fields.location;
      if (fields.price)             next.price             = String(fields.price);
      if (fields.price_child)       next.price_child       = String(fields.price_child);
      if (fields.departure_date)    next.departure_date    = fixDateYear(fields.departure_date);
      if (fields.departure_info)    next.departure_info    = typeof fields.departure_info === "string"
        ? fields.departure_info.split("\n").filter(Boolean)
        : Array.isArray(fields.departure_info) ? fields.departure_info : [];
      if (fields.includes)          next.includes          = fields.includes;
      if (fields.group_size)        next.group_size        = String(fields.group_size);
      if (fields.not_includes || fields._warnings?.length) {
        const parts = [fields.not_includes || "", (fields._warnings || []).join("\n")].filter(Boolean);
        next.not_includes = parts.join("\n");
      }
      let resolvedMonth = null;
      if (next.departure_date) {
        const d = new Date(next.departure_date + "T12:00:00");
        if (!isNaN(d.getTime())) resolvedMonth = MESES[d.getMonth()];
      }
      if (!resolvedMonth && fields.month) {
        const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        resolvedMonth = MESES.find((m) => norm(m) === norm(String(fields.month))) || null;
      }
      if (resolvedMonth) next.month = resolvedMonth;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isEdit && !imageFile && !galleryUrl) {
      setError("Debes seleccionar una imagen.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("slug", data.slug || generateSlug(data.title));
      formData.append("short_description", data.short_description?.trim() || data.description?.slice(0, 255) || data.title);
      formData.append("description", data.description || "");
      formData.append("location", data.location || "");
      formData.append("price", parseFloat(data.price) || 0);
      if (data.price_child !== "" && data.price_child != null) {
        formData.append("price_child", parseFloat(data.price_child));
      }
      formData.append("departure_date", data.departure_date || "");
      formData.append("month", data.month || "");
      formData.append("departure_info", (Array.isArray(data.departure_info) ? data.departure_info : []).join("\n"));
      formData.append("includes", Array.isArray(data.includes) ? data.includes.join("\n") : data.includes || "");
      formData.append("not_includes", Array.isArray(data.not_includes) ? data.not_includes.join("\n") : data.not_includes || "");
      formData.append("group_size", data.group_size || "");
      formData.append("is_featured", String(Boolean(data.is_featured)));
      formData.append("is_active", String(Boolean(data.is_active)));
      if (imageFile) { formData.append("image", imageFile); }
      else if (galleryUrl) { formData.append("image", galleryUrl); }
      const headers = { "Content-Type": "multipart/form-data", Authorization: `Token ${token}` };
      if (data.id) {
        await axios.put(apiUrl(`playas/${data.id}/`), formData, { headers });
      } else {
        await axios.post(apiUrl("playas/"), formData, { headers });
      }
      onSaved();
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.detail || (errData && typeof errData === "object" ? JSON.stringify(errData) : err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-4 backdrop-blur-[2px]">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border border-[#d7dfdc] bg-[#f5f7f6] shadow-[0_24px_52px_rgba(0,0,0,0.22)]"
      >
        <div className="flex items-center justify-between border-b border-[#d7dfdc] px-4 py-3 sm:px-5">
          <h3 className="font-display text-2xl font-semibold text-[#222f3a] sm:text-3xl">
            {isEdit ? "Editar Playa" : "Nueva Playa"}
          </h3>
          <button type="button" onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#cdd4d2] text-[#3b4b4b] transition hover:bg-[#c0c9c6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {error && (
            <div className="mb-4 rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}

          {!isEdit && (
            <AIExtractButton
              onExtracted={handleAIExtract}
              onImageFile={(file) => { setImageFile(file); setGalleryUrl(""); }}
              className="mb-4"
            />
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Nombre *</label>
                <input name="title" value={data.title} onChange={handleChange} required
                  className={inputCls} placeholder="Calpe - Playa de la Fossa" />
              </div>
              <div>
                <label className={labelCls}>Ubicación *</label>
                <input name="location" value={data.location} onChange={handleChange} required
                  className={inputCls} placeholder="Alicante, Costa Blanca" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Mes</label>
                <select name="month" value={data.month} onChange={handleChange} className={inputCls}>
                  <option value="">Selecciona</option>
                  {MESES.map((mes) => <option key={mes} value={mes}>{mes}</option>)}
                </select>
                <p className="mt-1 text-xs text-[#60706f]">Al elegir mes, la fecha de salida se ajusta automáticamente.</p>
              </div>
              <div>
                <label className={labelCls}>Fecha de salida</label>
                <input name="departure_date" type="date" value={data.departure_date || ""}
                  onChange={handleChange} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Mínimo de personas</label>
                <input name="group_size" value={data.group_size} onChange={handleChange}
                  className={inputCls} placeholder="45 personas" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Precio adulto (€) *</label>
                <input name="price" type="number" step="0.01" min="0" value={data.price}
                  onChange={handleChange} required className={inputCls} placeholder="65" />
              </div>
              <div>
                <label className={labelCls}>Precio niño/mayor 65/discapacidad (€) <span className="normal-case font-normal text-[#8fa09f]">(opcional)</span></label>
                <input name="price_child" type="number" step="0.01" min="0" value={data.price_child}
                  onChange={handleChange} className={inputCls} placeholder="55" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Imagen *</label>
              <input ref={inputRef} type="file" accept="image/*"
                onChange={(e) => { setImageFile(e.target.files?.[0] || null); setGalleryUrl(""); }}
                className="hidden" />
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setImageFile(e.dataTransfer.files?.[0] || null); setGalleryUrl(""); setIsDragOver(false); }}
                className={`rounded-2xl border-2 border-dashed p-5 transition cursor-pointer ${
                  isDragOver ? "border-[#1f7770] bg-[#e7f3f0]" : "border-[#c8d4d0] bg-[#f5f8f7] hover:border-[#1f7770]/60 hover:bg-[#edf4f2]"
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1f7770] shadow-sm">
                    <span className="text-xl font-semibold">+</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#1a2632]">Arrastra una imagen aquí o haz click para seleccionarla</p>
                  <p className="mt-1 text-xs text-[#60706f]">JPG, PNG, WEBP. Formato recomendado 16:9 o similar.</p>
                </div>
              </div>
              <div className="my-3 text-center text-[#60706f] font-semibold text-sm">— ó selecciona una de la galería —</div>
              <GallerySelect onSelect={(url) => { setGalleryUrl(url); setImageFile(null); }}
                selectedUrl={previewUrl} token={token} folder="playas" />
              {previewUrl && (
                <img key={previewUrl} src={previewUrl} alt={data.title || "Playa"}
                  className="mt-3 h-44 w-full rounded-lg object-cover border border-[#d7dfdc]" />
              )}
              {imageFile && <p className="mt-2 text-xs text-[#60706f]">Archivo: {imageFile.name}</p>}
              {!isEdit && !imageFile && !previewUrl && (
                <p className="mt-2 text-xs text-[#9e3f3f]">Se requiere una imagen para crear la playa.</p>
              )}
            </div>

            <div className="border-t border-[#d7dfdc] pt-3">
              <div className="mb-2 flex items-center justify-between">
                <label className={labelCls}>Itinerario / Puntos de salida</label>
                <button type="button" onClick={addStop}
                  className="rounded-xl border border-[#c9d2cf] bg-[#e5ebe8] px-3 py-1.5 text-xs font-semibold text-[#374a49] transition hover:bg-[#d9e1de]">
                  + Añadir parada
                </button>
              </div>
              <div className="space-y-2">
                {data.departure_info.length === 0 && (
                  <p className="text-xs text-[#8fa09f] italic">Sin paradas añadidas. Pulsa «+ Añadir parada» para comenzar.</p>
                )}
                {data.departure_info.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1f7770] text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => handleStopChange(idx, e.target.value)}
                      placeholder={`Ej: 00:${String(idx * 15).padStart(2, "0")} Punto de salida`}
                      className="flex-1 rounded-lg border border-[#c6cfcc] bg-[#dbe1de] px-3 py-2 text-sm text-[#1a2632] outline-none focus:border-[#1f7770]"
                    />
                    <button type="button" onClick={() => removeStop(idx)}
                      className="text-[#d95f5f] transition hover:text-[#bf4646]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Incluye <span className="normal-case font-normal text-[#8fa09f]">(uno por línea)</span></label>
              <textarea name="includes" value={data.includes} onChange={handleChange} rows={3}
                className={`${inputCls} resize-none`}
                placeholder={"Autobús ida y vuelta\nSeguro básico"} />
            </div>

            <div>
              <label className={labelCls}>No incluye <span className="normal-case font-normal text-[#8fa09f]">(uno por línea)</span></label>
              <textarea name="not_includes" value={data.not_includes} onChange={handleChange} rows={2}
                className={`${inputCls} resize-none`}
                placeholder={"Propinas del guía\nNingún otro servicio"} />
            </div>

            <div>
              <label className={labelCls}>Descripción</label>
              <textarea name="description" value={data.description} onChange={handleChange} rows={4}
                className={`${inputCls} resize-none`} placeholder="Describe la playa..." />
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <button type="button" role="switch" aria-checked={data.is_featured}
                  onClick={() => setData((p) => ({ ...p, is_featured: !p.is_featured }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_featured ? "bg-[#c6943d]" : "bg-[#c4ceca]"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.is_featured ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm font-semibold text-[#1a2632]">{data.is_featured ? "Destacada" : "No destacada"}</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" role="switch" aria-checked={data.is_active}
                  onClick={() => setData((p) => ({ ...p, is_active: !p.is_active }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_active ? "bg-[#1f7770]" : "bg-[#c4ceca]"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.is_active ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm font-semibold text-[#1a2632]">{data.is_active ? "Activa — visible en el sitio" : "Desactivada — no se muestra"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#d7dfdc] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-5">
          <button type="button" onClick={onCancel}
            className="w-full rounded-xl border border-[#cdd6d3] px-5 py-2 text-sm font-semibold text-[#344443] transition hover:bg-[#f0f3f2] sm:w-auto">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="w-full rounded-xl bg-[#1f7770] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1a6862] disabled:opacity-60 sm:w-auto">
            {saving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayaForm;
