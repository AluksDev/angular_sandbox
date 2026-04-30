export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  department: number;
  departmentName?: string;
  initials?: string;
  status: 'active' | 'inactive';
}

export interface APIUser {
  id?: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  department?: number | null;
  department_name?: string;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string | null;
  roles?: string[];
}