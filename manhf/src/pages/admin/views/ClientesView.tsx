// views/ClienteView.tsx
import React, { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
// Update the import path if the file is located elsewhere, for example:
import { ClienteList } from '../components/ClienteList';
// Or create the file at src/pages/admin/components/list/ClienteList.tsx if it does not exist.
import { ClienteForm } from '../components/ClienteForm';
import { Cliente } from '../services/clienteService';

export const ClienteView: React.FC = () => {
  const { clientes, loading, error, createCliente, deleteCliente, loadClientes } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const handleCreateCliente = async (clienteData: Omit<Cliente, 'idCliente'>) => {
    try {
      await createCliente(clienteData);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating client:', err);
    }
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleDeleteCliente = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteCliente(id);
      } catch (err) {
        console.error('Error deleting client:', err);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCliente(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <ClienteForm
          cliente={editingCliente}
          onSubmit={handleCreateCliente}
          onCancel={handleCloseForm}
        />
      )}

      <ClienteList
        clientes={clientes}
        loading={loading}
        error={error}
        onEditCliente={handleEditCliente}
        onDeleteCliente={handleDeleteCliente}
      />
    </div>
  );
};