import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/todos" replace />;
    }

    return (
        <div className="container">
            <div className="reports-header fade-in">
                <h1>TodoApp</h1>
                <p>Organiza tus tareas de manera simple y eficiente</p>
            </div>

            <div className="hero-actions">
                <a href="/login" className="btn">
                    Iniciar Sesión
                </a>
                <a href="/register" className="btn btn-secondary">
                    Registrarse
                </a>
            </div>
        </div>
    );
};

export default HomePage;