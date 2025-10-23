import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannersApi } from "../api/banners";
import { CreateBannerDto, UpdateBannerDto } from "../type/media";

export const useBanners = (
  isUserAuthorized: boolean = false,
  locationId?: number
) => {
  const queryClient = useQueryClient();

  const {
    data: banners = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["banners", isUserAuthorized, locationId],
    queryFn: () => bannersApi.getAll(isUserAuthorized, locationId),
    staleTime: 1000 * 60 * 2, // запрос каждые две минуты, чтобы данные не устаревали
    refetchInterval: !isUserAuthorized ? 1000 * 30 : undefined, // для админа не обновляется автоматически, а для телека обновлятеся
  });

  const createMutation = useMutation({
    mutationFn: bannersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => {
      console.error("Ошибка создания баннера:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBannerDto }) =>
      bannersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => {
      console.error("Ошибка обновления баннера:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bannersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => {
      console.error("Ошибка удаления баннера:", error);
    },
  });

  return {
    banners,
    isLoading,
    error,

    createBanner: (data: CreateBannerDto) => createMutation.mutate(data),
    updateBanner: (id: number, data: UpdateBannerDto) =>
      updateMutation.mutate({ id, data }),
    deleteBanner: (id: number) => deleteMutation.mutate(id),
    refetch,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
