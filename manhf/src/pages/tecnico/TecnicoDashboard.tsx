// src/pages/tecnicos/views/TecnicoDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { calendarioService, type EventoCalendario } from '../../services/calendario.service';

interface TecnicoDashboardProps {
  onViewChange?: (view: string) => void;
}

const TecnicoDashboard: React.FC<TecnicoDashboardProps> = ({ onViewChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [eventosHoy, setEventosHoy] = useState<EventoCalendario[]>([]);
  const [eventosSemana, setEventosSemana] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana'>('hoy');

  useEffect(() => {
    console.log('🔧 TECNICO DASHBOARD INICIADO');
    console.log('👤 USUARIO CONTEXT:', user);
    cargarEventosTecnico();
  }, []);

  const cargarEventosTecnico = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando eventos...');
      
      // Cargar eventos
      const eventos = await calendarioService.getEventos();
      console.log('📅 EVENTOS CARGADOS:', eventos);
      
      if (!eventos || eventos.length === 0) {
        console.log('❌ NO HAY EVENTOS');
        setEventosHoy([]);
        setEventosSemana([]);
        return;
      }

      const hoy = new Date().toISOString().split('T')[0];
      console.log('📆 HOY ES:', hoy);

      // 🎯 FILTRO PARA EVENTOS DE HOY
      const eventosDeHoy = eventos.filter(evento => {
        if (!evento.fechaInicio) {
          console.log('❌ Evento sin fecha:', evento.idCalendario);
          return false;
        }
        
        const fechaEvento = evento.fechaInicio.split('T')[0];
        const esHoy = fechaEvento === hoy;
        
        // Estados válidos: PROGRAMADO, EN_PROCESO, COMPLETADO
        const estadoValido = evento.estado === 'PROGRAMADO' || 
                            evento.estado === 'EN_PROCESO' || 
                            evento.estado === 'COMPLETADO';
        
        // Técnico válido: sin técnico o asignado al usuario actual
        const tecnicoValido = !evento.idTecnico || evento.idTecnico === user?.idUsuario;
        
        const pasaFiltro = esHoy && estadoValido && tecnicoValido;
        
        if (pasaFiltro) {
          console.log(`✅ INCLUIDO HOY: ${evento.titulo} (${evento.estado})`);
        }
        
        return pasaFiltro;
      });

      // 🎯 FILTRO PARA EVENTOS DE LA SEMANA (EXCLUYENDO LOS DE HOY)
      const eventosDeLaSemana = eventos.filter(evento => {
        if (!evento.fechaInicio) return false;
        
        const fechaEvento = new Date(evento.fechaInicio);
        const hoyObj = new Date();
        const finDeSemana = new Date();
        finDeSemana.setDate(hoyObj.getDate() + 7);
        
        // Excluir eventos de hoy
        const fechaEventoStr = evento.fechaInicio.split('T')[0];
        const esHoy = fechaEventoStr === hoy;
        
        const enSemana = fechaEvento >= hoyObj && fechaEvento <= finDeSemana && !esHoy;
        
        // Estados válidos
        const estadoValido = evento.estado === 'PROGRAMADO' || 
                            evento.estado === 'EN_PROCESO' || 
                            evento.estado === 'COMPLETADO';
        
        // Técnico válido
        const tecnicoValido = !evento.idTecnico || evento.idTecnico === user?.idUsuario;
        
        const pasaFiltro = enSemana && estadoValido && tecnicoValido;
        
        if (pasaFiltro) {
          console.log(`✅ INCLUIDO SEMANA: ${evento.titulo} (${fechaEventoStr})`);
        }
        
        return pasaFiltro;
      });

      console.log('📊 RESULTADOS FILTRADO:');
      console.log('📍 Eventos de hoy:', eventosDeHoy.length);
      console.log('📅 Eventos de la semana:', eventosDeLaSemana.length);
      
      setEventosHoy(eventosDeHoy);
      setEventosSemana(eventosDeLaSemana);
      
    } catch (error) {
      console.error('❌ ERROR CARGANDO EVENTOS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTomarEvento = async (evento: EventoCalendario) => {
    try {
      console.log('🎯 Tomando evento:', evento);
      
      // Marcar evento como tomado por el técnico usando calendarioService
      await calendarioService.updateEvento(evento.idCalendario, {
        estado: 'EN_PROCESO',
        idTecnico: user?.idUsuario
      });

      // Navegar al formulario correspondiente
      if (evento.tipoEvento === 'MANTENCION') {
        navigate(`/tecnico/mantencion/${evento.idCalendario}`);
      } else if (evento.tipoEvento === 'REPARACION') {
        navigate(`/tecnico/reparacion/${evento.idCalendario}`);
      } else if (evento.tipoEvento === 'EMERGENCIA') {
        navigate(`/tecnico/reparacion/${evento.idCalendario}?emergencia=true`);
      } else if (evento.tipoEvento === 'INSTALACION') {
        navigate(`/tecnico/mantencion/${evento.idCalendario}`);
      }
      
      // Recargar eventos
      cargarEventosTecnico();
    } catch (error) {
      console.error('❌ Error tomando evento:', error);
      alert('Error al tomar el evento: ' + error.message);
    }
  };

  const handleNavigation = (view: string) => {
    // Usar navigate para cambiar de vista
    switch (view) {
      case 'mantenciones':
        navigate('/tecnico/mantenciones/nueva');
        break;
      case 'reparaciones':
        navigate('/tecnico/reparaciones/nueva');
        break;
      case 'historial':
        navigate('/tecnico/historico');
        break;
      default:
        // Para otras vistas, usar onViewChange si existe
        if (onViewChange) {
          onViewChange(view);
        }
    }
  };

  // Calcular estadísticas
  const eventosCompletados = eventosSemana.filter(e => e.estado === 'COMPLETADO').length;
  const totalEventos = eventosHoy.length + eventosSemana.length;
  const eficiencia = totalEventos > 0 ? Math.round((eventosCompletados / totalEventos) * 100) : 0;

  return (
    <div className="tecnico-dashboard">
      <div className="px-6 py-6">
        
        {/* Header de Bienvenida */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            👋 Hola, {user?.nombre || 'Técnico'}
          </h1>
          <p className="text-gray-600">
            Aquí tienes tus tareas programadas para hoy y la semana
          </p>
          <button 
            onClick={cargarEventosTecnico}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            🔄 Recargar Eventos
          </button>
        </div>

        {/* Tarjetas de Acceso Rápido */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleNavigation('mantenciones')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 text-left"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 text-xl">🛠️</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Nueva Mantención</h3>
                  <p className="text-sm text-gray-600">Crear orden de mantención</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleNavigation('reparaciones')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 text-left"
            >
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <span className="text-orange-600 text-xl">🔧</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Nueva Reparación</h3>
                  <p className="text-sm text-gray-600">Crear orden de reparación</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleNavigation('historial')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 text-left"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Mi Historial</h3>
                  <p className="text-sm text-gray-600">Ver trabajos anteriores</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Navegación por Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'hoy' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('hoy')}
            >
              📅 Hoy ({eventosHoy.length})
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'semana' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('semana')}
            >
              📋 Próxima Semana ({eventosSemana.length})
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-2">Cargando eventos...</p>
              </div>
            ) : activeTab === 'hoy' ? (
              <EventosList 
                eventos={eventosHoy}
                onTomarEvento={handleTomarEvento}
                tipo="hoy"
              />
            ) : (
              <EventosList 
                eventos={eventosSemana}
                onTomarEvento={handleTomarEvento}
                tipo="semana"
              />
            )}
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-600">{eventosHoy.length}</div>
            <div className="text-sm text-gray-600">Para Hoy</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600">
              {eventosCompletados}
            </div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-orange-600">{eventosSemana.length}</div>
            <div className="text-sm text-gray-600">Próxima Semana</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-600">
              {eficiencia}%
            </div>
            <div className="text-sm text-gray-600">Eficiencia</div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Componente para lista de eventos
const EventosList: React.FC<{
  eventos: EventoCalendario[];
  onTomarEvento: (evento: EventoCalendario) => void;
  tipo: 'hoy' | 'semana';
}> = ({ eventos, onTomarEvento, tipo }) => {
  const getColorTipoEvento = (tipo: string) => {
    switch (tipo) {
      case 'MANTENCION': return 'bg-blue-500';
      case 'REPARACION': return 'bg-orange-500';
      case 'EMERGENCIA': return 'bg-red-500';
      case 'INSTALACION': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconoTipoEvento = (tipo: string) => {
    switch (tipo) {
      case 'MANTENCION': return '🛠️';
      case 'REPARACION': return '🔧';
      case 'EMERGENCIA': return '🚨';
      case 'INSTALACION': return '📦';
      default: return '📋';
    }
  };

  const formatHora = (fechaString: string) => {
    return new Date(fechaString).toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);
    
    if (fecha.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (fecha.toDateString() === manana.toDateString()) {
      return 'Mañana';
    } else {
      return fecha.toLocaleDateString('es-CL', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  if (eventos.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-2">
          {tipo === 'hoy' ? '📭' : '📅'}
        </span>
        <p className="text-gray-500">
          {tipo === 'hoy' 
            ? 'No hay eventos para hoy' 
            : 'No hay eventos para la próxima semana'
          }
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {tipo === 'hoy' 
            ? 'Los eventos se mostrarán aquí si están programados para hoy'
            : 'Los eventos de los próximos 7 días aparecerán aquí'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {eventos.map((evento) => (
        <div 
          key={evento.idCalendario} 
          className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className={`w-2 h-2 rounded-full mr-2 ${getColorTipoEvento(evento.tipoEvento)}`}></span>
                <span className="text-sm font-medium text-gray-900">
                  {getIconoTipoEvento(evento.tipoEvento)} {evento.tipoEvento}
                </span>
                {evento.fechaInicio && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tipo === 'semana' ? (
                      `${formatFecha(evento.fechaInicio)} • ${formatHora(evento.fechaInicio)}`
                    ) : (
                      formatHora(evento.fechaInicio)
                    )}
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">
                {evento.titulo}
              </h3>
              
              {evento.descripcion && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {evento.descripcion}
                </p>
              )}
              
              <div className="flex items-center text-sm text-gray-500">
                <span>📍 Cliente #{evento.idCliente}</span>
                {evento.idEquipo && (
                  <span className="ml-3">⚙️ Equipo #{evento.idEquipo}</span>
                )}
                {evento.idTecnico && (
                  <span className="ml-3">👤 Técnico #{evento.idTecnico}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className={`text-xs px-2 py-1 rounded ${
              evento.estado === 'PROGRAMADO' ? 'bg-yellow-100 text-yellow-800' :
              evento.estado === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
              evento.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {evento.estado?.replace('_', ' ') || 'Sin estado'}
            </span>
            
            {(evento.estado === 'PROGRAMADO' || !evento.estado) && (
              <button
                onClick={() => onTomarEvento(evento)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Tomar Tarea
              </button>
            )}
            
            {evento.estado === 'EN_PROCESO' && (
              <button
                onClick={() => onTomarEvento(evento)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TecnicoDashboard;