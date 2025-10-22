import React, { useState, useEffect } from 'react';
import { Ubicacion, Motor, UbicacionCreateRequest, MotorCreateRequest, Region, Comuna } from '../services/clientes.service';

interface ClienteUbicacionesProps {
  ubicaciones: Ubicacion[];
  onAddUbicacion: (ubicacion: UbicacionCreateRequest) => Promise<void>;
  onEditUbicacion: (id: number, ubicacion: any) => Promise<void>;
  onDeleteUbicacion: (id: number) => Promise<void>;
  onAddMotor: (motor: MotorCreateRequest) => Promise<void>;
  onEditMotor: (id: number, motor: any) => Promise<void>;
  onDeleteMotor: (id: number) => Promise<void>;
  idCliente: number;
  regiones: Region[];
  comunas: Comuna[];
  loading?: boolean;
}

export const ClienteUbicaciones: React.FC<ClienteUbicacionesProps> = ({
  ubicaciones,
  onAddUbicacion,
  onEditUbicacion,
  onDeleteUbicacion,
  onAddMotor,
  onEditMotor,
  onDeleteMotor,
  idCliente,
  regiones,
  comunas,
  loading = false
}) => {
  const [showUbicacionForm, setShowUbicacionForm] = useState(false);
  const [showMotorForm, setShowMotorForm] = useState(false);
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
  const [expandedUbicaciones, setExpandedUbicaciones] = useState<number[]>([]);

  const toggleUbicacion = (idUbicacion: number) => {
    setExpandedUbicaciones(prev =>
      prev.includes(idUbicacion)
        ? prev.filter(id => id !== idUbicacion)
        : [...prev, idUbicacion]
    );
  };

  const handleAddUbicacion = async (data: any) => {
    await onAddUbicacion({ ...data, idCliente });
    setShowUbicacionForm(false);
  };

  const handleAddMotor = async (data: any) => {
    if (selectedUbicacion) {
      await onAddMotor({ ...data, idUbicacion: selectedUbicacion.idUbicacion });
      setShowMotorForm(false);
      setSelectedUbicacion(null);
    }
  };

  const handleDeleteUbicacion = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      await onDeleteUbicacion(id);
    }
  };

  const handleDeleteMotor = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este motor?')) {
      await onDeleteMotor(id);
    }
  };

  const getNombreRegion = (regionId: number) => {
    const region = regiones.find(r => r.id === regionId);
    return region ? region.region : `Región ${regionId}`;
  };

  const getNombreComuna = (comunaId: number) => {
    const comuna = comunas.find(c => c.id === comunaId);
    return comuna ? comuna.comuna : `Comuna ${comunaId}`;
  };

  return (
    <div className="cliente-ubicaciones">
      <div className="section-header">
        <h3>Ubicaciones del Cliente</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowUbicacionForm(true)}
          disabled={loading}
        >
          + Agregar Ubicación
        </button>
      </div>

      {ubicaciones.length === 0 ? (
        <div className="empty-state">
          <p>No hay ubicaciones registradas para este cliente</p>
        </div>
      ) : (
        <div className="ubicaciones-list">
          {ubicaciones.map(ubicacion => (
            <div key={ubicacion.idUbicacion} className="ubicacion-card">
              <div className="ubicacion-header">
                <div className="ubicacion-info">
                  <h4>{ubicacion.nombre}</h4>
                  <p>{ubicacion.calle} {ubicacion.numero}, {getNombreComuna(ubicacion.comunaId)}, {getNombreRegion(ubicacion.regionId)}</p>
                  <div className="ubicacion-stats">
                    <small>{ubicacion.motores?.length || 0} motores registrados</small>
                  </div>
                </div>
                <div className="ubicacion-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => toggleUbicacion(ubicacion.idUbicacion)}
                    title={expandedUbicaciones.includes(ubicacion.idUbicacion) ? 'Contraer' : 'Expandir'}
                  >
                    {expandedUbicaciones.includes(ubicacion.idUbicacion) ? '▲' : '▼'}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setSelectedUbicacion(ubicacion);
                      setShowMotorForm(true);
                    }}
                    title="Agregar motor"
                  >
                    + Motor
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => onEditUbicacion(ubicacion.idUbicacion, ubicacion)}
                    title="Editar ubicación"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUbicacion(ubicacion.idUbicacion)}
                    title="Eliminar ubicación"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {expandedUbicaciones.includes(ubicacion.idUbicacion) && (
                <div className="motores-section">
                  <h5>Motores en esta ubicación</h5>
                  {ubicacion.motores && ubicacion.motores.length > 0 ? (
                    <div className="motores-list">
                      {ubicacion.motores.map(motor => (
                        <div key={motor.idMotor} className="motor-card">
                          <div className="motor-info">
                            <div className="motor-header">
                              <strong>{motor.marca} {motor.modelo}</strong>
                              <span className={`estado-badge estado-${motor.estado.toLowerCase().replace(' ', '-')}`}>
                                {motor.estado}
                              </span>
                            </div>
                            <div className="motor-details">
                              <span>Tipo: {motor.tipo}</span>
                              <span>Serie: {motor.serie}</span>
                              <span>Potencia: {motor.potencia} HP</span>
                              <span>Voltaje: {motor.voltaje}V</span>
                              {motor.fechaInstalacion && (
                                <span>Instalación: {new Date(motor.fechaInstalacion).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="motor-actions">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => onEditMotor(motor.idMotor, motor)}
                              title="Editar motor"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteMotor(motor.idMotor)}
                              title="Eliminar motor"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No hay motores en esta ubicación</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Forms modales */}
      {showUbicacionForm && (
        <UbicacionForm
          onSubmit={handleAddUbicacion}
          onClose={() => setShowUbicacionForm(false)}
          loading={loading}
          regiones={regiones}
          comunas={comunas}
        />
      )}

      {showMotorForm && selectedUbicacion && (
        <MotorForm
          onSubmit={handleAddMotor}
          onClose={() => {
            setShowMotorForm(false);
            setSelectedUbicacion(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// Componente de formulario de ubicación con regiones y comunas
const UbicacionForm: React.FC<{
  onSubmit: (data: any) => void;
  onClose: () => void;
  loading: boolean;
  regiones: Region[];
  comunas: Comuna[];
}> = ({ onSubmit, onClose, loading, regiones, comunas }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    regionId: '',
    comunaId: '',
    calle: '',
    numero: ''
  });

  const [comunasFiltradas, setComunasFiltradas] = useState<Comuna[]>([]);

  useEffect(() => {
    if (formData.regionId) {
      const filtered = comunas.filter(comuna => comuna.regionId === parseInt(formData.regionId));
      setComunasFiltradas(filtered);
      // Reset comunaId si la región cambia
      setFormData(prev => ({ ...prev, comunaId: '' }));
    } else {
      setComunasFiltradas([]);
    }
  }, [formData.regionId, comunas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      regionId: parseInt(formData.regionId),
      comunaId: parseInt(formData.comunaId)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Agregar Ubicación</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la ubicación *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              placeholder="Ej: Torre A, Sede Principal, etc."
            />
          </div>
          
          {regiones.length > 0 ? (
            <>
              <div className="form-group">
                <label>Región *</label>
                <select
                  value={formData.regionId}
                  onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                  required
                >
                  <option value="">Seleccione una región</option>
                  {regiones.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comuna *</label>
                <select
                  value={formData.comunaId}
                  onChange={(e) => setFormData({ ...formData, comunaId: e.target.value })}
                  required
                  disabled={!formData.regionId}
                >
                  <option value="">Seleccione una comuna</option>
                  {comunasFiltradas.map(comuna => (
                    <option key={comuna.id} value={comuna.id}>
                      {comuna.comuna}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div className="warning-message">
              <p>⚠️ No se pudieron cargar las regiones y comunas. Por favor, ingrese manualmente:</p>
              <div className="form-group">
                <label>Región *</label>
                <input
                  type="text"
                  value={formData.regionId}
                  onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                  required
                  placeholder="Ej: Metropolitana de Santiago"
                />
              </div>
              <div className="form-group">
                <label>Comuna *</label>
                <input
                  type="text"
                  value={formData.comunaId}
                  onChange={(e) => setFormData({ ...formData, comunaId: e.target.value })}
                  required
                  placeholder="Ej: Santiago"
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Calle *</label>
            <input
              type="text"
              value={formData.calle}
              onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
              required
              placeholder="Ej: Av. Libertador B. O'Higgins"
            />
          </div>
          <div className="form-group">
            <label>Número *</label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              required
              placeholder="Ej: 1234"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Ubicación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de formulario de motor (sin cambios)
const MotorForm: React.FC<{
  onSubmit: (data: any) => void;
  onClose: () => void;
  loading: boolean;
}> = ({ onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    tipo: 'Bomba Agua',
    marca: '',
    modelo: '',
    potencia: '',
    voltaje: '',
    r: '',
    s: '',
    t: '',
    serie: '',
    fechaInstalacion: '',
    estado: 'OPERATIVO'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      potencia: parseFloat(formData.potencia) || 0,
      voltaje: parseFloat(formData.voltaje) || 0,
      r: formData.r ? parseFloat(formData.r) : undefined,
      s: formData.s ? parseFloat(formData.s) : undefined,
      t: formData.t ? parseFloat(formData.t) : undefined,
      fechaInstalacion: formData.fechaInstalacion || new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Agregar Motor</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo *</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            >
              <option value="Bomba Agua">Bomba Agua</option>
              <option value="Bomba Incendio">Bomba Incendio</option>
              <option value="Ascensor Motor">Ascensor Motor</option>
              <option value="Ventilador Extractor">Ventilador Extractor</option>
              <option value="Bomba Piscina">Bomba Piscina</option>
              <option value="Compresor Aire">Compresor Aire</option>
              <option value="Bomba de Vacío">Bomba de Vacío</option>
              <option value="Sistema Presurización">Sistema Presurización</option>
              <option value="Motor Extractor">Motor Extractor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Marca *</label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              required
              placeholder="Ej: Grundfos, KSB, Siemens"
            />
          </div>
          <div className="form-group">
            <label>Modelo *</label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              required
              placeholder="Ej: CR15, Etanorm, XG-200"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Potencia (HP) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.potencia}
                onChange={(e) => setFormData({ ...formData, potencia: e.target.value })}
                required
                placeholder="Ej: 15.00"
              />
            </div>
            <div className="form-group">
              <label>Voltaje (V) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.voltaje}
                onChange={(e) => setFormData({ ...formData, voltaje: e.target.value })}
                required
                placeholder="Ej: 380.00"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>R (A)</label>
              <input
                type="number"
                step="0.01"
                value={formData.r}
                onChange={(e) => setFormData({ ...formData, r: e.target.value })}
                placeholder="Ej: 10.00"
              />
            </div>
            <div className="form-group">
              <label>S (A)</label>
              <input
                type="number"
                step="0.01"
                value={formData.s}
                onChange={(e) => setFormData({ ...formData, s: e.target.value })}
                placeholder="Ej: 10.20"
              />
            </div>
            <div className="form-group">
              <label>T (A)</label>
              <input
                type="number"
                step="0.01"
                value={formData.t}
                onChange={(e) => setFormData({ ...formData, t: e.target.value })}
                placeholder="Ej: 10.10"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Número de Serie *</label>
            <input
              type="text"
              value={formData.serie}
              onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
              required
              placeholder="Ej: LASPAL-001"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Instalación</label>
              <input
                type="date"
                value={formData.fechaInstalacion}
                onChange={(e) => setFormData({ ...formData, fechaInstalacion: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="OPERATIVO">Operativo</option>
                <option value="MANTENCIÓN">En Mantención</option>
                <option value="REPARACIÓN">En Reparación</option>
                <option value="FUERA_DE_SERVICIO">Fuera de Servicio</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Motor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};