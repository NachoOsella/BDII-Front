export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    username: string; // O el objeto User completo
    // user?: User; // Alternativa si el backend devuelve el objeto User
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