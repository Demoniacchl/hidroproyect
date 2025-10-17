// src/components/Layout/Layout.tsx
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
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

  const getRoleName = (rol: string) => {
    switch (rol) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Administrador';
      case 'TECNICO': return 'Técnico';
      default: return rol;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} activeView={''} onViewChange={function (view: string): void {
        throw new Error('Function not implemented.');
      } } />
      <div className="main-content-wrapper">
        <nav className="dashboard-header">
          <div className="header-container">
            <div className="header-content">
              <div className="flex items-center">
                <h1 className="header-title">Sistema de Gestión</h1>
              </div>
              <div className="header-user-section">
                <span className="user-greeting">Hola, {user?.nombre}</span>
                <span className="role-badge">{getRoleName(user?.rol || '')}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <span>🚪</span>
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
    </div>
  );
};

export default Layout;