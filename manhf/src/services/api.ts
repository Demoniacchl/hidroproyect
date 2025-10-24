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
      
      // DEBUG DETALLADO PARA ERRORES
      console.log('🔍 DEBUG - Response status:', response.status, response.statusText);
      
      if (response.status === 401) {
        console.error('❌ Token inválido o expirado');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Token expirado');
      }
      
      if (!response.ok) {
        // OBTENER DETALLES COMPLETOS DEL ERROR 400
        let errorBody = '';
        try {
          errorBody = await response.text();
          console.error('❌ DEBUG ERROR 400 - Cuerpo completo del error:', errorBody);
          
          // Intentar mostrar el error de forma más legible
          try {
            const errorJson = JSON.parse(errorBody);
            console.error('❌ DEBUG ERROR 400 - JSON parseado:', JSON.stringify(errorJson, null, 2));
            
            // Mostrar campos específicos del error si existen
            if (errorJson.message) {
              console.error('❌ DEBUG ERROR 400 - Mensaje:', errorJson.message);
            }
            if (errorJson.errors) {
              console.error('❌ DEBUG ERROR 400 - Errores de validación:', errorJson.errors);
            }
            if (errorJson.fieldErrors) {
              console.error('❌ DEBUG ERROR 400 - Errores por campo:', errorJson.fieldErrors);
            }
          } catch (jsonError) {
            console.error('❌ DEBUG ERROR 400 - Error como texto:', errorBody);
          }
        } catch (readError) {
          console.error('❌ DEBUG ERROR 400 - No se pudo leer el cuerpo del error');
        }
        
        // Si es error 403, probablemente necesitas autenticación
        if (response.status === 403) {
          throw new Error('No tienes permisos para acceder a este recurso');
        }
        
        throw new Error(`Error ${response.status}: ${errorBody || response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ DEBUG - Response data:', responseData);
      return responseData;
      
    } catch (error) {
      console.error('🚨 Error en API request:', error);
      throw error;
    }
  },

  get(endpoint: string, params?: any) {
    let url = endpoint;
    
    // Manejar parámetros de query
    if (params) {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return this.request(url);
  },

  post(endpoint: string, data: any) {
    console.log('📤 DEBUG - Datos que se envían en POST:');
    console.log('📤 DEBUG - Endpoint:', endpoint);
    console.log('📤 DEBUG - Datos:', JSON.stringify(data, null, 2));
    
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any, p0: { params: { progreso: string; }; }) {
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