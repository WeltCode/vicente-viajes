import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import { apiUrl } from "../services/api";
import GallerySelect from "../components/GallerySelect";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wide text-[#344443] mb-1";
const inputCls =
  "w-full rounded-xl border border-[#d7dfdc] bg-[#dbe1de] px-3 py-2 text-sm text-[#1a2632] outline-none transition placeholder:text-[#8fa09f] focus:border-[#1f7770]";

const calcDiscount = (price, originalPrice) => {
  const current = Number(price || 0);
  const original = Number(originalPrice || 0);
  if (original <= 0) return "0%";
  const percent = ((original - current) / original) * 100;
  const normalized = Math.max(0, Math.round(percent));
  return `-${normalized}%`;
};

const OfertaForm = ({ initialData, onSaved, onCancel }) => {
  const { token } = useAuth();
  const isEdit = Boolean(initialData?.id);
  const [data, setData] = useState({
    title: "",
    city: "",
    destination: "",
    nights: "",
    discount: "0%",
    price: "",
    original_price: "",
    validity: "",
    image: "",
    is_hot_deal: false,
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
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      // Prioriza image_url, luego image
      setPreviewUrl(initialData?.image_url || initialData?.image || "");
    }
    // eslint-disable-next-line
  }, [imageFile, initialData?.image_url, initialData?.image]);

  const computedDiscount = calcDiscount(data.price, data.original_price);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
    setSaving(true);
    try {
      const finalData = {
        ...data,
        discount: computedDiscount,
        nights: normalizeNights(data.nights),
        price: parseFloat(data.price) || 0,
        original_price: parseFloat(data.original_price) || 0,
      };

      const formData = new FormData();
      formData.append("title", finalData.title || "");
      formData.append("city", finalData.city || "");
      formData.append("destination", finalData.destination || "");
      formData.append("nights", finalData.nights || "");
      formData.append("discount", finalData.discount || "");
      formData.append("price", finalData.price);
      formData.append("original_price", finalData.original_price);
      formData.append("validity", finalData.validity || "");
      formData.append("is_hot_deal", String(Boolean(finalData.is_hot_deal)));
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
          apiUrl(`ofertas/${finalData.id}/`),
          formData,
          { headers }
        );
      } else {
        await axios.post(apiUrl("ofertas/"), formData, { headers });
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
      <div className="flex max-h-[92vh] w-full max-w-[620px] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e2e8e6] px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-[#1a2632]">
            {isEdit ? "Editar Oferta" : "Nueva Oferta"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-[#5f7070] transition hover:bg-[#e8ecea]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          id="oferta-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
        >
          {error && (
            <div className="rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Titulo *</label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="Paquete Caribe Todo Incluido"
              />
            </div>
            <div>
              <label className={labelCls}>Ciudad *</label>
              <input
                name="city"
                value={data.city}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="Cancun, Mexico"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Destino *</label>
              <input
                name="destination"
                value={data.destination}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="Cancun"
              />
            </div>
            <div>
              <label className={labelCls}>Noches *</label>
              <input
                name="nights"
                value={data.nights}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="7 noches"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Precio actual (€) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={data.price}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="1299"
              />
            </div>
            <div>
              <label className={labelCls}>Precio original (€) *</label>
              <input
                name="original_price"
                type="number"
                step="0.01"
                min="0"
                value={data.original_price}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="1899"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Descuento (auto)</label>
              <input
                name="discount"
                value={computedDiscount}
                readOnly
                className={inputCls}
                placeholder="-32%"
              />
            </div>
            <div>
              <label className={labelCls}>Texto de vigencia *</label>
              <input
                name="validity"
                value={data.validity}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="Valido hasta 31 Mar"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Imagen *</label>
            <div className="mb-2 text-sm font-semibold text-[#1a2632]">Carga una imagen</div>
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
            <div className="my-3 text-center text-[#60706f] font-semibold text-sm">— ó selecciona una de la galería —</div>
            <GallerySelect
              onSelect={(url) => {
                setPreviewUrl(url);
                setImageFile(null);
              }}
              selectedUrl={previewUrl}
              token={token}
              folder="ofertas"
            />
            {previewUrl && (
              <img
                key={previewUrl}
                src={previewUrl}
                alt={data.title || "Oferta"}
                className="mt-3 h-44 w-full rounded-lg object-cover border border-[#d7dfdc]"
              />
            )}
            {imageFile && (
              <p className="mt-2 text-xs text-[#60706f]">Archivo: {imageFile.name}</p>
            )}
            {!isEdit && !imageFile && !previewUrl && (
              <p className="mt-2 text-xs text-[#9e3f3f]">Se requiere una imagen para crear la oferta.</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3">
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(data.is_hot_deal)}
                onClick={() =>
                  setData((prev) => ({ ...prev, is_hot_deal: !Boolean(prev.is_hot_deal) }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  data.is_hot_deal ? "bg-[#1f7770]" : "bg-[#c4ceca]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    data.is_hot_deal ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-semibold text-[#1a2632]">
                {data.is_hot_deal
                  ? "Hot Deal — badge visible"
                  : "Hot Deal oculto"}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3">
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(data.is_active)}
                onClick={() =>
                  setData((prev) => ({ ...prev, is_active: !Boolean(prev.is_active) }))
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
                  ? "Activa — visible en ofertas"
                  : "Desactivada — no se muestra"}
              </span>
            </div>
          </div>
        </form>

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
            form="oferta-form"
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

export default OfertaForm;
