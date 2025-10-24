// src/pages/admin/views/CalendarioView.tsx
import React, { useState, useEffect } from 'react';
import { useCalendario } from '../../../hooks/useCalendario';
import { useClientes } from '../../../hooks/useClientes';
import { useUbicacion } from '../../../hooks/useUbicacion'; // ← CORREGIDO: singular
import type { EventoCreateRequest } from '../../../services/calendario.service';

const CalendarioView: React.FC = () => {
  const { 
    eventos, 
    loading, 
    error, 
    createEvento, 
    updateEvento, 
    deleteEvento,
    clearError 
  } = useCalendario();

  const { clientes } = useClientes();
  const { ubicaciones, cargarUbicacionesPorCliente, loading: loadingUbicaciones } = useUbicacion(); // ← CORREGIDO: singular
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventosModal, setShowEventosModal] = useState(false);
  const [showNuevoEventoModal, setShowNuevoEventoModal] = useState(false);
  const [showEditarEventoModal, setShowEditarEventoModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<any>(null);
  
  const [nuevoEvento, setNuevoEvento] = useState<EventoCreateRequest>({
    idCliente: 0,
    idUbicacion: 0,
    idTecnico: null,
    tipoEvento: 'MANTENCION',
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'PROGRAMADO'
  });

  const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SAB', 'DOM'];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Cargar ubicaciones cuando cambia el cliente seleccionado en NUEVO evento
  useEffect(() => {
    if (nuevoEvento.idCliente > 0) {
      cargarUbicacionesPorCliente(nuevoEvento.idCliente);
      // Resetear ubicación cuando cambia el cliente
      setNuevoEvento(prev => ({ ...prev, idUbicacion: 0 }));
    }
  }, [nuevoEvento.idCliente]);

  // Cargar ubicaciones cuando se abre el modal de EDITAR evento
  useEffect(() => {
    if (eventoEditando?.idCliente) {
      cargarUbicacionesPorCliente(eventoEditando.idCliente);
    }
  }, [eventoEditando]);

  // Función para verificar año bisiesto
  const esBisiesto = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  // Días por mes (considerando años bisiestos)
  const getDiasEnMes = (year: number, month: number): number => {
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    if (month === 1 && esBisiesto(year)) {
      return 29;
    }
    
    return diasPorMes[month];
  };

  // Generar días del mes
  const generarDiasDelMes = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const primerDia = new Date(year, month, 1);
    const primerDiaSemana = primerDia.getDay();

    const dias = [];
    const primerDiaAjustado = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    // Días del mes anterior
    const diasMesAnterior = getDiasEnMes(
      month === 0 ? year - 1 : year,
      month === 0 ? 11 : month - 1
    );

    for (let i = primerDiaAjustado - 1; i >= 0; i--) {
      const dia = diasMesAnterior - i;
      const fecha = new Date(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1,
        dia
      );
      dias.push({ fecha, esMesActual: false, eventos: [] });
    }

    // Días del mes actual
    const diasEnMes = getDiasEnMes(year, month);
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(year, month, dia);
      const eventosDia = getEventosDelDia(fecha);
      dias.push({ fecha, esMesActual: true, eventos: eventosDia });
    }

    // Días del mes siguiente
    const diasFaltantes = 42 - dias.length;
    for (let dia = 1; dia <= diasFaltantes; dia++) {
      const fecha = new Date(
        month === 11 ? year + 1 : year,
        month === 11 ? 0 : month + 1,
        dia
      );
      dias.push({ fecha, esMesActual: false, eventos: [] });
    }

    return dias;
  };

  const getEventosDelDia = (fecha: Date) => {
    return eventos.filter(evento => {
      const eventoDate = new Date(evento.fechaInicio);
      return (
        eventoDate.getDate() === fecha.getDate() &&
        eventoDate.getMonth() === fecha.getMonth() &&
        eventoDate.getFullYear() === fecha.getFullYear()
      );
    });
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

  const navegarMes = (direccion: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const nuevaFecha = new Date(prev);
      if (direccion === 'next') {
        nuevaFecha.setMonth(prev.getMonth() + 1);
      } else {
        nuevaFecha.setMonth(prev.getMonth() - 1);
      }
      return nuevaFecha;
    });
  };

  const irHoy = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleSeleccionarDia = (fecha: Date, esMesActual: boolean) => {
    if (esMesActual) {
      setSelectedDate(fecha);
      setShowEventosModal(true);
    }
  };

  const handleCrearEvento = async () => {
    try {
      await createEvento(nuevoEvento);
      setShowNuevoEventoModal(false);
      // Resetear formulario
      setNuevoEvento({
        idCliente: 0,
        idUbicacion: 0,
        idTecnico: null,
        tipoEvento: 'MANTENCION',
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'PROGRAMADO'
      });
    } catch (err) {
      console.error('Error creando evento:', err);
    }
  };

  const handleEditarEvento = async () => {
    if (!eventoEditando) return;
    
    try {
      await updateEvento(eventoEditando.idCalendario, {
        idCliente: eventoEditando.idCliente,
        idUbicacion: eventoEditando.idUbicacion,
        idTecnico: eventoEditando.idTecnico,
        tipoEvento: eventoEditando.tipoEvento,
        titulo: eventoEditando.titulo,
        descripcion: eventoEditando.descripcion,
        fechaInicio: eventoEditando.fechaInicio,
        fechaFin: eventoEditando.fechaFin,
        estado: eventoEditando.estado
      });
      
      setShowEditarEventoModal(false);
      setEventoEditando(null);
    } catch (err) {
      console.error('Error editando evento:', err);
    }
  };

  const handleEliminarEvento = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      console.log('🗑️ Iniciando eliminación del evento ID:', id);
      
      await deleteEvento(id);
      
      // CERRAR MODALES INMEDIATAMENTE
      setShowEditarEventoModal(false);
      setShowEventosModal(false);
      setEventoEditando(null);
      
      console.log('✅ Eliminación completada');
      
    } catch (err) {
      console.log('⚠️ Error manejado internamente');
    }
  };

  const abrirNuevoEvento = (fecha: Date) => {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(9, 0, 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(10, 0, 0, 0);

    setNuevoEvento(prev => ({
      ...prev,
      fechaInicio: fechaInicio.toISOString().slice(0, 16),
      fechaFin: fechaFin.toISOString().slice(0, 16)
    }));
    
    setShowNuevoEventoModal(true);
    setShowEventosModal(false);
  };

  const abrirEditarEvento = (evento: any) => {
    setEventoEditando(evento);
    setShowEditarEventoModal(true);
    setShowEventosModal(false);
  };

  const eventosDelDiaSeleccionado = selectedDate ? getEventosDelDia(selectedDate) : [];

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  // Obtener nombre de la ubicación
  const getNombreUbicacion = (idUbicacion: number) => {
    const ubicacion = ubicaciones.find(u => u.idUbicacion === idUbicacion);
    return ubicacion ? `${ubicacion.nombre} - ${ubicacion.calle} ${ubicacion.numero}` : `Ubicación #${idUbicacion}`;
  };

  // Obtener nombre del cliente
  const getNombreCliente = (idCliente: number) => {
    const cliente = clientes.find(c => c.idCliente === idCliente);
    return cliente ? cliente.nombre1 : `Cliente #${idCliente}`;
  };

  return (
    <div className="calendario-full-view">
      {/* Header del Calendario */}
      <div className="calendario-header">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Calendario</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navegarMes('prev')}
              >
                ‹
              </button>
              <h2 className="text-xl font-semibold">
                {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navegarMes('next')}
              >
                ›
              </button>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={irHoy}
            >
              Hoy
            </button>
          </div>
        </div>

        {/* Leyenda de eventos */}
        <div className="leyenda-container">
          <div className="leyenda-item">
            <div className="leyenda-color" style={{backgroundColor: '#28a745'}}></div>
            <span>Mantención</span>
          </div>
          <div className="leyenda-item">
            <div className="leyenda-color" style={{backgroundColor: '#dc3545'}}></div>
            <span>Reparación</span>
          </div>
          <div className="leyenda-item">
            <div className="leyenda-color" style={{backgroundColor: '#ffc107'}}></div>
            <span>Emergencia</span>
          </div>
          <div className="leyenda-item">
            <div className="leyenda-color" style={{backgroundColor: '#17a2b8'}}></div>
            <span>Instalación</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando eventos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError} className="close-btn">×</button>
        </div>
      )}

      {/* Grid del Calendario */}
      {!loading && (
        <div className="calendario-grid">
          {/* Días de la semana */}
          <div className="calendario-dias-semana">
            {diasSemana.map(dia => (
              <div key={dia} className="calendario-dia-header">
                {dia}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="calendario-dias-grid">
            {generarDiasDelMes().map(({ fecha, esMesActual, eventos: eventosDia }, index) => {
              const esDiaSeleccionado = selectedDate && 
                fecha.toDateString() === selectedDate.toDateString();
              
              return (
                <div
                  key={index}
                  className={`calendario-dia ${
                    !esMesActual ? 'calendario-dia-otro-mes' : ''
                  } ${
                    esHoy(fecha) ? 'calendario-dia-hoy' : ''
                  } ${
                    esDiaSeleccionado ? 'calendario-dia-seleccionado' : ''
                  }`}
                  onClick={() => handleSeleccionarDia(fecha, esMesActual)}
                >
                  <div className="calendario-dia-numero">
                    {fecha.getDate()}
                  </div>
                  
                  {/* Eventos del día */}
                  <div className="calendario-eventos">
                    {eventosDia.slice(0, 3).map((evento, idx) => (
                      <div
                        key={idx}
                        className="calendario-evento-item"
                        style={{ backgroundColor: getColorEvento(evento.tipoEvento) }}
                      >
                        <span className="calendario-evento-texto">
                          {evento.titulo}
                        </span>
                      </div>
                    ))}
                    {eventosDia.length > 3 && (
                      <div className="calendario-mas-eventos">
                        +{eventosDia.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Eventos del Día */}
      {showEventosModal && selectedDate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                Eventos del {selectedDate.toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowEventosModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {eventosDelDiaSeleccionado.length === 0 ? (
                <div className="empty-state">
                  <p>No hay eventos programados para este día</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventosDelDiaSeleccionado.map(evento => (
                    <div key={evento.idCalendario} className="card">
                      <div className="card-header">
                        <div className="flex items-center justify-between">
                          <h4 className="card-title">{evento.titulo}</h4>
                          <span 
                            className="badge"
                            style={{ backgroundColor: getColorEvento(evento.tipoEvento) }}
                          >
                            {evento.tipoEvento}
                          </span>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-muted">Cliente:</span>
                            <span>{getNombreCliente(evento.idCliente)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted">Ubicación:</span>
                            <span>
                              {evento.idUbicacion ? getNombreUbicacion(evento.idUbicacion) : 'No asignada'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted">Horario:</span>
                            <span>
                              {new Date(evento.fechaInicio).toLocaleTimeString('es-CL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(evento.fechaFin).toLocaleTimeString('es-CL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          {evento.descripcion && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted">Descripción:</span>
                              <span>{evento.descripcion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card-footer">
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => abrirEditarEvento(evento)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminarEvento(evento.idCalendario)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEventosModal(false)}
              >
                Cerrar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => abrirNuevoEvento(selectedDate)}
              >
                + Agregar Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Nuevo Evento */}
      {showNuevoEventoModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Nuevo Evento</h3>
              <button 
                className="close-btn"
                onClick={() => setShowNuevoEventoModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  className="input"
                  value={nuevoEvento.titulo}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                  placeholder="Título del evento"
                />
              </div>
              
              <div className="form-group">
                <label>Cliente:</label>
                <select
                  className="input"
                  value={nuevoEvento.idCliente}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, idCliente: parseInt(e.target.value), idUbicacion: 0})}
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
                <label>Ubicación:</label>
                <select
                  className="input"
                  value={nuevoEvento.idUbicacion}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, idUbicacion: parseInt(e.target.value)})}
                  disabled={!nuevoEvento.idCliente || loadingUbicaciones}
                >
                  <option value={0}>
                    {!nuevoEvento.idCliente ? 'Seleccione un cliente primero' : 
                     loadingUbicaciones ? 'Cargando ubicaciones...' :
                     ubicaciones.length === 0 ? 'No hay ubicaciones para este cliente' : 
                     'Seleccionar ubicación'}
                  </option>
                  {ubicaciones.map(ubicacion => (
                    <option key={ubicacion.idUbicacion} value={ubicacion.idUbicacion}>
                      {ubicacion.nombre} - {ubicacion.calle} {ubicacion.numero}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Evento:</label>
                <select
                  className="input"
                  value={nuevoEvento.tipoEvento}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, tipoEvento: e.target.value})}
                >
                  <option value="MANTENCION">Mantención</option>
                  <option value="REPARACION">Reparación</option>
                  <option value="EMERGENCIA">Emergencia</option>
                  <option value="INSTALACION">Instalación</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Fecha y Hora Inicio:</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={nuevoEvento.fechaInicio}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, fechaInicio: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Fecha y Hora Fin:</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={nuevoEvento.fechaFin}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, fechaFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  className="input"
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
                onClick={() => setShowNuevoEventoModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCrearEvento}
                disabled={!nuevoEvento.titulo || !nuevoEvento.idCliente || !nuevoEvento.idUbicacion || !nuevoEvento.fechaInicio}
              >
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Evento */}
      {showEditarEventoModal && eventoEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar Evento</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditarEventoModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  className="input"
                  value={eventoEditando.titulo}
                  onChange={(e) => setEventoEditando({...eventoEditando, titulo: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Cliente:</label>
                <select
                  className="input"
                  value={eventoEditando.idCliente}
                  onChange={(e) => setEventoEditando({...eventoEditando, idCliente: parseInt(e.target.value), idUbicacion: 0})}
                >
                  {clientes.map(cliente => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nombre1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ubicación:</label>
                <select
                  className="input"
                  value={eventoEditando.idUbicacion}
                  onChange={(e) => setEventoEditando({...eventoEditando, idUbicacion: parseInt(e.target.value)})}
                  disabled={loadingUbicaciones}
                >
                  <option value={0}>
                    {loadingUbicaciones ? 'Cargando ubicaciones...' : 
                     ubicaciones.length === 0 ? 'No hay ubicaciones para este cliente' : 'Seleccionar ubicación'}
                  </option>
                  {ubicaciones.map(ubicacion => (
                    <option key={ubicacion.idUbicacion} value={ubicacion.idUbicacion}>
                      {ubicacion.nombre} - {ubicacion.calle} {ubicacion.numero}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Evento:</label>
                <select
                  className="input"
                  value={eventoEditando.tipoEvento}
                  onChange={(e) => setEventoEditando({...eventoEditando, tipoEvento: e.target.value})}
                >
                  <option value="MANTENCION">Mantención</option>
                  <option value="REPARACION">Reparación</option>
                  <option value="EMERGENCIA">Emergencia</option>
                  <option value="INSTALACION">Instalación</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Fecha y Hora Inicio:</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={eventoEditando.fechaInicio.slice(0, 16)}
                    onChange={(e) => setEventoEditando({...eventoEditando, fechaInicio: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Fecha y Hora Fin:</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={eventoEditando.fechaFin.slice(0, 16)}
                    onChange={(e) => setEventoEditando({...eventoEditando, fechaFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  className="input"
                  value={eventoEditando.descripcion}
                  onChange={(e) => setEventoEditando({...eventoEditando, descripcion: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Estado:</label>
                <select
                  className="input"
                  value={eventoEditando.estado}
                  onChange={(e) => setEventoEditando({...eventoEditando, estado: e.target.value})}
                >
                  <option value="PROGRAMADO">Programado</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditarEventoModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleEliminarEvento(eventoEditando.idCalendario)}
              >
                Eliminar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEditarEvento}
                disabled={!eventoEditando.titulo || !eventoEditando.idCliente || !eventoEditando.idUbicacion || !eventoEditando.fechaInicio}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioView;