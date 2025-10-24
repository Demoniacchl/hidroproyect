// src/pages/tecnicos/views/FormularioMantencion.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calendarioService, EventoCalendario } from '../../../services/calendario.service';
import { ordenesService } from '../../../services/ordenes.service';
import { solicitudesService } from '../../../services/solicitudes.service';
import SignatureCanvas from '../../../components/SignatureCanvas';

const FormularioMantencion: React.FC = () => {
  const { idEvento } = useParams<{ idEvento: string }>();
  const navigate = useNavigate();
  
  const [evento, setEvento] = useState<EventoCalendario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firmaCliente, setFirmaCliente] = useState<string>('');
  
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
        horaInicio: ahora.toTimeString().slice(0, 5),
        observaciones: eventoData.descripcion || ''
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
    
        console.log('🔍 DEBUG INICIAL - Estado del formulario:');
    console.log('🔍 formData:', formData);
    console.log('🔍 evento:', evento);
    console.log('🔍 firmaCliente length:', firmaCliente.length);
    console.log('🔍 DEBUG: Iniciando proceso de guardado...');
    
    // Formatear fechas correctamente para el backend
    const ahora = new Date();
    const fechaBase = ahora.toISOString().split('T')[0];
    
    const horaIngreso = new Date(`${fechaBase}T${formData.horaInicio}:00`);
    const horaSalida = formData.horaFin ? new Date(`${fechaBase}T${formData.horaFin}:00`) : null;

    // Preparar datos para la orden
    const ordenData = {
      idMotor: evento.idEquipo || 0,
      idTecnico: evento.idTecnico || 0,
      idCliente: evento.idCliente,
      idUbicacion: 0,
      horaIngreso: horaIngreso.toISOString(),
      horaSalida: horaSalida ? horaSalida.toISOString() : null,
      r: formData.r ? parseFloat(formData.r) : null,
      s: formData.s ? parseFloat(formData.s) : null,
      t: formData.t ? parseFloat(formData.t) : null,
      voltaje: formData.voltaje ? parseFloat(formData.voltaje) : null,
      observaciones: formData.observaciones,
      firmaCliente: firmaCliente,
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
    };

    console.log('🔍 DEBUG FINAL - Datos completos a enviar:');
    console.log('🔍 DEBUG - JSON:', JSON.stringify(ordenData, null, 2));
    console.log('🔍 DEBUG - Tipos de datos:');
    Object.keys(ordenData).forEach(key => {
      const value = ordenData[key];
      console.log(`  ${key}: ${typeof value} = ${value}`);
    });

    // 1. CREAR ORDEN DE MANTENCIÓN
    console.log('🔄 Paso 1: Creando orden de mantención...');
    const ordenMantencion = await ordenesService.createMantencion(ordenData);
    // ... resto del código igual
  } catch (error) {
    console.error('❌ ERROR en el proceso completo:', error);
    alert('Error al guardar la mantención. Revisa la consola para más detalles.');
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

  const checklistItems = [
    { key: 'cambioRodamientos', label: 'Se cambió rodamiento' },
    { key: 'cambioSello', label: 'Se cambió sello' },
    { key: 'cambioVoluta', label: 'Se cambió voluta' },
    { key: 'rebobinoCampos', label: 'Se rebobinó campos' },
    { key: 'proteccionesSaltadas', label: 'Protecciones saltadas' },
    { key: 'cambioProtecciones', label: 'Se cambió protecciones' },
    { key: 'contactoresQuemados', label: 'Contactores quemados' },
    { key: 'cambioContactores', label: 'Se cambió contactores' },
    { key: 'cambioLucesPiloto', label: 'Se cambió luces piloto' },
    { key: 'limpioTablero', label: 'Se limpió tablero' },
    { key: 'cambioPresostato', label: 'Se cambió presostato' },
    { key: 'cambioManometro', label: 'Se cambió manómetro' },
    { key: 'cargoConAireEp', label: 'Se cargó con aire E.P.' },
    { key: 'revisoPresionEp', label: 'Se revisó presión E.P.' },
    { key: 'cambioValvRetencion', label: 'Se cambió válv. retención' },
    { key: 'suprimoFiltracion', label: 'Se suprimió filtración' },
    { key: 'revisoValvCompuerta', label: 'Se revisó válv. compuerta' },
    { key: 'revisoValvFlotador', label: 'Se revisó válv. flotador' },
    { key: 'revisoEstanqueAgua', label: 'Se revisó estanque agua' },
    { key: 'revisoFittingsOtros', label: 'Se revisó fittings otros' }
  ];

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
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{evento.tipoEvento}</span>
            </div>
          </div>
        </div>

        {/* Formulario Principal */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">⚡ Datos de la Mantención</h2>
          </div>
          <div className="card-content space-y-4">
            {/* Tipo de Orden */}
            <div className="form-group">
              <label className="form-label">Tipo de Mantención</label>
              <select
                value={formData.tipoOrden}
                onChange={(e) => handleInputChange('tipoOrden', e.target.value)}
                className="form-input"
              >
                <option value="PREVENTIVA">Preventiva</option>
                <option value="CORRECTIVA">Correctiva</option>
                <option value="EMERGENCIA">Emergencia</option>
              </select>
            </div>

            {/* Mediciones Eléctricas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">R (A)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.r}
                  onChange={(e) => handleInputChange('r', e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">S (A)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.s}
                  onChange={(e) => handleInputChange('s', e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">T (A)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.t}
                  onChange={(e) => handleInputChange('t', e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Voltaje (V)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.voltaje}
                  onChange={(e) => handleInputChange('voltaje', e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="form-group">
              <label className="form-label">Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Describa el trabajo realizado, hallazgos, recomendaciones..."
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Checklist de Mantención */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">✅ Checklist de Mantención</h2>
          </div>
          <div className="card-content">
            <div className="checklist-container">
              {checklistItems.map((item) => (
                <div key={item.key} className="checklist-item">
                  <span className="checklist-label">{item.label}</span>
                  <div className="checklist-options">
                    {[
                      { value: 'SI', label: 'S', type: 'si' },
                      { value: 'NO', label: 'N', type: 'no' },
                      { value: 'CB', label: 'CB', type: 'cb' }
                    ].map((opcion) => (
                      <button
                        key={opcion.value}
                        type="button"
                        onClick={() => handleChecklistChange(item.key, opcion.value as any)}
                        className={`checklist-btn ${opcion.type} ${
                          formData[item.key as keyof typeof formData] === opcion.value ? 'active' : ''
                        }`}
                      >
                        {opcion.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
          
          {!formData.horaFin ? (
            <button
              onClick={handleFinalizar}
              className="btn btn-warning flex-1 py-3"
            >
              Finalizar Trabajo
            </button>
          ) : (
            <button
              onClick={handleGuardar}
              disabled={saving || !firmaCliente}
              className="btn btn-primary flex-1 py-3"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="spinner-small"></div>
                  Guardando...
                </span>
              ) : (
                'Enviar a Revisión'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioMantencion;