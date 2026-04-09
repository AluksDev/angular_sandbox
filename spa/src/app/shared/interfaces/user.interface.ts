export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}