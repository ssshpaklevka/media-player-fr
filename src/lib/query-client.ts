import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 10, // 10 минут (ранее cacheTime)
      retry: (failureCount, error) => {
        // Не повторяем запросы при ошибках авторизации
        if (error instanceof AxiosError && error.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
