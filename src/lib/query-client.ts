import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 10, // 10 минут (ранее cacheTime)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retry: (failureCount, error: any) => {
        // Не повторяем запросы при ошибках авторизации
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
