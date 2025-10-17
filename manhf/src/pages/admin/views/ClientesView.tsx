// src/pages/admin/views/ClientesView.tsx
import React, { useState } from 'react';
import { useClientes } from '../../../hooks/useClientes';
import { ClienteList } from '../../../components/ClientesList';
import type { ClienteCreateRequest } from '../../../services/clientes.service';
import ClienteForm from '../../../components/ClienteForm';

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
  const [editingCliente, setEditingCliente] = useState<any>(null);

  const handleCreateCliente = async (clienteData: ClienteCreateRequest) => {
    try {
      await createCliente(clienteData);
      setShowForm(false);
      setEditingCliente(null);
    } catch (err) {
      console.error('Error creando cliente:', err);
    }
  };

  const handleEditCliente = (cliente: any) => {
    setEditingCliente(cliente);
    setShowForm(true);
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
    setEditingCliente(null);
    clearError();
  };

  return (
    <div className="clientes-view">
      <div className="view-header">
        <h1>Gestión de Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          disabled={loading}
        >
          <span>+</span>
          Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={clearError}
            className="close-btn"
          >
            ×
          </button>
        </div>
      )}

      <ClienteList
        clientes={clientes}
        loading={loading}
        error={error}
        onEditCliente={handleEditCliente}
        onDeleteCliente={handleDeleteCliente}
      />

      {(showForm || editingCliente) && (
        <ClienteForm
          cliente={editingCliente}
          onSubmit={handleCreateCliente}
          onClose={handleCloseForm}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default ClientesView;