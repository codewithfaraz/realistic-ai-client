import api from "@/config/axios";

export class PagesService {
  static requestConfig(tenantHost) {
    return tenantHost
      ? {
          headers: {
            "x-tenant-host": tenantHost,
          },
        }
      : undefined;
  }

  static async getAboutPage() {
    const response = await api.get("/api/public/pages/about");
    return response.data;
  }

  static async getHome(tenantHost) {
    const response = await api.get(
      "/api/public/pages/home",
      this.requestConfig(tenantHost),
    );
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
