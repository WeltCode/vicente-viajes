import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Map, Search, Plus, Pencil, Trash2, Star } from "lucide-react";
import ExcursionForm from "./ExcursionForm";
import { apiUrl } from "../services/api";

const ExcursionesAdmin = () => {
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
      const resp = await axios.get(apiUrl("excursiones/"), {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      setItems(resp.data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(`Error al cargar: ${errorMessage}`);
      console.error("Error al cargar excursiones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este elemento?")) {
      try {
        await axios.delete(apiUrl(`excursiones/${id}/`), {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
        fetchList();
      } catch (err) {
        const errorMessage = err.response?.data?.detail || err.message;
        setError(`Error al eliminar: ${errorMessage}`);
        console.error("Error al eliminar:", err);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.month?.toLowerCase().includes(q)
    );
  });

  const formatPrice = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return "€0";
    }
    return `€${numeric.toLocaleString("es-ES")}`;
  };

  const formatRating = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return "0.0";
    }
    return numeric.toFixed(1);
  };

  const formatDuration = (value) => {
    const numeric = String(value || "").replace(/\D/g, "");
    return numeric ? `${numeric} dias` : "-";
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c4d6d2] text-[#1f7770]">
            <Map className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1a2632]">Gestion de Excursiones</h1>
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
              Anadir
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-[#f0bdbd] bg-[#fae4e4] px-4 py-3 text-sm text-[#9e3f3f]">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#ccd4d2] bg-white p-5 text-sm text-[#5f6f6d]">Cargando...</div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[#ccd4d2] bg-white p-5 text-sm text-[#5f6f6d]">No hay excursiones registradas</div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredItems.map((item) => (
              <article key={`mobile-${item.id}`} className="rounded-2xl border border-[#ccd4d2] bg-white p-3.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=320&q=80"}
                    alt={item.title}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.is_active ? "bg-[#d7ece2] text-[#2f7f66]" : "bg-[#f2dcdc] text-[#b55353]"
                        }`}
                      >
                        {item.is_active ? "Activa" : "Desactivada"}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.is_featured ? "bg-[#f1e8cf] text-[#9a7b30]" : "bg-[#e6ecea] text-[#637371]"
                        }`}
                      >
                        {item.is_featured ? "Destacada" : "Normal"}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-[#1f2d31]">{item.title}</h3>
                    <p className="text-sm text-[#2f4a49]">{item.location || "Sin destino"}</p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-[#2f4a49] sm:grid-cols-2">
                  <p className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#1f7770]" />{item.month || "-"}</p>
                  <p><span className="font-semibold text-[#1f2d31]">Duración:</span> {formatDuration(item.duration)}</p>
                  <p><span className="font-semibold text-[#1f2d31]">Precio:</span> {formatPrice(item.price)}</p>
                  <p className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-[#c6943d] text-[#c6943d]" />{formatRating(item.rating)}</p>
                </div>

                {canManageContent && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c7d0cd] px-3 py-2 text-sm font-semibold text-[#1f7770] transition hover:bg-[#e0eeeb]"
                      onClick={() => setEditing(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#f0c4c4] px-3 py-2 text-sm font-semibold text-[#c75252] transition hover:bg-[#fae4e4]"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-[#ccd4d2] bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full table-auto">
              <thead>
                <tr className="border-b border-[#d5ddda] bg-white text-sm text-[#203035]">
                  <th className="px-5 py-3 text-left font-semibold">Imagen</th>
                  <th className="px-5 py-3 text-left font-semibold">Titulo</th>
                  <th className="px-5 py-3 text-left font-semibold">Destino</th>
                  <th className="px-5 py-3 text-left font-semibold">Mes</th>
                  <th className="px-5 py-3 text-left font-semibold">Duracion</th>
                  <th className="px-5 py-3 text-left font-semibold">Precio</th>
                  <th className="px-5 py-3 text-left font-semibold">Rating</th>
                  <th className="px-5 py-3 text-left font-semibold">Estado</th>
                  <th className="px-5 py-3 text-left font-semibold">Destacada</th>
                  {canManageContent && <th className="px-5 py-3 text-right font-semibold">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#dce3e0] last:border-b-0 hover:bg-[#f6f8f7]">
                    <td className="px-5 py-3">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=320&q=80"}
                        alt={item.title}
                        className="h-11 w-14 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-5 py-3 text-base font-semibold text-[#1f2d31]">{item.title}</td>
                    <td className="px-5 py-3 text-base text-[#2f4a49]">{item.location}</td>
                    <td className="px-5 py-3 text-base text-[#2f7770]">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {item.month || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-base text-[#1f2d31]">{formatDuration(item.duration)}</td>
                    <td className="px-5 py-3 text-base text-[#1f2d31]">{formatPrice(item.price)}</td>
                    <td className="px-5 py-3 text-base text-[#1f2d31]">
                      <span className="inline-flex items-center gap-1 text-[#1f2d31]">
                        <Star className="h-4 w-4 fill-[#c6943d] text-[#c6943d]" />
                        {formatRating(item.rating)}
                      </span>
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
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.is_featured
                            ? "bg-[#f1e8cf] text-[#9a7b30]"
                            : "bg-[#e6ecea] text-[#637371]"
                        }`}
                      >
                        {item.is_featured ? "Si" : "No"}
                      </span>
                    </td>
                    {canManageContent && (
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            className="text-[#2a8a83] transition hover:text-[#1f7770]"
                            onClick={() => setEditing(item)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="text-[#ea6a6a] transition hover:text-[#d55151]"
                            onClick={() => handleDelete(item.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      {editing !== null && canManageContent && (
        <ExcursionForm
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

export default ExcursionesAdmin;