// src/pages/admin/views/ClientesView.tsx
import React, { useState } from 'react';
import { useClientes } from '../../../hooks/useClientes';
import { ClienteList } from '../../../components/ClientesList';
import type { ClienteCreateRequest } from '../../../services/clientes.service';

const ClientesView: React.FC = () => {
  const { 
    clientes, 
    loading, 
    error, 
    createCliente, 
    deleteCliente,
    clearError 
  } = useClientes();
  
  const [showForm, setShowForm] = useState(false);

  const handleCreateCliente = async (clienteData: ClienteCreateRequest) => {
    try {
      await createCliente(clienteData);
      setShowForm(false);
    } catch (err) {
      console.error('Error creando cliente:', err);
    }
  };

  const handleDeleteCliente = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteCliente(id);
      } catch (err) {
        console.error('Error eliminando cliente:', err);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    clearError();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Nuevo Cliente'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={clearError}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      <ClienteList
        clientes={clientes}
        loading={loading}
        error={error}
        onEditCliente={(cliente) => console.log('Editar:', cliente)}
        onDeleteCliente={handleDeleteCliente}
      />
    </div>
  );
};

export default ClientesView;