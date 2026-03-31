import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ExcursionesAdmin from "./ExcursionesAdmin";
import PlayasAdmin from "./PlayasAdmin";
import OfertasAdmin from "./OfertasAdmin";
import EstadosAdmin from "./EstadosAdmin";
import AdminLayout from "./AdminLayout";

const AdminApp = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Guard simple: sin token muestra login; con token renderiza layout admin. */}
      <Route path="/" element={token ? <AdminLayout /> : <Login />}>
        <Route index element={<Dashboard />} />
        <Route path="excursiones" element={<ExcursionesAdmin />} />
        <Route path="playas" element={<PlayasAdmin />} />
        <Route path="estados" element={<EstadosAdmin />} />
        <Route path="ofertas" element={<OfertasAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminApp;
