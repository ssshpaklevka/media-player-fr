import { apiClient } from "@/lib/api-client";
import { AuthResponse } from "../type/media";

export interface LoginCredentials {
  login: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete("/auth/logout");
    return response.data;
  },

  // Авторизация проверяется через куки на сервере
};
