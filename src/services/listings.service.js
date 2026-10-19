import api from "@/config/axios";

export class ListingsService {
  static async getListings(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters.search) params.append("q", filters.search);
    if (filters.city) params.append("city", filters.city);
    if (filters.purpose) params.append("purpose", filters.purpose);
    if (filters.propertyType)
      params.append("propertyType", filters.propertyType);
    if (filters.bedrooms)
      params.append("bedrooms", filters.bedrooms.toString());
    if (filters.bathrooms)
      params.append("bathrooms", filters.bathrooms.toString());
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters.minArea) params.append("minArea", filters.minArea.toString());
    if (filters.maxArea) params.append("maxArea", filters.maxArea.toString());
    if (filters.featured !== undefined && filters.featured !== null)
      params.append("featured", filters.featured.toString());
    if (filters.amenities) params.append("amenities", filters.amenities);
    if (filters.sort) params.append("sort", filters.sort);
    const response = await api.get(`/api/public/listings?${params.toString()}`);
    return response.data;
  }

  static async getFeaturedListings(limit = 6) {
    const params = new URLSearchParams();
    params.append("featured", "true");
    params.append("limit", limit.toString());

    const response = await api.get(`/api/public/listings?${params.toString()}`);
    return response.data;
  }

  static async getListing(slug) {
    try {
      const response = await api.get(`/api/public/listings/${slug}`);
      //we will get property id to then send recently-viewed request with propertyid
      const listingId = response.data.data.listing.id;
      console.log("First request success, ID:", listingId);
      //here we will store this as recently viewed if user is logged in
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("homez_auth_token")
      ) {
        try {
          const res = await api.post(`/api/user/recently-viewed`, {
            listingId,
          });
          console.log("Second request success", res);
        } catch (trackingErr) {
          console.log("Failed to store recently-viewed:", trackingErr);
        }
      }
      return response.data;
    } catch (error) {
      console.log(error); //error is coming from the backend
      return null;
    }
  }

  static async saveListing(listingId) {
    const response = await api.post("/api/user/saved-listings", { listingId });
    return response.data;
  }

  static async getSavedListings(page = 1, limit = 10) {
    const response = await api.get(
      `/api/user/saved-listings?page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  static async unsaveListing(listingId) {
    const response = await api.delete(`/api/user/saved-listings/${listingId}`);
    return response.data;
  }

  static async getRecentlyViewedListings(page = 1, limit = 10) {
    const response = await api.get(
      `/api/user/recently-viewed?page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  static async getListingTypes() {
    const response = await api.get("/api/public/listing-types");
    return response.data;
  }

  static async getPopularListings(limit = 5) {
    const response = await api.get(
      `/api/public/listings/popular?limit=${limit}`,
    );
    return response.data;
  }

  static async getListingCities() {
    const response = await api.get("/api/public/listing-cities");
    return response.data;
  }
}
