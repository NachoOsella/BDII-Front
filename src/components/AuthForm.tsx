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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
            <h2>{formType === 'login' ? 'Login' : 'Register'}</h2>
            {formType === 'register' && (
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            )}
            <input
                type={formType === 'login' ? "text" : "email"} // Login puede ser con username o email
                placeholder={formType === 'login' ? "Username or Email" : "Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Procesando...' : (formType === 'login' ? 'Login' : 'Register')}
            </button>
        </form>
    );
};

export default AuthForm;