import apiClient from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';
import type { User } from '../types/user';

export const registerUser = async (credentials: RegisterCredentials): Promise<User> => { // Asumiendo que register devuelve el User
    const response = await apiClient.post<User>('/auth/register', credentials); // Cambiado de /usuario a /auth
    return response.data;
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials); // Cambiado de /usuario a /auth
    return response.data;
};