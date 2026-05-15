import React, { useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../services/api";
import { Sparkles, Upload, X } from "lucide-react";

/**
 * Botón de extracción de datos con IA a partir de un cartel/poster.
 *
 * Props:
 *   onExtracted(fields)  — callback con los campos extraídos (sin "warnings")
 *   onImageFile(file)    — (opcional) callback con el File cuando se selecciona, para usarlo como imagen del formulario
 *   className            — clases extra para el contenedor
 */
const AIExtractButton = ({ onExtracted, onImageFile, className = "" }) => {
  const { token } = useAuth();
  const inputRef = useRef(null);
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const selectFile = (file) => {
    if (!file) return;
    setPosterFile(file);
    setError(null);
    setWarnings([]);
    onImageFile?.(file);
  };

  const handleFileChange = (e) => {
    selectFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    selectFile(e.dataTransfer.files?.[0]);
    setIsDragOver(false);
  };

  const clearPoster = (e) => {
    e.stopPropagation();
    setPosterFile(null);
    setError(null);
    setWarnings([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleExtract = async () => {
    if (!posterFile) return;

    setLoading(true);
    setError(null);
    setWarnings([]);

    try {
      const formData = new FormData();
      formData.append("image", posterFile);

      const { data } = await axios.post(apiUrl("ai/extract-poster/"), formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { warnings: w = [], ...fields } = data;
      if (w.length > 0) setWarnings(w);
      onExtracted({ ...fields, _warnings: w });
    } catch (err) {
      setError(err.response?.data?.error || "Error al procesar la imagen con IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl border border-dashed border-[#1f7770]/50 bg-[#f0f9f8] p-3 ${className}`}
    >
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#1f7770]">
        <Sparkles size={13} />
        Rellenar formulario con IA
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {posterFile ? (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-lg border border-[#1f7770]/30 bg-white px-2 py-1.5 text-xs text-[#344443]">
            <span className="truncate flex-1">{posterFile.name}</span>
            <button
              type="button"
              onClick={clearPoster}
              className="shrink-0 text-gray-400 transition hover:text-red-500"
            >
              <X size={13} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleExtract}
            disabled={loading}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-[#1f7770] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#175e59] disabled:opacity-40"
          >
            <Sparkles size={12} />
            {loading ? "Procesando…" : "Extraer"}
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-4 transition cursor-pointer ${
            isDragOver
              ? "border-[#1f7770] bg-[#e7f3f0]"
              : "border-[#1f7770]/30 bg-white hover:border-[#1f7770]/60 hover:bg-[#edf4f2]"
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f9f8] text-[#1f7770] shadow-sm">
              <Upload size={18} />
            </div>
            <p className="mt-2 text-sm font-semibold text-[#1a2632]">
              Arrastra el cartel aquí o haz click para seleccionarlo
            </p>
            <p className="mt-0.5 text-xs text-[#60706f]">JPG, PNG, WEBP</p>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {warnings.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {warnings.map((w, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i} className="text-xs text-amber-600">
              ⚠ {w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIExtractButton;
