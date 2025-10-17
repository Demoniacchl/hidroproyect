import { apiClient } from './api';

export interface Cliente {
  idCliente: number;
  ncliente: number;
  nombre1: string;
  nombre2?: string;
  rut: string;
  telefono1: string;
  telefono2?: string;
  correo: string;
  observaciones?: string;
}

export interface ClienteCreateRequest {
  ncliente: number;
  nombre1: string;
  nombre2?: string;
  rut: string;
  telefono1: string;
  telefono2?: string;
  correo: string;
  observaciones?: string;
}

export interface ClienteUpdateRequest {
  ncliente?: number;
  nombre1?: string;
  nombre2?: string;
  rut?: string;
  telefono1?: string;
  telefono2?: string;
  correo?: string;
  observaciones?: string;
}

export const clientesService = {
  // Listar todos los clientes (sin paginación)
  async getClientes(): Promise<Cliente[]> {
    return apiClient.get('/clientes');
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

  // Buscar clientes por nombre o RUT
  async searchClientes(query: string): Promise<Cliente[]> {
    const clientes = await this.getClientes();
    return clientes.filter(cliente =>
      cliente.nombre1.toLowerCase().includes(query.toLowerCase()) ||
      cliente.nombre2?.toLowerCase().includes(query.toLowerCase()) ||
      cliente.rut.includes(query)
    );
  }
};
