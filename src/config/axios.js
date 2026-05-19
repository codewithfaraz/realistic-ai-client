import axios from "axios";

const api = axios.create({
  baseURL: "https://f802-39-45-104-81.ngrok-free.app",
  headers: {
    "x-tenant-host": "nirvana-nests.localhost",
    "ngrok-skip-browser-warning": true,
  },
});

// Request interceptor — attach auth token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("homez_auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip interceptor if flagged
    if (originalRequest._skipAuthRefresh) {
      return Promise.reject(error);
    }

    // If 401, clear stored auth and optionally redirect
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("homez_auth_token");
        localStorage.removeItem("homez_auth_user");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
