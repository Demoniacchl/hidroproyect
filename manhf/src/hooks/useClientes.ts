// src/hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { clientesService, Cliente, PaginatedClientes, ClienteCreateRequest, ClienteUpdateRequest } from '../services/clientes.service';

interface UseClientesReturn {
  // Estado
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  
  // Paginación
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
  };
  
  // Acciones principales
  loadClientes: (page?: number, size?: number) => Promise<void>;
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
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20
  });

  // Cargar clientes iniciales
  const loadClientes = async (page: number = 0, size: number = 20): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando clientes...', { page, size });
      const response: PaginatedClientes = await clientesService.getClientes(page, size);
      
      console.log('✅ Clientes cargados:', response.content.length);
      setClientes(response.content);
      setPagination({
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        size: response.size
      });
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
      
      // Recargar la lista para incluir el nuevo cliente
      await loadClientes(pagination.currentPage, pagination.size);
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
      
      // Actualizar el cliente en la lista local
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
      
      // Remover el cliente de la lista local
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

  // Buscar por número de cliente
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
    await loadClientes(pagination.currentPage, pagination.size);
  };

  // Cargar clientes al montar el hook
  useEffect(() => {
    loadClientes();
  }, []);

  return {
    // Estado
    clientes,
    loading,
    error,
    
    // Paginación
    pagination,
    
    // Acciones principales
    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    
    // Búsquedas y filtros
    getClienteById,
    searchByNumero,
    searchByNombre,
    filterByRegion,
    filterByComuna,
    
    // Utilidades
    clearError,
    refetch
  };
};