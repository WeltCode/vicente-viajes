import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import { apiUrl } from "../services/api";
import GallerySelect from "../components/GallerySelect";
import AIExtractButton from "../components/AIExtractButton";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wide text-[#344443] mb-1";
const inputCls =
  "w-full rounded-xl border border-[#d7dfdc] bg-[#dbe1de] px-3 py-2 text-sm text-[#1a2632] outline-none transition placeholder:text-[#8fa09f] focus:border-[#1f7770]";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const formatIsoDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const fixDateYear = (isoDate) => {
  if (!isoDate) return isoDate;
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) d.setFullYear(d.getFullYear() + 1);
  return formatIsoDate(d);
};

// Detecta si imagen es A4 (retrato) o 1:1 (cuadrada) por sus dimensiones
const detectImageFormat = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.naturalWidth / img.naturalHeight;
      // Cuadrada si ratio entre 0.85 y 1.15, retrato si más alto que ancho
      resolve(ratio >= 0.85 && ratio <= 1.15 ? "1:1" : "A4");
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve("A4"); };
    img.src = url;
  });

const calcDiscount = (price, originalPrice) => {
  const current = Number(price || 0);
  const original = Number(originalPrice || 0);
  if (original <= 0 || current <= 0) return "0%";
  const percent = Math.max(0, Math.round(((original - current) / original) * 100));
  return `-${percent}%`;
};

const EMPTY = {
  title: "", city: "", destination: "", nights: "", price: "",
  price_child: "", original_price: "", validity: "",
  image_format: "A4", description: "", departure_date: "", month: "",
  return_time: "", hotel: "", departure_info: "", includes: "",
  not_includes: "", is_hot_deal: false, is_active: true,
};

