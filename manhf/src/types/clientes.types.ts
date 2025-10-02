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

export interface ClienteFormData {
  n_cliente: number;
  nombre1: string;
  nombre2?: string;
  rut: string;
  telefono1: string;
  telefono2?: string;
  correo: string;
  observaciones?: string;
}

export interface ClienteFilters {
  regionId?: number;
  comunaId?: number;
  searchQuery?: string;
}