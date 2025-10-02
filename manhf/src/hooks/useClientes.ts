// hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { clientesService, Cliente } from '../services/clientes.service';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getClientes();
      // Si la API devuelve un objeto con content (paginación)
      const clientesList = data.content || data;
      setClientes(clientesList);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const createCliente = async (clienteData: Omit<Cliente, 'idCliente'>) => {
    try {
      const nuevoCliente = await clientesService.createCliente(clienteData);
      setClientes(prev => [...prev, nuevoCliente]);
      return nuevoCliente;
    } catch (err) {
      setError('Error al crear el cliente');
      throw err;
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      await clientesService.deleteCliente(id);
      setClientes(prev => prev.filter(cliente => cliente.idCliente !== id));
    } catch (err) {
      setError('Error al eliminar el cliente');
      throw err;
    }
  };

  return {
    clientes,
    loading,
    error,
    loadClientes,
    createCliente,
    deleteCliente
  };
};