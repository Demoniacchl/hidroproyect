import React, { useState } from 'react';
import { useClientes } from '../../../hooks/useClientes';
import { ClienteList } from '../../../components/ClientesList';
import { ClienteUbicaciones } from '../../../components/ClienteUbicaciones';
import type { ClienteCreateRequest, ClienteUpdateRequest, UbicacionCreateRequest, MotorCreateRequest } from '../../../services/clientes.service';
import ClienteForm from '../../../components/ClienteForm';

const ClientesView: React.FC = () => {
  const { 
    clientes, 
    clienteDetalle,
    regiones,
    comunas,
    loading, 
    error, 
    createCliente, 
    updateCliente, 
    deleteCliente,
    loadClienteDetalle,
    createUbicacion,
    createMotor,
    clearError,
    clearClienteDetalle
  } = useClientes();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);

  const handleSubmitCliente = async (clienteData: ClienteCreateRequest) => {
    try {
      if (editingCliente) {
        await updateCliente(editingCliente.idCliente, clienteData as ClienteUpdateRequest);
      } else {
        await createCliente(clienteData);
      }
      setShowForm(false);
      setEditingCliente(null);
    } catch (err) {
      console.error('Error guardando cliente:', err);
    }
  };

  const handleEditCliente = (cliente: any) => {
    console.log('✏️ Editando cliente:', cliente.idCliente);
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleViewUbicaciones = async (cliente: any) => {
    try {
      console.log('📍 Cargando ubicaciones para cliente:', cliente.idCliente);
      await loadClienteDetalle(cliente.idCliente);
    } catch (err) {
      console.error('Error cargando ubicaciones:', err);
    }
  };

  const handleNewCliente = () => {
    console.log('➕ Creando nuevo cliente');
    setEditingCliente(null);
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

  const handleCloseUbicaciones = () => {
    clearClienteDetalle();
  };

  // Funciones placeholder para edición (para implementar luego)
  const handleEditUbicacion = async (id: number, data: any) => {
    console.log('Editar ubicación:', id, data);
    // TODO: Implementar edición de ubicación
    alert('Edición de ubicación por implementar');
  };

  const handleDeleteUbicacion = async (id: number) => {
    console.log('Eliminar ubicación:', id);
    // TODO: Implementar eliminación de ubicación
    alert('Eliminación de ubicación por implementar');
  };

  const handleEditMotor = async (id: number, data: any) => {
    console.log('Editar motor:', id, data);
    // TODO: Implementar edición de motor
    alert('Edición de motor por implementar');
  };

  const handleDeleteMotor = async (id: number) => {
    console.log('Eliminar motor:', id);
    // TODO: Implementar eliminación de motor
    alert('Eliminación de motor por implementar');
  };

  return (
    <div className="clientes-view">
      <div className="view-header">
        <div className="header-content">
          <h1>Gestión de Clientes</h1>
          <p>Administración de clientes, ubicaciones y motores</p>
        </div>
        <button
          onClick={handleNewCliente}
          className="btn btn-primary"
          disabled={loading}
        >
          <span>+</span>
          Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={clearError} className="close-btn">×</button>
        </div>
      )}

      {!clienteDetalle ? (
        <ClienteList
          clientes={clientes}
          loading={loading}
          error={error}
          onEditCliente={handleEditCliente}
          onDeleteCliente={handleDeleteCliente}
          onViewUbicaciones={handleViewUbicaciones}
        />
      ) : (
        <div className="cliente-detalle">
          <div className="detalle-header">
            <button 
              className="btn btn-outline"
              onClick={handleCloseUbicaciones}
            >
              ← Volver a lista
            </button>
            <div className="detalle-title">
              <h2>Ubicaciones - {clienteDetalle.nombre1}</h2>
              <p className="cliente-info">
                RUT: {clienteDetalle.rut} | Tel: {clienteDetalle.telefono1} | Email: {clienteDetalle.correo}
              </p>
            </div>
          </div>
          
          <ClienteUbicaciones
            ubicaciones={clienteDetalle.ubicaciones}
            onAddUbicacion={createUbicacion}
            onEditUbicacion={handleEditUbicacion}
            onDeleteUbicacion={handleDeleteUbicacion}
            onAddMotor={createMotor}
            onEditMotor={handleEditMotor}
            onDeleteMotor={handleDeleteMotor}
            idCliente={clienteDetalle.idCliente}
            regiones={regiones}
            comunas={comunas}
            loading={loading}
          />
        </div>
      )}

      {(showForm || editingCliente) && (
        <ClienteForm
          cliente={editingCliente}
          onSubmit={handleSubmitCliente}
          onClose={handleCloseForm}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default ClientesView;