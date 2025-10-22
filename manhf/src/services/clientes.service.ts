import { apiClient } from './api';

export interface Region {
  id: number;
  region: string;
}

export interface Comuna {
  id: number;
  comuna: string;
  regionId: number;
}

export interface Ubicacion {
  idUbicacion: number;
  nombre: string;
  regionId: number;
  comunaId: number;
  calle: string;
  numero: string;
  region?: Region;
  comuna?: Comuna;
  motores?: Motor[];
}

export interface Motor {
  idMotor: number;
  idUbicacion: number;
  tipo: string;
  marca: string;
  modelo: string;
  potencia: number;
  voltaje: number;
  r?: number;
  s?: number;
  t?: number;
  serie: string;
  fechaInstalacion: string;
  estado: string;
}

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
  ubicaciones: Ubicacion[];
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

export interface UbicacionCreateRequest {
  nombre: string;
  regionId: number;
  comunaId: number;
  calle: string;
  numero: string;
  idCliente: number;
}

export interface UbicacionUpdateRequest {
  nombre?: string;
  regionId?: number;
  comunaId?: number;
  calle?: string;
  numero?: string;
}

export interface MotorCreateRequest {
  tipo: string;
  marca: string;
  modelo: string;
  potencia: number;
  voltaje: number;
  r?: number;
  s?: number;
  t?: number;
  serie: string;
  fechaInstalacion: string;
  estado: string;
  idUbicacion: number;
}

export interface MotorUpdateRequest {
  tipo?: string;
  marca?: string;
  modelo?: string;
  potencia?: number;
  voltaje?: number;
  r?: number;
  s?: number;
  t?: number;
  serie?: string;
  fechaInstalacion?: string;
  estado?: string;
}

export const clientesService = {
  // Clientes
  async getClientes(): Promise<Cliente[]> {
    return apiClient.get('/clientes');
  },

  async getClienteByNumero(nCliente: string): Promise<Cliente> {
    return apiClient.get(`/clientes/numero/${nCliente}`);
  },

  async getCliente(id: number): Promise<Cliente> {
    return apiClient.get(`/clientes/${id}`);
  },

  async createCliente(cliente: ClienteCreateRequest): Promise<Cliente> {
    return apiClient.post('/clientes', cliente);
  },

  async updateCliente(id: number, cliente: ClienteUpdateRequest): Promise<Cliente> {
    return apiClient.put(`/clientes/${id}`, cliente);
  },

  async deleteCliente(id: number): Promise<void> {
    return apiClient.delete(`/clientes/${id}`);
  },

  async searchClientes(query: string): Promise<Cliente[]> {
    const clientes = await this.getClientes();
    return clientes.filter(cliente =>
      cliente.nombre1.toLowerCase().includes(query.toLowerCase()) ||
      cliente.nombre2?.toLowerCase().includes(query.toLowerCase()) ||
      cliente.rut.includes(query)
    );
  },

  // Ubicaciones
  async getUbicaciones(): Promise<Ubicacion[]> {
    return apiClient.get('/ubicaciones');
  },

  async getUbicacionesByCliente(idCliente: number): Promise<Ubicacion[]> {
    return apiClient.get(`/clientes/${idCliente}/ubicaciones`);
  },

  async getUbicacion(id: number): Promise<Ubicacion> {
    return apiClient.get(`/ubicaciones/${id}`);
  },

  async createUbicacion(ubicacion: UbicacionCreateRequest): Promise<Ubicacion> {
    return apiClient.post('/ubicaciones', ubicacion);
  },

  async updateUbicacion(id: number, ubicacion: UbicacionUpdateRequest): Promise<Ubicacion> {
    return apiClient.put(`/ubicaciones/${id}`, ubicacion);
  },

  async deleteUbicacion(id: number): Promise<void> {
    return apiClient.delete(`/ubicaciones/${id}`);
  },

  // Motores
  async getMotores(): Promise<Motor[]> {
    return apiClient.get('/equipomotor');
  },

  async getMotoresByUbicacion(idUbicacion: number): Promise<Motor[]> {
    const motores = await this.getMotores();
    return motores.filter(motor => motor.idUbicacion === idUbicacion);
  },

  async getMotor(id: number): Promise<Motor> {
    return apiClient.get(`/equipomotor/${id}`);
  },

  async createMotor(motor: MotorCreateRequest): Promise<Motor> {
    return apiClient.post('/equipomotor', motor);
  },

  async updateMotor(id: number, motor: MotorUpdateRequest): Promise<Motor> {
    return apiClient.put(`/equipomotor/${id}`, motor);
  },

  async deleteMotor(id: number): Promise<void> {
    return apiClient.delete(`/equipomotor/${id}`);
  },

  // Regiones y Comunas
  async getRegiones(): Promise<Region[]> {
    return apiClient.get('/regiones');
  },

  async getComunas(): Promise<Comuna[]> {
    return apiClient.get('/comunas');
  },

  async getComunasByRegion(regionId: number): Promise<Comuna[]> {
    const comunas = await this.getComunas();
    return comunas.filter(comuna => comuna.regionId === regionId);
  }
};