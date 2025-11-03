import { User } from "@api/defs/User";

export interface AuthResponse {
    token: string;
    user:  User;
}