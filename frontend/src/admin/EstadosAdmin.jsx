import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Eye, Image, Search, Plus, Pencil, Trash2, X } from "lucide-react";
import EstadoForm from "./EstadoForm";
import { apiUrl } from "../services/api";

const EstadosAdmin = () => {
  const { token, canManageContent } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get(apiUrl("estados/"), {
        headers: { Authorization: `Token ${token}` },
      });
      setItems(resp.data || []);
    } catch (err) {
      setError(`Error al cargar: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  useEffect(() => {
    if (!previewing) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreviewing(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewing]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este estado?")) return;
    try {
      await axios.delete(apiUrl(`estados/${id}/`), {
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
      item.subtitle?.toLowerCase().includes(q) ||
      item.excursion_date?.toLowerCase().includes(q) ||
      String(item.id).includes(q)
    );
  });

  const formatDate = (value) => {
    if (!value) return "Sin fecha";
    return new Date(`${value}T00:00:00`).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDateAlert = (value, isActive) => {
    if (!value) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const excursionDate = new Date(`${value}T00:00:00`);
    const diffMs = excursionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { label: "Vencido", className: "bg-[#f2dcdc] text-[#b55353]" };
    }
    if (!isActive) {
      return { label: "Desactivado", className: "bg-[#ecefef] text-[#637371]" };
    }
    if (diffDays <= 3) {
      return { label: `En ${diffDays} dia${diffDays === 1 ? "" : "s"}`, className: "bg-[#f5ead2] text-[#a06e1c]" };
    }
    if (diffDays <= 7) {
      return { label: "Proximo", className: "bg-[#e7edf6] text-[#4f6f9f]" };
    }

    return null;
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c4d6d2] text-[#1f7770]">
            <Image className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1a2632]">
              Gestion de Estados
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
              Anadir
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
          No hay estados registrados
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredItems.map((item) => {
              const alert = getDateAlert(item.excursion_date, item.is_active);
              return (
                <article key={`mobile-${item.id}`} className="rounded-2xl border border-[#ccd4d2] bg-white p-3.5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => setPreviewing(item)} className="shrink-0">
                      <img
                        src={item.image_url || item.image}
                        alt={item.title || `Estado ${item.id}`}
                        className="h-24 w-16 rounded-xl object-cover"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_active ? "bg-[#d7ece2] text-[#2f7f66]" : "bg-[#f2dcdc] text-[#b55353]"}`}>
                          {item.is_active ? "Activa" : "Desactivada"}
                        </span>
                        {alert && (
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${alert.className}`}>
                            {alert.label}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-[#1f2d31]">{item.title || `Estado ${item.id}`}</h3>
                      <p className="mt-1 text-sm text-[#2f4a49]">{item.subtitle || "Sin subtítulo"}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#2f4a49]"><CalendarDays className="h-4 w-4 text-[#1f7770]" />{formatDate(item.excursion_date)}</p>
                    </div>
                  </div>

                  {canManageContent && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => setPreviewing(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c7d0cd] px-3 py-2 text-sm font-semibold text-[#506766] transition hover:bg-[#e8efed]"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </button>
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
              <table className="min-w-[860px] w-full table-auto">
              <thead>
                <tr className="border-b border-[#d5ddda] bg-white text-sm text-[#203035]">
                  <th className="px-5 py-3 text-left font-semibold">Vista</th>
                  <th className="px-5 py-3 text-left font-semibold">Titulo</th>
                  <th className="px-5 py-3 text-left font-semibold">Subtitulo</th>
                  <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-5 py-3 text-left font-semibold">Estado</th>
                  {canManageContent && <th className="px-5 py-3 text-right font-semibold">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#dce3e0] last:border-b-0 hover:bg-[#f6f8f7]">
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => setPreviewing(item)}>
                        <img
                          src={item.image_url || item.image}
                          alt={item.title || `Estado ${item.id}`}
                          className="h-20 w-12 rounded-lg object-cover"
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-base font-semibold text-[#1f2d31]">
                      {item.title || "Sin titulo"}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#2f4a49]">
                      {item.subtitle || "Sin subtitulo"}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#2f4a49]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-[#1f7770]" />
                        {formatDate(item.excursion_date)}
                        </span>
                        {getDateAlert(item.excursion_date, item.is_active) && (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDateAlert(item.excursion_date, item.is_active).className}`}
                          >
                            {getDateAlert(item.excursion_date, item.is_active).label}
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
                            onClick={() => setPreviewing(item)}
                            className="rounded-lg border border-[#c7d0cd] p-1.5 text-[#506766] transition hover:bg-[#e8efed]"
                            title="Ver imagen completa"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      {editing !== null && canManageContent && (
        <EstadoForm
          initialData={editing}
          onSaved={() => {
            setEditing(null);
            fetchList();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <AnimatePresence>
        {previewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm"
            onClick={() => setPreviewing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <img
                src={previewing.image_url || previewing.image}
                alt={previewing.title || "Estado"}
                className="max-h-[86vh] w-full object-contain bg-[#0f1b20]"
              />
              <button
                onClick={() => setPreviewing(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-12 text-white">
                <h3 className="text-xl font-display font-bold">{previewing.title || `Estado ${previewing.id}`}</h3>
                <p className="mt-1 text-sm text-white/80">{previewing.subtitle || formatDate(previewing.excursion_date)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EstadosAdmin;
