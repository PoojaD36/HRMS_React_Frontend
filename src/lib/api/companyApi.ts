import axios from './axiosConfig';

export interface Company {
  id: number;
  uuid: string;
  company_code: string;
  name: string;
  email: string;
  phone: string | null;
  database_name: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyUser {
  id: number;
  company_id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface CompanyRegistrationData {
  company_name: string;
  company_email: string;
  phone?: string;
  admin_name: string;
  admin_email: string;
  password: string;
}

export interface CompanyRegistrationResponse {
  success: boolean;
  data: {
    company: Company;
    user: CompanyUser;
  };
}

export const companyApi = {
  registerCompany: async (
    data: CompanyRegistrationData
  ): Promise<CompanyRegistrationResponse> => {
    const response = await axios.post('/register-company', data);
    return response.data;
  },

  getCompanies: async (): Promise<Company[]> => {
    const response = await axios.get('/companies');
    return response.data.data;
  },

  getCompany: async (id: number): Promise<Company> => {
    const response = await axios.get(`/companies/${id}`);
    return response.data.data;
  },

  updateCompany: async (
    id: number,
    data: Partial<CompanyRegistrationData>
  ): Promise<Company> => {
    const response = await axios.put(`/companies/${id}`, data);
    return response.data.data;
  },

  deleteCompany: async (id: number): Promise<void> => {
    await axios.delete(`/companies/${id}`);
  },
};
