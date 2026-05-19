"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";

const AuthContext = createContext(undefined);

const TOKEN_KEY = "homez_auth_token";
const USER_KEY = "homez_auth_user";

// Token helpers — use localStorage so it persists across tabs/refreshes
const getStoredToken = () => {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const setStoredToken = (token) => {
  try {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

const getStoredUser = () => {
  try {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user) => {
  try {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialise from storage on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  const setAuth = (newToken, newUser) => {
    setTokenState(newToken);
    setUserState(newUser);
    setStoredToken(newToken);
    setStoredUser(newUser);
  };

  const login = async (credentials) => {
    const res = await AuthService.login(credentials);
    if (res?.success && res?.data) {
      setAuth(res.data.token, res.data.user);
      return res;
    }
    throw new Error(res?.message || "Login failed");
  };

  const signup = async (data) => {
    const res = await AuthService.signup(data);
    if (res?.success && res?.data) {
      setAuth(res.data.token, res.data.user);
      return res;
    }
    throw new Error(res?.message || "Signup failed");
  };

  const logout = async () => {
    await AuthService.logout();
    setAuth(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
