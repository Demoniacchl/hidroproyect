import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import './AdminDashboard.css';

// Importar vistas
import DashboardView from './views/DashboardView';
import ClientesView from './views/ClientesView';
import SolicitudesView from './views/SolicitudesView';
import CalendarioView from './views/CalendarioView';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'clientes':
        return <ClientesView />;
      case 'solicitudes':
        return <SolicitudesView />;
      case 'calendario':
        return <CalendarioView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
      />
      
      <div className="main-content">
        <main className="page-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;