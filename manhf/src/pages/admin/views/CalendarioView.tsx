import React, { useState, useEffect } from 'react';
import { calendarioService } from '../../../services/calendario.service';
import { clientesService } from '../../../services/clientes.service';

interface EventoCalendario {
  id: number;
  idCliente: number;
  idEquipo?: number;
  idTecnico: number;
  tipoEvento: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface Cliente {
  idCliente: number;
  nombre1: string;
}

const CalendarioView: React.FC = () => {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    idCliente: 0,
    idTecnico: 1,
    tipoEvento: 'MANTENCION',
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'PROGRAMADO'
  });

  useEffect(() => {
    cargarDatos();
  }, [fechaSeleccionada]);

const cargarDatos = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Cargar clientes REALES
    const clientesData = await clientesService.getClientes(0, 100);
    setClientes(clientesData.content || []);
    
    // Cargar eventos REALES
    const eventosData = await calendarioService.getEventos();
    setEventos(eventosData || []);
    
  } catch (error) {
    console.error('Error cargando calendario:', error);
    setError('Error al cargar el calendario');
    setEventos([]); // Array vacío en caso de error
  } finally {
    setLoading(false);
  }
};

  const handleCrearEvento = async () => {
    try {
      await calendarioService.createEvento(nuevoEvento);
      setMostrarModal(false);
      setNuevoEvento({
        idCliente: 0,
        idTecnico: 1,
        tipoEvento: 'MANTENCION',
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'PROGRAMADO'
      });
      cargarDatos(); // Recargar eventos
    } catch (error) {
      console.error('Error creando evento:', error);
    }
  };

  const getColorEvento = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'MANTENCION': return '#28a745';
      case 'REPARACION': return '#dc3545';
      case 'EMERGENCIA': return '#ffc107';
      case 'INSTALACION': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADO': return 'badge-primary';
      case 'EN_PROCESO': return 'badge-warning';
      case 'COMPLETADO': return 'badge-success';
      case 'CANCELADO': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const formatHora = (fechaString: string) => {
    return new Date(fechaString).toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando calendario...</p>
      </div>
    );
  }

  return (
    <div className="calendario-view">
      <div className="view-header">
        <h1>Calendario de Eventos</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setMostrarModal(true)}
          >
            + Nuevo Evento
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-calendario">
        <div className="filtro-group">
          <label>Fecha:</label>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="filtro-input"
          />
        </div>
        
        <div className="filtro-group">
          <label>Tipo de Evento:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="filtro-select"
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="MANTENCION">Mantención</option>
            <option value="REPARACION">Reparación</option>
            <option value="EMERGENCIA">Emergencia</option>
            <option value="INSTALACION">Instalación</option>
          </select>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={cargarDatos}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="eventos-lista">
        <h3>Eventos para {new Date(fechaSeleccionada).toLocaleDateString('es-CL')}</h3>
        
        {eventos.length === 0 ? (
          <div className="empty-state">
            <p>No hay eventos programados para esta fecha</p>
          </div>
        ) : (
          <div className="eventos-grid">
            {eventos.map(evento => (
              <div 
                key={evento.id} 
                className="evento-card"
                style={{ borderLeftColor: getColorEvento(evento.tipoEvento) }}
              >
                <div className="evento-header">
                  <div className="evento-tipo">
                    <span 
                      className="tipo-badge"
                      style={{ backgroundColor: getColorEvento(evento.tipoEvento) }}
                    >
                      {evento.tipoEvento}
                    </span>
                    <span className={`estado-badge ${getEstadoBadge(evento.estado)}`}>
                      {evento.estado}
                    </span>
                  </div>
                  <h4>{evento.titulo}</h4>
                </div>

                <div className="evento-info">
                  <div className="info-item">
                    <span className="info-label">⏰ Horario:</span>
                    <span>{formatHora(evento.fechaInicio)} - {formatHora(evento.fechaFin)}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">👤 Cliente:</span>
                    <span>
                      {clientes.find(c => c.idCliente === evento.idCliente)?.nombre1 || `Cliente #${evento.idCliente}`}
                    </span>
                  </div>

                  {evento.descripcion && (
                    <div className="info-item">
                      <span className="info-label">📝 Descripción:</span>
                      <span>{evento.descripcion}</span>
                    </div>
                  )}
                </div>

                <div className="evento-actions">
                  <button className="btn btn-sm btn-outline">
                    Editar
                  </button>
                  <button className="btn btn-sm btn-outline">
                    Completar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para nuevo evento */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Nuevo Evento</h3>
              <button 
                className="close-btn"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  value={nuevoEvento.titulo}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                  placeholder="Título del evento"
                />
              </div>
              
              <div className="form-group">
                <label>Cliente:</label>
                <select
                  value={nuevoEvento.idCliente}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, idCliente: parseInt(e.target.value)})}
                >
                  <option value={0}>Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nombre1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Evento:</label>
                <select
                  value={nuevoEvento.tipoEvento}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, tipoEvento: e.target.value})}
                >
                  <option value="MANTENCION">Mantención</option>
                  <option value="REPARACION">Reparación</option>
                  <option value="EMERGENCIA">Emergencia</option>
                  <option value="INSTALACION">Instalación</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha y Hora Inicio:</label>
                  <input
                    type="datetime-local"
                    value={nuevoEvento.fechaInicio}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, fechaInicio: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Fecha y Hora Fin:</label>
                  <input
                    type="datetime-local"
                    value={nuevoEvento.fechaFin}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, fechaFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={nuevoEvento.descripcion}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})}
                  placeholder="Descripción del evento..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCrearEvento}
                disabled={!nuevoEvento.titulo || !nuevoEvento.idCliente || !nuevoEvento.fechaInicio}
              >
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioView;