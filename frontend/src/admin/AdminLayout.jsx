import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Map, Waves, ImageIcon, Tag, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/images/vicentelogo.png";

const links = [
  { to: "", label: "Dashboard", icon: LayoutGrid },
  { to: "excursiones", label: "Excursiones", icon: Map },
  { to: "playas", label: "Playas", icon: Waves },
  { to: "estados", label: "Estados", icon: ImageIcon },
  { to: "ofertas", label: "Ofertas", icon: Tag },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const userName = user?.username || "admin";

  return (
    <div className="min-h-screen bg-[#dde2df] text-[#1b2a2f]">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex h-screen w-[214px] shrink-0 flex-col border-r border-[#d5dcda] bg-[#f2f4f3]">
          <div className="px-4 pt-4 pb-3">
            <div className="flex w-full flex-col items-center gap-1.5 text-center">
              <img
                src={logoImage}
                alt="Vicente Viajes"
                className="h-11 w-auto object-contain"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6d7c7b]">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 px-2 pt-1">
            <ul className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === ""}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                          isActive
                            ? "bg-[#1f7770] text-white shadow-[0_5px_12px_rgba(26,96,89,0.2)]"
                            : "text-[#3c4f4e] hover:bg-[#e6ecea]"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[#d5dcda] px-2 py-3">
            <div className="rounded-xl bg-[#c9d1ce] p-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8eb2ad] bg-[#d9dfdd] text-[#2b7a73]">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1f2d31]">{userName}</p>
                  <p className="text-xs text-[#61706f]">Admin</p>
                </div>
              </div>

              <div className="mt-2 flex gap-1.5 text-[11px]">
                <span className="rounded-full bg-[#b4ccc4] px-2 py-1 text-[#2d7e77]">Editar</span>
                <span className="rounded-full bg-[#d7e9dc] px-2 py-1 text-[#5f9f75]">Crear</span>
                <span className="rounded-full bg-[#f1d5d5] px-2 py-1 text-[#e46060]">Eliminar</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f4e3e3] px-3 py-2.5 text-sm font-semibold text-[#ef4e4e] transition hover:bg-[#f2d7d7]"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesion
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="border-b border-[#d5dcda] bg-[#f2f4f3] lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <img
                    src={logoImage}
                    alt="Vicente Viajes"
                    className="h-9 w-auto object-contain"
                  />
                  <p className="text-xs text-[#6d7c7b]">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-sm font-semibold text-[#ef4e4e]"
              >
                Salir
              </button>
            </div>

            <nav className="overflow-x-auto px-4 pb-4">
              <ul className="flex min-w-max gap-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={`mobile-${link.to}`}>
                      <NavLink
                        to={link.to}
                        end={link.to === ""}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                            isActive ? "bg-[#1f7770] text-white" : "bg-white text-[#39514f]"
                          }`
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="min-h-screen p-3 lg:p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
