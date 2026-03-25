import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Tag, Search, Plus, Pencil, Trash2, Flame, GripVertical } from "lucide-react";
import OfertaForm from "./OfertaForm";

const OfertasAdmin = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get("http://localhost:8000/api/ofertas/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = resp.data || [];
      data.sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
      setItems(data);
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
    if (!window.confirm("¿Eliminar esta oferta?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/ofertas/${id}/`, {
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
      item.city?.toLowerCase().includes(q) ||
      item.destination?.toLowerCase().includes(q)
    );
  });

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `€${amount.toLocaleString("es-ES")}`;
  };

  const persistOrder = async (list) => {
    try {
      const payload = list.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }));
      await axios.post("http://localhost:8000/api/ofertas/reorder/", payload, {
        headers: { Authorization: `Token ${token}` },
      });
    } catch (err) {
      setError(`Error al guardar orden: ${err.response?.data?.detail || err.message}`);
    }
  };

  const moveItem = (fromId, toId) => {
    if (query.trim()) return;
    if (!fromId || !toId || fromId === toId) return;
    const fromIndex = items.findIndex((item) => item.id === fromId);
    const toIndex = items.findIndex((item) => item.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;

    const reorderedAll = [...items];
    const [moved] = reorderedAll.splice(fromIndex, 1);
    reorderedAll.splice(toIndex, 0, moved);

    setItems(reorderedAll);
    persistOrder(reorderedAll);
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c4d6d2] text-[#1f7770]">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1a2632]">
              Gestion de Ofertas
            </h1>
            <p className="text-sm text-[#687674]">{items.length} elementos</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7f7e]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="h-10 w-56 rounded-xl border border-[#c7d0cd] bg-[#e7ecea] pl-9 pr-3 text-sm text-[#213136] outline-none transition focus:border-[#1f7770]"
            />
          </label>
          <button
            onClick={() => setEditing({})}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1f7770] px-4 text-sm font-semibold text-white transition hover:bg-[#1a6862]"
          >
            <Plus className="h-4 w-4" />
            Anadir
          </button>
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
          No hay ofertas registradas
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#ccd4d2] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full table-auto">
              <thead>
                <tr className="border-b border-[#d5ddda] bg-white text-sm text-[#203035]">
                  <th className="px-3 py-3 text-left font-semibold">Orden</th>
                  <th className="px-5 py-3 text-left font-semibold">Imagen</th>
                  <th className="px-5 py-3 text-left font-semibold">Titulo</th>
                  <th className="px-5 py-3 text-left font-semibold">Ciudad</th>
                  <th className="px-5 py-3 text-left font-semibold">Noches</th>
                  <th className="px-5 py-3 text-left font-semibold">Precio</th>
                  <th className="px-5 py-3 text-left font-semibold">Descuento</th>
                  <th className="px-5 py-3 text-left font-semibold">Hot Deal</th>
                  <th className="px-5 py-3 text-left font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    draggable={!query.trim()}
                    onDragStart={() => setDraggingId(item.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      moveItem(draggingId, item.id);
                      setDraggingId(null);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className="border-b border-[#dce3e0] last:border-b-0 hover:bg-[#f6f8f7]"
                  >
                    <td className="px-3 py-3 text-[#7c8d8b]">
                      <GripVertical className="h-4 w-4 cursor-grab" />
                    </td>
                    <td className="px-5 py-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-11 w-14 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-5 py-3 text-base font-semibold text-[#1f2d31]">
                      {item.title}
                    </td>
                    <td className="px-5 py-3 text-base text-[#2f4a49]">{item.city}</td>
                    <td className="px-5 py-3 text-base text-[#2f4a49]">{item.nights}</td>
                    <td className="px-5 py-3 text-base text-[#1f2d31]">
                      {formatMoney(item.price)}
                      <span className="ml-2 text-sm text-[#6c7d7b] line-through">
                        {formatMoney(item.original_price)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-base text-[#1f2d31]">{item.discount}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.is_hot_deal
                            ? "bg-[#f1e8cf] text-[#9a7b30]"
                            : "bg-[#e6ecea] text-[#637371]"
                        }`}
                      >
                        <Flame className="h-3.5 w-3.5" />
                        {item.is_hot_deal ? "Si" : "No"}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing !== null && (
        <OfertaForm
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

export default OfertasAdmin;
