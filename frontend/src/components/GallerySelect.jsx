import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../services/api";

export default function GallerySelect({ onSelect, selectedUrl, token, folder = "excursiones" }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSelected, setModalSelected] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const params = folder ? `?folder=${encodeURIComponent(folder)}` : "";
    axios
      .get(apiUrl(`excursiones/gallery/${params}`), {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setImages(res.data.images || []);
      })
      .catch(() => {
        setError("No se pudo cargar la galería");
      })
      .finally(() => setLoading(false));
  }, [token, folder]);

  if (!token) return null;

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-[#344443]">Seleccionar de galería</span>
        <button
          type="button"
          className="ml-2 px-2 py-0.5 rounded bg-[#e5ebe8] text-[#1f7770] text-xs font-semibold border border-[#c9d2cf] hover:bg-[#d9e1de] transition"
          onClick={() => setShowModal(true)}
        >
          Ver grande
        </button>
      </div>
      <div className="rounded-2xl border-2 border-dashed bg-[#f5f8f7] p-3 mb-2">
        {loading && <div className="text-xs text-[#60706f]">Cargando imágenes...</div>}
        {error && <div className="text-xs text-[#9e3f3f]">{error}</div>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-32 overflow-y-auto">
          {images.map((img) => (
            <button
              type="button"
              key={img.public_id}
              className={`border-2 rounded-lg p-1 transition focus:outline-none bg-white ${
                selectedUrl === img.url
                  ? "border-[#1f7770] shadow-lg"
                  : "border-transparent hover:border-[#1f7770]/40"
              }`}
              onClick={() => onSelect(img.url)}
              tabIndex={0}
              title="Seleccionar imagen"
              style={{ minHeight: 56 }}
            >
              <img
                src={img.url}
                alt={img.public_id}
                className="h-14 w-full object-cover rounded"
                style={{ background: "#e5e5e5" }}
              />
            </button>
          ))}
          {images.length === 0 && !loading && (
            <div className="text-xs text-[#60706f] col-span-full">No hay imágenes en la galería.</div>
          )}
        </div>
      </div>

      {/* Modal expandible */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full sm:w-auto sm:max-w-[1100px] max-h-[92vh] bg-white rounded-2xl shadow-2xl p-2 sm:p-8 flex flex-col sm:flex-col overflow-y-auto sm:overflow-visible mx-auto"
            style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
            <button
              type="button"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#1f7770] bg-[#e5ebe8] rounded-full p-2 hover:bg-[#d9e1de] border border-[#c9d2cf]"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar galería"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#1f7770" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="mb-2 sm:mb-4 text-base sm:text-lg font-semibold text-[#344443] text-center">Galería de imágenes</div>
            {/* Layout móvil: grid y preview en bloques independientes; desktop: flex-row */}
            {/* Layout condicional: móvil (previsualización al final), escritorio (previsualización a la derecha) */}
            <div className="block sm:hidden w-full max-w-full">
              {/* SOLO MÓVIL: grid y preview al final */}
              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <button
                    type="button"
                    key={img.public_id}
                    className={`group border-2 rounded-xl p-1 transition focus:outline-none flex flex-col items-center aspect-square ${
                      (modalSelected ? modalSelected.url : selectedUrl) === img.url
                        ? "border-[#1f7770] shadow-lg bg-[#e7f3f0]"
                        : "border-transparent hover:border-[#1f7770]/40 bg-[#f5f8f7]"
                    }`}
                    onClick={() => setModalSelected(img)}
                    tabIndex={0}
                    title="Previsualizar imagen"
                  >
                    <img
                      src={img.url}
                      alt={img.public_id}
                      className="w-full h-full object-cover rounded-xl border border-[#d7dfdc] group-hover:scale-105 transition-transform aspect-square"
                      style={{ background: "#e5e5e5" }}
                    />
                    <span className="text-xs text-[#60706f] truncate w-full mt-1">{img.public_id.split('/').pop()}</span>
                  </button>
                ))}
                {images.length === 0 && !loading && (
                  <div className="text-xs text-[#60706f] col-span-full">No hay imágenes en la galería.</div>
                )}
              </div>
              {((modalSelected && modalSelected.url) || selectedUrl) && (
                <>
                  <hr className="my-5 border-t-2 border-[#d7dfdc]" />
                  <div className="flex flex-col items-center justify-center w-full">
                    <img
                      src={(modalSelected && modalSelected.url) || selectedUrl}
                      alt={modalSelected?.public_id || "Previsualización"}
                      className="w-full max-w-xs max-h-60 rounded-2xl border-2 border-[#d7dfdc] shadow-lg bg-[#f5f8f7] mx-auto"
                      style={{ background: "#e5e5e5", objectFit: 'contain' }}
                    />
                    <div className="mt-3 flex gap-2 w-full justify-center">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[#1f7770] text-white font-semibold text-sm shadow hover:bg-[#17635e] transition w-full"
                        onClick={() => {
                          onSelect((modalSelected && modalSelected.url) || selectedUrl);
                          setShowModal(false);
                        }}
                      >
                        Seleccionar esta imagen
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl border border-[#c9d2cf] bg-[#e5ebe8] text-[#1f7770] font-semibold text-sm hover:bg-[#d9e1de] transition w-full"
                        onClick={() => setModalSelected(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="hidden sm:flex flex-row flex-1 gap-10 min-h-[320px] justify-center items-center">
              {/* SOLO ESCRITORIO: grid a la izquierda, preview a la derecha, todo más grande y centrado */}
              <div className="w-[480px] max-w-[48vw] flex-shrink-0 overflow-y-auto pr-4 flex flex-col items-center">
                <div className="grid grid-cols-4 gap-6">
                  {images.map((img) => (
                    <button
                      type="button"
                      key={img.public_id}
                      className={`group border-2 rounded-xl p-1.5 transition focus:outline-none flex flex-col items-center aspect-square ${
                        (modalSelected ? modalSelected.url : selectedUrl) === img.url
                          ? "border-[#1f7770] shadow-lg bg-[#e7f3f0]"
                          : "border-transparent hover:border-[#1f7770]/40 bg-[#f5f8f7]"
                      }`}
                      onClick={() => setModalSelected(img)}
                      tabIndex={0}
                      title="Previsualizar imagen"
                    >
                      <img
                        src={img.url}
                        alt={img.public_id}
                        className="w-full h-full object-cover rounded-xl border border-[#d7dfdc] group-hover:scale-105 transition-transform aspect-square"
                        style={{ background: "#e5e5e5" }}
                      />
                      <span className="text-sm text-[#60706f] truncate w-full mt-1">{img.public_id.split('/').pop()}</span>
                    </button>
                  ))}
                  {images.length === 0 && !loading && (
                    <div className="text-sm text-[#60706f] col-span-full">No hay imágenes en la galería.</div>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center min-h-[260px] max-w-[520px]">
                {((modalSelected && modalSelected.url) || selectedUrl) ? (
                  <>
                    <div className="flex-1 flex items-center justify-center w-full">
                      <img
                        src={(modalSelected && modalSelected.url) || selectedUrl}
                        alt={modalSelected?.public_id || "Previsualización"}
                        className="max-w-xl max-h-72 rounded-2xl border-2 border-[#d7dfdc] shadow-lg bg-[#f5f8f7] mx-auto"
                        style={{ background: "#e5e5e5", objectFit: 'contain' }}
                      />
                    </div>
                    <div className="mt-4 flex gap-3 w-full justify-center">
                      <button
                        type="button"
                        className="px-5 py-3 rounded-xl bg-[#1f7770] text-white font-semibold text-base shadow hover:bg-[#17635e] transition w-full sm:w-auto"
                        onClick={() => {
                          onSelect((modalSelected && modalSelected.url) || selectedUrl);
                          setShowModal(false);
                        }}
                      >
                        Seleccionar esta imagen
                      </button>
                      <button
                        type="button"
                        className="px-5 py-3 rounded-xl border border-[#c9d2cf] bg-[#e5ebe8] text-[#1f7770] font-semibold text-base hover:bg-[#d9e1de] transition w-full sm:w-auto"
                        onClick={() => setModalSelected(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-[#60706f] text-base text-center">Selecciona una imagen de la galería para previsualizarla aquí.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
