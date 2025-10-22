// src/pages/tecnicos/views/FormularioReparacion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { calendarioService, EventoCalendario } from '../../../services/calendario.service';
import { ordenesService } from '../../../services/ordenes.service';

const FormularioReparacion: React.FC = () => {
  const { idEvento } = useParams<{ idEvento: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const esEmergencia = searchParams.get('emergencia') === 'true';
  
  const [evento, setEvento] = useState<EventoCalendario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    progreso: 'EN_GESTION' as 'REALIZADO' | 'NO_REALIZADO' | 'EN_GESTION',
    firmaCliente: '',
    diagnostico: '',
    materialesUtilizados: '',
    tiempoTrabajo: ''
  });

  useEffect(() => {
    if (idEvento) {
      cargarEvento();
    }
  }, [idEvento]);

  const cargarEvento = async () => {
    try {
      setLoading(true);
      const eventoData = await calendarioService.getEvento(Number(idEvento));
      setEvento(eventoData);
      
      // Pre-cargar descripción del evento en observaciones
      if (eventoData.descripcion) {
        setFormData(prev => ({
          ...prev,
          observaciones: eventoData.descripcion,
          diagnostico: eventoData.descripcion
        }));
      }
    } catch (error) {
      console.error('Error cargando evento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    if (!evento) return;
    
    try {
      setSaving(true);
      
      // Crear la orden de reparación
      const ordenReparacion = await ordenesService.createReparacion({
        idMotor: evento.idEquipo || 0,
        idTecnico: evento.idTecnico || 0,
        idCliente: evento.idCliente,
        idUbicacion: 0, // Esto debería venir del evento o buscarse
        fecha: `${formData.fecha}T12:00:00`, // Usar fecha actual
        observaciones: formData.observaciones,
        progreso: formData.progreso,
        firmaCliente: formData.firmaCliente
      });

      // Actualizar evento según el progreso
      const nuevoEstado = formData.progreso === 'REALIZADO' ? 'COMPLETADO' : 'EN_PROCESO';
      await calendarioService.updateEvento(evento.idCalendario, {
        estado: nuevoEstado,
        idOrdenReparacion: ordenReparacion.idOrdenReparacion
      });

      // Si está completado, crear solicitud de revisión
      if (formData.progreso === 'REALIZADO') {
        // await solicitudesService.crearSolicitudRevisión(...);
      }

      navigate('/tecnico?mensaje=reparacion_guardada');

    } catch (error) {
      console.error('Error guardando reparación:', error);
      alert('Error al guardar la reparación');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4">❌</span>
          <h2 className="text-xl font-semibold text-gray-900">Evento no encontrado</h2>
          <button 
            onClick={() => navigate('/tecnico')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/tecnico')}
                className="mr-3 text-gray-600"
              >
                ←
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {esEmergencia ? '🚨 Emergencia' : '🔧 Reparación'}
                </h1>
                <p className="text-xs text-gray-600">{evento.titulo}</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              esEmergencia ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {esEmergencia ? 'URGENTE' : 'REPARACIÓN'}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Información del Evento */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-2">Información del Servicio</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">#{evento.idCliente}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equipo:</span>
              <span className="font-medium">#{evento.idEquipo || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prioridad:</span>
              <span className="font-medium">{esEmergencia ? 'ALTA' : 'MEDIA'}</span>
            </div>
          </div>
        </div>

        {/* Formulario de Reparación */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Datos de la Reparación</h2>
          
          <div className="space-y-4">
            {/* Estado del Progreso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de la Reparación *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'EN_GESTION', label: 'En Gestión', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'REALIZADO', label: 'Realizado', color: 'bg-green-100 text-green-800' },
                  { value: 'NO_REALIZADO', label: 'No Realizado', color: 'bg-red-100 text-red-800' }
                ].map((opcion) => (
                  <button
                    key={opcion.value}
                    onClick={() => handleInputChange('progreso', opcion.value)}
                    className={`p-3 rounded-lg border text-center text-sm font-medium ${
                      formData.progreso === opcion.value
                        ? `${opcion.color} border-current`
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {opcion.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnóstico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico *
              </label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                rows={3}
                placeholder="Describa el problema encontrado..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Trabajo Realizado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trabajo Realizado *
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Describa el trabajo de reparación realizado..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Materiales Utilizados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materiales Utilizados
              </label>
              <textarea
                value={formData.materialesUtilizados}
                onChange={(e) => handleInputChange('materialesUtilizados', e.target.value)}
                rows={2}
                placeholder="Lista de materiales, repuestos utilizados..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tiempo de Trabajo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Trabajo
              </label>
              <input
                type="text"
                value={formData.tiempoTrabajo}
                onChange={(e) => handleInputChange('tiempoTrabajo', e.target.value)}
                placeholder="Ej: 2 horas 30 minutos"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Firma del Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firma del Cliente
              </label>
              <input
                type="text"
                value={formData.firmaCliente}
                onChange={(e) => handleInputChange('firmaCliente', e.target.value)}
                placeholder="Nombre y apellido del cliente"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Información Adicional para Emergencias */}
        {esEmergencia && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <span className="text-red-600 text-lg mr-2">⚠️</span>
              <h3 className="font-semibold text-red-800">Reparación de Emergencia</h3>
            </div>
            <p className="text-sm text-red-700">
              Esta reparación fue marcada como emergencia. Asegúrese de documentar 
              completamente la situación y las acciones tomadas.
            </p>
          </div>
        )}
      </main>

      {/* Botones Fijos Abajo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/tecnico')}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleGuardar}
            disabled={saving || !formData.diagnostico || !formData.observaciones}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Reparación'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioReparacion;