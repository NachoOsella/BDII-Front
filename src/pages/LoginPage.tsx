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
        <div className="container">
            <div className="reports-header">
                <h1>Bienvenido</h1>
                <p>Inicia sesión para acceder a tus tareas</p>
            </div>
            <AuthForm<LoginCredentials>
                formType="login"
                onSubmit={handleLogin}
                isLoading={authLoading}
                error={error}
            />
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p style={{ color: 'var(--md-on-surface)', opacity: 0.7 }}>
                    ¿No tienes cuenta?{' '}
                    <a href="/register" style={{ color: 'var(--md-primary)', textDecoration: 'none' }}>
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;