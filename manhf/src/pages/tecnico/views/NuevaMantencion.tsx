// src/pages/tecnicos/views/NuevaMantencion.tsx (Actualizado)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { calendarioService } from '../../../services/calendario.service';
import { ordenesService } from '../../../services/ordenes.service';
import SignatureCanvas from '../../../components/SignatureCanvas';

const NuevaMantencion: React.FC = () => {
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
    horaInicio: '09:00',
    horaSalida: '11:00',
    
    // Datos técnicos
    tipoOrden: 'PREVENTIVA',
    observaciones: '',
    
    // Mediciones eléctricas
    r: '',
    s: '', 
    t: '',
    voltaje: '',
    
    // Checklist (SI/NO/CB)
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

  const handleSubmit = async () => {
    if (!formData.idCliente || !formData.titulo) {
      alert('Por favor complete cliente y título');
      return;
    }

    if (!firmaCliente) {
      alert('Por favor capture la firma del cliente');
      return;
    }

    try {
      setLoading(true);

      // 1. Crear evento en calendario
      const fechaInicio = `${formData.fecha}T${formData.horaInicio}:00`;
      const fechaFin = `${formData.fecha}T${formData.horaSalida}:00`;

      const nuevoEvento = await calendarioService.createEvento({
        idCliente: parseInt(formData.idCliente),
        idEquipo: formData.idEquipo ? parseInt(formData.idEquipo) : null,
        idTecnico: user?.idUsuario || null,
        tipoEvento: 'MANTENCION',
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        estado: 'COMPLETADO'
      });

      // 2. Crear orden de mantención
      await ordenesService.createMantencion({
        idMotor: formData.idEquipo ? parseInt(formData.idEquipo) : 0,
        idTecnico: user?.idUsuario || 0,
        idCliente: parseInt(formData.idCliente),
        idUbicacion: 0,
        horaIngreso: `${formData.fecha} ${formData.horaInicio}`,
        horaSalida: `${formData.fecha} ${formData.horaSalida}`,
        r: formData.r ? parseFloat(formData.r) : null,
        s: formData.s ? parseFloat(formData.s) : null,
        t: formData.t ? parseFloat(formData.t) : null,
        voltaje: formData.voltaje ? parseFloat(formData.voltaje) : null,
        observaciones: formData.observaciones,
        firmaCliente: firmaCliente, // Usar la firma digital
        tipoOrden: formData.tipoOrden,
        
        // Checklist completo
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

      navigate('/tecnico?mensaje=mantencion_creada');

    } catch (error) {
      console.error('Error creando mantención:', error);
      alert('Error al crear la mantención');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/tecnico')}
              className="btn btn-ghost p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">🛠️ ORDEN DE MANTENCIÓN</h1>
              <p className="text-xs text-gray-600">Crear mantención manual</p>
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
                placeholder="Ej: Mantención preventiva trimestral"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={2}
                placeholder="Describa el trabajo a realizar..."
                className="form-input"
              />
            </div>

            <div className="form-row-3">
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
                <label className="form-label">Hora Inicio</label>
                <input
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora Salida</label>
                <input
                  type="time"
                  value={formData.horaSalida}
                  onChange={(e) => handleInputChange('horaSalida', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Datos Técnicos */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">⚡ Datos Técnicos</h2>
          </div>
          <div className="card-content space-y-4">
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
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-700 flex-1">{item.label}</span>
                  <div className="flex gap-1">
                    {[
                      { value: 'SI', label: 'S', color: 'bg-green-500 text-white' },
                      { value: 'NO', label: 'N', color: 'bg-red-500 text-white' },
                      { value: 'CB', label: 'CB', color: 'bg-yellow-500 text-white' }
                    ].map((opcion) => (
                      <button
                        key={opcion.value}
                        type="button"
                        onClick={() => handleChecklistChange(item.key, opcion.value as any)}
                        className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                          formData[item.key as keyof typeof formData] === opcion.value
                            ? `${opcion.color} shadow-inner scale-95`
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.idCliente || !formData.titulo || !firmaCliente}
            className="btn btn-primary flex-1 py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="spinner-small"></div>
                Creando...
              </span>
            ) : (
              'Crear Mantención'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaMantencion;