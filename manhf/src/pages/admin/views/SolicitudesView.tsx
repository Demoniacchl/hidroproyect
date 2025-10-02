import React, { useState, useEffect } from 'react';
import { solicitudesService } from '../../../services/solicitudes.service';

interface Solicitud {
  id: number;
  idOrden: number;
  tipoOrden: string;
  estado: string;
  fechaCreacion: string;
  observacionesAdmin?: string;
}

const SolicitudesView: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');

  useEffect(() => {
    cargarSolicitudes();
  }, [filtroEstado]);

const cargarSolicitudes = async () => {
  try {
    setLoading(true);
    let data: Solicitud[] = [];

    if (filtroEstado === 'TODAS') {
      data = await solicitudesService.getSolicitudes();
    } else {
      data = await solicitudesService.getSolicitudesByEstado(filtroEstado);
    }

    setSolicitudes(data);
  } catch (error) {
    console.error('Error cargando solicitudes:', error);
    setError('Error al cargar las solicitudes');
    setSolicitudes([]); // Array vacío en caso de error
  } finally {
    setLoading(false);
  }
};

  const handleAprobar = async (solicitudId: number) => {
    try {
      await solicitudesService.updateSolicitud(solicitudId, { estado: 'APROBADO' });
      cargarSolicitudes(); // Recargar la lista
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
    }
  };

  const handleRechazar = async (solicitudId: number) => {
    try {
      await solicitudesService.updateSolicitud(solicitudId, { estado: 'RECHAZADO' });
      cargarSolicitudes(); // Recargar la lista
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
    }
  };

  const getBadgeClass = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'badge-warning';
      case 'APROBADO': return 'badge-success';
      case 'RECHAZADO': return 'badge-danger';
      case 'EN_PROCESO': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="solicitudes-view">
      <div className="view-header">
        <h1>Solicitudes de Aprobación</h1>
        <div className="header-actions">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            <option value="TODAS">Todas las solicitudes</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADO">Aprobadas</option>
            <option value="RECHAZADO">Rechazadas</option>
            <option value="EN_PROCESO">En proceso</option>
          </select>
        </div>
      </div>

      <div className="solicitudes-container">
        {solicitudes.length === 0 ? (
          <div className="empty-state">
            <p>No hay solicitudes {filtroEstado !== 'TODAS' ? `con estado ${filtroEstado}` : ''}</p>
          </div>
        ) : (
          <div className="solicitudes-grid">
            {solicitudes.map(solicitud => (
              <div key={solicitud.id} className="solicitud-card">
                <div className="solicitud-header">
                  <h3>Solicitud #{solicitud.id}</h3>
                  <span className={`status-badge ${getBadgeClass(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </div>
                
                <div className="solicitud-info">
                  <div className="info-row">
                    <label>Orden #:</label>
                    <span>{solicitud.idOrden}</span>
                  </div>
                  <div className="info-row">
                    <label>Tipo:</label>
                    <span className="tipo-orden">{solicitud.tipoOrden}</span>
                  </div>
                  <div className="info-row">
                    <label>Fecha:</label>
                    <span>{new Date(solicitud.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                  {solicitud.observacionesAdmin && (
                    <div className="info-row">
                      <label>Observaciones:</label>
                      <span>{solicitud.observacionesAdmin}</span>
                    </div>
                  )}
                </div>

                {solicitud.estado === 'PENDIENTE' && (
                  <div className="solicitud-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleAprobar(solicitud.id)}
                    >
                      ✅ Aprobar
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleRechazar(solicitud.id)}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudesView;