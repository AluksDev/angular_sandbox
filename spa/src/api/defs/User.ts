/* tslint:disable:max-line-length */

export interface User {
  id?: number;
  /** format: email */
  email?: string;
  dni?: string;
  username: string;
  /** format: date-time */
  date_joined?: string;
  /** format: date-time */
  last_login?: string;
  is_active?: boolean;
  /** Has the user accepted the data protection law? */
  lopd_accepted?: boolean;
  department?: number;
}
