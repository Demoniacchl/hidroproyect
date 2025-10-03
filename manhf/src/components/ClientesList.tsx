// src/components/ClienteList.tsx
import React from 'react';

interface Cliente {
  idCliente: number;
  n_cliente: number;
  nombre1: string;
  nombre2?: string;
  rut: string;
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
    return <div className="text-center py-4">Cargando clientes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay clientes registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N° Cliente
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RUT
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente.idCliente} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {cliente.n_cliente}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{cliente.nombre1}</div>
                  {cliente.nombre2 && (
                    <div className="text-gray-500 text-xs">{cliente.nombre2}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cliente.rut}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{cliente.telefono1}</div>
                {cliente.telefono2 && (
                  <div className="text-gray-500 text-xs">{cliente.telefono2}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cliente.correo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEditCliente(cliente)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeleteCliente(cliente.idCliente)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};