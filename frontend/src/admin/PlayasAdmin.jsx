import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Waves, Search, Plus, Pencil, Trash2, Star } from "lucide-react";
import PlayaForm from "./PlayaForm";
import { apiUrl } from "../services/api";

const PlayasAdmin = () => {
  const { token, canManageContent } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get(apiUrl("playas/"), {
        headers: { Authorization: `Token ${token}` },
      });
      setItems(resp.data);
    } catch (err) {
      setError(`Error al cargar: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este elemento?")) return;
    try {
      await axios.delete(apiUrl(`playas/${id}/`), {
        headers: { Authorization: `Token ${token}` },
      });
      fetchList();
    } catch (err) {
      setError(`Error al eliminar: ${err.response?.data?.detail || err.message}`);
    }
  };

  const filteredItems = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
  });

  const formatPrice = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return "€0";
    return `€${numeric.toLocaleString("es-ES")}`;
  };

  const formatRating = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return "0.0";
    return numeric.toFixed(1);
  };

  const parseFeatures = (value) =>
    String(value || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c4d6d2] text-[#1f7770]">
            <Waves className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1a2632]">
              Gestión de Playas
            </h1>
            <p className="text-sm text-[#687674]">{items.length} elementos</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <label className="relative block w-full sm:w-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7f7e]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="h-10 w-full sm:w-56 rounded-xl border border-[#c7d0cd] bg-[#e7ecea] pl-9 pr-3 text-sm text-[#213136] outline-none transition focus:border-[#1f7770]"
            />
          </label>
          {canManageContent && (
            <button
              onClick={() => setEditing({})}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1f7770] px-4 text-sm font-semibold text-white transition hover:bg-[#1a6862] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Añadir
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">
            Cerrar
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#ccd4d2] bg-white p-5 text-sm text-[#5f6f6d]">
          Cargando...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[#ccd4d2] bg-white p-5 text-sm text-[#5f6f6d]">
          No hay playas registradas
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredItems.map((item) => {
              const features = parseFeatures(item.characteristics);
              return (
                <article key={`mobile-${item.id}`} className="rounded-2xl border border-[#ccd4d2] bg-white p-3.5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image_url || item.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=320&q=80"}
                      alt={item.title}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_active ? "bg-[#d7ece2] text-[#2f7f66]" : "bg-[#f2dcdc] text-[#b55353]"}`}>
                        {item.is_active ? "Activa" : "Desactivada"}
                      </span>
                      <h3 className="mt-2 text-base font-semibold text-[#1f2d31]">{item.title}</h3>
                      <p className="text-sm text-[#2f4a49]">{item.location}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-[#2f4a49] sm:grid-cols-2">
                    <p><span className="font-semibold text-[#1f2d31]">Precio:</span> {formatPrice(item.price)}</p>
                    <p className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-[#c6943d] text-[#c6943d]" />{formatRating(item.rating)}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {features.slice(0, 3).map((f) => (
                      <span key={`${item.id}-${f}`} className="rounded-full bg-[#e0eeeb] px-2 py-0.5 text-xs font-medium text-[#1f7770]">
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="rounded-full bg-[#e8eceb] px-2 py-0.5 text-xs font-medium text-[#637371]">
                        +{features.length - 3}
                      </span>
                    )}
                  </div>

                  {canManageContent && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditing(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c7d0cd] px-3 py-2 text-sm font-semibold text-[#1f7770] transition hover:bg-[#e0eeeb]"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#f0c4c4] px-3 py-2 text-sm font-semibold text-[#c75252] transition hover:bg-[#fae4e4]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-[#ccd4d2] bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full table-auto">
              <thead>
                <tr className="border-b border-[#d5ddda] bg-white text-sm text-[#203035]">
                  <th className="px-5 py-3 text-left font-semibold">Imagen</th>
                  <th className="px-5 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-5 py-3 text-left font-semibold">Ubicación</th>
                  <th className="px-5 py-3 text-left font-semibold">Precio</th>
                  <th className="px-5 py-3 text-left font-semibold">Rating</th>
                  <th className="px-5 py-3 text-left font-semibold">Características</th>
                  <th className="px-5 py-3 text-left font-semibold">Estado</th>
                  {canManageContent && <th className="px-5 py-3 text-right font-semibold">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const features = parseFeatures(item.characteristics);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#dce3e0] last:border-b-0 hover:bg-[#f6f8f7]"
                    >
                      <td className="px-5 py-3">
                        <img
                          src={item.image_url || item.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=320&q=80"}
                          alt={item.title}
                          className="h-11 w-14 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-5 py-3 text-base font-semibold text-[#1f2d31]">
                        {item.title}
                      </td>
                      <td className="px-5 py-3 text-base text-[#2f4a49]">
                        {item.location}
                      </td>
                      <td className="px-5 py-3 text-base text-[#1f2d31]">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-5 py-3 text-base text-[#1f2d31]">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#c6943d] text-[#c6943d]" />
                          {formatRating(item.rating)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {features.slice(0, 2).map((f) => (
                            <span
                              key={f}
                              className="rounded-full bg-[#e0eeeb] px-2 py-0.5 text-xs font-medium text-[#1f7770]"
                            >
                              {f}
                            </span>
                          ))}
                          {features.length > 2 && (
                            <span className="rounded-full bg-[#e8eceb] px-2 py-0.5 text-xs font-medium text-[#637371]">
                              +{features.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.is_active
                              ? "bg-[#d7ece2] text-[#2f7f66]"
                              : "bg-[#f2dcdc] text-[#b55353]"
                          }`}
                        >
                          {item.is_active ? "Activa" : "Desactivada"}
                        </span>
                      </td>
                      {canManageContent && (
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setEditing(item)}
                              className="rounded-lg border border-[#c7d0cd] p-1.5 text-[#1f7770] transition hover:bg-[#e0eeeb]"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="rounded-lg border border-[#f0c4c4] p-1.5 text-[#c75252] transition hover:bg-[#fae4e4]"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      {editing !== null && canManageContent && (
        <PlayaForm
          initialData={editing}
          onSaved={() => {
            setEditing(null);
            fetchList();
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </section>
  );
};

export default PlayasAdmin;
