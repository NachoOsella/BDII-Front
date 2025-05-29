import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/">TodoApp</Link>
            <div>
                {isAuthenticated && user ? (
                    <>
                        <span style={{ marginRight: '1rem' }}>Hola, {user.username}</span>
                        <Link to="/todos" style={{ marginRight: '1rem' }}>Mis Tareas</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;