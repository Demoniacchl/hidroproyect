// src/hooks/useClientes.ts
import { useState, useEffect } from 'react';
import {clientesService, Cliente, ClienteCreateRequest, ClienteUpdateRequest} from '../services/clientes.service';

interface UseClientesReturn {
  // Estado
  clientes: Cliente[];
  loading: boolean;
  error: string | null;

  // Acciones principales
  loadClientes: () => Promise<void>;
  createCliente: (clienteData: ClienteCreateRequest) => Promise<Cliente>;
  updateCliente: (id: number, clienteData: ClienteUpdateRequest) => Promise<Cliente>;
  deleteCliente: (id: number) => Promise<void>;

  // Búsquedas y filtros
  getClienteById: (id: number) => Promise<Cliente>;
  searchByNumero: (nCliente: string) => Promise<Cliente>;
  searchByNombre: (query: string) => Promise<Cliente[]>;
  filterByRegion: (regionId: number) => Promise<Cliente[]>;
  filterByComuna: (comunaId: number) => Promise<Cliente[]>;

  // Utilidades
  clearError: () => void;
  refetch: () => Promise<void>;
}

export const useClientes = (): UseClientesReturn => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los clientes
  const loadClientes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Cargando clientes...');
      const data = await clientesService.getClientes();

      console.log('✅ Clientes cargados:', data.length);
      setClientes(data);
    } catch (err) {
      console.error('❌ Error cargando clientes:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Crear cliente
  const createCliente = async (clienteData: ClienteCreateRequest): Promise<Cliente> => {
    try {
      setError(null);
      console.log('🔄 Creando cliente:', clienteData);

      const nuevoCliente = await clientesService.createCliente(clienteData);
      console.log('✅ Cliente creado:', nuevoCliente);

      setClientes(prev => [...prev, nuevoCliente]);
      return nuevoCliente;
    } catch (err) {
      console.error('❌ Error creando cliente:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Actualizar cliente
  const updateCliente = async (id: number, clienteData: ClienteUpdateRequest): Promise<Cliente> => {
    try {
      setError(null);
      console.log('🔄 Actualizando cliente:', id, clienteData);

      const clienteActualizado = await clientesService.updateCliente(id, clienteData);
      console.log('✅ Cliente actualizado:', clienteActualizado);

      setClientes(prev =>
        prev.map(cliente =>
          cliente.idCliente === id ? clienteActualizado : cliente
        )
      );

      return clienteActualizado;
    } catch (err) {
      console.error('❌ Error actualizando cliente:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Eliminar cliente
  const deleteCliente = async (id: number): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 Eliminando cliente:', id);

      await clientesService.deleteCliente(id);
      console.log('✅ Cliente eliminado:', id);

      setClientes(prev => prev.filter(cliente => cliente.idCliente !== id));
    } catch (err) {
      console.error('❌ Error eliminando cliente:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Buscar cliente por ID
  const getClienteById = async (id: number): Promise<Cliente> => {
    try {
      setError(null);
      return await clientesService.getCliente(id);
    } catch (err) {
      console.error('❌ Error obteniendo cliente por ID:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Buscar por número
  const searchByNumero = async (nCliente: string): Promise<Cliente> => {
    try {
      setError(null);
      return await clientesService.getClienteByNumero(nCliente);
    } catch (err) {
      console.error('❌ Error buscando cliente por número:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar el cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Buscar por nombre
  const searchByNombre = async (query: string): Promise<Cliente[]> => {
    try {
      setError(null);
      return await clientesService.searchClientes(query);
    } catch (err) {
      console.error('❌ Error buscando clientes por nombre:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar clientes';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Filtrar por región
  const filterByRegion = async (regionId: number): Promise<Cliente[]> => {
    try {
      setError(null);
      const clientesFiltrados = await clientesService.getClientesByRegion(regionId);
      setClientes(clientesFiltrados);
      return clientesFiltrados;
    } catch (err) {
      console.error('❌ Error filtrando clientes por región:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al filtrar clientes';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Filtrar por comuna
  const filterByComuna = async (comunaId: number): Promise<Cliente[]> => {
    try {
      setError(null);
      const clientesFiltrados = await clientesService.getClientesByComuna(comunaId);
      setClientes(clientesFiltrados);
      return clientesFiltrados;
    } catch (err) {
      console.error('❌ Error filtrando clientes por comuna:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al filtrar clientes';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Utilidades
  const clearError = (): void => {
    setError(null);
  };

  const refetch = async (): Promise<void> => {
    await loadClientes();
  };

  // Cargar clientes al montar el hook
  useEffect(() => {
    loadClientes();
  }, []);

  return {
    clientes,
    loading,
    error,

    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente,

    getClienteById,
    searchByNumero,
    searchByNombre,
    filterByRegion,
    filterByComuna,

    clearError,
    refetch
  };
};
