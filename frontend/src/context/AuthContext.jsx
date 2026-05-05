import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../services/api";

const AuthContext = createContext();
const SESSION_TOKEN_KEY = "admin_session_token";
const SESSION_USER_KEY = "admin_session_user";
const SESSION_STARTED_AT_KEY = "admin_session_started_at";
const LEGACY_STORAGE_KEYS = ["token", "admin_user"];
const ADMIN_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

function clearLegacyAuthStorage() {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function clearAdminSessionStorage() {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
  sessionStorage.removeItem(SESSION_STARTED_AT_KEY);
}

function readStoredAdminSession() {
  clearLegacyAuthStorage();

  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const rawUser = sessionStorage.getItem(SESSION_USER_KEY);
  const startedAt = Number(sessionStorage.getItem(SESSION_STARTED_AT_KEY) || 0);

  if (!token || !startedAt || !Number.isFinite(startedAt)) {
    clearAdminSessionStorage();
    return { token: null, user: null };
  }

  if (Date.now() - startedAt >= ADMIN_SESSION_MAX_AGE_MS) {
    clearAdminSessionStorage();
    return { token: null, user: null };
  }

  if (!rawUser) {
    return { token, user: null };
  }

  try {
    return { token, user: JSON.parse(rawUser) };
  } catch {
    clearAdminSessionStorage();
    return { token: null, user: null };
  }
}

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
  const initialSession = readStoredAdminSession();
  const [token, setToken] = useState(initialSession.token);
  const [user, setUser] = useState(initialSession.user);

  const logout = () => {
    if (token) {
      axios.post(apiUrl("logout/")).catch(() => null);
    }
    clearLegacyAuthStorage();
    clearAdminSessionStorage();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    clearLegacyAuthStorage();
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      if (!sessionStorage.getItem(SESSION_STARTED_AT_KEY)) {
        sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(Date.now()));
      }
      // Header global para todas las llamadas axios posteriores.
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      clearAdminSessionStorage();
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (!token) return undefined;

    const startedAt = Number(sessionStorage.getItem(SESSION_STARTED_AT_KEY) || 0);
    if (!startedAt || !Number.isFinite(startedAt)) {
      logout();
      return undefined;
    }

    const remainingMs = ADMIN_SESSION_MAX_AGE_MS - (Date.now() - startedAt);
    if (remainingMs <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [token]);

  const refreshUser = async () => {
    if (!token) return null;
    try {
      const resp = await axios.get(apiUrl("me/"));
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
      const resp = await axios.post(apiUrl("login/"), {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.data && resp.data.token) {
        clearLegacyAuthStorage();
        sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(Date.now()));
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

  const updateCurrentUser = async (payload, config = {}) => {
    const resp = await axios.patch(apiUrl("me/"), payload, config);
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
