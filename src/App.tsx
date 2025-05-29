import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/NavBar';
import './App.css'; // Puedes crear este archivo para estilos globales

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container" style={{ padding: '20px' }}> {/* Un contenedor simple */}
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;