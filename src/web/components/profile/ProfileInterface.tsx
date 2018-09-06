export interface ProfileProps {
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    password?: string;
    user_id?: string;
}

export interface ProfileState {
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    password?: string;
    user_id?: string;
    modalVisible?: boolean;
    confirmEmail?: string;
    validUsername?: boolean;
}