import { createContext, useEffect, useState } from "react";

import { clearAuthData, getStoredUser, saveAuthData } from "../utils/storage";

import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getMe();

        setUser(response.user);
        saveAuthData(null, response.user);
      } catch {
        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    const storedUser = getStoredUser();

    if (storedUser) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const response = await loginRequest({
      email,
      password,
    });

    saveAuthData(response.token, response.user);
    setUser(response.user);

    return response;
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch {
      // Si falla el backend, igual cerramos sesión localmente.
    }

    clearAuthData();
    setUser(null);

    window.location.replace("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
