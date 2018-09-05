export interface SignUpProps {
    email?: string;
}

export interface SignUpState {
    app_secret_key?: string;
    email?: string;
    password?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    successfulSignup?: boolean;
    validUsername?: boolean;
}