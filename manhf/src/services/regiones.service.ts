import { apiClient } from './api';
export const regionesService = {
  async getRegiones(): Promise<Region[]> {
    return await apiClient.get('/regiones');
  },

  async getComunas(): Promise<Comuna[]> {
    return await apiClient.get('/comunas');
  },

  async getComunasByRegion(regionId: number): Promise<Comuna[]> {
    return await apiClient.get(`/comunas/region/${regionId}`);
  }
};