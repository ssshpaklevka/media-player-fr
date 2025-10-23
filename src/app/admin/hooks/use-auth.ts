import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi, type LoginCredentials } from "../api/auth";
import { AuthResponse, User } from "../type/media";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Проверяем localStorage при загрузке
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("user");
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Мутация для входа
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      // Сохраняем данные пользователя
      setUser(data.user);
      setIsAuthenticated(true);

      // Сохраняем в localStorage для сохранения сессии
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Перенаправляем в зависимости от location_id
      // Если location_id пустой (null/undefined) - это админ
      // Если location_id есть - это обычный пользователь
      if (!data.user.location_id) {
        router.push("/admin/dashboard");
      } else {
        router.push("/display");
      }
    },
    onError: (error) => {
      console.error("Ошибка входа:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Очищаем состояние
      setUser(null);
      setIsAuthenticated(false);

      // Очищаем localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      // Очищаем кеш
      queryClient.clear();
      // Перенаправляем на главную страницу (логин)
      router.push("/");
    },
    onError: (error) => {
      console.error("Ошибка выхода:", error);
      // Все равно очищаем и перенаправляем
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      queryClient.clear();
      router.push("/");
    },
  });

  return {
    user,
    isAuthenticated,
    isAuthLoading: !isInitialized, // Показываем загрузку пока не инициализировались

    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
};
