import { apiClient } from './api';

export interface OrdenMantencion {
  id_orden: number;
  id_motor: number;
  id_tecnico: number;
  hora_ingreso: string;
  hora_salida: string;
  r: number;
  s: number;
  t: number;
  voltaje: number;
  observaciones: string;
  firma_cliente: string;
  tipo_orden: string;
  cambio_rodamientos?: string;
  cambio_sello?: string;
  cambio_voluta?: string;
  rebobino_campos?: string;
  protecciones_saltadas?: string;
  cambio_protecciones?: string;
  contactores_quemados?: string;
  cambio_contactores?: string;
  cambio_luces_piloto?: string;
  limpio_tablero?: string;
  cambio_presostato?: string;
  cambio_manometro?: string;
  cargo_con_aire_ep?: string;
  reviso_presion_ep?: string;
  cambio_valv_retencion?: string;
  suprimo_filtracion?: string;
  reviso_valv_compuerta?: string;
  reviso_valv_flotador?: string;
  reviso_estanque_agua?: string;
  reviso_fittings_otros?: string;
  cliente?: {
    id_cliente: number;
    n_cliente: number;
    nombre1: string;
    rut: string;
  };
  equipo?: {
    id_motor: number;
    tipo: string;
    marca: string;
    modelo: string;
  };
  tecnico?: {
    id_usuario: number;
    nombre: string;
  };
  ubicacion?: {
    nombre: string;
    calle: string;
    numero: string;
  };
}

export interface OrdenReparacion {
  id_orden_reparacion: number;
  id_motor: number;
  id_tecnico: number;
  fecha: string;
  observaciones: string;
  progreso: string;
  firma_cliente: string;
  cliente?: {
    id_cliente: number;
    n_cliente: number;
    nombre1: string;
    rut: string;
  };
  equipo?: {
    id_motor: number;
    tipo: string;
    marca: string;
    modelo: string;
  };
  tecnico?: {
    id_usuario: number;
    nombre: string;
  };
  ubicacion?: {
    nombre: string;
    calle: string;
    numero: string;
  };
}

export interface OrdenFilters {
  cliente?: string;
  rut?: string;
  ubicacion?: string;
  tipo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export const ordenesService = {
  // Obtener todas las órdenes de mantención
  getMantenciones: async (filters?: OrdenFilters): Promise<OrdenMantencion[]> => {
    const params: any = { ...filters };
    
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    const response = await apiClient.get('/mantenciones', { params });
    return response.data;
  },

  // Obtener todas las órdenes de reparación
  getReparaciones: async (filters?: OrdenFilters): Promise<OrdenReparacion[]> => {
    const params: any = { ...filters };
    
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    const response = await apiClient.get('/reparaciones', { params });
    return response.data;
  },

  // Buscar órdenes por término (búsqueda global)
  buscarOrdenes: async (termino: string): Promise<{
    mantenciones: OrdenMantencion[];
    reparaciones: OrdenReparacion[];
  }> => {
    const [mantenciones, reparaciones] = await Promise.all([
      apiClient.get('/mantenciones', { params: { search: termino } }),
      apiClient.get('/reparaciones', { params: { search: termino } })
    ]);
    
    return {
      mantenciones: mantenciones.data,
      reparaciones: reparaciones.data
    };
  },

  // Obtener órdenes por cliente
  getOrdenesByCliente: async (idCliente: number): Promise<{
    mantenciones: OrdenMantencion[];
    reparaciones: OrdenReparacion[];
  }> => {
    const [mantenciones, reparaciones] = await Promise.all([
      apiClient.get(`/mantenciones/cliente/${idCliente}`),
      apiClient.get(`/reparaciones/cliente/${idCliente}`)
    ]);
    
    return {
      mantenciones: mantenciones.data,
      reparaciones: reparaciones.data
    };
  },

  // Obtener orden de mantención por ID
  getMantencionById: async (id: number): Promise<OrdenMantencion> => {
    const response = await apiClient.get(`/mantenciones/${id}`);
    return response.data;
  },

  // Obtener orden de reparación por ID
  getReparacionById: async (id: number): Promise<OrdenReparacion> => {
    const response = await apiClient.get(`/reparaciones/${id}`);
    return response.data;
  },

  // Crear nueva orden de mantención
  createMantencion: async (ordenData: any): Promise<OrdenMantencion> => {
    const response = await apiClient.post('/mantenciones', ordenData);
    return response.data;
  },

  // Crear nueva orden de reparación
  createReparacion: async (ordenData: any): Promise<OrdenReparacion> => {
    const response = await apiClient.post('/reparaciones', ordenData);
    return response.data;
  },

  // Actualizar orden de mantención
  updateMantencion: async (id: number, ordenData: any): Promise<OrdenMantencion> => {
    const response = await apiClient.put(`/mantenciones/${id}`, ordenData);
    return response.data;
  },

  // Actualizar orden de reparación
  updateReparacion: async (id: number, ordenData: any): Promise<OrdenReparacion> => {
    const response = await apiClient.put(`/reparaciones/${id}`, ordenData);
    return response.data;
  }
};