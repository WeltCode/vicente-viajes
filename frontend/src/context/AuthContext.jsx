import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Se hidrata token persistido para no cerrar sesion al recargar.
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

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
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
