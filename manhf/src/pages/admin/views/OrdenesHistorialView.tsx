// src/pages/admin/views/OrdenesHistorialView.tsx
import React, { useState, useEffect } from 'react';
import { ordenesService, OrdenMantencion, OrdenReparacion } from '../../../services/ordenes.service';

interface OrdenCombinada {
  id: string;
  idOrden: number;
  idCliente: number;
  idMotor: number;
  idTecnico: number;
  tipo: 'MANTENCION' | 'REPARACION';
  fecha: string;
  observaciones?: string;
  tipoOrden?: string;
  progreso?: string;
  horaIngreso?: string;
  horaSalida?: string;
}

const OrdenesHistorialView: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenCombinada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const [tipoFiltro, setTipoFiltro] = useState<'TODAS' | 'MANTENCION' | 'REPARACION'>('TODAS');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Cargando órdenes...');

      // Cargar ambas en paralelo
      const [mantencionesData, reparacionesData] = await Promise.all([
        ordenesService.getMantenciones(),
        ordenesService.getReparaciones()
      ]);
      
      console.log('📊 Datos recibidos:', {
        mantenciones: mantencionesData.length,
        reparaciones: reparacionesData.length
      });

      // DEBUG: Ver IDs de órdenes
      console.log('🔍 IDs Mantenciones:', mantencionesData.map(m => m.idOrden));
      console.log('🔍 IDs Reparaciones:', reparacionesData.map(r => r.idOrdenReparacion)); // ← CAMBIADO

      // COMBINAR ÓRDENES CON IDs ÚNICOS
      const ordenesCombinadas: OrdenCombinada[] = [];

      // Agregar mantenciones con ID único "M-{idOrden}"
      mantencionesData.forEach(orden => {
        ordenesCombinadas.push({
          id: `M-${orden.idOrden}`,
          idOrden: orden.idOrden, // ← idOrden para mantención
          idCliente: orden.idCliente,
          idMotor: orden.idMotor,
          idTecnico: orden.idTecnico,
          tipo: 'MANTENCION',
          fecha: orden.horaIngreso,
          observaciones: orden.observaciones,
          tipoOrden: orden.tipoOrden,
          horaIngreso: orden.horaIngreso,
          horaSalida: orden.horaSalida
        });
      });

      // Agregar reparaciones con ID único "R-{idOrdenReparacion}"
      reparacionesData.forEach(orden => {
        ordenesCombinadas.push({
          id: `R-${orden.idOrdenReparacion}`, // ← idOrdenReparacion para reparación
          idOrden: orden.idOrdenReparacion, // ← idOrdenReparacion para reparación
          idCliente: orden.idCliente,
          idMotor: orden.idMotor,
          idTecnico: orden.idTecnico,
          tipo: 'REPARACION',
          fecha: orden.fecha,
          observaciones: orden.observaciones,
          progreso: orden.progreso
        });
      });

      console.log('✅ Órdenes combinadas:', ordenesCombinadas.length);
      console.log('📋 Ejemplo de IDs:', ordenesCombinadas.slice(0, 3).map(o => o.id));
      
      setOrdenes(ordenesCombinadas);
      
    } catch (error: any) {
      console.error('❌ Error cargando órdenes:', error);
      setError(error.message || 'Error al cargar las órdenes');
      setOrdenes([]);
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
      
      // Reconstruir el array combinado con los resultados filtrados
      const ordenesFiltradas: OrdenCombinada[] = [];
      
      resultado.mantenciones?.forEach(orden => {
        ordenesFiltradas.push({
          id: `M-${orden.idOrden}`,
          idOrden: orden.idOrden,
          idCliente: orden.idCliente,
          idMotor: orden.idMotor,
          idTecnico: orden.idTecnico,
          tipo: 'MANTENCION',
          fecha: orden.horaIngreso,
          observaciones: orden.observaciones,
          tipoOrden: orden.tipoOrden,
          horaIngreso: orden.horaIngreso,
          horaSalida: orden.horaSalida
        });
      });

      resultado.reparaciones?.forEach(orden => {
        ordenesFiltradas.push({
          id: `R-${orden.idOrdenReparacion}`, // ← CAMBIADO
          idOrden: orden.idOrdenReparacion, // ← CAMBIADO
          idCliente: orden.idCliente,
          idMotor: orden.idMotor,
          idTecnico: orden.idTecnico,
          tipo: 'REPARACION',
          fecha: orden.fecha,
          observaciones: orden.observaciones,
          progreso: orden.progreso
        });
      });

      setOrdenes(ordenesFiltradas);
      
    } catch (error: any) {
      console.error('Error buscando órdenes:', error);
      setError('Error al buscar órdenes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const formatFecha = (fechaString: string) => {
    try {
      return new Date(fechaString).toLocaleDateString('es-CL');
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
      case 'REALIZADO': return 'estado-completado';
      case 'EN_GESTION': return 'estado-proceso';
      case 'NO_REALIZADO': return 'estado-pendiente';
      default: return 'estado-default';
    }
  };

  const getTipoOrdenColor = (tipo: string) => {
    switch (tipo?.toUpperCase()) {
      case 'PREVENTIVA': return 'tipo-preventiva';
      case 'CORRECTIVA': return 'tipo-correctiva';
      case 'EMERGENCIA': return 'tipo-emergencia';
      default: return 'tipo-default';
    }
  };

  const getTipoIcono = (tipo: string) => {
    switch (tipo?.toUpperCase()) {
      case 'MANTENCION': return '🔧';
      case 'REPARACION': return '🛠️';
      default: return '📋';
    }
  };

  // Filtrar órdenes para mostrar
  const ordenesFiltradas = ordenes.filter(orden => {
    // Filtro por tipo
    if (tipoFiltro !== 'TODAS' && orden.tipo !== tipoFiltro) {
      return false;
    }
    
    // Filtro por búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      return (
        orden.idOrden.toString().includes(busquedaLower) ||
        orden.idCliente.toString().includes(busquedaLower) ||
        orden.idMotor.toString().includes(busquedaLower) ||
        orden.idTecnico.toString().includes(busquedaLower) ||
        (orden.observaciones && orden.observaciones.toLowerCase().includes(busquedaLower)) ||
        (orden.tipoOrden && orden.tipoOrden.toLowerCase().includes(busquedaLower)) ||
        (orden.progreso && orden.progreso.toLowerCase().includes(busquedaLower))
      );
    }
    
    return true;
  });

  // Contadores para los filtros
  const contadores = {
    todas: ordenes.length,
    mantencion: ordenes.filter(o => o.tipo === 'MANTENCION').length,
    reparacion: ordenes.filter(o => o.tipo === 'REPARACION').length
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="ordenes-historial-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h1>Historial de Órdenes</h1>
          <p>Gestión y consulta de órdenes de trabajo</p>
        </div>
      </div>

      {/* Controles */}
      <div className="controles-container">
        <div className="filtros-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por ID, cliente, equipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button className="btn-search" onClick={handleBuscar}>
              🔍
            </button>
          </div>

          <div className="filtros-tipo">
            <button 
              className={`filtro-btn ${tipoFiltro === 'TODAS' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('TODAS')}
            >
              Todas ({contadores.todas})
            </button>
            <button 
              className={`filtro-btn ${tipoFiltro === 'MANTENCION' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('MANTENCION')}
            >
              Mantención ({contadores.mantencion})
            </button>
            <button 
              className={`filtro-btn ${tipoFiltro === 'REPARACION' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('REPARACION')}
            >
              Reparación ({contadores.reparacion})
            </button>
          </div>

          <button className="btn-refresh" onClick={cargarOrdenes}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Tabla de Órdenes */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>ID Orden</th>
              <th>Cliente</th>
              <th>Equipo</th>
              <th>Técnico</th>
              <th>Fecha</th>
              <th>Estado/Progreso</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  {busqueda ? 'No se encontraron órdenes con los filtros aplicados' : 'No hay órdenes registradas'}
                </td>
              </tr>
            ) : (
              ordenesFiltradas.map((orden) => (
                <tr key={orden.id} className="orden-row">
                  <td>
                    <div className="tipo-orden">
                      <span className="tipo-icono">{getTipoIcono(orden.tipo)}</span>
                      <span className="tipo-texto">{orden.tipo}</span>
                    </div>
                  </td>
                  <td>
                    <div className="numero-orden">#{orden.idOrden}</div>
                    <div className="tipo-id" style={{fontSize: '0.7em', color: '#666'}}>
                      ({orden.tipo === 'MANTENCION' ? 'M' : 'R'})
                    </div>
                  </td>
                  <td>
                    <div className="cliente-info">Cliente #{orden.idCliente}</div>
                  </td>
                  <td>
                    <div className="equipo-info">Motor #{orden.idMotor}</div>
                  </td>
                  <td>
                    <div className="tecnico-info">Técnico #{orden.idTecnico}</div>
                  </td>
                  <td>
                    <div className="fecha-info">
                      <div className="fecha">{formatFecha(orden.fecha)}</div>
                      {orden.tipo === 'MANTENCION' && orden.horaIngreso && (
                        <div className="hora">
                          {formatHora(orden.horaIngreso)} - {orden.horaSalida ? formatHora(orden.horaSalida) : '--:--'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {orden.tipo === 'MANTENCION' ? (
                      <span className={`badge ${getTipoOrdenColor(orden.tipoOrden || '')}`}>
                        {orden.tipoOrden || 'MANTENCIÓN'}
                      </span>
                    ) : (
                      <span className={`badge ${getProgresoColor(orden.progreso || '')}`}>
                        {orden.progreso || 'PENDIENTE'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="observaciones">
                      {orden.observaciones ? (
                        <span title={orden.observaciones}>
                          {orden.observaciones.length > 50 
                            ? `${orden.observaciones.substring(0, 50)}...` 
                            : orden.observaciones
                          }
                        </span>
                      ) : (
                        <span className="text-muted">Sin observaciones</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="btn-action btn-view" title="Ver detalles">
                        👁️
                      </button>
                      <button className="btn-action btn-download" title="Descargar PDF">
                        📄
                      </button>
                      {(orden.tipo === 'REPARACION' && orden.progreso !== 'REALIZADO') && (
                        <button className="btn-action btn-edit" title="Editar orden">
                          ✏️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="resumen-footer">
        <div className="resumen-stats">
          <span>Mostrando: {ordenesFiltradas.length} de {ordenes.length} órdenes</span>
          <span className="stat-divider">|</span>
          <span>Mantenciones: {contadores.mantencion}</span>
          <span className="stat-divider">|</span>
          <span>Reparaciones: {contadores.reparacion}</span>
        </div>
      </div>
    </div>
  );
};

export default OrdenesHistorialView;