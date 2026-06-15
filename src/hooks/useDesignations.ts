import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { designationApi, DesignationListParams, DesignationFormData } from '@/lib/api/designationApi';

export const useDesignations = (params?: DesignationListParams) => {
  return useQuery({
    queryKey: ['designations', params],
    queryFn: () => designationApi.getDesignations(params),
  });
};

export const useDesignation = (id: number) => {
  return useQuery({
    queryKey: ['designation', id],
    queryFn: () => designationApi.getDesignation(id),
    enabled: !!id,
  });
};

export const useCreateDesignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DesignationFormData) => designationApi.createDesignation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    },
  });
};

export const useUpdateDesignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DesignationFormData }) =>
      designationApi.updateDesignation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    },
  });
};

export const useDeleteDesignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => designationApi.deleteDesignation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    },
  });
};
