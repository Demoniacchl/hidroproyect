import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/common/Dashboard';
import NotFound from './pages/common/NotFound';
import Unauthorized from './pages/common/Unauthorized';

// Role-specific pages (vamos a crearlas después)
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TecnicoDashboard from './pages/tecnico/TecnicoDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin" element={
              <ProtectedRoute requiredRole="SUPER_ADMIN">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Tecnico Routes */}
            <Route path="/tecnico" element={
              <ProtectedRoute requiredRole="TECNICO">
                <TecnicoDashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;