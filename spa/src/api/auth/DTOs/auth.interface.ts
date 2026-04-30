import { APIUser } from "@api/users/DTOs/user.interace"

export interface APILoginResponse {
  token: string,
  user: APIUser
}

export interface APILogoutResponse {
  detail: string
}