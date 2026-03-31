import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { UserPlus, Pencil, Trash2, KeyRound, ImagePlus, UploadCloud, X } from "lucide-react";

const API_BASE = "http://localhost:8000/api/users/";

const ROLE_OPTIONS = [
  { value: "viewer", label: "Solo lectura" },
  { value: "editor", label: "Editor (CRUD contenido)" },
  { value: "superuser", label: "Superusuario (acceso total)" },
];

const emptyForm = {
  id: null,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "editor",
  is_active: true,
  password: "",
  profile_image: null,
  profile_image_url: "",
};

function roleBadgeClass(role) {
  if (role === "superuser") {
    return "bg-rose-100 text-rose-700 border border-rose-200";
  }
  if (role === "editor") {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

function roleLabel(role) {
  if (role === "superuser") return "Superusuario";
  if (role === "editor") return "Editor";
  return "Solo lectura";
}

function displayName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
}

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInputRef = useRef(null);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  async function loadUsers() {
    setLoading(true);
    try {
      const resp = await axios.get(API_BASE);
      setUsers(resp.data || []);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreate() {
    setError("");
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(user) {
    setError("");
    setForm({
      id: user.id,
      username: user.username,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      role: user.role || "editor",
      is_active: Boolean(user.is_active),
      password: "",
      profile_image: null,
      profile_image_url: user.profile_image_url || "",
    });
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setForm(emptyForm);
    setIsDragOver(false);
  }

  function assignProfileImage(file) {
    setForm((prev) => ({ ...prev, profile_image: file || null }));
    setIsDragOver(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) {
      setError("El nombre de usuario es obligatorio.");
      return;
    }

    if (!isEditing && !form.password.trim()) {
      setError("La contraseña es obligatoria al crear el usuario.");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("username", form.username.trim());
      payload.append("first_name", form.first_name.trim());
      payload.append("last_name", form.last_name.trim());
      payload.append("email", form.email.trim());
      payload.append("role", form.role);
      payload.append("is_active", String(form.is_active));
      if (form.password.trim()) {
        payload.append("password", form.password);
      }
      if (form.profile_image) {
        payload.append("profile_image", form.profile_image);
      }

      if (isEditing) {
        await axios.put(`${API_BASE}${form.id}/`, payload);
      } else {
        await axios.post(API_BASE, payload);
      }

      closeModal();
      await loadUsers();
    } catch (err) {
      const data = err?.response?.data;
      if (typeof data === "string") {
        setError(data);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstValue = data[firstKey];
        if (Array.isArray(firstValue)) {
          setError(firstValue[0]);
        } else {
          setError(String(firstValue));
        }
      } else {
        setError("No se pudo guardar el usuario.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(user) {
    const ok = window.confirm(`Eliminar al usuario ${user.username}?`);
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}${user.id}/`);
      await loadUsers();
    } catch (err) {
      window.alert(err?.response?.data?.detail || "No se pudo eliminar el usuario.");
    }
  }

  async function onResetPassword(user) {
    const newPassword = window.prompt(`Nueva contraseña para ${user.username}:`);
    if (!newPassword || !newPassword.trim()) return;
    try {
      await axios.post(`${API_BASE}${user.id}/reset-password/`, {
        password: newPassword,
      });
      window.alert("Contraseña actualizada.");
    } catch (err) {
      window.alert(err?.response?.data?.detail || "No se pudo cambiar la contraseña.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-600">Gestiona permisos y acceso al panel de administración.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <UserPlus size={16} />
          Nuevo usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                          {user.profile_image_url ? (
                            <img src={user.profile_image_url} alt={displayName(user)} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">{displayName(user).slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p>{user.username}</p>
                          <p className="text-xs font-normal text-slate-500">{displayName(user)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(user.role)}`}>
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onResetPassword(user)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          title="Restablecer contraseña"
                        >
                          <KeyRound size={14} />
                          Clave
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEditing ? "Editar usuario" : "Nuevo usuario"}
                </h2>
                <p className="text-sm text-slate-600">
                  {isEditing
                    ? "Actualiza rol, estado y datos de acceso."
                    : "Crea un nuevo usuario para el panel de administración."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Usuario</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-600"
                    required
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Nombre</span>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-600"
                    placeholder="Ivan"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Apellido</span>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-600"
                    placeholder="Opcional"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-600"
                    placeholder="usuario@dominio.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Imagen de perfil</span>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => assignProfileImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      assignProfileImage(e.dataTransfer.files?.[0] || null);
                    }}
                    className={`rounded-2xl border-2 border-dashed p-5 transition cursor-pointer ${
                      isDragOver
                        ? "border-[#1f7770] bg-[#e7f3f0]"
                        : "border-[#c8d4d0] bg-[#f5f8f7] hover:border-[#1f7770]/60 hover:bg-[#edf4f2]"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1f7770] shadow-sm">
                        {isDragOver ? <UploadCloud className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#1a2632]">
                        Arrastra una imagen aqui o haz click para seleccionarla
                      </p>
                      <p className="mt-1 text-xs text-[#60706f]">
                        Se mostrara en el sidebar y en el listado de usuarios. JPG, PNG, WEBP.
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-[#60706f]">
                    Recomendado formato cuadrado. Maximo 3 MB. Formatos: JPG, PNG, WEBP.
                  </p>
                  {(form.profile_image_url || form.profile_image) && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <img
                        src={form.profile_image ? URL.createObjectURL(form.profile_image) : form.profile_image_url}
                        alt="Perfil"
                        className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {form.profile_image ? form.profile_image.name : "Imagen actual"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {form.profile_image ? "Nueva imagen lista para guardar" : "La imagen actual se mantendra si no subes otra"}
                        </p>
                      </div>
                      {form.profile_image && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            assignProfileImage(null);
                          }}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-white"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  )}
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Rol</span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-600"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">
                    {isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                  </span>
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-600"
                    placeholder={isEditing ? "Solo si deseas cambiarla" : "Mínimo 8 caracteres"}
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                />
                Usuario activo
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
