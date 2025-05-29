export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}