// src/services/api.ts
const BASE_URL = 'http://localhost:8080/api';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Obtener token REAL del localStorage
    const token = localStorage.getItem('token');
    
    // Si no hay token, redirigir al login
    if (!token) {
      console.warn('⚠️ No hay token JWT, redirigiendo al login...');
      window.location.href = '/login';
      throw new Error('No autenticado');
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ← Token REAL
        ...options.headers,
      },
      ...options,
    };

    console.log('🌐 Haciendo request a:', url);
    console.log('🔐 Token REAL usado:', token.substring(0, 20) + '...');

    try {
      const response = await fetch(url, config);
      
      // Si el token expiró o es inválido
      if (response.status === 401) {
        console.error('❌ Token inválido o expirado');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Token expirado');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('🚨 Error en API request:', error);
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};