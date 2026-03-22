import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Excursiones from "../pages/Excursiones";
import Playas from "../pages/Playas";
import Nosotros from "../pages/Nosotros";
import Contacto from "../pages/Contacto";
import { AuthProvider } from "../context/AuthContext";
import AdminApp from "../admin/AdminApp";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excursiones" element={<Excursiones />} />
          <Route path="/playas" element={<Playas />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
