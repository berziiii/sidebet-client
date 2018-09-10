export interface AdminUserProps {
    props?: any;
    match?: any;
}

export interface AdminUserState {
    loading?: boolean;
    activity?: any;
    username?: string;
    is_admin?: boolean;
    is_active?: boolean;
    password?: string;
    first_name?: string;
    phone?: string;
    last_name?: string;
    user_id?: string;
    email?: string;
    created_at?: string;
    last_login?: string;
    modalVisible?: boolean;
    confirmEmail?: string;
}