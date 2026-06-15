import axios from './axiosConfig';

export interface Department {
  id: number;
  name: string;
  description: string | null;
  status: boolean;
  created_at: string;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
  status: boolean;
}

export interface DepartmentListResponse {
  data: Department[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DepartmentListParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export const departmentApi = {
  getDepartments: async (params?: DepartmentListParams): Promise<DepartmentListResponse> => {
    const response = await axios.get('/departments', { params });
    return response.data;
  },

  getDepartment: async (id: number): Promise<Department> => {
    const response = await axios.get(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (data: DepartmentFormData): Promise<Department> => {
    const response = await axios.post('/departments', data);
    return response.data.data;
  },

  updateDepartment: async (id: number, data: DepartmentFormData): Promise<Department> => {
    const response = await axios.put(`/departments/${id}`, data);
    return response.data.data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await axios.delete(`/departments/${id}`);
  },
};
