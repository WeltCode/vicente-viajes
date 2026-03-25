import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ExcursionesAdmin from "./ExcursionesAdmin";
import PlayasAdmin from "./PlayasAdmin";
import OfertasAdmin from "./OfertasAdmin";
import AdminLayout from "./AdminLayout";

const PlaceholderSection = ({ title }) => {
  return (
    <section className="rounded-2xl border border-[#d0d9d7] bg-white p-6">
      <h2 className="text-3xl font-display font-semibold text-[#182330]">{title}</h2>
      <p className="mt-2 text-[#60706f]">Seccion en preparacion.</p>
    </section>
  );
};

const AdminApp = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={token ? <AdminLayout /> : <Login />}>
        <Route index element={<Dashboard />} />
        <Route path="excursiones" element={<ExcursionesAdmin />} />
        <Route path="playas" element={<PlayasAdmin />} />
        <Route path="hoteles" element={<PlaceholderSection title="Gestion de Hoteles" />} />
        <Route path="ofertas" element={<OfertasAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminApp;
