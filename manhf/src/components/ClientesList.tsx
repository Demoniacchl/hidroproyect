// src/components/ClientesList.tsx
import React from 'react';

interface Cliente {
  idCliente: number;
  ncliente: number;
  rut: string;
  nombre1: string;
  nombre2?: string;
  telefono1: string;
  telefono2?: string;
  correo: string;
  observaciones?: string;
}

interface ClienteListProps {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  onEditCliente: (cliente: Cliente) => void;
  onDeleteCliente: (id: number) => void;
}

export const ClienteList: React.FC<ClienteListProps> = ({
  clientes,
  loading,
  error,
  onEditCliente,
  onDeleteCliente
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error al cargar clientes: {error}
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="tabla-container">
      <div className="tabla-header">
        Total: {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Cliente</th>
              <th>Información</th>
              <th>Contacto</th>
              <th>RUT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.idCliente}>
                <td>
                  <div className="numero-cliente">{cliente.ncliente}</div>
                </td>
                <td>
                  <div className="cliente-nombre">
                    <div className="nombre-principal">{cliente.nombre1}</div>
                    {cliente.nombre2 && (
                      <div className="nombre-alternativo">{cliente.nombre2}</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="telefonos">
                    <div>{cliente.telefono1}</div>
                    {cliente.telefono2 && (
                      <div className="telefono-secundario">{cliente.telefono2}</div>
                    )}
                  </div>
                  <div className="email">{cliente.correo}</div>
                </td>
                <td>
                  <div className="rut">{cliente.rut}</div>
                </td>
                <td>
                  <div className="acciones">
                    <button
                      onClick={() => onEditCliente(cliente)}
                      className="btn-action btn-edit"
                      title="Editar cliente"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteCliente(cliente.idCliente)}
                      className="btn-action btn-delete"
                      title="Eliminar cliente"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};