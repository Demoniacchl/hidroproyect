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
}