import axios from './axiosConfig';

export interface Department {
  id: number;
  name: string;
}

export interface Designation {
  id: number;
  department_id: number;
  department: Department;
  name: string;
  status: boolean;
  created_at: string;
}

export interface DesignationFormData {
  department_id: number;
  name: string;
  status: boolean;
}

export interface DesignationListResponse {
  data: Designation[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DesignationListParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export const designationApi = {
  getDesignations: async (params?: DesignationListParams): Promise<DesignationListResponse> => {
    const response = await axios.get('/designations', { params });
    return response.data;
  },

  getDesignation: async (id: number): Promise<Designation> => {
    const response = await axios.get(`/designations/${id}`);
    return response.data.data;
  },

  createDesignation: async (data: DesignationFormData): Promise<Designation> => {
    const response = await axios.post('/designations', data);
    return response.data.data;
  },

  updateDesignation: async (id: number, data: DesignationFormData): Promise<Designation> => {
    const response = await axios.put(`/designations/${id}`, data);
    return response.data.data;
  },

  deleteDesignation: async (id: number): Promise<void> => {
    await axios.delete(`/designations/${id}`);
  },
};
