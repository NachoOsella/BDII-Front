import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TodosDashboardPage from '../pages/TodosDashboardPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/todos" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/todos" />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/todos" element={<TodosDashboardPage />} />
                {/* Otras rutas protegidas aquí */}
            </Route>

            {/* Ruta por defecto: si está autenticado va a todos, sino a login */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/todos" : "/login"} />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Fallback para rutas no encontradas */}
        </Routes>
    );
};

export default AppRoutes;