// src/services/auth.service.ts
import { httpClient, apiClient } from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  rol: string;
  nombre: string;
}

export interface User {
  usuario: string;
  rol: string;
  nombre: string;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('🔐 Intentando login con:', credentials);
      
      // ✅ PASO 1: Login SIN token usando httpClient
      const response: LoginResponse = await httpClient.post('/auth/login', credentials);
      
      console.log('✅ Respuesta REAL del backend:', response);
      
      // ✅ PASO 2: Devolver datos mapeados correctamente
      return {
        usuario: response.username,  // ← CORREGIDO: username → usuario
        rol: response.rol,
        nombre: response.nombre,
        token: response.token  // ← Esto se usará en AuthContext
      };
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      const errorMessage = error.message || 'Error de conexión con el servidor';
      throw new Error(errorMessage);
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      // ✅ PASO 3: Validar token usando apiClient (CON token)
      await apiClient.get('/clientes?page=0&size=1');
      return true;
    } catch (error) {
      return false;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🚪 Sesión cerrada - tokens eliminados');
  }
};