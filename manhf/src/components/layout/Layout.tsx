// src/components/Layout/Layout.tsx
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/globals.css';
import '../../assets/styles/variables.css';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'TECNICO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (rol: string) => {
    switch (rol) {
      case 'SUPER_ADMIN': return 'Super Administrador';
      case 'ADMIN': return 'Administrador';
      case 'TECNICO': return 'Técnico';
      default: return rol;
    }
  };

  return (
<div className="dashboard-layout">
  <nav className="dashboard-header">
    <div className="header-container">
      <div className="header-content">
        <div className="flex items-center">
          <h1 className="header-title">Sistema de Gestión de Mantenciones</h1>
        </div>
        <div className="header-user-section">
          <span className="user-greeting">Hola, {user?.nombre}</span>
          <span className="role-badge">{getRoleName(user?.rol || '')}</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
  <main className="dashboard-main">
    {children}
  </main>
</div>
  );
};

export default Layout;