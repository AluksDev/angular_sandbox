export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  department: number;
  status: 'active' | 'inactive';
}

export interface APIUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  department: number | null;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  roles: string[];
}

export interface APILoginResponse {
  token: string,
  user: APIUser
}

export interface APILogoutResponse {
  detail: string
}