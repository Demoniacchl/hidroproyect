export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TECNICO';

export interface AuthState {
  user: {
    usuario: string;
    rol: UserRole;
    nombre: string;
    token: string;
  } | null;
  isLoading: boolean;
}

export interface LoginFormData {
  usuario: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  usuario: string;
  rol: UserRole;
  nombre: string;
}