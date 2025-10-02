import { apiClient } from './api';

export interface EventoCalendario {
  id: number;
  idCliente: number;
  idEquipo?: number;
  idTecnico: number;
  tipoEvento: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

export interface EventoCreateRequest {
  idCliente: number;
  idEquipo?: number;
  idTecnico: number;
  tipoEvento: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

export const calendarioService = {
  // Listar todos los eventos
  async getEventos(): Promise<EventoCalendario[]> {
    return apiClient.get('/calendario');
  },

  // Obtener evento específico
  async getEvento(id: number): Promise<EventoCalendario> {
    return apiClient.get(`/calendario/${id}`);
  },

  // Eventos por cliente
  async getEventosPorCliente(clienteId: number): Promise<EventoCalendario[]> {
    return apiClient.get(`/calendario/cliente/${clienteId}`);
  },

  // Eventos por fecha (necesitaríamos implementar este endpoint o filtrar del lado del frontend)
  async getEventosPorFecha(fecha: string): Promise<EventoCalendario[]> {
    const eventos = await this.getEventos();
    return eventos.filter(evento => 
      evento.fechaInicio.startsWith(fecha)
    );
  },

  // Crear evento
  async createEvento(evento: EventoCreateRequest): Promise<EventoCalendario> {
    return apiClient.post('/calendario', evento);
  },

  // Actualizar evento
  async updateEvento(id: number, evento: Partial<EventoCreateRequest>): Promise<EventoCalendario> {
    return apiClient.put(`/calendario/${id}`, evento);
  },

  // Eliminar evento
  async deleteEvento(id: number): Promise<void> {
    return apiClient.delete(`/calendario/${id}`);
  }
};