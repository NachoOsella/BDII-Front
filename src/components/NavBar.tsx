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
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">TodoApp</Link>
                <div className="navbar-nav">
                    {isAuthenticated && user ? (
                        <>
                            <span className="navbar-user">Hola, {user.username}</span>
                            <Link to="/todos" className="navbar-link">Mis Tareas</Link>
                            <Link to="/reports" className="navbar-link">Reportes</Link>
                            <button onClick={handleLogout} className="btn btn-small">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">Login</Link>
                            <Link to="/register" className="navbar-link">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;