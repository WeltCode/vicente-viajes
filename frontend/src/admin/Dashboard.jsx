import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [counts, setCounts] = useState({ excursiones: 0, playas: 0 });
  const { logout, token } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const headers = {
          "Authorization": `Token ${token}`,
        };
        const [eResp, pResp] = await Promise.all([
          axios.get("http://localhost:8000/api/excursiones/", { headers }),
          axios.get("http://localhost:8000/api/playas/", { headers }),
        ]);
        setCounts({ excursiones: eResp.data.length, playas: pResp.data.length });
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
      }
    }
    if (token) {
      load();
    }
  }, [token]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button
          onClick={logout}
          className="text-red-600 hover:underline"
        >
          Cerrar Sesión
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/excursiones"
          className="p-6 bg-white rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Excursiones</h2>
          <p>{counts.excursiones} elementos</p>
        </Link>
        <Link
          to="/admin/playas"
          className="p-6 bg-white rounded shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Playas</h2>
          <p>{counts.playas} elementos</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;