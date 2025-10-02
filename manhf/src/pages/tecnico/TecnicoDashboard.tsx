import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TecnicoDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Datos de ejemplo para las tareas del técnico
  const tareasPendientes = [
    { id: 1, tipo: 'Mantención', cliente: 'Edificio Marina', equipo: 'Bomba Agua CR15', hora: '09:00' },
    { id: 2, tipo: 'Reparación', cliente: 'Torre Los Andes', equipo: 'Motor Eléctrico', hora: '11:30' },
    { id: 3, tipo: 'Emergencia', cliente: 'Centro Comercial', equipo: 'Sistema Presión', hora: '14:00' },
  ];

  const mantencionesCompletadas = [
    { id: 1, cliente: 'Edificio Norte', equipo: 'Bomba Grundfos', fecha: '2024-01-15' },
    { id: 2, cliente: 'Hotel Plaza', equipo: 'Motor 20HP', fecha: '2024-01-14' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🔧 Panel Técnico
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
          
          {/* Tarjetas de Acceso Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button 
              onClick={() => navigate('/tecnico/mantenciones')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 text-xl">🛠️</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Mantenciones</h3>
                  <p className="text-sm text-gray-600">Registrar mantención</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/tecnico/reparaciones')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <span className="text-red-600 text-xl">🚨</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Reparaciones</h3>
                  <p className="text-sm text-gray-600">Nueva reparación</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/tecnico/historico')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Histórico</h3>
                  <p className="text-sm text-gray-600">Ver trabajos</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/tecnico/perfil')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-purple-600 text-xl">👤</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Mi Perfil</h3>
                  <p className="text-sm text-gray-600">Configuración</p>
                </div>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Tareas del Día */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  📅 Tareas de Hoy
                </h2>
              </div>
              <div className="p-6">
                {tareasPendientes.length > 0 ? (
                  <div className="space-y-4">
                    {tareasPendientes.map((tarea) => (
                      <div key={tarea.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              tarea.tipo === 'Emergencia' ? 'bg-red-500' : 
                              tarea.tipo === 'Reparación' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}></span>
                            <span className="font-medium text-gray-900">{tarea.tipo}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{tarea.cliente}</p>
                          <p className="text-xs text-gray-500">{tarea.equipo}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tarea.hora}
                          </span>
                          <button className="block mt-2 text-blue-600 hover:text-blue-800 text-sm">
                            Iniciar →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay tareas programadas para hoy</p>
                )}
              </div>
            </div>

            {/* Mantenciones Recientes */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  ✅ Mantenciones Recientes
                </h2>
              </div>
              <div className="p-6">
                {mantencionesCompletadas.length > 0 ? (
                  <div className="space-y-3">
                    {mantencionesCompletadas.map((mantencion) => (
                      <div key={mantencion.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{mantencion.cliente}</p>
                          <p className="text-sm text-gray-600">{mantencion.equipo}</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {mantencion.fecha}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay mantenciones recientes</p>
                )}
                
                <button 
                  onClick={() => navigate('/tecnico/mantenciones/nueva')}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Nueva Mantención
                </button>
              </div>
            </div>

          </div>

          {/* Estadísticas Rápidas */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Mant. Este Mes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Tareas Complet.</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Eficiencia</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TecnicoDashboard;