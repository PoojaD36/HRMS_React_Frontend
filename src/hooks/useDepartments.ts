import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi, DepartmentListParams, DepartmentFormData } from '@/lib/api/departmentApi';

export const useDepartments = (params?: DepartmentListParams) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => departmentApi.getDepartments(params),
  });
};

export const useDepartment = (id: number) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentApi.getDepartment(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentFormData) => departmentApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentFormData }) =>
      departmentApi.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => departmentApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};
