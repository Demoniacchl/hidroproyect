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

    console.log('🔐 Haciendo request a:', url);
    console.log('🔐 Token presente:', !!token);
    console.log('🔐 Método:', config.method);

    try {
      const response = await fetch(url, config);
      
      // OBTENER EL TEXTO DE LA RESPUESTA PRIMERO (éxito o error)
      const responseText = await response.text();
      
      console.log('🔍 DEBUG - Response status:', response.status, response.statusText);
      console.log('🔍 DEBUG - Response body RAW:', responseText);
      
      if (response.status === 401) {
        console.error('❌ Token inválido o expirado');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Token expirado');
      }
      
      if (!response.ok) {
        console.error('❌❌❌ ERROR 400 DETECTADO ❌❌❌');
        console.error('❌ URL:', url);
        console.error('❌ Status:', response.status, response.statusText);
        console.error('❌ Response body:', responseText);
        
        // Intentar parsear como JSON para mejor legibilidad
        if (responseText) {
          try {
            const errorJson = JSON.parse(responseText);
            console.error('❌ ERROR JSON PARSED:', JSON.stringify(errorJson, null, 2));
            
            // Mostrar campos específicos del error si existen
            if (errorJson.message) {
              console.error('❌ ERROR MESSAGE:', errorJson.message);
            }
            if (errorJson.error) {
              console.error('❌ ERROR FIELD:', errorJson.error);
            }
            if (errorJson.errors) {
              console.error('❌ VALIDATION ERRORS:', errorJson.errors);
            }
            if (errorJson.fieldErrors) {
              console.error('❌ FIELD ERRORS:', errorJson.fieldErrors);
            }
            if (errorJson.path) {
              console.error('❌ ERROR PATH:', errorJson.path);
            }
            if (errorJson.timestamp) {
              console.error('❌ ERROR TIMESTAMP:', errorJson.timestamp);
            }
          } catch (jsonError) {
            console.error('❌ ERROR BODY (RAW TEXT):', responseText);
          }
        } else {
          console.error('❌ ERROR: Response body está vacío');
        }
        
        throw new Error(`Error ${response.status}: ${responseText || response.statusText}`);
      }
      
      // Si fue exitoso, parsear la respuesta
      const responseData = responseText ? JSON.parse(responseText) : {};
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
    console.log('📤📤📤 DEBUG POST - Datos que se envían:');
    console.log('📤 Endpoint:', endpoint);
    console.log('📤 Datos completos:', JSON.stringify(data, null, 2));
    console.log('📤 Tipos de datos:', Object.keys(data).map(key => ({
      campo: key,
      valor: data[key],
      tipo: typeof data[key]
    })));
    
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

// ✅ Exportar ambos clientes
export default apiClient;