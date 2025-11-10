/* tslint:disable:max-line-length */

export interface UserResponse {
  count:    number;
  total:    number;
  next:     null;
  previous: null;
  results:  User[];
}

export interface User {
  id?: number;
  /** format: email */
  email?: string;
  dni?: string;
  username: string;

  first_name?: string,
  last_name?: string,
  /** format: date-time */
  date_joined?: string;
  /** format: date-time */
  last_login?: string;
  is_active?: boolean;
  /** Has the user accepted the data protection law? */
  lopd_accepted?: boolean;
  department?: number;
  department_name: string
}
