export interface AdminUser {
    token: string;
    user_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    is_admin: boolean;
    is_active: boolean;
    last_login: string;
    created_at: string;
}