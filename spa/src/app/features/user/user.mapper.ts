import { APIUser, User } from "@api/users/DTOs/user.interace";

export function mapApiUserToUser(apiUser: APIUser): User{
    const fullName = `${apiUser.first_name} ${apiUser.last_name}`.trim();
    return {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        fullName: fullName || apiUser.username,
        department: apiUser.department ?? 0,
        status: apiUser.is_active ? 'active' : 'inactive'
    };
}