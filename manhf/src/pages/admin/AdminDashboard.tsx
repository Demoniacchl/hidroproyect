import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { clientesService } from '../../services/clientes.service';
import { solicitudesService } from '../../services/solicitudes.service';
import { calendarioService } from '../../services/calendario.service';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClientes: 0,
    mantencionesHoy: 0,
    solicitudesPendientes: 0,
    eventosProgramados: 0
  });
  const [solicitudesRecientes, setSolicitudesRecientes] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      
      // Cargar clientes
      const clientesData = await clientesService.getClientes(0, 100);
      setClientes(clientesData.content || []);
      
      // Cargar solicitudes pendientes
      const solicitudesData = await solicitudesService.getSolicitudesByEstado('PENDIENTE');
      setSolicitudesRecientes(solicitudesData || []);
      
      // Cargar eventos de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const eventosHoy = await calendarioService.getEventosPorFecha(hoy);
      
      setStats({
        totalClientes: clientesData.totalElements || 0,
        solicitudesPendientes: solicitudesData.length || 0,
        mantencionesHoy: eventosHoy.filter((evento: any) => evento.tipoEvento === 'MANTENCION').length,
        eventosProgramados: eventosHoy.length || 0
      });
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'clientes':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Gestión de Clientes</h2>
              <button className="btn btn-primary">
                + Nuevo Cliente
              </button>
            </div>
            {/* Tabla de clientes aquí */}
          </div>
        );
      default:
        return (
          <div className="dashboard-main">
            {/* Cards de Estadísticas */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon clients">
                  <span>👥</span>
                </div>
                <div className="stat-info">
                  <h3>Clientes</h3>
                  <div className="stat-number">{stats.totalClientes}</div>
                  <span className="stat-label">Total registrados</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon maintenance">
                  <span>🔧</span>
                </div>
                <div className="stat-info">
                  <h3>Mantenciones</h3>
                  <div className="stat-number">{stats.mantencionesHoy}</div>
                  <span className="stat-label">Programadas hoy</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon requests">
                  <span>📋</span>
                </div>
                <div className="stat-info">
                  <h3>Solicitudes</h3>
                  <div className="stat-number">{stats.solicitudesPendientes}</div>
                  <span className="stat-label">Pendientes</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon events">
                  <span>📅</span>
                </div>
                <div className="stat-info">
                  <h3>Eventos</h3>
                  <div className="stat-number">{stats.eventosProgramados}</div>
                  <span className="stat-label">Para hoy</span>
                </div>
              </div>
            </div>

            {/* Gráficos y Tablas */}
            <div className="content-grid">
              <div className="chart-section">
                <div className="section-header">
                  <h3>Solicitudes Recientes</h3>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudesRecientes.slice(0, 5).map(solicitud => (
                        <tr key={solicitud.id}>
                          <td>#{solicitud.id}</td>
                          <td>{solicitud.tipoOrden}</td>
                          <td>
                            <span className={`status-badge status-${solicitud.estado.toLowerCase()}`}>
                              {solicitud.estado}
                            </span>
                          </td>
                          <td>{new Date(solicitud.fechaCreacion).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="quick-actions">
                <div className="section-header">
                  <h3>Acciones Rápidas</h3>
                </div>
                <div className="actions-grid">
                  <button className="action-btn">
                    <span className="action-icon">👥</span>
                    <span>Gestionar Clientes</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📅</span>
                    <span>Ver Calendario</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">✅</span>
                    <span>Aprobar Solicitudes</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📊</span>
                    <span>Ver Reportes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard coreui-style">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🔧 Mantenciones</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'clientes' ? 'active' : ''}`}
            onClick={() => setActiveView('clientes')}
          >
            <span className="nav-icon">👥</span>
            <span>Clientes</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'calendario' ? 'active' : ''}`}
            onClick={() => setActiveView('calendario')}
          >
            <span className="nav-icon">📅</span>
            <span>Calendario</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'solicitudes' ? 'active' : ''}`}
            onClick={() => setActiveView('solicitudes')}
          >
            <span className="nav-icon">✅</span>
            <span>Solicitudes</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="header-content">
            <div className="breadcrumb">
              <span>Dashboard</span>
            </div>
            <div className="header-actions">
              <div className="user-menu">
                <span className="user-name">Hola, {user?.nombre}</span>
                <span className="user-role">{user?.rol}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;