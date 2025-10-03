// components/ClienteForm.tsx
import React, { useState, useEffect } from 'react';
import { Cliente } from '../services/clientes.service';

interface ClienteFormProps {
  cliente?: Cliente | null;
  onSubmit: (clienteData: Omit<Cliente, 'idCliente'>) => void;
  onCancel: () => void;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    n_cliente: cliente?.n_cliente || 0,
    nombre1: cliente?.nombre1 || '',
    nombre2: cliente?.nombre2 || '',
    rut: cliente?.rut || '',
    telefono1: cliente?.telefono1 || '',
    telefono2: cliente?.telefono2 || '',
    correo: cliente?.correo || '',
    observaciones: cliente?.observaciones || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'n_cliente' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">N° Cliente</label>
            <input
              type="number"
              name="n_cliente"
              value={formData.n_cliente}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Principal</label>
            <input
              type="text"
              name="nombre1"
              value={formData.nombre1}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {cliente ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ClienteForm;