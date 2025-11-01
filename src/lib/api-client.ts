import axios from "axios";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: API_DOMAIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерсептор для обработки ошибок авторизации
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Очищаем localStorage при ошибке авторизации
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        // Перенаправляем на страницу входа только если мы не на ней
        const currentPath = window.location.pathname;
        const loginPath = "/media-player";
        if (currentPath !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }
    return Promise.reject(error);
  }
);
