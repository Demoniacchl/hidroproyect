// src/services/api.ts
const BASE_URL = 'http://localhost:8080/api';

// ✅ Cliente SIN autenticación para login
export const httpClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('🌐 Haciendo request SIN token a:', url);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('🚨 Error en HTTP request:', error);
      throw error;
    }
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

// ✅ Cliente CON autenticación para APIs protegidas
export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const token = localStorage.getItem('token');
    
    // ✅ SOLO para endpoints protegidos, NO para login
    if (!token && !endpoint.includes('/auth/')) {
      console.warn('⚠️ No hay token JWT');
      throw new Error('No autenticado');
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('🔐 Haciendo request a:', url, token ? 'CON token' : 'SIN token');

    try {
      const response = await fetch(url, config);
      
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