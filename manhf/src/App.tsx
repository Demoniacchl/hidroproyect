// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm/LoginForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/layout/Layout';
import '../src/assets/styles/globals.css';
import '../src/assets/styles/variables.css';
// Componente simple para debug
const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🚀 Sistema de Gestión de Mantenciones</h1>
      <p>Redirigiendo al login...</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta principal - redirige a login */}
            <Route path="/" element={<Home />} />
            
            {/* Ruta de login */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Ruta protegida de admin */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta 404 */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;