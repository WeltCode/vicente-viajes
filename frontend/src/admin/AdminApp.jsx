import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ExcursionesAdmin from "./ExcursionesAdmin";
import PlayasAdmin from "./PlayasAdmin";

const AdminApp = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Dashboard /> : <Login />}
      />
      <Route
        path="excursiones"
        element={token ? <ExcursionesAdmin /> : <Navigate to="/admin" />}
      />
      <Route
        path="playas"
        element={token ? <PlayasAdmin /> : <Navigate to="/admin" />}
      />
    </Routes>
  );
};

export default AdminApp;
