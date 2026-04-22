import { APIUser } from "@api/users/DTOs/user.interace"

export interface APILoginResponse {
  token: string,
  user: APIUser
}

export interface APILogoutResponse {
  detail: string
}

export interface ApiUserRegister {
  username: string,
  email: string,
  password: string,
  password_confirm: string,
  fist_name: string,
  last_name: string
}