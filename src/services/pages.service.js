import api from "@/config/axios";

export class PagesService {
  static async getAboutPage() {
    const response = await api.get("/api/public/pages/about");
    return response.data;
  }
  static async getHome() {
    //here is the error
    const response = await api.get("/api/public/pages/home");
    return response.data;
  }

  static async getPrivacyPolicy() {
    const response = await api.get("/api/public/pages/privacy-policy");
    return response.data;
  }

  static async getTerms() {
    const response = await api.get("/api/public/pages/terms");
    return response.data;
  }
}
