import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Excursiones from "../pages/Excursiones";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/excursiones" element={<Excursiones />} />
      </Routes>
    </BrowserRouter>
  )
}
