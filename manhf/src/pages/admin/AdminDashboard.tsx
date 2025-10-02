import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🏢 Panel Administrador
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {user?.nombre}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Gestión de Clientes */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <span className="text-white text-2xl">👥</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gestión de Clientes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Administrar clientes
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm">
                  <button 
                    onClick={() => navigate('/admin/clients')}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Gestionar Clientes →
                  </button>
                </div>
              </div>
            </div>

            {/* Calendario */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Calendario
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Programar eventos
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm">
                  <button 
                    onClick={() => navigate('/admin/calendar')}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    Ver Calendario →
                  </button>
                </div>
              </div>
            </div>

            {/* Aprobaciones */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Aprobaciones
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Revisar solicitudes
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm">
                  <button 
                    onClick={() => navigate('/admin/approvals')}
                    className="text-yellow-600 hover:text-yellow-900 font-medium"
                  >
                    Ver Solicitudes →
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Resumen Rápido */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Solicitudes Pendientes</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600">🔧</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Mantenciones Hoy</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-purple-600">🚨</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Emergencias Activas</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <span className="text-orange-600">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Clientes Activos</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;