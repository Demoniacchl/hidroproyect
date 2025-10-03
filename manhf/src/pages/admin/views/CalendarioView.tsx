import React, { useState, useEffect } from 'react';
import { calendarioService } from '../../../services/calendario.service';
import { clientesService } from '../../../services/clientes.service';

interface EventoCalendario {
  id: number;
  idCliente: number;
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventosModal, setShowEventosModal] = useState(false);
  const [showNuevoEventoModal, setShowNuevoEventoModal] = useState(false);
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

  const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SAB', 'DOM'];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    cargarDatos();
  }, [currentDate]);

  const cargarDatos = async () => {
    try {
      const [clientesData, eventosData] = await Promise.all([
        clientesService.getClientes(0, 100),
        calendarioService.getEventos()
      ]);
      
      setClientes(clientesData.content || []);
      setEventos(eventosData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  // Función para verificar año bisiesto
  const esBisiesto = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  // Días por mes (considerando años bisiestos)
  const getDiasEnMes = (year: number, month: number): number => {
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    if (month === 1 && esBisiesto(year)) { // Febrero (mes 1) en año bisiesto
      return 29;
    }
    
    return diasPorMes[month];
  };

  // Generar días del mes con manejo correcto de fechas
  const generarDiasDelMes = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month, getDiasEnMes(year, month));
    const primerDiaSemana = primerDia.getDay(); // 0 = Domingo
    
    const dias = [];

    // Días del mes anterior (para completar primera semana)
    const diasMesAnterior = getDiasEnMes(
      month === 0 ? year - 1 : year, // Si es enero, año anterior
      month === 0 ? 11 : month - 1   // Si es enero, diciembre
    );

    for (let i = primerDiaSemana -2; i >= 0; i--) {
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

    // Días del mes siguiente (para completar última semana)
    const diasFaltantes = 42 - dias.length; // 6 semanas * 7 días
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
      await calendarioService.createEvento(nuevoEvento);
      setShowNuevoEventoModal(false);
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
      cargarDatos();
    } catch (error) {
      console.error('Error creando evento:', error);
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

  const eventosDelDiaSeleccionado = selectedDate ? getEventosDelDia(selectedDate) : [];

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
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
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#28a745]"></div>
            <span>Mantención</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#dc3545]"></div>
            <span>Reparación</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffc107]"></div>
            <span>Emergencia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#17a2b8]"></div>
            <span>Instalación</span>
          </div>
        </div>
      </div>

      {/* Grid del Calendario */}
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
          {generarDiasDelMes().map(({ fecha, esMesActual, eventos }, index) => {
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
                  {eventos.slice(0, 3).map((evento, idx) => (
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
                  {eventos.length > 3 && (
                    <div className="calendario-mas-eventos">
                      +{eventos.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                    <div key={evento.id} className="card">
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
                            <span>
                              {clientes.find(c => c.idCliente === evento.idCliente)?.nombre1 || `Cliente #${evento.idCliente}`}
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