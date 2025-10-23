"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../admin/hooks/use-auth";
import { useBanners } from "../admin/hooks/use-banners";

export default function DisplayPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthLoading, logout } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Загружаем баннеры с учетом location_id пользователя
  // Вызываем хук всегда, независимо от условий
  const { banners, isLoading, error } = useBanners(
    isAuthenticated,
    user?.location_id
  );

  // Проверяем авторизацию
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/");
    }
    // Если это админ (нет location_id), перенаправляем на админ панель
    if (!isAuthLoading && isAuthenticated && user && !user.location_id) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  // Применяем полноэкранные стили для телевизора
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Добавляем класс для телевизора
      document.body.classList.add("tv-display");
      document.documentElement.classList.add("tv-display");

      return () => {
        document.body.classList.remove("tv-display");
        document.documentElement.classList.remove("tv-display");
      };
    }
  }, []);

  // Автоматическая смена слайдов с учетом времени показа каждого баннера
  useEffect(() => {
    if (banners.length === 0) return;

    const currentBanner = banners[currentIndex];
    const showTime = (currentBanner?.seconds || 5) * 1000; // Время в миллисекундах

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, showTime);

    return () => clearInterval(interval);
  }, [banners, currentIndex]);

  // Показываем загрузку пока проверяем авторизацию
  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Проверка авторизации...</div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        <div className="w-screen h-screen relative">
          <Image
            src="/img/logo.webp"
            alt="Нет баннеров для отображения"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="100vw"
            unoptimized={true}
          />
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div className="w-screen h-screen relative">
        {currentBanner.type === "image" ? (
          currentBanner.image ? (
            <Image
              src={currentBanner.image}
              alt={currentBanner.title}
              fill
              className="object-cover"
              priority
              quality={100}
              sizes="100vw"
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-2xl">
                Изображение недоступно
              </span>
            </div>
          )
        ) : currentBanner.image ? (
          <video
            src={currentBanner.image}
            autoPlay
            loop
            className="w-full h-full object-cover"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-2xl">Видео недоступно</span>
          </div>
        )}

        {/* Информация о баннере */}
        {/* <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-2">{currentBanner.title}</h2>
            {currentBanner.description && (
              <p className="text-lg opacity-90">{currentBanner.description}</p>
            )}
          </div>
        </div> */}
      </div>

      {/* Индикаторы слайдов */}
      {/* {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_: Banner, index: number) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
