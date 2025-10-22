import React from 'react';
import { Cliente } from '../services/clientes.service';

interface ClienteListProps {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  onEditCliente: (cliente: Cliente) => void;
  onDeleteCliente: (id: number) => void;
  onViewUbicaciones: (cliente: Cliente) => void;
}

export const ClienteList: React.FC<ClienteListProps> = ({
  clientes,
  loading,
  error,
  onEditCliente,
  onDeleteCliente,
  onViewUbicaciones
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
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Ubicaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-state">
                No hay clientes registrados
              </td>
            </tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.idCliente} className="cliente-row">
                <td>
                  <div className="numero-cliente">#{cliente.ncliente}</div>
                </td>
                <td>
                  <div className="cliente-nombre">
                    <strong>{cliente.nombre1}</strong>
                    {cliente.nombre2 && <div className="nombre-secundario">{cliente.nombre2}</div>}
                  </div>
                </td>
                <td>
                  <div className="cliente-rut">{cliente.rut}</div>
                </td>
                <td>
                  <div className="cliente-telefono">
                    <div>{cliente.telefono1}</div>
                    {cliente.telefono2 && <div className="telefono-secundario">{cliente.telefono2}</div>}
                  </div>
                </td>
                <td>
                  <div className="cliente-email">{cliente.correo}</div>
                </td>
                <td>
                  <div className="ubicaciones-count">
                    <span className="badge badge-outline">
                      {cliente.ubicaciones.length} ubicación{cliente.ubicaciones.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="acciones">
                    <button 
                      className="btn-action btn-locations"
                      onClick={() => onViewUbicaciones(cliente)}
                      title="Ver ubicaciones"
                    >
                      📍
                    </button>
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => onEditCliente(cliente)}
                      title="Editar cliente"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => onDeleteCliente(cliente.idCliente)}
                      title="Eliminar cliente"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};