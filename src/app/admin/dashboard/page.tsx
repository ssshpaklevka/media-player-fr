"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Textarea } from "../../../components/ui/textarea";
import { useAuth } from "../hooks/use-auth";
import { useBanners } from "../hooks/use-banners";
import { useLocations } from "../hooks/use-locations";
import { Banner, CreateBannerDto, UpdateBannerDto } from "../type/media";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoggingOut, isAuthLoading } =
    useAuth();
  const {
    banners,
    isLoading,
    createBanner,
    deleteBanner,
    isCreating,
    isDeleting,
    createError,
    updateBanner,
    isUpdating,
  } = useBanners(true, undefined); // true = показать все баннеры, undefined = все локации (админ)

  const { locations, isLoading: isLocationsLoading } = useLocations();

  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    seconds: 10,
    file: null as File | null,
    is_active: true,
    location_id: 0,
  });

  const [editBanner, setEditBanner] = useState<{
    id?: number;
    title: string;
    description: string;
    seconds: number;
    file: File | null;
    is_active: boolean;
    location_id: number;
  }>({
    title: "",
    description: "",
    seconds: 10,
    file: null,
    is_active: true,
    location_id: 0,
  });

  const [editDialogOpen, setEditDialogOpen] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Проверка авторизации...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Перенаправление на вход...</div>
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewBanner({ ...newBanner, file });
    }
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.file || !newBanner.title || !newBanner.description) {
      alert("Пожалуйста, заполните все поля и выберите файл");
      return;
    }

    if (!newBanner.location_id || newBanner.location_id === 0) {
      alert("Пожалуйста, выберите локацию (магазин)");
      return;
    }

    const bannerData: CreateBannerDto = {
      title: newBanner.title,
      description: newBanner.description,
      seconds: newBanner.seconds,
      file: newBanner.file,
      is_active: newBanner.is_active,
      location_id: newBanner.location_id,
    };

    createBanner(bannerData);

    setNewBanner({
      title: "",
      description: "",
      seconds: 10,
      file: null,
      is_active: true,
      location_id: 0,
    });
  };

  const handleEditClick = (banner: Banner) => {
    setEditBanner({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      seconds: banner.seconds,
      file: null,
      is_active: banner.is_active,
      location_id: banner.location_id,
    });
    setEditDialogOpen((prev) => ({ ...prev, [banner.id]: true }));
  };

  const handleUpdateBanner = (e: React.FormEvent, bannerId: number) => {
    e.preventDefault();

    if (!editBanner.title.trim() || !editBanner.description.trim()) {
      alert("Пожалуйста, заполните название и описание");
      return;
    }

    const bannerData: UpdateBannerDto = {
      title: editBanner.title,
      description: editBanner.description,
      seconds: editBanner.seconds,
      ...(editBanner.file && { file: editBanner.file }),
      is_active: editBanner.is_active,
      location_id: editBanner.location_id,
    };

    updateBanner(bannerId, bannerData);

    // Закрываем диалог и очищаем форму
    setEditDialogOpen((prev) => ({ ...prev, [bannerId]: false }));
    setEditBanner({
      title: "",
      description: "",
      seconds: 10,
      file: null,
      is_active: true,
      location_id: 0,
    });
  };

  const handleDelete = (id: number) => {
    deleteBanner(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Добро пожаловать, {user.firstname}
                </p>
              )}
            </div>
            <Button
              onClick={logout}
              disabled={isLoggingOut}
              size={"sm"}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? "Выход..." : "Выйти"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6 sm:px-6 lg:px-8">
        {/* Создание баннера */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Создать новый баннер
            </h3>
            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Название
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Введите название баннера"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="seconds"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Время показа (сек)
                  </Label>
                  <Input
                    type="number"
                    id="seconds"
                    min="1"
                    value={newBanner.seconds}
                    onChange={(e) =>
                      setNewBanner({
                        ...newBanner,
                        seconds: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Описание
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={newBanner.description}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, description: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Введите описание баннера"
                  required
                />
              </div>
              <div className="w-[300px]">
                <Label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  Файл (webp, png или webm)
                </Label>
                <Input
                  type="file"
                  id="file"
                  accept=".webp, .png, .webm"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 hover:file:bg-indigo-100"
                  required
                />
              </div>
              <div className="w-[300px]">
                <Label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Магазин (локация)
                </Label>
                <Select
                  value={
                    newBanner.location_id > 0
                      ? newBanner.location_id.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setNewBanner({
                      ...newBanner,
                      location_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Выберите магазин" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLocationsLoading ? (
                      <SelectItem value="0" disabled>
                        Загрузка...
                      </SelectItem>
                    ) : locations.length === 0 ? (
                      <SelectItem value="0" disabled>
                        Нет доступных локаций
                      </SelectItem>
                    ) : (
                      locations.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name} - {location.address}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" disabled={isCreating} size={"sm"}>
                  {isCreating ? "Создание..." : "Создать баннер"}
                </Button>
                {createError && (
                  <span className="text-sm text-red-500">
                    Ошибка создания: {createError.message}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        <Card>
          <CardHeader>Медиа ({banners.length})</CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Медиа</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Локация</TableHead>
                  <TableHead>Время показа</TableHead>
                  <TableHead>Активность</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead>Удаление</TableHead>
                  <TableHead>Редактирование</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      {banner.type === "image" ? (
                        banner.image ? (
                          <Image
                            className="h-40 w-40 object-cover rounded-lg"
                            src={banner.image}
                            alt={banner.title}
                            width={80}
                            height={80}
                          />
                        ) : (
                          <div className="h-40 w-40 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              Нет фото
                            </span>
                          </div>
                        )
                      ) : banner.image ? (
                        <video
                          className="h-40 w-40 object-cover rounded-lg"
                          src={banner.image}
                          controls
                        />
                      ) : (
                        <div className="h-40 w-40 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            Нет видео
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{banner.title}</TableCell>
                    <TableCell>{banner.description}</TableCell>
                    <TableCell>
                      {locations.find((loc) => loc.id === banner.location_id)
                        ?.name || "Нет"}
                    </TableCell>
                    <TableCell>{banner.seconds}</TableCell>
                    <TableCell
                      className={
                        banner.is_active
                          ? "text-green-500 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {banner.is_active ? "Активный" : "Неактивный"}
                    </TableCell>
                    <TableCell>
                      {banner.type === "image" ? "Изображение" : "Видео"}
                    </TableCell>
                    <TableCell>
                      {new Date(banner.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size={"sm"}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Удалить
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Удалить баннер {banner.title}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить баннер{" "}
                              {banner.title}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(banner.id)}
                              disabled={isDeleting}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={editDialogOpen[banner.id] || false}
                        onOpenChange={(open) =>
                          setEditDialogOpen((prev) => ({
                            ...prev,
                            [banner.id]: open,
                          }))
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size={"sm"}
                            onClick={() => handleEditClick(banner)}
                          >
                            Редактировать
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Редактировать баннер {banner.title}
                            </DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => handleUpdateBanner(e, banner.id)}
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`edit-title-${banner.id}`}>
                                  Название
                                </Label>
                                <Input
                                  type="text"
                                  id={`edit-title-${banner.id}`}
                                  value={editBanner.title}
                                  onChange={(e) =>
                                    setEditBanner({
                                      ...editBanner,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label
                                  htmlFor={`edit-description-${banner.id}`}
                                >
                                  Описание
                                </Label>
                                <Textarea
                                  id={`edit-description-${banner.id}`}
                                  value={editBanner.description}
                                  onChange={(e) =>
                                    setEditBanner({
                                      ...editBanner,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`edit-seconds-${banner.id}`}>
                                  Время показа (сек)
                                </Label>
                                <Input
                                  type="number"
                                  id={`edit-seconds-${banner.id}`}
                                  min="1"
                                  value={editBanner.seconds}
                                  onChange={(e) =>
                                    setEditBanner({
                                      ...editBanner,
                                      seconds: parseInt(e.target.value) || 1,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`edit-file-${banner.id}`}>
                                  Файл (оставьте пустым, чтобы не менять)
                                </Label>
                                <Input
                                  type="file"
                                  id={`edit-file-${banner.id}`}
                                  accept=".webp, .png, .webm"
                                  onChange={(e) =>
                                    setEditBanner({
                                      ...editBanner,
                                      file: e.target.files?.[0] ?? null,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`edit-is_active-${banner.id}`}>
                                  Активность
                                </Label>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size={"sm"}
                                    variant={
                                      editBanner.is_active
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() =>
                                      setEditBanner({
                                        ...editBanner,
                                        is_active: true,
                                      })
                                    }
                                  >
                                    Активный
                                  </Button>
                                  <Button
                                    type="button"
                                    size={"sm"}
                                    variant={
                                      !editBanner.is_active
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() =>
                                      setEditBanner({
                                        ...editBanner,
                                        is_active: false,
                                      })
                                    }
                                  >
                                    Неактивный
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`edit-location-${banner.id}`}>
                                  Магазин (локация)
                                </Label>
                                <Select
                                  value={
                                    editBanner.location_id > 0
                                      ? editBanner.location_id.toString()
                                      : ""
                                  }
                                  onValueChange={(value) =>
                                    setEditBanner({
                                      ...editBanner,
                                      location_id: parseInt(value),
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите магазин" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {isLocationsLoading ? (
                                      <SelectItem value="0" disabled>
                                        Загрузка...
                                      </SelectItem>
                                    ) : locations.length === 0 ? (
                                      <SelectItem value="0" disabled>
                                        Нет доступных локаций
                                      </SelectItem>
                                    ) : (
                                      locations.map((location) => (
                                        <SelectItem
                                          key={location.id}
                                          value={location.id.toString()}
                                        >
                                          {location.name} - {location.address}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter className="mt-6">
                              <DialogClose asChild>
                                <Button size={"sm"} variant={"outline"}>
                                  Отмена
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                size={"sm"}
                                disabled={isUpdating}
                              >
                                {isUpdating ? "Сохранение..." : "Сохранить"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          {/* <ul className="divide-y divide-gray-200">
            {banners.map((banner) => (
              <li
                key={banner.id}
                className="px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-20 w-20">
                    {banner.type === "image" ? (
                      <Image
                        className="h-20 w-20 object-cover rounded-lg"
                        src={banner.image}
                        alt={banner.title}
                        width={80}
                        height={80}
                      />
                    ) : (
                      <video
                        className="h-20 w-20 object-cover rounded-lg"
                        src={banner.image}
                        muted
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {banner.title}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      {banner.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      Показ: {banner.seconds}сек | Тип: {banner.type} | Создан:{" "}
                      {new Date(banner.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"sm"} className="bg-red-600 hover:bg-red-700">
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Удалить баннер {banner.title}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить баннер {banner.title}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(banner.id)}
                        disabled={isDeleting}
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul> */}
          {isLoading && (
            <div className="px-4 py-12 text-center text-gray-500">
              Загрузка...
            </div>
          )}
          {banners.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-500">
              Нет созданных баннеров
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
