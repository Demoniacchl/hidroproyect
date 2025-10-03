import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import './AdminDashboard.css';

// Importar vistas
import DashboardView from './views/DashBoardView';
import ClientesView from './views/ClientesView';
import SolicitudesView from './views/SolicitudesView';
import CalendarioView from './views/CalendarioView';

import OrdenesHistorialView from './views/OrdenesHistorialView'; // ← IMPORTAR

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const renderView = () => {
  switch (activeView) {
    case 'dashboard':
      return <DashboardView />;
    case 'clientes':
      return <ClientesView />;
    case 'calendario':
      return <CalendarioView />;
    case 'ordenes': // ← AGREGAR ESTE CASE
      return <OrdenesHistorialView />;
    case 'solicitudes':
      return <SolicitudesView />;
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
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;