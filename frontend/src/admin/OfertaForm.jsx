import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

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

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };

      if (finalData.id) {
        await axios.put(
          `http://localhost:8000/api/ofertas/${finalData.id}/`,
          finalData,
          { headers }
        );
      } else {
        await axios.post("http://localhost:8000/api/ofertas/", finalData, { headers });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-[620px] flex-col rounded-2xl bg-white shadow-2xl h-[88vh]">
        <div className="flex items-center justify-between border-b border-[#e2e8e6] px-6 py-4">
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
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          {error && (
            <div className="rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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
            <label className={labelCls}>URL de imagen *</label>
            <input
              name="image"
              value={data.image}
              onChange={handleChange}
              required
              className={inputCls}
              placeholder="https://..."
            />
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

        <div className="flex items-center justify-end gap-3 border-t border-[#e2e8e6] px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#cdd6d3] px-5 py-2 text-sm font-semibold text-[#344443] transition hover:bg-[#f0f3f2]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="oferta-form"
            disabled={saving}
            className="rounded-xl bg-[#1f7770] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1a6862] disabled:opacity-60"
          >
            {saving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfertaForm;
