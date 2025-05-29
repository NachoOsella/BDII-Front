import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';
import type { User } from '../types/user';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/authService';
// Asumimos que tienes una función para obtener el usuario desde el token o una API
// import { getMe } from '../services/userService'; // Opcional

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    // loadUser: () => Promise<void>; // Opcional, si necesitas cargar el usuario al inicio
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [isLoading, setIsLoading] = useState<boolean>(true); // Para carga inicial

    // Simulación de carga de usuario si hay token al inicio
    useEffect(() => {
        const attemptLoadUser = async () => {
            if (token) {
                try {
                    // Aquí podrías llamar a un endpoint /me para obtener datos del usuario si el token es válido
                    // Por ahora, si hay token, asumimos que es válido y decodificamos o esperamos login
                    // Para este ejemplo, el usuario se establecerá explícitamente al hacer login.
                    // Si quisieras persistir el objeto User, lo guardarías en localStorage junto al token.
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }

                } catch (error) {
                    console.error("Failed to auto-login with token", error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        attemptLoadUser();
    }, [token]);


    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const data: AuthResponse = await apiLogin(credentials);
            localStorage.setItem('accessToken', data.accessToken);
            // Ahora el backend devuelve el objeto user completo
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.accessToken);
        } catch (error) {
            console.error("Login failed", error);
            throw error; // Re-throw para que el componente lo maneje
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        try {
            await apiRegister(credentials);
            // Opcionalmente, podrías loguear al usuario automáticamente después del registro
            // await login({ usernameOrEmail: credentials.email, password: credentials.password });
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [login]);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Aquí podrías querer redirigir al usuario a la página de login
        // navigate('/login'); // Si usas useNavigate
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};