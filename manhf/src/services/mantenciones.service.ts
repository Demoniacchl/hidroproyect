import { apiClient } from './api';

export interface Mantencion {
  idMantencion?: number;
  idMotor: number;
  idTecnico: number;
  horaIngreso: string;
  horaSalida: string;
  r: number;
  s: number;
  t: number;
  voltaje: number;
  observaciones: string;
  firmaCliente: string;
  tipoOrden: string;
  campoAdicional?: string;
  cambioRodamientos: string;
  cambioSello: string;
  cambioVoluta: string;
  rebobinoCampos: string;
  proteccionesSaltadas: string;
  cambioProtecciones: string;
  contactoresQuemados: string;
  cambioContactores: string;
  cambioLucesPiloto: string;
  limpioTablero: string;
  cambioPresostato: string;
  cambioManometro: string;
  cargoConAireEp: string;
  revisoPresionEp: string;
  cambioValvRetencion: string;
  suprimoFiltracion: string;
  revisoValvCompuerta: string;
  revisoValvFlotador: string;
  revisoEstanqueAgua: string;
  revisoFittingsOtros: string;
}

export const mantencionesService = {
  // Listar mantenciones
  async getMantenciones() {
    return apiClient.get('/mantenciones');
  },

  // Obtener mantención específica
  async getMantencion(id: number) {
    return apiClient.get(`/mantenciones/${id}`);
  },

  // Mantenciones por equipo
  async getMantencionesByEquipo(equipoId: number) {
    return apiClient.get(`/mantenciones/equipo/${equipoId}`);
  },

  // Crear mantención
  async createMantencion(mantencion: Mantencion) {
    return apiClient.post('/mantenciones', mantencion);
  },

  // Actualizar mantención
  async updateMantencion(id: number, mantencion: Partial<Mantencion>) {
    return apiClient.put(`/mantenciones/${id}`, mantencion);
  }
};