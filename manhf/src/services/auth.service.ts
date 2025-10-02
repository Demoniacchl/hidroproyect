import { apiClient } from './api';
import { User } from '../context/AuthContext';

export interface LoginFormData {
  usuario: string;
  contrasena: string;
}

export interface SpringLoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: string;
  rol: string;
  nombre: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('🔐 Intentando login con:', credentials);
      
      // Spring Security espera credentials en formato específico
      const springCredentials = {
        username: credentials.username,
        password: credentials.password
      };
      
      const response: LoginResponse = await apiClient.post('/auth/login', springCredentials);
      
      console.log('✅ Login exitoso:', response);
      
      return {
        usuario: response.usuario,
        rol: response.rol,
        nombre: response.nombre,
        token: response.token
      };
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      const errorMessage = error.message || 'Error de conexión con el servidor';
      throw new Error(errorMessage);
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get('/clientes?page=0&size=1');
      return true;
    } catch (error) {
      return false;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};