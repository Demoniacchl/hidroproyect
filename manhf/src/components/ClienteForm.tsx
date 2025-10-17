// src/components/ClientesForm.tsx
import React, { useState, useEffect } from 'react';
import type { ClienteCreateRequest } from '../services/clientes.service';

interface ClienteFormProps {
  cliente?: any;
  onSubmit: (data: ClienteCreateRequest) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSubmit,
  onClose,
  loading,
  error
}) => {
  const [formData, setFormData] = useState<ClienteCreateRequest>({
    ncliente: 0,
    rut: '',
    nombre1: '',
    nombre2: '',
    telefono1: '',
    telefono2: '',
    correo: '',
    observaciones: ''
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        ncliente: cliente.ncliente || '',
        rut: cliente.rut || '',
        nombre1: cliente.nombre1 || '',
        nombre2: cliente.nombre2 || '',
        telefono1: cliente.telefono1 || '',
        telefono2: cliente.telefono2 || '',
        correo: cliente.correo || '',
        observaciones: cliente.observaciones || ''
      });
    }
  }, [cliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="ncliente">Número de Cliente *</label>
                <input
                  type="text"
                  id="ncliente"
                  name="ncliente"
                  value={formData.ncliente}
                  onChange={handleChange}
                  required
                  placeholder="9"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rut">RUT *</label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  required
                  placeholder="12.345.678-9"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nombre1">Nombre Principal *</label>
                <input
                  type="text"
                  id="nombre1"
                  name="nombre1"
                  value={formData.nombre1}
                  onChange={handleChange}
                  required
                  placeholder="Nombre o razón social"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nombre2">Nombre Alternativo</label>
                <input
                  type="text"
                  id="nombre2"
                  name="nombre2"
                  value={formData.nombre2}
                  onChange={handleChange}
                  placeholder="Nombre secundario (opcional)"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono1">Teléfono Principal *</label>
                <input
                  type="tel"
                  id="telefono1"
                  name="telefono1"
                  value={formData.telefono1}
                  onChange={handleChange}
                  required
                  placeholder="+56 9 1234 5678"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono2">Teléfono Secundario</label>
                <input
                  type="tel"
                  id="telefono2"
                  name="telefono2"
                  value={formData.telefono2}
                  onChange={handleChange}
                  placeholder="Teléfono adicional (opcional)"
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="correo">Correo Electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="cliente@empresa.cl"
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Información adicional del cliente..."
                />
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (cliente ? 'Actualizar' : 'Crear')} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;