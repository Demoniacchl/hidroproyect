import { apiClient } from './api';

export interface Cliente {
  idCliente: number;          // Cambiado de id_cliente
  nCliente: number;           // Cambiado de n_cliente
  nombre1: string;
  rut: string;
}

export interface Equipo {
  idMotor: number;            // Cambiado de id_motor
  tipo: string;
  marca: string;
  modelo: string;
}

export interface Tecnico {
  idUsuario: number;          // Cambiado de id_usuario
  nombre: string;
}

export interface Ubicacion {
  nombre: string;
  calle: string;
  numero: string;
}

export interface OrdenMantencion {
  idOrden: number;            // Cambiado de id_orden
  idMotor: number;            // Cambiado de id_motor
  idTecnico: number;          // Cambiado de id_tecnico
  horaIngreso: string;        // Cambiado de hora_ingreso
  horaSalida: string;         // Cambiado de hora_salida
  r: number;
  s: number;
  t: number;
  voltaje: number;
  observaciones: string;
  firmaCliente: string;       // Cambiado de firma_cliente
  tipoOrden: string;          // Cambiado de tipo_orden
  campoAdicional?: string;
  cambioRodamientos?: string;
  cambioSello?: string;
  cambioVoluta?: string;
  rebobinoCampos?: string;
  proteccionesSaltadas?: string;
  cambioProtecciones?: string;
  contactoresQuemados?: string;
  cambioContactores?: string;
  cambioLucesPiloto?: string;
  limpioTablero?: string;
  cambioPresostato?: string;
  cambioManometro?: string;
  cargoConAireEp?: string;
  revisoPresionEp?: string;
  cambioValvRetencion?: string;
  suprimoFiltracion?: string;
  revisoValvCompuerta?: string;
  revisoValvFlotador?: string;
  revisoEstanqueAgua?: string;
  revisoFittingsOtros?: string;
  cliente?: Cliente;
  equipo?: Equipo;
  tecnico?: Tecnico;
  ubicacion?: Ubicacion;
}

export interface OrdenReparacion {
  idOrdenReparacion: number;  // ← CAMBIADO de idOrden a idOrdenReparacion
  idMotor: number;
  idTecnico: number;
  fecha: string;
  observaciones: string;
  progreso: string;
  firmaCliente: string;
  idCliente: number;
  equipo?: Equipo;
  tecnico?: Tecnico;
  ubicacion?: Ubicacion;
}

export interface OrdenFilters {
  cliente?: string;
  rut?: string;
  ubicacion?: string;
  tipo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: string;
  tecnico?: string;
}

export interface RangoFechas {
  inicio: string;
  fin: string;
}

// Helper para limpiar parámetros undefined/empty
const cleanParams = (params: any): any => {
  const cleaned: any = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
      cleaned[key] = params[key];
    }
  });
  return cleaned;
};

