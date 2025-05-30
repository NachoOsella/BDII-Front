import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TodosDashboardPage from '../pages/TodosDashboardPage';
import ReportsPage from '../pages/ReportsPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/todos" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/todos" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/todos" />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/todos" element={<TodosDashboardPage />} />
                <Route path="/reports" element={<ReportsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;