import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 Panel Super Administrador
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {user?.nombre} ({user?.rol})
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Gestión de Usuarios */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <span className="text-white text-2xl">👥</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gestión de Usuarios
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Administrar todos los usuarios
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm">
                  <button 
                    onClick={() => navigate('/super-admin/users')}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Gestionar Usuarios →
                  </button>
                </div>
              </div>
            </div>

            {/* Configuración del Sistema */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <span className="text-white text-2xl">⚙️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Configuración Sistema
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Configuraciones globales
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm">
                  <button 
                    onClick={() => navigate('/super-admin/system')}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    Configurar Sistema →
                  </button>
                </div>
              </div>
            </div>

            {/* Reportes Completos */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Reportes Completos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Todos los reportes del sistema
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm">
                  <button 
                    onClick={() => navigate('/super-admin/reports')}
                    className="text-purple-600 hover:text-purple-900 font-medium"
                  >
                    Ver Reportes →
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Acciones Rápidas */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-blue-100 text-blue-700 p-4 rounded-lg hover:bg-blue-200 transition-colors">
                Crear Usuario
              </button>
              <button className="bg-green-100 text-green-700 p-4 rounded-lg hover:bg-green-200 transition-colors">
                Backup BD
              </button>
              <button className="bg-yellow-100 text-yellow-700 p-4 rounded-lg hover:bg-yellow-200 transition-colors">
                Ver Logs
              </button>
              <button className="bg-red-100 text-red-700 p-4 rounded-lg hover:bg-red-200 transition-colors">
                Auditoría
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Usuarios Totales</h3>
              <p className="text-3xl font-bold text-blue-600">24</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Clientes Activos</h3>
              <p className="text-3xl font-bold text-green-600">156</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Mantenciones Hoy</h3>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;