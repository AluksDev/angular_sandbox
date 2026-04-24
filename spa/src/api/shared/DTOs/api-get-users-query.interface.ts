export interface GetUsersQuery {
  search?: string;
  department?: string;
  is_active?: string;
  limit?: number;
  offset?: number;
  fields?: string;
  expand?: string;
}