// src/pages/tecnicos/views/FormularioReparacion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { calendarioService, EventoCalendario } from '../../../services/calendario.service';
import { ordenesService } from '../../../services/ordenes.service';
import SignatureCanvas from '../../../components/SignatureCanvas';

const FormularioReparacion: React.FC = () => {
  const { idEvento } = useParams<{ idEvento: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const esEmergencia = searchParams.get('emergencia') === 'true';
  
  const [evento, setEvento] = useState<EventoCalendario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firmaCliente, setFirmaCliente] = useState<string>('');
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    progreso: 'EN_GESTION' as 'REALIZADO' | 'NO_REALIZADO' | 'EN_GESTION',
    diagnostico: '',
    materialesUtilizados: '',
    tiempoTrabajo: ''
  });

  useEffect(() => {
    if (idEvento) {
      cargarEvento();
    }
    cargarUsuarioLogueado();
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

  const cargarUsuarioLogueado = () => {
    try {
      console.log('🔍 Buscando usuario logueado...');
      
      // Buscar en TODAS las posibles keys del localStorage
      const possibleKeys = ['user', 'currentUser', 'usuario', 'auth', 'authState', 'userData', 'userInfo'];
      let userFound = null;
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            console.log(`🔍 Encontrado en ${key}:`, parsed);
            userFound = parsed;
            break;
          } catch (e) {
            console.log(`🔍 ${key} no es JSON válido`);
          }
        }
      }
      
      if (userFound) {
        setUsuarioLogueado(userFound);
        
        // Buscar el ID en diferentes campos posibles
        const idTecnico = userFound.idUsuario || userFound.id || userFound.usuarioId || 
                          userFound.userId || userFound.technicianId || userFound.tecnicoId;
        
        console.log('🔍 ID encontrado:', idTecnico);
        console.log('🔍 Todos los campos del usuario:', Object.keys(userFound));
        
      } else {
        console.warn('⚠️ No se encontró usuario en ninguna key del localStorage');
        console.warn('⚠️ Keys disponibles:', Object.keys(localStorage));
      }
      
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFirmaSave = (signatureData: string) => {
    setFirmaCliente(signatureData);
  };

  const handleFirmaClear = () => {
    setFirmaCliente('');
  };

  const handleGuardar = async () => {
    if (!evento) return;
    
    if (!firmaCliente) {
      alert('Por favor capture la firma del cliente antes de guardar');
      return;
    }
    
    try {
      setSaving(true);
      
      // OBTENER EL ID DEL TÉCNICO LOGUEADO CON MÚLTIPLES INTENTOS
      let idTecnicoLogueado = null;
      
      if (usuarioLogueado) {
        // Buscar en diferentes campos posibles
        idTecnicoLogueado = usuarioLogueado.idUsuario || 
                           usuarioLogueado.id || 
                           usuarioLogueado.usuarioId ||
                           usuarioLogueado.userId ||
                           usuarioLogueado.technicianId;
      }
      
      // Si no encontramos, buscar directamente en localStorage
      if (!idTecnicoLogueado) {
        console.log('🔍 Buscando ID directamente en localStorage...');
        const userData = localStorage.getItem('user') || localStorage.getItem('currentUser');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            idTecnicoLogueado = user.idUsuario || user.id;
          } catch (e) {
            console.error('Error parseando user data:', e);
          }
        }
      }
      
      // Si aún no encontramos, usar un valor por defecto TEMPORAL
      if (!idTecnicoLogueado) {
        console.warn('⚠️ No se pudo obtener ID del técnico, usando valor temporal');
        idTecnicoLogueado = 2; // Valor temporal para testing
      }
      
      console.log('🔰 ID Técnico final:', idTecnicoLogueado);
      console.log('🔰 IDs del evento - Motor:', evento.idEquipo, 'Cliente:', evento.idCliente, 'Ubicacion:', evento.idUbicacion);
      
      // USAR LOS IDs CORRECTOS:
      // - Cliente, Ubicación, Motor: Del evento (creado por admin)
      // - Técnico: Del usuario logueado (el que hace el formulario)
      const datosReparacion = {
        idMotor: evento.idEquipo || 3,           // ← Del evento (con fallback)
        idTecnico: idTecnicoLogueado,            // ← Del usuario logueado
        idCliente: evento.idCliente || 1,        // ← Del evento (con fallback)
        idUbicacion: evento.idUbicacion || 4,    // ← Del evento (con fallback)
        fecha: new Date().toISOString(),
        observaciones: `${formData.diagnostico}\n\nTrabajo realizado: ${formData.observaciones}\nMateriales: ${formData.materialesUtilizados}\nTiempo: ${formData.tiempoTrabajo}`,
        progreso: formData.progreso,
        firmaCliente: firmaCliente
      };

      console.log('🔴🔴🔰 Datos finales a enviar:', datosReparacion);

      // Crear la orden de reparación
      const ordenReparacion = await ordenesService.createReparacion(datosReparacion);
      console.log('🟢🟢🟢 RESPUESTA EXITOSA:', ordenReparacion);

      // Actualizar evento según el progreso
      const nuevoEstado = formData.progreso === 'REALIZADO' ? 'COMPLETADO' : 'EN_PROCESO';
      await calendarioService.updateEvento(evento.idCalendario, {
        estado: nuevoEstado,
        idOrdenReparacion: ordenReparacion.idOrdenReparacion
      });

      navigate('/tecnico?mensaje=reparacion_guardada');

    } catch (error) {
      console.error('🔴🔴🔴 Error guardando reparación:', error);
      alert('Error al guardar la reparación: ' + error.message);
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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/tecnico')}
                className="btn btn-ghost p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">←</span>
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {esEmergencia ? '🚨 Emergencia' : '🔧 Reparación'}
                </h1>
                <p className="text-xs text-gray-600">{evento.titulo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`badge ${esEmergencia ? 'badge-danger' : 'badge-warning'}`}>
                {esEmergencia ? 'URGENTE' : 'REPARACIÓN'}
              </div>
              <div className="text-xs text-gray-500">
                Técnico: {usuarioLogueado ? (usuarioLogueado.nombre || usuarioLogueado.username || 'Usuario') : 'No identificado'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Información del Evento */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📋 Información del Servicio</h2>
          </div>
          <div className="card-content space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">#{evento.idCliente}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equipo:</span>
              <span className="font-medium">#{evento.idEquipo || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ubicación:</span>
              <span className="font-medium">#{evento.idUbicacion || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Técnico asignado:</span>
              <span className="font-medium">
                {usuarioLogueado ? (usuarioLogueado.nombre || usuarioLogueado.username || 'Usuario') : 'No identificado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prioridad:</span>
              <span className="font-medium">{esEmergencia ? 'ALTA' : 'MEDIA'}</span>
            </div>
          </div>
        </div>

        {/* Formulario de Reparación */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🔧 Datos de la Reparación</h2>
          </div>
          <div className="card-content space-y-4">
            {/* Estado del Progreso */}
            <div className="form-group">
              <label className="form-label">Estado de la Reparación *</label>
              <div className="switch-tres-opciones">
                <input 
                  type="radio" 
                  id="en_gestion" 
                  name="estado_reparacion" 
                  value="EN_GESTION"
                  checked={formData.progreso === 'EN_GESTION'}
                  onChange={(e) => handleInputChange('progreso', e.target.value)}
                />
                <label htmlFor="en_gestion" className="switch-option">
                  <span className="switch-indicator"></span>
                  <span className="switch-text">En Gestión</span>
                </label>

                <input 
                  type="radio" 
                  id="realizado" 
                  name="estado_reparacion" 
                  value="REALIZADO"
                  checked={formData.progreso === 'REALIZADO'}
                  onChange={(e) => handleInputChange('progreso', e.target.value)}
                />
                <label htmlFor="realizado" className="switch-option">
                  <span className="switch-indicator"></span>
                  <span className="switch-text">Realizado</span>
                </label>

                <input 
                  type="radio" 
                  id="no_realizado" 
                  name="estado_reparacion" 
                  value="NO_REALIZADO"
                  checked={formData.progreso === 'NO_REALIZADO'}
                  onChange={(e) => handleInputChange('progreso', e.target.value)}
                />
                <label htmlFor="no_realizado" className="switch-option">
                  <span className="switch-indicator"></span>
                  <span className="switch-text">No Realizado</span>
                </label>
                
                <div className="switch-slider"></div>
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="form-group">
              <label className="form-label">Diagnóstico *</label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                rows={3}
                placeholder="Describa el problema encontrado..."
                className="form-input"
              />
            </div>

            {/* Trabajo Realizado */}
            <div className="form-group">
              <label className="form-label">Trabajo Realizado *</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Describa el trabajo de reparación realizado..."
                className="form-input"
              />
            </div>

            {/* Materiales Utilizados */}
            <div className="form-group">
              <label className="form-label">Materiales Utilizados</label>
              <textarea
                value={formData.materialesUtilizados}
                onChange={(e) => handleInputChange('materialesUtilizados', e.target.value)}
                rows={2}
                placeholder="Lista de materiales, repuestos utilizados..."
                className="form-input"
              />
            </div>

            {/* Tiempo de Trabajo */}
            <div className="form-group">
              <label className="form-label">Tiempo de Trabajo</label>
              <input
                type="text"
                value={formData.tiempoTrabajo}
                onChange={(e) => handleInputChange('tiempoTrabajo', e.target.value)}
                placeholder="Ej: 2 horas 30 minutos"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Información Adicional para Emergencias */}
        {esEmergencia && (
          <div className="card border-l-4 border-l-red-500">
            <div className="card-header bg-red-50">
              <h2 className="card-title text-red-800">⚠️ Reparación de Emergencia</h2>
            </div>
            <div className="card-content">
              <p className="text-sm text-red-700">
                Esta reparación fue marcada como emergencia. Asegúrese de documentar 
                completamente la situación y las acciones tomadas.
              </p>
            </div>
          </div>
        )}

        {/* FIRMA DEL CLIENTE - AL FINAL */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">✍️ Firma del Cliente *</h2>
          </div>
          <div className="card-content">
            <SignatureCanvas 
              onSave={handleFirmaSave}
              onClear={handleFirmaClear}
            />
            {firmaCliente && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">✅ Firma capturada correctamente</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Botones Fijos Abajo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate('/tecnico')}
            className="btn btn-outline flex-1 py-3"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleGuardar}
            disabled={saving || !formData.diagnostico || !formData.observaciones || !firmaCliente}
            className="btn btn-primary flex-1 py-3"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="spinner-small"></div>
                Guardando...
              </span>
            ) : (
              'Guardar Reparación'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioReparacion;