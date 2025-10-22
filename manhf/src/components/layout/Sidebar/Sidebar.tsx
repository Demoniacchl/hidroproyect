import React from 'react';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout }) => {
  const { user } = useAuth();

  // Navegación específica para ADMIN
// En adminNavigation, agrega:
const adminNavigation = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'calendario', label: 'Calendario', icon: '📅' },
  { id: 'clientes', label: 'Clientes', icon: '👥' },
  { id: 'ordenes', label: 'Órdenes', icon: '📋' }, // ← NUEVO
  { id: 'solicitudes', label: 'Solicitudes', icon: '✅' },
  { id: 'reportes', label: 'Reportes', icon: '📈' },
];

  // Navegación específica para TÉCNICO
const tecnicoNavigation = [
  { id: 'dashboard', label: 'Mi Panel', icon: '📱' },
  { id: 'tareas-hoy', label: 'Tareas de Hoy', icon: '📅' },
  { id: 'tareas-pendientes', label: 'Tareas Pendientes', icon: '⏳' },
  { id: 'nueva-mantencion', label: 'Nueva Mantención', icon: '🛠️' },
  { id: 'nueva-reparacion', label: 'Nueva Reparación', icon: '🔧' },
  { id: 'historial', label: 'Mi Historial', icon: '📋' },
  { id: 'calendario', label: 'Mi Calendario', icon: '🗓️' },
];

  // Navegación específica para SUPER_ADMIN
  const superAdminNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
    { id: 'clientes', label: 'Clientes', icon: '🏢' },
    { id: 'ordenes', label: 'Órdenes', icon: '📋' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
    { id: 'reportes', label: 'Reportes', icon: '📈' },
  ];

  const getNavigationItems = () => {
    switch (user?.rol) {
      case 'SUPER_ADMIN':
        return superAdminNavigation;
      case 'TECNICO':
        return tecnicoNavigation;
      case 'ADMIN':
      default:
        return adminNavigation;
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🔧 Mantenciones</h2>
        <div className="user-info-sidebar">
          <span className="user-name">{user?.nombre}</span>
          <span className="user-role">{user?.rol}</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {getNavigationItems().map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn-sidebar">
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;