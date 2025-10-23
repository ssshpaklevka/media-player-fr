import { apiClient } from "@/lib/api-client";
import {
  Banner,
  BannerResponse,
  CreateBannerDto,
  UpdateBannerDto,
} from "../type/media";

export const bannersApi = {
  getAll: async (
    showAll: boolean = true,
    locationId?: number
  ): Promise<Banner[]> => {
    // Для админки передаем user=true (показать все), для публичного user=false (только активные)
    // Если есть locationId - фильтруем по локации (обычный пользователь)
    let url = `/banner?user=${showAll}`;
    if (locationId !== undefined) {
      url += `&location_id=${locationId}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: number): Promise<Banner> => {
    const response = await apiClient.get(`/banner/${id}`);
    return response.data;
  },

  create: async (data: CreateBannerDto): Promise<BannerResponse> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("seconds", data.seconds.toString());
    formData.append("file", data.file);
    formData.append("is_active", data.is_active.toString());
    formData.append("location_id", data.location_id.toString());

    const response = await apiClient.post("/banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  update: async (
    id: number,
    data: UpdateBannerDto
  ): Promise<BannerResponse> => {
    const formData = new FormData();

    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("seconds", (data.seconds || 10).toString());
    formData.append("is_active", (data.is_active ?? true).toString());

    // Location ID отправляем если он указан
    if (data.location_id !== undefined) {
      formData.append("location_id", data.location_id.toString());
    }

    if (data.file) {
      formData.append("file", data.file);
    }

    const response = await apiClient.patch(`/banner/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/banner/${id}`);
    return response.data;
  },
};
