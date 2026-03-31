import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Map, Waves, ImageIcon, Tag, CalendarDays, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [counts, setCounts] = useState({ excursiones: 0, playas: 0, estados: 0, ofertas: 0 });
  const [recent, setRecent] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const headers = {
          "Authorization": `Token ${token}`,
        };
        const [eResp, pResp, oResp, sResp] = await Promise.all([
          axios.get("http://localhost:8000/api/excursiones/", { headers }),
          axios.get("http://localhost:8000/api/playas/", { headers }),
          axios.get("http://localhost:8000/api/ofertas/", { headers }),
          axios.get("http://localhost:8000/api/estados/", { headers }),
        ]);
        const excursiones = eResp.data || [];
        const playas = pResp.data || [];
        const ofertas = oResp.data || [];
        const estados = sResp.data || [];

        setCounts((prev) => ({
          ...prev,
          excursiones: excursiones.length,
          playas: playas.length,
          estados: estados.length,
          ofertas: ofertas.length,
        }));

        const excursionItems = excursiones.map((item) => ({
          id: `e-${item.id}`,
          title: item.title,
          type: "Excursión",
          created_at: item.created_at || "",
        }));

        const playaItems = playas.map((item) => ({
          id: `p-${item.id}`,
          title: item.title,
          type: "Playa",
          created_at: item.created_at || "",
        }));

        const ofertaItems = ofertas.map((item) => ({
          id: `o-${item.id}`,
          title: item.title,
          type: "Oferta",
          created_at: item.created_at || "",
        }));

        const estadoItems = estados.map((item) => ({
          id: `s-${item.id}`,
          title: item.title || `Estado ${item.id}`,
          type: "Estado",
          created_at: item.created_at || "",
        }));

        const combined = [...excursionItems, ...playaItems, ...ofertaItems, ...estadoItems].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setRecent(combined.slice(0, 8));
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
      }
    }
    if (token) {
      load();
    }
  }, [token]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight text-[#182330]">Bienvenido, {user?.username || "admin"}!</h1>
        <p className="mt-1 text-base text-[#637271]">Gestiona el contenido de Vicente Viajes desde este panel.</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-4 sm:grid-cols-2">
        <article className="rounded-xl border border-[#ccd4d2] bg-white px-4 py-4">
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f7770] text-white">
            <Map className="h-4 w-4" />
          </span>
          <p className="text-3xl font-semibold text-[#1b2733]">{counts.excursiones}</p>
          <p className="mt-0.5 text-sm text-[#60706f]">Excursiones</p>
        </article>

        <article className="rounded-xl border border-[#ccd4d2] bg-white px-4 py-4">
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f7770] text-white">
            <Waves className="h-4 w-4" />
          </span>
          <p className="text-3xl font-semibold text-[#1b2733]">{counts.playas}</p>
          <p className="mt-0.5 text-sm text-[#60706f]">Playas</p>
        </article>

        <article className="rounded-xl border border-[#ccd4d2] bg-white px-4 py-4">
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#5dac7f] text-white">
            <ImageIcon className="h-4 w-4" />
          </span>
          <p className="text-3xl font-semibold text-[#1b2733]">{counts.estados}</p>
          <p className="mt-0.5 text-sm text-[#60706f]">Estados</p>
        </article>

        <article className="rounded-xl border border-[#ccd4d2] bg-white px-4 py-4">
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#a8a15c] text-white">
            <Tag className="h-4 w-4" />
          </span>
          <p className="text-3xl font-semibold text-[#1b2733]">{counts.ofertas}</p>
          <p className="mt-0.5 text-sm text-[#60706f]">Ofertas</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-[#ccd4d2] bg-white p-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#182330]">
            <ArrowUpRight className="h-4 w-4 text-[#1f7770]" />
            Acciones Rapidas
          </h2>

          <div className="mt-3 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            <Link to="/admin/excursiones" className="rounded-xl bg-[#c9d1ce] px-4 py-4 text-center transition hover:bg-[#bec8c4]">
              <Map className="mx-auto h-5 w-5 text-[#566967]" />
              <p className="mt-2 text-base font-semibold text-[#213136]">Gestionar</p>
              <p className="text-xs text-[#5f6f6d]">Excursiones</p>
            </Link>

            <Link to="/admin/playas" className="rounded-xl bg-[#c9d1ce] px-4 py-4 text-center transition hover:bg-[#bec8c4]">
              <Waves className="mx-auto h-5 w-5 text-[#566967]" />
              <p className="mt-2 text-base font-semibold text-[#213136]">Gestionar</p>
              <p className="text-xs text-[#5f6f6d]">Playas</p>
            </Link>

            <Link to="/admin/estados" className="rounded-xl bg-[#c9d1ce] px-4 py-4 text-center transition hover:bg-[#bec8c4]">
              <ImageIcon className="mx-auto h-5 w-5 text-[#566967]" />
              <p className="mt-2 text-base font-semibold text-[#213136]">Gestionar</p>
              <p className="text-xs text-[#5f6f6d]">Estados</p>
            </Link>

            <Link to="/admin/ofertas" className="rounded-xl bg-[#c9d1ce] px-4 py-4 text-center transition hover:bg-[#bec8c4]">
              <Tag className="mx-auto h-5 w-5 text-[#566967]" />
              <p className="mt-2 text-base font-semibold text-[#213136]">Gestionar</p>
              <p className="text-xs text-[#5f6f6d]">Ofertas</p>
            </Link>
          </div>
        </div>

        <aside className="rounded-xl border border-[#ccd4d2] bg-white p-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-[#182330]">
            <CalendarDays className="h-4 w-4 text-[#1f7770]" />
            Contenido Reciente
          </h2>

          <ul className="mt-3 space-y-2.5">
            {recent.map((item) => (
              <li key={item.id} className="rounded-lg bg-[#c9d1ce] px-3 py-2.5">
                <p className="text-sm font-semibold text-[#1f2d31]">{item.title}</p>
                <p className="text-xs text-[#5f6f6d]">{item.type}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;