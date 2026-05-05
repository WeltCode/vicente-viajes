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
 *   className            — clases extra para el contenedor
 */
const AIExtractButton = ({ onExtracted, className = "" }) => {
  const { token } = useAuth();
  const inputRef = useRef(null);
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    setError(null);
    setWarnings([]);
  };

  const clearPoster = (e) => {
    e.stopPropagation();
    setPosterFile(null);
    setError(null);
    setWarnings([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleExtract = async () => {
    if (!posterFile) {
      inputRef.current?.click();
      return;
    }

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
      onExtracted(fields);
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

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {posterFile ? (
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
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1f7770]/30 bg-white px-3 py-2 text-xs text-[#1f7770] transition hover:bg-[#1f7770]/5"
          >
            <Upload size={13} />
            Subir cartel / poster
          </button>
        )}

        <button
          type="button"
          onClick={handleExtract}
          disabled={!posterFile || loading}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-[#1f7770] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#175e59] disabled:opacity-40"
        >
          <Sparkles size={12} />
          {loading ? "Procesando…" : "Extraer"}
        </button>
      </div>

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
