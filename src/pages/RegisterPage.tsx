import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import type { RegisterCredentials } from '../types/auth';

const RegisterPage: React.FC = () => {
    const { register, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (credentials: RegisterCredentials) => {
        setError(null);
        try {
            await register(credentials);
            alert('Registro exitoso. Por favor, inicia sesión.'); // O un toast
            navigate('/login');
        } catch (err) {
            if (err && typeof err === 'object' && err !== null) {
                const errorObj = err as { response?: { data?: { message?: string } }, message?: string };
                setError(errorObj.response?.data?.message || errorObj.message || 'Error en el registro.');
            } else {
                setError('Error en el registro.');
            }
            console.error(err);
        }
    };

    return (
        <div>
            <AuthForm<RegisterCredentials>
                formType="register"
                onSubmit={handleRegister}
                isLoading={authLoading}
                error={error}
            />
        </div>
    );
};

export default RegisterPage;