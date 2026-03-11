import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PlayaForm from "./PlayaForm";

const PlayasAdmin = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get("http://localhost:8000/api/playas/", {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      setItems(resp.data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(`Error al cargar: ${errorMessage}`);
      console.error("Error al cargar playas:", err);
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
        await axios.delete(`http://localhost:8000/api/playas/${id}/`, {
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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Gestión de Playas</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => setEditing({})}
      >
        Añadir
      </button>
      {loading ? (
        <p>Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No hay playas registradas</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Título</th>
              <th className="border p-2 text-left">Ubicación</th>
              <th className="border p-2 text-left">Precio</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="border p-2">{item.title}</td>
                <td className="border p-2">{item.location}</td>
                <td className="border p-2">€{item.price}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setEditing(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editing !== null && (
        <PlayaForm
          initialData={editing}
          onSaved={() => {
            setEditing(null);
            fetchList();
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default PlayasAdmin;
