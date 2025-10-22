// src/components/Layout/Layout.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    
    // Navegar a rutas específicas basadas en la vista seleccionada
    switch (view) {
      case 'dashboard':
        if (user?.rol === 'TECNICO') {
          navigate('/tecnico');
        } else {
          navigate('/admin');
        }
        break;
      case 'calendario':
        if (user?.rol === 'TECNICO') {
          navigate('/tecnico/calendario');
        } else {
          navigate('/admin/calendario');
        }
        break;
      case 'clientes':
        navigate('/admin/clientes');
        break;
      case 'ordenes':
        navigate('/admin/ordenes');
        break;
      case 'solicitudes':
        navigate('/admin/solicitudes');
        break;
      case 'reportes':
        navigate('/admin/reportes');
        break;
      case 'usuarios':
        navigate('/admin/usuarios');
        break;
      case 'configuracion':
        navigate('/admin/configuracion');
        break;
      case 'mantenciones':
        navigate('/tecnico/mantenciones/nueva');
        break;
      case 'reparaciones':
        navigate('/tecnico/reparaciones/nueva');
        break;
      case 'historial':
        if (user?.rol === 'TECNICO') {
          navigate('/tecnico/historico');
        } else {
          navigate('/admin/historial');
        }
        break;
      default:
        // Para otras vistas, mantener la navegación actual
        break;
    }
  };

  const getRoleName = (rol: string) => {
    switch (rol) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Administrador';
      case 'TECNICO': return 'Técnico';
      default: return rol;
    }
  };

  const getDashboardTitle = () => {
    if (user?.rol === 'TECNICO') {
      return 'Panel del Técnico';
    } else {
      return 'Sistema de Gestión';
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        onLogout={handleLogout} 
      />
      <div className="main-content-wrapper">
        <nav className="dashboard-header">
          <div className="header-container">
            <div className="header-content">
              <div className="flex items-center">
                <h1 className="header-title">{getDashboardTitle()}</h1>
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
          {React.Children.map(children, child =>
            React.isValidElement(child) 
              ? React.cloneElement(child as React.ReactElement<any>, {
                  onViewChange: handleViewChange
                })
              : child
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;