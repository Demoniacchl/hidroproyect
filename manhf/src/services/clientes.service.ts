import { apiClient } from './api';

export interface Cliente {
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

export interface ClienteCreateRequest {
  n_cliente: number;
  nombre1: string;
  nombre2?: string;
  rut: string;
  telefono1: string;
  telefono2?: string;
  correo: string;
  observaciones?: string;
}

export interface ClienteUpdateRequest {
  n_cliente?: number;
  nombre1?: string;
  nombre2?: string;
  rut?: string;
  telefono1?: string;
  telefono2?: string;
  correo?: string;
  observaciones?: string;
}

export interface PaginatedClientes {
  content: Cliente[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const clientesService = {
  // Listar clientes (paginado)
  async getClientes(
    page: number = 0, 
    size: number = 20, 
    sort: string = 'nombre1,asc'
  ): Promise<PaginatedClientes> {
    return apiClient.get(`/clientes?page=${page}&size=${size}&sort=${sort}`);
  },

  // Buscar cliente por número
  async getClienteByNumero(nCliente: string): Promise<Cliente> {
    return apiClient.get(`/clientes/numero/${nCliente}`);
  },

  // Filtrar por región
  async getClientesByRegion(regionId: number): Promise<Cliente[]> {
    return apiClient.get(`/clientes/region/${regionId}`);
  },

  // Filtrar por comuna
  async getClientesByComuna(comunaId: number): Promise<Cliente[]> {
    return apiClient.get(`/clientes/comuna/${comunaId}`);
  },

  // Obtener cliente específico
  async getCliente(id: number): Promise<Cliente> {
    return apiClient.get(`/clientes/${id}`);
  },

  // Crear cliente
  async createCliente(cliente: ClienteCreateRequest): Promise<Cliente> {
    return apiClient.post('/clientes', cliente);
  },

  // Actualizar cliente
  async updateCliente(id: number, cliente: ClienteUpdateRequest): Promise<Cliente> {
    return apiClient.put(`/clientes/${id}`, cliente);
  },

  // Eliminar cliente
  async deleteCliente(id: number): Promise<void> {
    return apiClient.delete(`/clientes/${id}`);
  },

  // Buscar clientes por nombre (si el backend lo soporta)
  async searchClientes(query: string): Promise<Cliente[]> {
    const response = await this.getClientes(0, 100);
    return response.content.filter(cliente =>
      cliente.nombre1.toLowerCase().includes(query.toLowerCase()) ||
      cliente.nombre2?.toLowerCase().includes(query.toLowerCase()) ||
      cliente.rut.includes(query)
    );
  }
};