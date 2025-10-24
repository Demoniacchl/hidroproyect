// src/App.tsx - VERSIÓN COMPLETA CON RUTAS DE TÉCNICO
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm/LoginForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import TecnicoDashboard from './pages/tecnico/TecnicoDashboard';
import FormularioMantencion from './pages/tecnico/views/FormularioMantencion';
import FormularioReparacion from './pages/tecnico/views/FormularioReparacion';
import NuevaMantencion from './pages/tecnico/views/NuevaMantencion';
import NuevaReparacion from './pages/tecnico/views/NuevaReparacion';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/layout/Layout';
import '../src/assets/styles/globals.css';
import '../src/assets/styles/variables.css';

// Componente para redirección basada en rol
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.rol === 'TECNICO') {
    return <Navigate to="/tecnico" replace />;
  } else if (user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Componente para página no autorizada
const UnauthorizedPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>⛔ No Autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button onClick={() => window.history.back()}>Volver</button>
    </div>
  );
};

// Componentes placeholder para otras vistas del técnico
const CalendarioTecnico: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">📅 Mi Calendario</h1>
    <p>Vista de calendario para técnicos</p>
  </div>
);

const HistoricoTecnico: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">📋 Mi Historial</h1>
    <p>Historial de trabajos del técnico</p>
  </div>
);

const PerfilTecnico: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">👤 Mi Perfil</h1>
    <p>Perfil del técnico</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta principal - redirige basado en rol */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta de login */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Ruta no autorizada */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
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
            
            {/* Ruta protegida de técnico - TODAS LAS RUTAS */}
            <Route 
              path="/tecnico/*" 
              element={
                <ProtectedRoute allowedRoles={['TECNICO']}>
                  <Layout>
                    <Routes>
                      {/* Ruta principal del técnico */}
                      <Route path="" element={<TecnicoDashboard />} />
                      
                      {/* Rutas de formularios */}
                      <Route path="mantencion/:idEvento" element={<FormularioMantencion />} />
                      <Route path="reparacion/:idEvento" element={<FormularioReparacion />} />
                      
                      {/* Rutas de navegación */}
                      <Route path="calendario" element={<CalendarioTecnico />} />
                      <Route path="historico" element={<HistoricoTecnico />} />
                      <Route path="perfil" element={<PerfilTecnico />} />
                      
                      {/* Rutas para nuevas órdenes (placeholders) */}
                      <Route path="mantenciones/nueva" element={<NuevaMantencion />} />
                      <Route path="reparaciones/nueva" element={<NuevaReparacion />} />
                    </Routes>
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