export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  department: number;
  status: 'active' | 'inactive';
}