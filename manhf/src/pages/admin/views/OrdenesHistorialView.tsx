import React, { useState, useEffect } from 'react';
import { ordenesService, OrdenMantencion, OrdenReparacion, OrdenFilters } from '../../../services/ordenes.service';

const OrdenesHistorialView: React.FC = () => {
  const [mantenciones, setMantenciones] = useState<OrdenMantencion[]>([]);
  const [reparaciones, setReparaciones] = useState<OrdenReparacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Estados de filtros
  const [showMantencion, setShowMantencion] = useState(true);
  const [showReparacion, setShowReparacion] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Iniciando carga de órdenes...');
      
      // Verificar autenticación primero
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor inicia sesión.');
      }

      // Cargar ambas en paralelo
      const [mantencionesData, reparacionesData] = await Promise.all([
        ordenesService.getMantenciones(),
        ordenesService.getReparaciones()
      ]);
      
      setMantenciones(mantencionesData);
      setReparaciones(reparacionesData);
      
      console.log(`✅ Carga exitosa: ${mantencionesData.length} mantenciones, ${reparacionesData.length} reparaciones`);
      
    } catch (error: any) {
      console.error('❌ Error cargando órdenes:', error);
      setError(error.message || 'Error al cargar las órdenes');
      setMantenciones([]);
      setReparaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      cargarOrdenes();
      return;
    }

    try {
      setLoading(true);
      const resultado = await ordenesService.buscarOrdenes(busqueda);
      
      setMantenciones(resultado.mantenciones || []);
      setReparaciones(resultado.reparaciones || []);
      
    } catch (error: any) {
      console.error('Error buscando órdenes:', error);
      setError('Error al buscar órdenes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMantencion = () => {
    setShowMantencion(!showMantencion);
  };

  const handleToggleReparacion = () => {
    setShowReparacion(!showReparacion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const formatFecha = (fechaString: string) => {
    try {
      return new Date(fechaString).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fechaString;
    }
  };

  const formatHora = (fechaString: string) => {
    try {
      return new Date(fechaString).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaString;
    }
  };

  const getProgresoColor = (progreso: string) => {
    switch (progreso?.toUpperCase()) {
      case 'REALIZADO': return 'bg-green-100 text-green-800';
      case 'EN_GESTION': return 'bg-yellow-100 text-yellow-800';
      case 'NO_REALIZADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoOrdenColor = (tipo: string) => {
    switch (tipo?.toUpperCase()) {
      case 'PREVENTIVA': return 'bg-blue-100 text-blue-800';
      case 'CORRECTIVA': return 'bg-orange-100 text-orange-800';
      case 'EMERGENCIA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar órdenes para mostrar según los toggles
  const mantencionesFiltradas = showMantencion ? mantenciones : [];
  const reparacionesFiltradas = showReparacion ? reparaciones : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando órdenes...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">🛠️ Historial de Órdenes</h1>
        
        {/* Barra de búsqueda */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por cliente, ubicación, equipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleBuscar}
          >
            Buscar
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={cargarOrdenes}
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Filtros Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              showMantencion 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={handleToggleMantencion}
          >
            {showMantencion ? '✅ MANTENCIÓN' : '⬜ MANTENCIÓN'}
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg ${
              showReparacion 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={handleToggleReparacion}
          >
            {showReparacion ? '✅ REPARACIÓN' : '⬜ REPARACIÓN'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Grid de Órdenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Mantenciones */}
        {showMantencion && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">📋 Órdenes de Mantención</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {mantencionesFiltradas.length} órdenes
                </span>
              </div>
            </div>

            {mantencionesFiltradas.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No hay órdenes de mantención</p>
              </div>
            ) : (
              mantencionesFiltradas.map((orden) => (
                <div key={orden.idOrden} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">Orden #{orden.idOrden}</h3>
                        <p className="text-gray-600 text-sm">
                          Cliente ID: {orden.idCliente} #### • Motor ID: {orden.idMotor} #### • Técnico ID: {orden.idTecnico} ####
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoOrdenColor(orden.tipoOrden)}`}>
                        {orden.tipoOrden}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipo:</span>
                        <span className="font-medium">Motor ID: {orden.idMotor} </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Técnico:</span>
                        <span className="font-medium">Técnico ID: {orden.idTecnico} </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">{formatFecha(orden.horaIngreso)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Horario:</span>
                        <span className="font-medium">{formatHora(orden.horaIngreso)} - {formatHora(orden.horaSalida)}</span>
                      </div>

                      {orden.observaciones && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-gray-600 block mb-1">Observaciones:</span>
                          <p className="text-sm text-gray-700">{orden.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        👁️ Ver Detalles
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        📄 Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Columna Reparaciones */}
        {showReparacion && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">🔧 Órdenes de Reparación</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {reparacionesFiltradas.length} órdenes
                </span>
              </div>
            </div>

            {reparacionesFiltradas.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No hay órdenes de reparación</p>
              </div>
            ) : (
              reparacionesFiltradas.map((orden) => (
                <div key={orden.idOrden} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">Orden #{orden.idOrden}</h3>
                        <p className="text-gray-600 text-sm">
                          Cliente ID: {orden.idCliente} • Motor ID: {orden.idMotor}  • Técnico ID: {orden.idTecnico} 
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getProgresoColor(orden.progreso)}`}>
                        {orden.progreso}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipo:</span>
                        <span className="font-medium">Motor ID: {orden.idMotor} ####</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Técnico:</span>
                        <span className="font-medium">Técnico ID: {orden.idTecnico} ####</span>
                      </div>
                      
                      <div className="flex">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">{formatFecha(orden.fecha)}</span>
                      </div>

                      {orden.observaciones && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-gray-600 block mb-1">Observaciones:</span>
                          <p className="text-sm text-gray-700">{orden.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        👁️ Ver Detalles
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        📄 Descargar PDF
                      </button>
                      {orden.progreso !== 'REALIZADO' && (
                        <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                          ✏️ Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mensaje cuando no hay nada seleccionado */}
      {!showMantencion && !showReparacion && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Selecciona al menos un tipo de orden para visualizar
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdenesHistorialView;