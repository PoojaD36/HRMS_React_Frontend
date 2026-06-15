import axios from './axiosConfig';

export interface EmployeeDepartment {
  id: number;
  name: string;
}

export interface EmployeeDesignation {
  id: number;
  name: string;
}

export interface EmployeeManager {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  joining_date: string | null;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary: number | null;
  profile_image: string | null;
  department: EmployeeDepartment | null;
  designation: EmployeeDesignation | null;
  manager: EmployeeManager | null;
  status: boolean;
  created_at: string;
}

export interface EmployeeFormData {
  department_id: number;
  designation_id: number;
  reporting_manager_id?: number | null;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  joining_date?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary?: number;
  profile_image?: File;
  status: boolean;
}

export interface EmployeeListResponse {
  data: Employee[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface EmployeeListParams {
  search?: string;
  department_id?: number;
  designation_id?: number;
  status?: boolean;
  per_page?: number;
  page?: number;
  sort?: 'first_name' | 'joining_date' | 'employee_code' | 'created_at';
}

export const employeeApi = {
  getEmployees: async (params?: EmployeeListParams): Promise<EmployeeListResponse> => {
    const response = await axios.get('/employees', { params });
    return response.data;
  },

  getEmployee: async (id: number): Promise<Employee> => {
    const response = await axios.get(`/employees/${id}`);
    return response.data.data;
  },

  createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await axios.post('/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  updateEmployee: async (id: number, data: Partial<EmployeeFormData>): Promise<Employee> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.append('_method', 'PUT');

    const response = await axios.post(`/employees/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await axios.delete(`/employees/${id}`);
  },

  // For getting list of employees (for manager dropdown)
  getManagers: async (): Promise<Employee[]> => {
    const response = await axios.get('/employees', {
      params: { per_page: 100, status: true },
    });
    return response.data.data;
  },
};
