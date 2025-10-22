// src/pages/tecnicos/views/FormularioMantencion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calendarioService, EventoCalendario } from '../../../services/calendario.service';
import { ordenesService } from '../../../services/ordenes.service';

const FormularioMantencion: React.FC = () => {
  const { idEvento } = useParams<{ idEvento: string }>();
  const navigate = useNavigate();
  
  const [evento, setEvento] = useState<EventoCalendario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    horaInicio: '',
    horaFin: '',
    r: '',
    s: '',
    t: '',
    voltaje: '',
    observaciones: '',
    tipoOrden: 'PREVENTIVA',
    firmaCliente: '',
    
    // Checklist de mantención
    cambioRodamientos: 'NO',
    cambioSello: 'NO',
    cambioVoluta: 'NO',
    rebobinoCampos: 'NO',
    proteccionesSaltadas: 'NO',
    cambioProtecciones: 'NO',
    contactoresQuemados: 'NO',
    cambioContactores: 'NO',
    cambioLucesPiloto: 'NO',
    limpioTablero: 'NO',
    cambioPresostato: 'NO',
    cambioManometro: 'NO',
    cargoConAireEp: 'NO',
    revisoPresionEp: 'NO',
    cambioValvRetencion: 'NO',
    suprimoFiltracion: 'NO',
    revisoValvCompuerta: 'NO',
    revisoValvFlotador: 'NO',
    revisoEstanqueAgua: 'NO',
    revisoFittingsOtros: 'NO'
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
      
      // Setear hora actual como hora de inicio
      const ahora = new Date();
      setFormData(prev => ({
        ...prev,
        horaInicio: ahora.toTimeString().slice(0, 5)
      }));
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

  const handleChecklistChange = (campo: string, valor: 'SI' | 'NO' | 'CB') => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleGuardar = async () => {
    if (!evento) return;
    
    try {
      setSaving(true);
      
      // Crear la orden de mantención
      const ordenMantencion = await ordenesService.createMantencion({
        idMotor: evento.idEquipo || 0,
        idTecnico: evento.idTecnico || 0,
        idCliente: evento.idCliente,
        idUbicacion: 0, // Esto debería venir del evento o buscarse
        horaIngreso: `${new Date().toDateString()} ${formData.horaInicio}`,
        horaSalida: formData.horaFin ? `${new Date().toDateString()} ${formData.horaFin}` : null,
        r: formData.r ? parseFloat(formData.r) : null,
        s: formData.s ? parseFloat(formData.s) : null,
        t: formData.t ? parseFloat(formData.t) : null,
        voltaje: formData.voltaje ? parseFloat(formData.voltaje) : null,
        observaciones: formData.observaciones,
        firmaCliente: formData.firmaCliente,
        tipoOrden: formData.tipoOrden,
        
        // Checklist
        cambioRodamientos: formData.cambioRodamientos,
        cambioSello: formData.cambioSello,
        cambioVoluta: formData.cambioVoluta,
        rebobinoCampos: formData.rebobinoCampos,
        proteccionesSaltadas: formData.proteccionesSaltadas,
        cambioProtecciones: formData.cambioProtecciones,
        contactoresQuemados: formData.contactoresQuemados,
        cambioContactores: formData.cambioContactores,
        cambioLucesPiloto: formData.cambioLucesPiloto,
        limpioTablero: formData.limpioTablero,
        cambioPresostato: formData.cambioPresostato,
        cambioManometro: formData.cambioManometro,
        cargoConAireEp: formData.cargoConAireEp,
        revisoPresionEp: formData.revisoPresionEp,
        cambioValvRetencion: formData.cambioValvRetencion,
        suprimoFiltracion: formData.suprimoFiltracion,
        revisoValvCompuerta: formData.revisoValvCompuerta,
        revisoValvFlotador: formData.revisoValvFlotador,
        revisoEstanqueAgua: formData.revisoEstanqueAgua,
        revisoFittingsOtros: formData.revisoFittingsOtros
      });

      // Actualizar evento como completado
      await calendarioService.updateEvento(evento.idCalendario, {
        estado: 'COMPLETADO',
        idOrdenMantenimiento: ordenMantencion.idOrden
      });

      // Crear solicitud de revisión (esto iría a un servicio de solicitudes)
      // await solicitudesService.crearSolicitudRevisión(...);

      navigate('/tecnico?mensaje=mantencion_guardada');

    } catch (error) {
      console.error('Error guardando mantención:', error);
      alert('Error al guardar la mantención');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalizar = () => {
    const ahora = new Date();
    setFormData(prev => ({
      ...prev,
      horaFin: ahora.toTimeString().slice(0, 5)
    }));
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
                <h1 className="text-lg font-bold text-gray-900">🛠️ Mantención</h1>
                <p className="text-xs text-gray-600">{evento.titulo}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {formData.horaInicio ? `Inicio: ${formData.horaInicio}` : 'No iniciada'}
              </div>
              {formData.horaFin && (
                <div className="text-xs text-green-600">Finalizada: {formData.horaFin}</div>
              )}
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
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{evento.tipoEvento}</span>
            </div>
          </div>
        </div>

        {/* Formulario Principal */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Datos de la Mantención</h2>
          
          <div className="space-y-4">
            {/* Tipo de Orden */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Mantención *
              </label>
              <select
                value={formData.tipoOrden}
                onChange={(e) => handleInputChange('tipoOrden', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PREVENTIVA">Preventiva</option>
                <option value="CORRECTIVA">Correctiva</option>
                <option value="EMERGENCIA">Emergencia</option>
              </select>
            </div>

            {/* Mediciones Eléctricas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">R (A)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.r}
                  onChange={(e) => handleInputChange('r', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">S (A)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.s}
                  onChange={(e) => handleInputChange('s', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">T (A)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.t}
                  onChange={(e) => handleInputChange('t', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voltaje (V)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.voltaje}
                  onChange={(e) => handleInputChange('voltaje', e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Describa el trabajo realizado, hallazgos, recomendaciones..."
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

        {/* Checklist de Mantención */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Checklist de Mantención</h2>
          
          <div className="space-y-3">
            {[
              { key: 'cambioRodamientos', label: 'Cambio de rodamientos' },
              { key: 'cambioSello', label: 'Cambio de sello mecánico' },
              { key: 'cambioVoluta', label: 'Cambio de voluta' },
              { key: 'rebobinoCampos', label: 'Rebobino de campos' },
              { key: 'proteccionesSaltadas', label: 'Protecciones saltadas' },
              { key: 'cambioProtecciones', label: 'Cambio de protecciones' },
              { key: 'contactoresQuemados', label: 'Contactores quemados' },
              { key: 'cambioContactores', label: 'Cambio de contactores' },
              { key: 'cambioLucesPiloto', label: 'Cambio de luces piloto' },
              { key: 'limpioTablero', label: 'Limpieza de tablero' },
              { key: 'cambioPresostato', label: 'Cambio de presostato' },
              { key: 'cambioManometro', label: 'Cambio de manómetro' },
              { key: 'cargoConAireEp', label: 'Carga con aire EP' },
              { key: 'revisoPresionEp', label: 'Revisión presión EP' },
              { key: 'cambioValvRetencion', label: 'Cambio válvula retención' },
              { key: 'suprimoFiltracion', label: 'Supresión filtración' },
              { key: 'revisoValvCompuerta', label: 'Revisión válvula compuerta' },
              { key: 'revisoValvFlotador', label: 'Revisión válvula flotador' },
              { key: 'revisoEstanqueAgua', label: 'Revisión estanque agua' },
              { key: 'revisoFittingsOtros', label: 'Revisión fittings otros' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">{item.label}</span>
                <div className="flex space-x-1">
                  {['SI', 'NO', 'CB'].map((opcion) => (
                    <button
                      key={opcion}
                      onClick={() => handleChecklistChange(item.key, opcion as any)}
                      className={`px-2 py-1 text-xs rounded ${
                        formData[item.key as keyof typeof formData] === opcion
                          ? opcion === 'SI' ? 'bg-green-600 text-white' :
                            opcion === 'NO' ? 'bg-red-600 text-white' :
                            'bg-yellow-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
          
          {!formData.horaFin ? (
            <button
              onClick={handleFinalizar}
              className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              Finalizar Trabajo
            </button>
          ) : (
            <button
              onClick={handleGuardar}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Enviar a Revisión'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioMantencion;