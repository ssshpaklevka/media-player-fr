import { apiClient } from "@/lib/api-client";
import {
  CreateLocationDto,
  DeleteLocationResponse,
  Location,
  LocationResponse,
  UpdateLocationDto,
} from "../type/media";

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const response = await apiClient.get("/location");
    return response.data;
  },

  getById: async (id: number): Promise<Location> => {
    const response = await apiClient.get(`/location/${id}`);
    return response.data;
  },

  create: async (data: CreateLocationDto): Promise<Location> => {
    const response = await apiClient.post("/location", data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateLocationDto
  ): Promise<LocationResponse> => {
    const response = await apiClient.patch(`/location/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<DeleteLocationResponse> => {
    const response = await apiClient.delete(`/location/${id}`);
    return response.data;
  },
};
