import api from "@/config/axios";
export class MenuService {
  static async getMenu(key) {
    const response = await api.get(`/api/public/menus/${key}`);
    return response.data;
  }
}
