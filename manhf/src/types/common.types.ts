export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TECNICO';

export type EstadoCalendario = 'PROGRAMADO' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';

export type TipoEvento = 'MANTENCION' | 'REPARACION' | 'EMERGENCIA' | 'INSTALACION';

export type ProgresoReparacion = 'REALIZADO' | 'NO_REALIZADO' | 'EN_GESTION';

export type EstadoSolicitud = 'PENDIENTE' | 'EN_PROCESO' | 'APROBADO' | 'RECHAZADO';

export type ChecklistOption = 'SI' | 'NO' | 'CB';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Interfaces para las solicitudes
export interface Solicitud {
  id: number;
  idOrden: number;
  tipoOrden: string;
  estado: EstadoSolicitud;
  fechaCreacion: string;
  observacionesAdmin?: string;
}

// Interfaces para el calendario
export interface EventoCalendario {
  id: number;
  idCliente: number;
  idEquipo?: number;
  idTecnico: number;
  tipoEvento: TipoEvento;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCalendario;
}