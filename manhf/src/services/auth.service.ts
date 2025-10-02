import { apiClient } from './api';
import { User } from '../context/AuthContext';

export interface LoginCredentials {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: string;
  rol: string;
  nombre: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response: LoginResponse = await apiClient.post('/auth/login', credentials);
    
    return {
      usuario: response.usuario,
      rol: response.rol,
      nombre: response.nombre,
      token: response.token
    };
  },

  async validateToken(): Promise<boolean> {
    try {
      // Endpoint para validar token - puedes ajustar según tu backend
      await apiClient.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  },

  logout() {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};