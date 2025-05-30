import React, { useState } from 'react';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthFormProps<T> {
    formType: 'login' | 'register';
    onSubmit: (data: T) => Promise<void>;
    isLoading: boolean;
    error?: string | null;
}

const AuthForm = <T extends LoginCredentials | RegisterCredentials>({ formType, onSubmit, isLoading, error }: AuthFormProps<T>) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // Solo para registro
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formType === 'login') {
            onSubmit({ usernameOrEmail: email, password } as T); // Asumiendo que el login puede ser con email
        } else {
            onSubmit({ username, email, password } as T);
        }
    };

    return (
        <div className="card form-container">
            <form onSubmit={handleSubmit} className="fade-in">
                <h2 className="form-header">
                    {formType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                </h2>

                {formType === 'register' && (
                    <div className="form-field">
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                )}

                <div className="form-field">
                    <input
                        type={formType === 'login' ? "text" : "email"}
                        placeholder={formType === 'login' ? "Usuario o Email" : "Email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-field">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="btn btn-full-width">
                    {isLoading ? 'Procesando...' : (formType === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;