const OfertaForm = ({ initialData, onSaved, onCancel }) => {
  const { token } = useAuth();
  const isEdit = Boolean(initialData?.id);
  const [data, setData] = useState(
    initialData
      ? {
          ...EMPTY,
          ...initialData,
          price: String(initialData.price ?? ""),
          price_child: initialData.price_child != null ? String(initialData.price_child) : "",
          original_price: String(initialData.original_price ?? ""),
          departure_info: Array.isArray(initialData.departure_info)
            ? initialData.departure_info.join("\n")
            : initialData.departure_info || "",
          includes: Array.isArray(initialData.includes)
            ? initialData.includes.join("\n")
            : initialData.includes || "",
          not_includes: Array.isArray(initialData.not_includes)
            ? initialData.not_includes.join("\n")
            : initialData.not_includes || "",
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
      setGalleryUrl(""); // Si sube nueva, limpia galería
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      // Auto-detectar formato A4 vs 1:1
      detectImageFormat(imageFile).then((fmt) =>
        setData((prev) => ({ ...prev, image_format: fmt }))
      );
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (galleryUrl) {
      setPreviewUrl(galleryUrl);
    } else {
      setPreviewUrl(initialData?.image_url || initialData?.image || "");
    }
    // eslint-disable-next-line
  }, [imageFile, galleryUrl, initialData?.image_url, initialData?.image]);

  const computedDiscount = calcDiscount(data.price, data.original_price);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "departure_date" && value) {
        const d = new Date(`${value}T00:00:00`);
        if (!Number.isNaN(d.getTime())) next.month = MESES[d.getMonth()] || next.month;
      }
      return next;
    });
    if (error) setError(null);
  };

  // Handler extracción IA → mapea campos al formulario
  const handleAIExtract = (fields) => {
    setData((prev) => {
      const next = { ...prev };
      if (fields.title)          next.title         = fields.title;
      if (fields.city)           next.city          = fields.city;
      if (fields.destination)    next.destination   = fields.destination;
      if (fields.nights)         next.nights        = String(fields.nights);
      if (fields.price)          next.price         = String(fields.price);
      if (fields.price_child)    next.price_child   = String(fields.price_child);
      if (fields.original_price) next.original_price = String(fields.original_price);
      if (fields.validity)       next.validity      = fields.validity;
      if (fields.hotel)          next.hotel         = fields.hotel;
      if (fields.description)    next.description   = fields.description;
      if (fields.departure_info) next.departure_info = fields.departure_info;
      if (fields.includes)       next.includes      = fields.includes;
      if (fields.not_includes)   next.not_includes  = fields.not_includes;
      if (fields.return_time)    next.return_time   = fields.return_time;
      if (fields.is_hot_deal != null) next.is_hot_deal = Boolean(fields.is_hot_deal);
      if (fields.departure_date) next.departure_date = fixDateYear(fields.departure_date);

      // Resolver mes
      const MESES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
      const normMes = (val) => {
        if (!val) return null;
        const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return MESES_ES.find((m) => norm(m) === norm(String(val))) || null;
      };
      let resolvedMonth = null;
      if (next.departure_date) {
        const d = new Date(next.departure_date + "T12:00:00");
        if (!Number.isNaN(d.getTime())) resolvedMonth = MESES_ES[d.getMonth()];
      }
      if (!resolvedMonth && fields.month) resolvedMonth = normMes(fields.month);
      if (resolvedMonth) next.month = resolvedMonth;

      return next;
    });
  };

  const normalizeNights = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    if (/^\d+$/.test(trimmed)) return `${trimmed} noches`;
    return trimmed;
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
      formData.append("city", data.city || "");
      formData.append("destination", data.destination || "");
      formData.append("nights", normalizeNights(data.nights));
      formData.append("discount", computedDiscount);
      formData.append("price", parseFloat(data.price) || 0);
      formData.append("original_price", parseFloat(data.original_price) || 0);
      if (data.price_child !== "" && data.price_child != null) {
        formData.append("price_child", parseFloat(data.price_child));
      }
      formData.append("validity", data.validity || "");
      formData.append("image_format", data.image_format || "A4");
      formData.append("description", data.description || "");
      formData.append("departure_date", data.departure_date || "");
      formData.append("month", data.month || "");
      formData.append("return_time", data.return_time || "");
      formData.append("hotel", data.hotel || "");
      formData.append("departure_info", data.departure_info || "");
      formData.append("includes", data.includes || "");
      formData.append("not_includes", data.not_includes || "");
      formData.append("is_hot_deal", String(Boolean(data.is_hot_deal)));
      formData.append("is_active", String(Boolean(data.is_active)));
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (galleryUrl) {
        formData.append("image", galleryUrl);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      };

      if (data.id) {
        await axios.put(apiUrl(`ofertas/${data.id}/`), formData, { headers });
      } else {
        await axios.post(apiUrl("ofertas/"), formData, { headers });
      }
      onSaved();
    } catch (err) {
      const errData = err.response?.data;
      setError(
        errData?.detail ||
          (errData && typeof errData === "object" ? JSON.stringify(errData) : err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-4 backdrop-blur-[2px]">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-[#d7dfdc] bg-[#f5f7f6] shadow-[0_24px_52px_rgba(0,0,0,0.22)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d7dfdc] px-4 py-3 sm:px-5">
          <h3 className="font-display text-2xl font-semibold text-[#222f3a] sm:text-3xl">
            {isEdit ? "Editar Oferta" : "Nueva Oferta"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#cdd4d2] text-[#3b4b4b] transition hover:bg-[#c0c9c6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {error && (
            <div className="mb-4 rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}

          {/* IA extractor */}
          {!isEdit && (
            <AIExtractButton
              onExtracted={handleAIExtract}
              onImageFile={(file) => { setImageFile(file); setGalleryUrl(""); }}
              className="mb-4"
            />
          )}

          <div className="space-y-4">
            {/* Título + Destino */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Título *</label>
                <input name="title" value={data.title} onChange={handleChange} required
                  className={inputCls} placeholder="Galicia - O'Grove, Cambados, Vigo" />
              </div>
              <div>
                <label className={labelCls}>Destino *</label>
                <input name="destination" value={data.destination} onChange={handleChange} required
                  className={inputCls} placeholder="Galicia" />
              </div>
            </div>

            {/* Ciudad + Hotel */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Ciudad de salida</label>
                <input name="city" value={data.city} onChange={handleChange}
                  className={inputCls} placeholder="Madrid" />
              </div>
              <div>
                <label className={labelCls}>Hotel</label>
                <input name="hotel" value={data.hotel} onChange={handleChange}
                  className={inputCls} placeholder="Hotel San Marcos Salnés" />
              </div>
            </div>

            {/* Noches + Mes + Fecha salida */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Noches / Días</label>
                <input name="nights" value={data.nights} onChange={handleChange}
                  className={inputCls} placeholder="2" />
              </div>
              <div>
                <label className={labelCls}>Mes</label>
                <select name="month" value={data.month} onChange={handleChange} className={inputCls}>
                  <option value="">Selecciona</option>
                  {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Fecha salida</label>
                <input name="departure_date" type="date" value={data.departure_date || ""}
                  onChange={handleChange} className={inputCls} />
                <p className="mt-0.5 text-xs text-[#60706f]">Auto-desactiva al pasar la fecha.</p>
              </div>
            </div>

            {/* Hora regreso */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Hora de regreso</label>
                <input name="return_time" value={data.return_time} onChange={handleChange}
                  className={inputCls} placeholder="23:59" />
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Precio adulto (€) *</label>
                <input name="price" type="number" step="0.01" min="0" value={data.price}
                  onChange={handleChange} required className={inputCls} placeholder="159" />
              </div>
              <div>
                <label className={labelCls}>Precio niño / Mayor 65 (€)</label>
                <input name="price_child" type="number" step="0.01" min="0" value={data.price_child}
                  onChange={handleChange} className={inputCls} placeholder="149" />
              </div>
              <div>
                <label className={labelCls}>Precio original (€)</label>
                <input name="original_price" type="number" step="0.01" min="0" value={data.original_price}
                  onChange={handleChange} className={inputCls} placeholder="199" />
              </div>
            </div>

            {/* Vigencia */}
            <div>
              <label className={labelCls}>Texto de vigencia</label>
              <input name="validity" value={data.validity} onChange={handleChange}
                className={inputCls} placeholder="Hasta 31 de Junio" />
            </div>

            {/* Descripción */}
            <div>
              <label className={labelCls}>Descripción breve</label>
              <textarea name="description" value={data.description} onChange={handleChange} rows={2}
                className={`${inputCls} resize-none`}
                placeholder="Paseo en catamarán por la ría, visita a Cambados y Vigo..." />
            </div>

            {/* Puntos de salida */}
            <div>
              <label className={labelCls}>Puntos de salida <span className="normal-case font-normal text-[#8fa09f]">(uno por línea)</span></label>
              <textarea name="departure_info" value={data.departure_info} onChange={handleChange} rows={3}
                className={`${inputCls} resize-none`}
                placeholder={"00:15 Ventas (Metro) Hotel Ibis\n00:30 Legazpi, Metro..."} />
            </div>

            {/* Incluye / No incluye */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Incluye <span className="normal-case font-normal text-[#8fa09f]">(uno por línea)</span></label>
                <textarea name="includes" value={data.includes} onChange={handleChange} rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder={"Bus ida y vuelta\nEncargado acompañante\n1 Pensión completa"} />
              </div>
              <div>
                <label className={labelCls}>No incluye <span className="normal-case font-normal text-[#8fa09f]">(uno por línea)</span></label>
                <textarea name="not_includes" value={data.not_includes} onChange={handleChange} rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder={"Propinas del guía\nNingún otro servicio"} />
              </div>
            </div>

            {/* Imagen */}
            <div>
              <label className={labelCls}>Imagen *</label>
              {/* Selector de formato */}
              <div className="mb-3 flex gap-3">
                {[["A4", "A4 Retrato (cartel)"], ["1:1", "Cuadrada 1:1 (Instagram)"]].map(([val, label]) => (
                  <button key={val} type="button"
                    onClick={() => setData((p) => ({ ...p, image_format: val }))}
                    className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition ${
                      data.image_format === val
                        ? "border-[#1f7770] bg-[#e7f3f0] text-[#1f7770]"
                        : "border-[#d7dfdc] bg-[#dbe1de] text-[#5f7070] hover:border-[#1f7770]/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
                  <p className="mt-1 text-xs text-[#60706f]">JPG, PNG, WEBP — A4 retrato o cuadrada 1:1</p>
                </div>
              </div>
              <div className="my-3 text-center text-[#60706f] font-semibold text-sm">— ó selecciona una de la galería —</div>
              <GallerySelect
                onSelect={(url) => { setGalleryUrl(url); setImageFile(null); }}
                selectedUrl={galleryUrl || previewUrl}
                token={token}
                folder="ofertas"
              />
              {previewUrl && (
                <img key={previewUrl} src={previewUrl} alt={data.title || "Oferta"}
                  className={`mt-3 w-full rounded-lg object-cover border border-[#d7dfdc] ${
                    data.image_format === "1:1" ? "aspect-square" : "max-h-64 object-top"
                  }`} />
              )}
              {imageFile && <p className="mt-2 text-xs text-[#60706f]">Archivo: {imageFile.name}</p>}
              {!isEdit && !imageFile && !previewUrl && (
                <p className="mt-2 text-xs text-[#9e3f3f]">Se requiere una imagen para crear la oferta.</p>
              )}
            </div>

            {/* Switches */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <button type="button" role="switch" aria-checked={Boolean(data.is_hot_deal)}
                  onClick={() => setData((p) => ({ ...p, is_hot_deal: !p.is_hot_deal }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_hot_deal ? "bg-[#c6943d]" : "bg-[#c4ceca]"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.is_hot_deal ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm font-semibold text-[#1a2632]">{data.is_hot_deal ? "Hot Deal activado" : "Hot Deal oculto"}</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" role="switch" aria-checked={Boolean(data.is_active)}
                  onClick={() => setData((p) => ({ ...p, is_active: !p.is_active }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_active ? "bg-[#1f7770]" : "bg-[#c4ceca]"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.is_active ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm font-semibold text-[#1a2632]">{data.is_active ? "Activa — visible en ofertas" : "Desactivada — no se muestra"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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

export default OfertaForm;
