// src/services/ubicacion.service.ts
import { apiClient } from './api';

export interface Ubicacion {
  idUbicacion: number;
  idCliente: number;
  nombre: string;
  regionId: number;
  comunaId: number;
  calle: string;
  numero: string;
  cliente?: {
    idCliente: number;
    nombre1: string;
    rut?: string;
  };
  region?: {
    id: number;
    region: string;
  };
  comuna?: {
    id: number;
    comuna: string;
  };
}

export const ubicacionService = {
  /**
   * Obtener todas las ubicaciones
   */
  getUbicaciones: async (): Promise<Ubicacion[]> => {
    try {
      const response = await apiClient.get('/ubicaciones');
      return response;
    } catch (error) {
      console.error('Error obteniendo ubicaciones:', error);
      throw error;
    }
  },

  /**
   * Obtener ubicación por ID
   */
  getUbicacionById: async (id: number): Promise<Ubicacion> => {
    try {
      const response = await apiClient.get(`/ubicaciones/${id}`);
      return response;
    } catch (error) {
      console.error(`Error obteniendo ubicación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener ubicaciones por cliente
   */
  getUbicacionesByCliente: async (clienteId: number): Promise<Ubicacion[]> => {
    try {
      const response = await apiClient.get(`/ubicaciones/cliente/${clienteId}`);
      return response;
    } catch (error) {
      console.error(`Error obteniendo ubicaciones para cliente ${clienteId}:`, error);
      throw error;
    }
  },

  /**
   * Crear nueva ubicación
   */
  createUbicacion: async (ubicacionData: any): Promise<Ubicacion> => {
    try {
      const response = await apiClient.post('/ubicaciones', ubicacionData);
      return response;
    } catch (error) {
      console.error('Error creando ubicación:', error);
      throw error;
    }
  },

  /**
   * Actualizar ubicación
   */
  updateUbicacion: async (id: number, ubicacionData: any): Promise<Ubicacion> => {
    try {
      const response = await apiClient.put(`/ubicaciones/${id}`, ubicacionData);
      return response;
    } catch (error) {
      console.error(`Error actualizando ubicación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar ubicación
   */
  deleteUbicacion: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/ubicaciones/${id}`);
    } catch (error) {
      console.error(`Error eliminando ubicación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar ubicaciones por término
   */
  buscarUbicaciones: async (termino: string): Promise<Ubicacion[]> => {
    try {
      const response = await apiClient.get('/ubicaciones/buscar', {
        params: { termino }
      });
      return response;
    } catch (error) {
      console.error('Error buscando ubicaciones:', error);
      throw error;
    }
  }
};