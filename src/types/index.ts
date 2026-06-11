// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  company_name: string;
  company_email: string;
  admin_name: string;
  admin_email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company_id: number;
  company_name?: string;
}

// Company Types
export interface Company {
  id: number;
  uuid: string;
  company_code: string;
  name: string;
  email: string;
  phone?: string;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  status: boolean;
}

// Plan Types
export interface Plan {
  id: number;
  name: string;
  monthly_price: number;
  yearly_price: number;
  employee_limit: number;
  storage_limit: number;
  status: boolean;
}

// Subscription Types
export interface Subscription {
  id: number;
  company_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
}

// Payment Types
export interface Payment {
  id: number;
  company_id: number;
  subscription_id: number;
  gateway: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paid_at?: string;
  gateway_response?: any;
}

// Employee Types
export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  department_id?: number;
  designation_id?: number;
  reporting_manager_id?: number;
  joining_date?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary: number;
  profile_image?: string;
  status: boolean;
  department?: Department;
  designation?: Designation;
  reporting_manager?: Employee;
}

export interface EmployeeFormData {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  department_id?: number;
  designation_id?: number;
  reporting_manager_id?: number;
  joining_date?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary: number;
  profile_image?: string;
  status: boolean;
}

// Department Types
export interface Department {
  id: number;
  name: string;
  description?: string;
  status: boolean;
  employee_count?: number;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
  status: boolean;
}

// Designation Types
export interface Designation {
  id: number;
  name: string;
  department_id: number;
  status: boolean;
  department?: Department;
  employee_count?: number;
}

export interface DesignationFormData {
  name: string;
  department_id: number;
  status: boolean;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Filter Types
export interface EmployeeFilters {
  search?: string;
  department_id?: number;
  designation_id?: number;
  status?: boolean;
  employment_type?: string;
}

export interface DepartmentFilters {
  search?: string;
  status?: boolean;
}

export interface DesignationFilters {
  search?: string;
  department_id?: number;
  status?: boolean;
}
