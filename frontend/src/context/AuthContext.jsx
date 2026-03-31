import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

function getRoleLabel(role) {
  if (role === "superuser") return "Super Usuario";
  if (role === "editor") return "Editor";
  return "Solo Lectura";
}

function getPermissionTags(role) {
  if (role === "superuser") return ["Editar", "Crear", "Eliminar", "Usuarios"];
  if (role === "editor") return ["Editar", "Crear", "Eliminar"];
  return ["Solo Lectura"];
}

export const AuthProvider = ({ children }) => {
  // Se hidrata token persistido para no cerrar sesion al recargar.
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("admin_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Header global para todas las llamadas axios posteriores.
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("admin_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("admin_user");
    }
  }, [user]);

  const refreshUser = async () => {
    if (!token) return null;
    try {
      const resp = await axios.get("http://localhost:8000/api/me/");
      setUser(resp.data || null);
      return resp.data || null;
    } catch {
      setUser(null);
      setToken(null);
      return null;
    }
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    refreshUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      // Login contra endpoint custom de Django que devuelve Token DRF.
      const resp = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.data && resp.data.token) {
        setToken(resp.data.token);
        setUser(resp.data.user || null);
        return resp;
      } else {
        throw new Error('No token in response');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateCurrentUser = async (payload, config = {}) => {
    const resp = await axios.patch("http://localhost:8000/api/me/", payload, config);
    setUser(resp.data || null);
    return resp.data || null;
  };

  const normalizedRole = user?.role || (user?.is_superuser ? "superuser" : user?.is_staff ? "editor" : "viewer");
  const displayName = (user?.first_name || "").trim() || user?.username || "admin";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        displayName,
        role: normalizedRole,
        roleLabel: getRoleLabel(normalizedRole),
        permissionTags: getPermissionTags(normalizedRole),
        canManageContent: normalizedRole === "superuser" || normalizedRole === "editor",
        isSuperUser: Boolean(user?.is_superuser),
        refreshUser,
        updateCurrentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
