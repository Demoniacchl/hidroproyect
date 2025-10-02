import { apiClient } from './api';

export interface Equipo {
  idMotor: number;
  idUbicacion: number;
  tipo: string;
  marca: string;
  modelo: string;
  potencia: number;
  voltaje: number;
  serie: string;
  fechaInstalacion: string;
  estado: string;
}

export interface EquipoCreateRequest {
  idUbicacion: number;
  tipo: string;
  marca: string;
  modelo: string;
  potencia: number;
  voltaje: number;
  serie: string;
  fechaInstalacion: string;
  estado: string;
}

export const equiposService = {
  // Listar equipos
  async getEquipos() {
    return apiClient.get('/equipos');
  },

  // Obtener equipo específico
  async getEquipo(id: number) {
    return apiClient.get(`/equipos/${id}`);
  },

  // Equipos por ubicación
  async getEquiposByUbicacion(ubicacionId: number) {
    return apiClient.get(`/equipos/ubicacion/${ubicacionId}`);
  },

  // Crear equipo
  async createEquipo(equipo: EquipoCreateRequest) {
    return apiClient.post('/equipos', equipo);
  },

  // Actualizar equipo
  async updateEquipo(id: number, equipo: Partial<EquipoCreateRequest>) {
    return apiClient.put(`/equipos/${id}`, equipo);
  },

  // Eliminar equipo
  async deleteEquipo(id: number) {
    return apiClient.delete(`/equipos/${id}`);
  }
};