import api from "@/config/axios";

export class ProfileService {
  /**
   * Fetch current user profile details
   * @returns {Promise<Object>}
   */
  static async getProfile() {
    const response = await api.get("/api/auth/me");
    return response.data;
  }

  /**
   * Update user profile 
   * @param {Object} data - Profile details to update
   * @returns {Promise<Object>}
   */
  static async updateProfile(data) {
    const response = await api.patch("/api/user/profile", data);
    return response.data;
  }
}
