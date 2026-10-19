import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window === "undefined" ? "http://127.0.0.1:3000" : "");

const getTenantHost = () => {
  if (typeof window !== "undefined") {
    const browserHost = window.location.hostname;

    if (["localhost", "127.0.0.1", "0.0.0.0"].includes(browserHost)) {
      return process.env.NEXT_PUBLIC_TENANT_HOST || "nirvana-nests.localhost";
    }

    return browserHost;
  }

  return process.env.NEXT_PUBLIC_TENANT_HOST || "nirvana-nests.localhost";
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor — attach auth token to every request
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers["x-tenant-host"] =
      config.headers["x-tenant-host"] || getTenantHost();

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
