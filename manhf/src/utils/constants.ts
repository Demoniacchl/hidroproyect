export const API_BASE_URL = 'http://localhost:8080/api';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TECNICO: 'TECNICO'
} as const;

export const ESTADOS_CALENDARIO = {
  PROGRAMADO: 'PROGRAMADO',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO'
} as const;

export const TIPOS_EVENTO = {
  MANTENCION: 'MANTENCION',
  REPARACION: 'REPARACION',
  EMERGENCIA: 'EMERGENCIA',
  INSTALACION: 'INSTALACION'
} as const;

export const CHECKLIST_OPTIONS = {
  SI: 'SI',
  NO: 'NO',
  CB: 'CB'
} as const;

// Usuarios demo para desarrollo
export const DEMO_USERS = [
  { usuario: 'superadmin', contrasena: 'password', rol: 'SUPER_ADMIN', nombre: 'Super Administrador' },
  { usuario: 'admin', contrasena: 'password', rol: 'ADMIN', nombre: 'Administrador' },
  { usuario: 'tecnico', contrasena: 'password', rol: 'TECNICO', nombre: 'Técnico Demo' }
];