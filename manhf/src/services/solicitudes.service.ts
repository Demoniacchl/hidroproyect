import { apiClient } from './api';

export interface Solicitud {
  id: number;
  idOrden: number;
  tipoOrden: string;
  estado: string;
  fechaCreacion: string;
  observacionesAdmin?: string;
}

export interface SolicitudCreateRequest {
  idOrden: number;
  tipoOrden: string;
  estado: string;
  fechaCreacion: string;
  observacionesAdmin?: string;
}

export const solicitudesService = {
  // Listar todas las solicitudes
  async getSolicitudes(): Promise<Solicitud[]> {
    return apiClient.get('/solicitudes');
  },

  // Obtener solicitud específica
  async getSolicitud(id: number): Promise<Solicitud> {
    return apiClient.get(`/solicitudes/${id}`);
  },

  // Solicitudes por estado
  async getSolicitudesByEstado(estado: string): Promise<Solicitud[]> {
    return apiClient.get(`/solicitudes/estado/${estado}`);
  },

  // Crear solicitud
  async createSolicitud(solicitud: SolicitudCreateRequest): Promise<Solicitud> {
    return apiClient.post('/solicitudes', solicitud);
  },

  // Actualizar solicitud
  async updateSolicitud(id: number, solicitud: Partial<SolicitudCreateRequest>): Promise<Solicitud> {
    return apiClient.put(`/solicitudes/${id}`, solicitud);
  },

  // Eliminar solicitud (si está implementado en el backend)
  async deleteSolicitud(id: number): Promise<void> {
    return apiClient.delete(`/solicitudes/${id}`);
  }
};