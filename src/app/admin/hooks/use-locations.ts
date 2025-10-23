import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "../api/location";
import { CreateLocationDto, UpdateLocationDto } from "../type/media";

export const useLocations = () => {
  const queryClient = useQueryClient();

  const {
    data: locations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  const createMutation = useMutation({
    mutationFn: locationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (error) => {
      console.error("Ошибка создания локации:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLocationDto }) =>
      locationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (error) => {
      console.error("Ошибка обновления локации:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: locationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (error) => {
      console.error("Ошибка удаления локации:", error);
    },
  });

  return {
    locations,
    isLoading,
    error,

    createLocation: (data: CreateLocationDto) => createMutation.mutate(data),
    updateLocation: (id: number, data: UpdateLocationDto) =>
      updateMutation.mutate({ id, data }),
    deleteLocation: (id: number) => deleteMutation.mutate(id),
    refetch,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
