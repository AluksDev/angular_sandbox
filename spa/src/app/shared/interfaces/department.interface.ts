 export interface Department {
  id: number;
  name: string;
  code?: string; // optional because in DB it's nullable
}