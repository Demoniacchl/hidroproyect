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
      
      if (showMantencion) {
        const mantencionesData = await ordenesService.getMantenciones();
        setMantenciones(mantencionesData);
      }
      
      if (showReparacion) {
        const reparacionesData = await ordenesService.getReparaciones();
        setReparaciones(reparacionesData);
      }
      
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      setError('Error al cargar las órdenes');
      // Datos de ejemplo en caso de error (para desarrollo)
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
      
      if (showMantencion) {
        setMantenciones(resultado.mantenciones || []);
      }
      
      if (showReparacion) {
        setReparaciones(resultado.reparaciones || []);
      }
      
    } catch (error) {
      console.error('Error buscando órdenes:', error);
      setError('Error al buscar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMantencion = () => {
    const nuevoEstado = !showMantencion;
    setShowMantencion(nuevoEstado);
    
    if (nuevoEstado && mantenciones.length === 0) {
      // Si se activa y no hay datos, cargar
      cargarMantenciones();
    }
  };

  const handleToggleReparacion = () => {
    const nuevoEstado = !showReparacion;
    setShowReparacion(nuevoEstado);
    
    if (nuevoEstado && reparaciones.length === 0) {
      // Si se activa y no hay datos, cargar
      cargarReparaciones();
    }
  };

  const cargarMantenciones = async () => {
    try {
      const mantencionesData = await ordenesService.getMantenciones();
      setMantenciones(mantencionesData);
    } catch (error) {
      console.error('Error cargando mantenciones:', error);
    }
  };

  const cargarReparaciones = async () => {
    try {
      const reparacionesData = await ordenesService.getReparaciones();
      setReparaciones(reparacionesData);
    } catch (error) {
      console.error('Error cargando reparaciones:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const formatFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatHora = (fechaString: string) => {
    return new Date(fechaString).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgresoColor = (progreso: string) => {
    switch (progreso) {
      case 'REALIZADO': return 'badge-success';
      case 'EN_GESTION': return 'badge-warning';
      case 'NO_REALIZADO': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getTipoOrdenColor = (tipo: string) => {
    switch (tipo) {
      case 'PREVENTIVA': return 'badge-primary';
      case 'CORRECTIVA': return 'badge-warning';
      case 'EMERGENCIA': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="spinner"></div>
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
              className="input w-full"
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleBuscar}
          >
            Buscar
          </button>
          <button 
            className="btn btn-outline"
            onClick={cargarOrdenes}
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Filtros Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            className={`btn ${showMantencion ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleToggleMantencion}
          >
            {showMantencion ? '✅ MANTENCIÓN' : '⬜ MANTENCIÓN'}
          </button>
          
          <button
            className={`btn ${showReparacion ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleToggleReparacion}
          >
            {showReparacion ? '✅ REPARACIÓN' : '⬜ REPARACIÓN'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Grid de Órdenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Mantenciones */}
        {showMantencion && (
          <div className="space-y-4">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📋 Órdenes de Mantención</h2>
                <span className="badge badge-primary">
                  {mantenciones.length} órdenes
                </span>
              </div>
            </div>

            {mantenciones.length === 0 ? (
              <div className="card">
                <div className="card-content text-center py-8">
                  <p className="text-muted">No hay órdenes de mantención</p>
                </div>
              </div>
            ) : (
              mantenciones.map((orden) => (
                <div key={orden.id_orden} className="card hover:bg-accent cursor-pointer">
                  <div className="card-header">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title">Orden #{orden.id_orden}</h3>
                        <p className="text-muted">
                          {orden.cliente?.nombre1} • {orden.ubicacion?.nombre}
                        </p>
                      </div>
                      <span className={`badge ${getTipoOrdenColor(orden.tipo_orden)}`}>
                        {orden.tipo_orden}
                      </span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Equipo:</span>
                        <span>{orden.equipo?.marca} {orden.equipo?.modelo}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted">Técnico:</span>
                        <span>{orden.tecnico?.nombre}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted">Fecha:</span>
                        <span>{formatFecha(orden.hora_ingreso)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted">Horario:</span>
                        <span>{formatHora(orden.hora_ingreso)} - {formatHora(orden.hora_salida)}</span>
                      </div>

                      {orden.observaciones && (
                        <div className="mt-2">
                          <span className="text-muted">Observaciones:</span>
                          <p className="text-sm mt-1">{orden.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline">
                        👁️ Ver Detalles
                      </button>
                      <button className="btn btn-sm btn-outline">
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
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">🔧 Órdenes de Reparación</h2>
                <span className="badge badge-primary">
                  {reparaciones.length} órdenes
                </span>
              </div>
            </div>

            {reparaciones.length === 0 ? (
              <div className="card">
                <div className="card-content text-center py-8">
                  <p className="text-muted">No hay órdenes de reparación</p>
                </div>
              </div>
            ) : (
              reparaciones.map((orden) => (
                <div key={orden.id_orden_reparacion} className="card hover:bg-accent cursor-pointer">
                  <div className="card-header">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title">Orden #{orden.id_orden_reparacion}</h3>
                        <p className="text-muted">
                          {orden.cliente?.nombre1} • {orden.ubicacion?.nombre}
                        </p>
                      </div>
                      <span className={`badge ${getProgresoColor(orden.progreso)}`}>
                        {orden.progreso}
                      </span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Equipo:</span>
                        <span>{orden.equipo?.marca} {orden.equipo?.modelo}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted">Técnico:</span>
                        <span>{orden.tecnico?.nombre}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted">Fecha:</span>
                        <span>{formatFecha(orden.fecha)}</span>
                      </div>

                      {orden.observaciones && (
                        <div className="mt-2">
                          <span className="text-muted">Observaciones:</span>
                          <p className="text-sm mt-1">{orden.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline">
                        👁️ Ver Detalles
                      </button>
                      <button className="btn btn-sm btn-outline">
                        📄 Descargar PDF
                      </button>
                      {orden.progreso !== 'REALIZADO' && (
                        <button className="btn btn-sm btn-secondary">
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
          <p className="text-muted text-lg">
            Selecciona al menos un tipo de orden para visualizar
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdenesHistorialView;