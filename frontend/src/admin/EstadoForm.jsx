import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, ImagePlus, UploadCloud, X } from "lucide-react";
import { apiUrl } from "../services/api";
import GallerySelect from "../components/GallerySelect";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wide text-[#344443] mb-1";
const inputCls =
  "w-full rounded-xl border border-[#d7dfdc] bg-[#dbe1de] px-3 py-2 text-sm text-[#1a2632] outline-none transition placeholder:text-[#8fa09f] focus:border-[#1f7770]";

const EstadoForm = ({ initialData, onSaved, onCancel }) => {
  const inputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [galleryUrl, setGalleryUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(initialData?.image_url || initialData?.image || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (imageFile) {
      setGalleryUrl("");
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (galleryUrl) {
      setPreviewUrl(galleryUrl);
    } else {
      setPreviewUrl(initialData?.image_url || initialData?.image || "");
    }
    // eslint-disable-next-line
  }, [imageFile, galleryUrl, initialData?.image_url, initialData?.image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const assignFile = (file) => {
    setImageFile(file);
    if (file) {
      setPreviewUrl("");
    }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSaving(true);
      try {
        const formData = new FormData();
        formData.append("title", data.title || "");
        formData.append("subtitle", data.subtitle || "");
        // Asegura formato YYYY-MM-DD
        let dateValue = data.excursion_date || "";
        if (dateValue && dateValue.length > 0) {
          // Si ya es YYYY-MM-DD, lo deja igual
          const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!match) {
            // Intenta formatear si viene en otro formato
            const d = new Date(dateValue);
            if (!isNaN(d.getTime())) {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              dateValue = `${yyyy}-${mm}-${dd}`;
            }
          }
        }
        formData.append("excursion_date", dateValue);
        formData.append("is_active", String(Boolean(data.is_active)));
        if (imageFile) {
          formData.append("image", imageFile);
        } else if (galleryUrl) {
          formData.append("image_url", galleryUrl);
        }

        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        };

        if (data.id) {
          await axios.put(apiUrl(`estados/${data.id}/`), formData, { headers });
        } else {
          await axios.post(apiUrl("estados/"), formData, { headers });
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
  const { token } = useAuth();
  const isEdit = Boolean(initialData?.id);
  const [data, setData] = useState(() => {
    // Si initialData, usar sus valores, asegurando formato de fecha correcto
    let date = initialData?.excursion_date || "";
    if (date && date.length > 0) {
      // Si no es YYYY-MM-DD, intenta formatear
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!match) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          date = `${yyyy}-${mm}-${dd}`;
        }
      }
    }
    return {
      id: initialData?.id,
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      excursion_date: date,
      is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    };
  });

// (Eliminado bloque de código fuera de función que causaba errores)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-[620px] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e2e8e6] px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-[#1a2632]">
            {isEdit ? "Editar Estado" : "Nuevo Estado"}
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
          id="estado-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
        >
          {error && (
            <div className="rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
              {error}
            </div>
          )}


          <div>
            <label className={labelCls}>Titulo (opcional)</label>
            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              className={inputCls}
              placeholder="Estado en playa"
            />
          </div>

          <div>
            <label className={labelCls}>Fecha de excursión *</label>
            <input
              name="excursion_date"
              type="date"
              value={data.excursion_date}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Imagen vertical *</label>
            <div className="mb-2 text-sm font-semibold text-[#1a2632]">Carga una imagen</div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => assignFile(e.target.files?.[0] || null)}
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
                assignFile(e.dataTransfer.files?.[0] || null);
                setIsDragOver(false);
              }}
              className={`rounded-2xl border-2 border-dashed p-5 transition cursor-pointer ${
                isDragOver
                  ? "border-[#1f7770] bg-[#e7f3f0]"
                  : "border-[#c8d4d0] bg-[#f5f8f7] hover:border-[#1f7770]/60 hover:bg-[#edf4f2]"
              }`}>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1f7770] shadow-sm">
                  {isDragOver ? <UploadCloud className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#1a2632]">
                  Arrastra una imagen aquí o haz click para seleccionarla
                </p>
                <p className="mt-1 text-xs text-[#60706f]">
                  Formato vertical 9:16 recomendado. Máximo 3 MB. JPG, PNG, WEBP.
                </p>
              </div>
            </div>
            <div className="my-3 text-center text-[#60706f] font-semibold text-sm">— ó selecciona una de la galería —</div>
            <GallerySelect
              onSelect={(url) => {
                setGalleryUrl(url);
                setImageFile(null);
              }}
              selectedUrl={galleryUrl || previewUrl}
              token={token}
              folder="estados"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt={data.title || "Estado"}
                className="mt-3 h-44 w-28 rounded-lg object-cover border border-[#d7dfdc]"
              />
            )}
            {imageFile && (
              <p className="mt-2 text-xs text-[#60706f]">Archivo: {imageFile.name}</p>
            )}
            {!isEdit && !imageFile && !previewUrl && (
              <p className="mt-2 text-xs text-[#9e3f3f]">Se requiere una imagen para crear el estado.</p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#f0f4f2] px-4 py-3">
            <button
              type="button"
              role="switch"
              aria-checked={data.is_active}
              onClick={() => setData((prev) => ({ ...prev, is_active: !prev.is_active }))}
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
            form="estado-form"
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

export default EstadoForm;
