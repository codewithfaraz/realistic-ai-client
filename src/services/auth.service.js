import api from "@/config/axios";

export class AuthService {
  static async login({ email, password }) {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  }

  static async signup({ email, password, firstName, lastName, phone }) {
    const response = await api.post("/api/auth/signup", {
      email,
      password,
      firstName,
      lastName,
      phone,
    });
    return response.data;
  }
  static async logout() {
    const response = await api.post("/api/auth/logout");
    console.log(response);
    return response.data;
  }
}
