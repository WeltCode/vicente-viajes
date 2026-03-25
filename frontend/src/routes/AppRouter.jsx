import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Excursiones from "../pages/Excursiones";
import Playas from "../pages/Playas";
import Ofertas from "../pages/Ofertas";
import BuscarVuelos from "../pages/BuscarVuelos";
import Nosotros from "../pages/Nosotros";
import Contacto from "../pages/Contacto";
import { AuthProvider } from "../context/AuthContext";
import AdminApp from "../admin/AdminApp";

export default function AppRouter() {
  return (
    // AuthProvider inyecta token/login/logout para todo el arbol de rutas.
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excursiones" element={<Excursiones />} />
          <Route path="/playas" element={<Playas />} />
          <Route path="/ofertas" element={<Ofertas />} />
          {/* Token de busqueda de vuelos codificado en URL para reconstruir payload. */}
          <Route path="/buscar/:searchToken" element={<BuscarVuelos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
