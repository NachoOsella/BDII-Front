import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth';

const LoginPage: React.FC = () => {
    const { login, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);

    const from = location.state?.from?.pathname || "/todos";

    const handleLogin = async (credentials: LoginCredentials) => {
        setError(null);
        try {
            await login(credentials);
            navigate(from, { replace: true });
        } catch (err) {
            if (err && typeof err === 'object' && err !== null) {
                const errorObj = err as { response?: { data?: { message?: string } }, message?: string };
                setError(errorObj.response?.data?.message || errorObj.message || 'Error al iniciar sesión.');
            } else {
                setError('Error al iniciar sesión.');
            }
            console.error(err);
        }
    };

    return (
        <div>
            <AuthForm<LoginCredentials>
                formType="login"
                onSubmit={handleLogin}
                isLoading={authLoading}
                error={error}
            />
        </div>
    );
};

export default LoginPage;