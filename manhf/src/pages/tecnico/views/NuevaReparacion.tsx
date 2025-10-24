// src/pages/tecnicos/views/NuevaReparacion.tsx (Actualizado)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calendarioService } from '../../../services/calendario.service';
import { ordenesService } from '../../../services/ordenes.service';
import SignatureCanvas from '../../../components/SignatureCanvas';

const NuevaReparacion: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [firmaCliente, setFirmaCliente] = useState<string>('');
  
  const [formData, setFormData] = useState({
    // Información básica
    idCliente: '',
    idEquipo: '',
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    
    // Datos de reparación
    observaciones: '',
    progreso: 'REALIZADO' as 'REALIZADO' | 'NO_REALIZADO' | 'EN_GESTION',
    diagnostico: '',
    materialesUtilizados: '',
    tiempoTrabajo: '',
    esEmergencia: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
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

  const handleSubmit = async () => {
    if (!formData.idCliente || !formData.titulo || !formData.diagnostico) {
      alert('Por favor complete cliente, título y diagnóstico');
      return;
    }

    if (!firmaCliente) {
      alert('Por favor capture la firma del cliente');
      return;
    }

    try {
      setLoading(true);

      // 1. Crear evento en calendario
      const fechaInicio = `${formData.fecha}T09:00:00`;
      const fechaFin = `${formData.fecha}T11:00:00`;

      const nuevoEvento = await calendarioService.createEvento({
        idCliente: parseInt(formData.idCliente),
        idEquipo: formData.idEquipo ? parseInt(formData.idEquipo) : null,
        idTecnico: user?.idUsuario || null,
        tipoEvento: formData.esEmergencia ? 'EMERGENCIA' : 'REPARACION',
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado: formData.progreso === 'REALIZADO' ? 'COMPLETADO' : 'EN_PROCESO'
      });

      // 2. Crear orden de reparación
      await ordenesService.createReparacion({
        idMotor: formData.idEquipo ? parseInt(formData.idEquipo) : 0,
        idTecnico: user?.idUsuario || 0,
        idCliente: parseInt(formData.idCliente),
        idUbicacion: 0,
        fecha: `${formData.fecha}T12:00:00`,
        observaciones: `${formData.diagnostico}\n\nTrabajo realizado: ${formData.observaciones}\nMateriales: ${formData.materialesUtilizados}\nTiempo: ${formData.tiempoTrabajo}`,
        progreso: formData.progreso,
        firmaCliente: firmaCliente // Usar la firma digital
      });

      navigate('/tecnico?mensaje=reparacion_creada');

    } catch (error) {
      console.error('Error creando reparación:', error);
      alert('Error al crear la reparación');
    } finally {
      setLoading(false);
    }
  };

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
                  {formData.esEmergencia ? '🚨 ORDEN DE EMERGENCIA' : '🔧 ORDEN DE REPARACIÓN'}
                </h1>
                <p className="text-xs text-gray-600">
                  {formData.esEmergencia ? 'Reparación de emergencia' : 'Reparación manual'}
                </p>
              </div>
            </div>
            <div className={`badge ${formData.esEmergencia ? 'badge-danger' : 'badge-warning'}`}>
              {formData.esEmergencia ? 'URGENTE' : 'REPARACIÓN'}
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Información Básica */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📋 Información Básica</h2>
          </div>
          <div className="card-content space-y-4">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ID Cliente *</label>
                <input
                  type="number"
                  value={formData.idCliente}
                  onChange={(e) => handleInputChange('idCliente', e.target.value)}
                  placeholder="Ej: 123"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ID Equipo</label>
                <input
                  type="number"
                  value={formData.idEquipo}
                  onChange={(e) => handleInputChange('idEquipo', e.target.value)}
                  placeholder="Opcional"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Ej: Reparación de bomba principal"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={2}
                placeholder="Describa el problema a reparar..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.esEmergencia}
                  onChange={(e) => handleInputChange('esEmergencia', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Marcar como emergencia</span>
              </label>
            </div>
          </div>
        </div>

        {/* Datos de la Reparación */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🔧 Datos de la Reparación</h2>
          </div>
          <div className="card-content space-y-4">
            {/* Estado del Progreso */}
            <div className="form-group">
              <label className="form-label">Estado de la Reparación *</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'EN_GESTION', label: 'En Gestión', color: 'bg-yellow-500' },
                  { value: 'REALIZADO', label: 'Realizado', color: 'bg-green-500' },
                  { value: 'NO_REALIZADO', label: 'No Realizado', color: 'bg-red-500' }
                ].map((opcion) => (
                  <button
                    key={opcion.value}
                    type="button"
                    onClick={() => handleInputChange('progreso', opcion.value)}
                    className={`p-3 rounded-lg border text-center text-sm font-medium transition-all ${
                      formData.progreso === opcion.value
                        ? `${opcion.color} text-white border-transparent shadow-inner scale-95`
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {opcion.label}
                  </button>
                ))}
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

        {/* Información de Emergencia */}
        {formData.esEmergencia && (
          <div className="card border-l-4 border-l-red-500">
            <div className="card-header bg-red-50">
              <h2 className="card-title text-red-800">⚠️ Reparación de Emergencia</h2>
            </div>
            <div className="card-content">
              <p className="text-sm text-red-700">
                Esta reparación fue marcada como emergencia. Asegúrese de documentar 
                completamente la situación y las acciones tomadas para seguimiento.
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
            onClick={handleSubmit}
            disabled={loading || !formData.idCliente || !formData.titulo || !formData.diagnostico || !firmaCliente}
            className="btn btn-primary flex-1 py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="spinner-small"></div>
                Creando...
              </span>
            ) : (
              'Crear Reparación'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaReparacion;