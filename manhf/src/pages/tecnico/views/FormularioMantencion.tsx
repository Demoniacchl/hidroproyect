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
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null);
  
  // Estados del formulario - SIN VALORES PRECARGADOS
  const [formData, setFormData] = useState({
    horaInicio: '',
    horaFin: '',
    r: '',
    s: '',
    t: '',
    voltaje: '',
    observaciones: '',
    tipoOrden: 'PREVENTIVA',
    
    // Checklist de mantención - SIN VALORES PRECARGADOS
    cambioRodamientos: '',
    cambioSello: '',
    cambioVoluta: '',
    rebobinoCampos: '',
    proteccionesSaltadas: '',
    cambioProtecciones: '',
    contactoresQuemados: '',
    cambioContactores: '',
    cambioLucesPiloto: '',
    limpioTablero: '',
    cambioPresostato: '',
    cambioManometro: '',
    cargoConAireEp: '',
    revisoPresionEp: '',
    cambioValvRetencion: '',
    suprimoFiltracion: '',
    revisoValvCompuerta: '',
    revisoValvFlotador: '',
    revisoEstanqueAgua: '',
    revisoFittingsOtros: ''
  });

  useEffect(() => {
    if (idEvento) {
      cargarEvento();
    }
    cargarUsuarioLogueado();
  }, [idEvento]);

  // FUNCIÓN MEJORADA PARA OBTENER EL USUARIO LOGUEADO
  const cargarUsuarioLogueado = async () => {
    try {
      console.log('🔍 Buscando usuario logueado...');
      
      // PRIMERO: Buscar en localStorage
      const possibleKeys = ['user', 'currentUser', 'usuario', 'auth', 'authState', 'userData', 'userInfo'];
      let userFound = null;
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            console.log(`✅ Encontrado en localStorage[${key}]:`, parsed);
            userFound = parsed;
            break;
          } catch (e) {
            console.log(`❌ ${key} no es JSON válido`);
          }
        }
      }
      
      // SEGUNDO: Si no está en localStorage, buscar en sessionStorage
      if (!userFound) {
        console.log('🔍 Buscando en sessionStorage...');
        for (const key of possibleKeys) {
          const data = sessionStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              console.log(`✅ Encontrado en sessionStorage[${key}]:`, parsed);
              userFound = parsed;
              break;
            } catch (e) {
              console.log(`❌ ${key} no es JSON válido`);
            }
          }
        }
      }
      
      // TERCERO: Intentar obtener desde el token JWT
      if (!userFound) {
        userFound = obtenerUsuarioDesdeToken();
      }
      
      // CUARTO: Si encontramos usuario, procesarlo
      if (userFound) {
        setUsuarioLogueado(userFound);
        
        // Buscar el ID en diferentes campos posibles
        const idTecnico = userFound.idUsuario || userFound.id || userFound.usuarioId || 
                          userFound.userId || userFound.technicianId || userFound.tecnicoId;
        
        console.log('🔍 ID Técnico encontrado:', idTecnico);
        console.log('🔍 Todos los campos del usuario:', Object.keys(userFound));
        
      } else {
        console.warn('⚠️ No se encontró usuario en ningún lugar');
        console.log('📝 Contenido de localStorage:');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          console.log(`  ${key}:`, localStorage.getItem(key)?.substring(0, 100) + '...');
        }
      }
      
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
    }
  };

  // FUNCIÓN PARA OBTENER USUARIO DESDE TOKEN JWT
  const obtenerUsuarioDesdeToken = () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        console.log('🔍 Token encontrado, decodificando...');
        // Decodificar el token JWT (parte del payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 Payload del token:', payload);
        
        // El usuario podría estar en diferentes campos del token
        const userFromToken = {
          id: payload.id || payload.userId || payload.sub,
          nombre: payload.nombre || payload.name || payload.username,
          email: payload.email,
          rol: payload.rol || payload.role
        };
        
        if (userFromToken.id) {
          console.log('✅ Usuario obtenido del token:', userFromToken);
          return userFromToken;
        }
      }
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
    }
    return null;
  };

  const cargarEvento = async () => {
    try {
      setLoading(true);
      const eventoData = await calendarioService.getEvento(Number(idEvento));
      setEvento(eventoData);
      
      console.log('🎯 EVENTO CARGADO:', eventoData);

      // Setear hora actual como hora de inicio
      const ahora = new Date();
      const horaFormateada = ahora.toTimeString().slice(0, 5);
      setFormData(prev => ({
        ...prev,
        horaInicio: horaFormateada,
        observaciones: eventoData.descripcion || ''
      }));

    } catch (error) {
      console.error('❌ Error cargando evento:', error);
      alert('Error al cargar el evento: ' + error.message);
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

  // OBTENER ID DEL TÉCNICO - VERSIÓN MEJORADA
  const obtenerIdTecnico = () => {
    let idTecnico = null;
    
    console.log('🔍 BUSCANDO ID TÉCNICO...');
    
    // PRIMERO: Del usuario logueado en el estado
    if (usuarioLogueado) {
      idTecnico = usuarioLogueado.idUsuario || usuarioLogueado.id || usuarioLogueado.usuarioId ||
                 usuarioLogueado.userId || usuarioLogueado.technicianId || usuarioLogueado.tecnicoId;
      console.log('✅ ID desde usuario logueado:', idTecnico);
    }
    
    // SEGUNDO: Si no está en el estado, buscar directamente en localStorage
    if (!idTecnico) {
      console.log('🔍 Buscando en localStorage directamente...');
      const possibleKeys = ['user', 'currentUser', 'usuario', 'userData', 'userInfo'];
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const user = JSON.parse(data);
            console.log(`✅ Encontrado en localStorage[${key}]:`, user);
            
            idTecnico = user.idUsuario || user.id || user.userId || user.technicianId || user.tecnicoId;
            if (idTecnico) {
              console.log(`✅ ID encontrado: ${idTecnico}`);
              break;
            }
          } catch (e) {
            console.log(`❌ ${key} no es JSON válido`);
          }
        }
      }
    }
    
    // TERCERO: Intentar obtener desde el token JWT
    if (!idTecnico) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          console.log('🔍 Token encontrado, decodificando...');
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Payload del token:', payload);
          
          idTecnico = payload.id || payload.userId || payload.sub;
          console.log('🔍 ID desde token:', idTecnico);
        }
      } catch (error) {
        console.error('❌ Error decodificando token:', error);
      }
    }
    
    // CUARTO: Valor por defecto como último recurso
    if (!idTecnico) {
      console.warn('⚠️ NO SE PUDO OBTENER ID DEL TÉCNICO, usando valor por defecto 1');
      idTecnico = 1; // Valor por defecto
    }
    
    console.log('🔰 ID TÉCNICO FINAL:', idTecnico);
    return idTecnico;
  };

  // Función temporal para debug
  const debugUsuario = () => {
    console.log('🐛 DEBUG USUARIO:');
    console.log('👤 usuarioLogueado:', usuarioLogueado);
    console.log('🆔 ID calculado:', obtenerIdTecnico());
    
    // Mostrar todo localStorage
    console.log('📝 localStorage completo:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`  ${key}:`, localStorage.getItem(key));
    }
  };

  const handleGuardar = async () => {
    if (!evento) {
      alert('No hay evento cargado');
      return;
    }
    
    if (!firmaCliente) {
      alert('Por favor capture la firma del cliente antes de guardar');
      return;
    }

    // 🎯 VARIABLE PARA GUARDAR LOS DATOS QUE SE ENVIARÁN
    let ordenData: any = null;

    try {
      setSaving(true);
      
      // OBTENER IDs CORRECTOS
      const idTecnico = obtenerIdTecnico();
      const idEquipo = evento.idEquipo || 1;
      const idCliente = evento.idCliente || 1;
      const idUbicacion = evento.idUbicacion || 1;

      console.log('🎯 IDs FINALES:', { 
        idTecnico, 
        idEquipo, 
        idCliente, 
        idUbicacion 
      });

      // VALIDACIONES
      const errores = [];
      if (!formData.horaInicio) errores.push('❌ La hora de inicio es requerida');
      if (!formData.observaciones?.trim()) errores.push('❌ Las observaciones son requeridas');

      if (errores.length > 0) {
        throw new Error(errores.join('\n'));
      }

      // ✅ ESTABLECER HORA FIN AUTOMÁTICAMENTE
      const ahora = new Date();
      const horaFinFormateada = ahora.toTimeString().slice(0, 5);
      
      // Actualizar el estado local para mostrar la hora fin al usuario
      setFormData(prev => ({
        ...prev,
        horaFin: horaFinFormateada
      }));

      // FORMATEAR FECHAS CORRECTAMENTE
      const fechaBase = ahora.toISOString().split('T')[0];
      const horaInicioFormateada = formData.horaInicio.padStart(5, '0');
      const horaFinFormateadaParaBackend = horaFinFormateada.padStart(5, '0');

      // 🎯 Asegurar que ambas fechas sean del mismo día
      const horaIngreso = `${fechaBase}T${horaInicioFormateada}:00.000Z`;
      const horaSalida = `${fechaBase}T${horaFinFormateadaParaBackend}:00.000Z`;

      console.log('⏰ FECHAS FORMATEADAS:', {
        horaIngreso,
        horaSalida,
        fechaBase,
        horaInicio: formData.horaInicio,
        horaFin: horaFinFormateada
      });

      // 🎯 PREPARAR DATOS COMPATIBLES CON EL BACKEND
      ordenData = {
        // 🎯 IDs como objetos (no números)
        motor: { id: Number(idEquipo) },
        tecnico: { id: Number(idTecnico) },
        cliente: { id: Number(idCliente) },
        ubicacion: { id: Number(idUbicacion) },
        
        // 🎯 Fechas como strings (el backend las convierte a Date)
        horaIngreso: horaIngreso,
        horaSalida: horaSalida,
        
        // Información general
        observaciones: formData.observaciones.trim(),
        firmaCliente: firmaCliente,
        tipoOrden: formData.tipoOrden,
        
        // 🎯 Campos eléctricos como strings (para BigDecimal)
        r: formData.r ? formData.r.toString() : "0",
        s: formData.s ? formData.s.toString() : "0", 
        t: formData.t ? formData.t.toString() : "0",
        voltaje: formData.voltaje ? formData.voltaje.toString() : "0",
        
        // 🎯 Checklist - si no se seleccionó, enviar null
        cambioRodamientos: formData.cambioRodamientos || null,
        cambioSello: formData.cambioSello || null,
        cambioVoluta: formData.cambioVoluta || null,
        rebobinoCampos: formData.rebobinoCampos || null,
        proteccionesSaltadas: formData.proteccionesSaltadas || null,
        cambioProtecciones: formData.cambioProtecciones || null,
        contactoresQuemados: formData.contactoresQuemados || null,
        cambioContactores: formData.cambioContactores || null,
        cambioLucesPiloto: formData.cambioLucesPiloto || null,
        limpioTablero: formData.limpioTablero || null,
        cambioPresostato: formData.cambioPresostato || null,
        cambioManometro: formData.cambioManometro || null,
        cargoConAireEp: formData.cargoConAireEp || null,
        revisoPresionEp: formData.revisoPresionEp || null,
        cambioValvRetencion: formData.cambioValvRetencion || null,
        suprimoFiltracion: formData.suprimoFiltracion || null,
        revisoValvCompuerta: formData.revisoValvCompuerta || null,
        revisoValvFlotador: formData.revisoValvFlotador || null,
        revisoEstanqueAgua: formData.revisoEstanqueAgua || null,
        revisoFittingsOtros: formData.revisoFittingsOtros || null
      };

      // 🎯 MOSTRAR EL JSON EN CONSOLA
      console.log('📤 JSON QUE SE ENVÍA AL BACKEND:');
      console.log(JSON.stringify(ordenData, null, 2));

      // 1. CREAR ORDEN DE MANTENCIÓN
      const ordenMantencion = await ordenesService.createMantencion(ordenData);

      // 2. ACTUALIZAR EVENTO EN CALENDARIO
      await calendarioService.updateEvento(evento.idCalendario, {
        estado: 'COMPLETADO',
        idOrdenMantencion: ordenMantencion.idOrden
      });

      // 3. ACTUALIZAR SOLICITUD SI EXISTE
      if (evento.idSolicitud) {
        await solicitudesService.updateSolicitud(evento.idSolicitud, {
          estado: 'COMPLETADO'
        });
      }

      alert('✅ Mantención guardada exitosamente con hora fin automática');
      navigate('/tecnico?mensaje=mantencion_guardada');

    } catch (error) {
      console.error('💥 ERROR:', error);
      
      let mensajeError = 'Error al guardar la mantención';
      
      if (error.message.includes('\n')) {
        mensajeError = `Errores de validación:\n${error.message}`;
      } else if (error.message.includes('401')) {
        mensajeError = 'Error 401: No autorizado. Token JWT inválido o faltante.';
      } else if (error.message.includes('400')) {
        // 🎯 MOSTRAR EL JSON EN EL ERROR 400
        const jsonEnviado = ordenData ? JSON.stringify(ordenData, null, 2) : 'No se pudo obtener el JSON';
        mensajeError = `Error 400: Datos inválidos enviados al servidor.\n\n📤 JSON ENVIADO:\n${jsonEnviado}`;
      } else if (error.message.includes('conexión') || error.message.includes('Failed to fetch')) {
        mensajeError = 'Error de conexión. Verifique su conexión a internet.';
      } else {
        mensajeError = error.message || 'Error desconocido al guardar la mantención';
      }
      
      alert(mensajeError);
    } finally {
      setSaving(false);
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
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
              {/* ✅ Ahora mostramos la hora fin cuando se guarde */}
              {formData.horaFin && (
                <div className="text-xs text-green-600">Finalizada: {formData.horaFin}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
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
            <button 
              onClick={debugUsuario}
              className="text-xs bg-red-600 text-white px-3 py-2 rounded"
            >
              🐛 Debug Usuario
            </button>
          </div>
          <div className="card-content space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">#{evento.idCliente || 'No asignado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Equipo:</span>
              <span className="font-medium">#{evento.idEquipo || 'No asignado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Técnico (logueado):</span>
              <span className="font-medium">
                {usuarioLogueado ? (usuarioLogueado.nombre || usuarioLogueado.username || 'Usuario') : 'No identificado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ubicación:</span>
              <span className="font-medium">#{evento.idUbicacion || 'No asignado'}</span>
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
              <label className="form-label">Tipo de Mantención *</label>
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

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Hora Inicio *</label>
                <input
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora Fin</label>
                <input
                  type="time"
                  value={formData.horaFin}
                  readOnly
                  className="form-input bg-gray-100"
                  placeholder="Se establecerá automáticamente"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ✅ Se establecerá automáticamente al guardar
                </p>
              </div>
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
              <label className="form-label">Observaciones *</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Describa el trabajo realizado, hallazgos, recomendaciones..."
                className="form-input"
                required
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

      {/* ✅ BOTONES SIMPLIFICADOS - SOLO GUARDAR Y CANCELAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate('/tecnico')}
            className="btn btn-outline flex-1 py-3"
            disabled={saving}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleGuardar}
            disabled={saving || !firmaCliente || !formData.observaciones.trim()}
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
        </div>
      </div>
    </div>
  );
};

export default FormularioMantencion;