export const ordenesService = {
  /**
   * Obtener todas las órdenes de mantención
   */
  getMantenciones: async (): Promise<OrdenMantencion[]> => {
    try {
      console.log('🔄 Obteniendo órdenes de mantención...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor inicia sesión.');
      }
      
      console.log('🔐 Token encontrado, haciendo request...');
      const response = await apiClient.get('/ordenes-mantenimiento');
      console.log('✅ Órdenes de mantención obtenidas correctamente', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Error obteniendo mantenciones:', error);
      
      if (error.message.includes('401') || error.message.includes('No autenticado')) {
        throw new Error('Error de autenticación. Por favor inicia sesión nuevamente.');
      }
      
      throw error;
    }
  },

  /**
   * Obtener todas las órdenes de reparación
   */
  getReparaciones: async (): Promise<OrdenReparacion[]> => {
    try {
      console.log('🔄 Obteniendo órdenes de reparación...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor inicia sesión.');
      }
      
      console.log('🔐 Token encontrado, haciendo request...');
      const response = await apiClient.get('/ordenes-reparacion');
      console.log('✅ Órdenes de reparación obtenidas correctamente', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Error obteniendo reparaciones:', error);
      
      if (error.message.includes('401') || error.message.includes('No autenticado')) {
        throw new Error('Error de autenticación. Por favor inicia sesión nuevamente.');
      }
      
      throw error;
    }
  },

  /**
   * Obtener orden de mantención por ID
   */
  getMantencionById: async (id: number): Promise<OrdenMantencion> => {
    try {
      const response = await apiClient.get(`/ordenes-mantenimiento/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching mantención ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener orden de reparación por ID
   */
  getReparacionById: async (id: number): Promise<OrdenReparacion> => {
    try {
      const response = await apiClient.get(`/ordenes-reparacion/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching reparación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener órdenes de mantención por motor
   */
  getMantencionesByMotor: async (motorId: number): Promise<OrdenMantencion[]> => {
    try {
      const response = await apiClient.get(`/ordenes-mantenimiento/motor/${motorId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching mantenciones for motor ${motorId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener órdenes de mantención por rango de fechas
   */
  getMantencionesByRangoFechas: async (inicio: string, fin: string): Promise<OrdenMantencion[]> => {
    try {
      const response = await apiClient.get('/ordenes-mantenimiento/rango-fechas', { inicio, fin });
      return response;
    } catch (error) {
      console.error('Error fetching mantenciones por rango de fechas:', error);
      throw error;
    }
  },

  /**
   * Obtener órdenes de reparación por cliente
   */
  getReparacionesByCliente: async (clienteId: number): Promise<OrdenReparacion[]> => {
    try {
      const response = await apiClient.get(`/ordenes-reparacion/cliente/${clienteId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching reparaciones for cliente ${clienteId}:`, error);
      throw error;
    }
  },

  /**
   * Crear nueva orden de mantención
   */
  createMantencion: async (ordenData: any): Promise<OrdenMantencion> => {
    try {
      const response = await apiClient.post('/ordenes-mantenimiento', ordenData);
      return response;
    } catch (error) {
      console.error('Error creating mantención:', error);
      throw error;
    }
  },

  /**
   * Crear nueva orden de reparación
   */
  createReparacion: async (ordenData: any): Promise<OrdenReparacion> => {
    try {
      const response = await apiClient.post('/ordenes-reparacion', ordenData);
      return response;
    } catch (error) {
      console.error('Error creating reparación:', error);
      throw error;
    }
  },

  /**
   * Actualizar orden de mantención
   */
  updateMantencion: async (id: number, ordenData: any): Promise<OrdenMantencion> => {
    try {
      const response = await apiClient.put(`/ordenes-mantenimiento/${id}`, ordenData);
      return response;
    } catch (error) {
      console.error(`Error updating mantención ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar orden de reparación
   */
  updateReparacion: async (id: number, ordenData: any): Promise<OrdenReparacion> => {
    try {
      const response = await apiClient.put(`/ordenes-reparacion/${id}`, ordenData);
      return response;
    } catch (error) {
      console.error(`Error updating reparación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar progreso de orden de reparación
   */
  updateProgresoReparacion: async (id: number, progreso: string): Promise<OrdenReparacion> => {
    try {
      const response = await apiClient.put(`/ordenes-reparacion/${id}/progreso`, {}, {
        params: { progreso }
      });
      return response;
    } catch (error) {
      console.error(`Error updating progreso for reparación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar orden de mantención
   */
  deleteMantencion: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/ordenes-mantenimiento/${id}`);
    } catch (error) {
      console.error(`Error deleting mantención ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar orden de reparación
   */
  deleteReparacion: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/ordenes-reparacion/${id}`);
    } catch (error) {
      console.error(`Error deleting reparación ${id}:`, error);
      throw error;
    }
  },

  /**
   * Búsqueda global de órdenes
   */
  buscarOrdenes: async (termino: string): Promise<{
    mantenciones: OrdenMantencion[];
    reparaciones: OrdenReparacion[];
  }> => {
    try {
      // Para búsqueda global, obtenemos todas y filtramos en el frontend
      const [mantenciones, reparaciones] = await Promise.all([
        ordenesService.getMantenciones(),
        ordenesService.getReparaciones()
      ]);
      
      // Filtrar mantenciones
      const mantencionesFiltradas = mantenciones.filter(orden => 
        orden.cliente?.nombre1?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.ubicacion?.nombre?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.equipo?.marca?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.equipo?.modelo?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.observaciones?.toLowerCase().includes(termino.toLowerCase())
      );
      
      // Filtrar reparaciones
      const reparacionesFiltradas = reparaciones.filter(orden => 
        orden.cliente?.nombre1?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.ubicacion?.nombre?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.equipo?.marca?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.equipo?.modelo?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.observaciones?.toLowerCase().includes(termino.toLowerCase()) ||
        orden.progreso?.toLowerCase().includes(termino.toLowerCase())
      );
      
      return {
        mantenciones: mantencionesFiltradas,
        reparaciones: reparacionesFiltradas
      };
    } catch (error) {
      console.error(`Error searching órdenes for term: ${termino}:`, error);
      throw error;
    }
  },
};