"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "./admin/hooks/use-auth";

export default function Home() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  });

  const {
    login,
    isLoggingIn,
    loginError,
    isAuthenticated,
    isAuthLoading,
    user,
  } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      // Если location_id пустой - это админ, иначе - обычный пользователь
      if (!user.location_id) {
        router.push("/admin/dashboard");
      } else {
        router.push("/display");
      }
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Проверка авторизации...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Перенаправление...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            ТВ Дисплей
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Система отображения медиа
          </p>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в систему
          </h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="login" className="sr-only">
                Логин (Email)
              </Label>
              <Input
                id="login"
                name="login"
                type="email"
                required
                placeholder="Email"
                value={credentials.login}
                onChange={(e) =>
                  setCredentials({ ...credentials, login: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Пароль
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Пароль"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError.message || "Ошибка входа"}
              </div>
            )}

            <Button type="submit" disabled={isLoggingIn} className="w-full">
              {isLoggingIn ? "Вход..." : "Войти"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
