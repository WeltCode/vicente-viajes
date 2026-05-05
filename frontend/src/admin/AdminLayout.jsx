import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Map, Waves, ImageIcon, Tag, Users, LogOut, Camera, UserRound, TriangleAlert, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/images/vicentelogo.png";

const baseLinks = [
  { to: "", label: "Dashboard", icon: LayoutGrid },
  { to: "excursiones", label: "Excursiones", icon: Map },
  { to: "playas", label: "Playas", icon: Waves },
  { to: "estados", label: "Estados", icon: ImageIcon },
  { to: "ofertas", label: "Ofertas", icon: Tag },
];

const AdminLayout = () => {
  const { logout, user, isSuperUser, roleLabel, permissionTags, displayName, updateCurrentUser } = useAuth();
  const userName = displayName || user?.username || "admin";
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const links = isSuperUser
    ? [...baseLinks, { to: "usuarios", label: "Usuarios", icon: Users }]
    : baseLinks;

  const closePasswordModal = () => {
    if (savingPassword || user?.must_change_password) return;
    setShowPasswordModal(false);
    setPasswordError("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (user?.must_change_password) {
      setPasswordError("");
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowPasswordModal(true);
      return;
    }

    setShowPasswordModal(false);
  }, [user?.must_change_password]);

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("profile_image", file);
      await updateCurrentUser(formData);
    } catch (error) {
      window.alert(error?.response?.data?.detail || "No se pudo actualizar la imagen de perfil.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    const normalizedPassword = newPassword.trim();
    const normalizedConfirm = confirmPassword.trim();

    if (!normalizedPassword) {
      setPasswordError("La nueva contraseña es obligatoria.");
      return;
    }

    if (normalizedPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (normalizedPassword !== normalizedConfirm) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setSavingPassword(true);
    setPasswordError("");
    try {
      const formData = new FormData();
      formData.append("password", normalizedPassword);
      await updateCurrentUser(formData);
      closePasswordModal();
      window.alert("Tu contraseña se actualizo correctamente.");
    } catch (error) {
      setPasswordError(error?.response?.data?.detail || "No se pudo actualizar la contraseña.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dde2df] text-[#1b2a2f]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden h-screen w-[214px] shrink-0 flex-col border-r border-[#d5dcda] bg-[#f2f4f3] lg:flex">
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
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#8eb2ad] bg-[#d9dfdd] text-[#2b7a73]">
                    {user?.profile_image_url ? (
                      <img src={user.profile_image_url} alt={userName} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-6 w-6" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#1f7770] text-white shadow-sm transition hover:bg-[#1a6862] disabled:cursor-not-allowed disabled:opacity-60"
                    title="Cambiar foto"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1f2d31]">{userName}</p>
                  <p className="text-xs text-[#61706f]">{roleLabel}</p>
                  {uploadingImage && <p className="text-[10px] text-[#61706f]">Subiendo foto...</p>}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                {permissionTags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2 py-1 ${
                      tag === "Eliminar"
                        ? "bg-[#f1d5d5] text-[#e46060]"
                        : tag === "Crear"
                          ? "bg-[#d7e9dc] text-[#5f9f75]"
                          : tag === "Solo Lectura"
                            ? "bg-[#e0e7e5] text-[#516867]"
                            : "bg-[#b4ccc4] text-[#2d7e77]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
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

        <main className="min-w-0 flex-1">
          <div className="border-b border-[#d5dcda] bg-[#f2f4f3] lg:hidden">
            <div className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <img
                    src={logoImage}
                    alt="Vicente Viajes"
                    className="h-9 w-auto object-contain"
                  />
                  <p className="text-xs text-[#6d7c7b]">Admin Panel</p>
                </div>
                <button
                  onClick={logout}
                  className="shrink-0 rounded-lg bg-[#f4e3e3] px-3 py-2 text-sm font-semibold text-[#ef4e4e]"
                >
                  Salir
                </button>
              </div>

              <div className="rounded-2xl border border-[#d5dcda] bg-white px-3 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#8eb2ad] bg-[#d9dfdd] text-[#2b7a73]">
                      {user?.profile_image_url ? (
                        <img src={user.profile_image_url} alt={userName} className="h-full w-full object-cover" />
                      ) : (
                        <UserRound className="h-5 w-5" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#1f7770] text-white shadow-sm transition hover:bg-[#1a6862] disabled:cursor-not-allowed disabled:opacity-60"
                      title="Cambiar foto"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1f2d31]">{userName}</p>
                    <p className="text-xs text-[#61706f]">{roleLabel}</p>
                    {uploadingImage && <p className="text-[10px] text-[#61706f]">Subiendo foto...</p>}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                  {permissionTags.map((tag) => (
                    <span
                      key={`mobile-${tag}`}
                      className={`rounded-full px-2 py-1 ${
                        tag === "Eliminar"
                          ? "bg-[#f1d5d5] text-[#e46060]"
                          : tag === "Crear"
                            ? "bg-[#d7e9dc] text-[#5f9f75]"
                            : tag === "Solo Lectura"
                              ? "bg-[#e0e7e5] text-[#516867]"
                              : "bg-[#b4ccc4] text-[#2d7e77]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>

              <nav className="overflow-x-auto pb-1">
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
          </div>

          <div className="min-h-screen p-3 sm:p-4 lg:p-5">
            {user?.must_change_password && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Debes sustituir tu clave temporal</p>
                    <p className="text-sm">Tu acceso fue restablecido por un superusuario. Antes de continuar, define una contraseña personal y segura.</p>
                  </div>
                </div>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sustituye tu clave temporal</h2>
                <p className="text-sm text-slate-600">Para seguir usando el sistema, crea ahora una contraseña que solo tu conozcas.</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {passwordError}
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                Estabas usando una clave temporal generada por un superusuario. Sustituyela por una contraseña personal para completar el acceso.
              </div>

              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Nueva contraseña</span>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-11 text-sm outline-none focus:border-slate-600"
                    placeholder="Minimo 8 caracteres"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    aria-label={showNewPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Confirmar contraseña</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-11 text-sm outline-none focus:border-slate-600"
                    placeholder="Repite la nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                    aria-label={showConfirmPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPassword ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
