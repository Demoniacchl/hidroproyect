import React, { useState } from 'react';
import { apiClient } from '../services/api';

const ApiTester: React.FC = () => {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const token = localStorage.getItem('token');

  const testEndpoint = async () => {
    if (!endpoint.trim()) {
      setError('Por favor ingresa un endpoint');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResponse(null);

      console.log(`🔧 Probando: ${method} ${endpoint}`);
      
      let result;
      let bodyData = null;

      // Parsear JSON si hay body
      if (requestBody.trim()) {
        try {
          bodyData = JSON.parse(requestBody);
        } catch (e) {
          setError('JSON inválido en el cuerpo de la solicitud');
          setLoading(false);
          return;
        }
      }

      switch (method) {
        case 'GET':
          result = await apiClient.get(endpoint);
          break;
        case 'POST':
          result = await apiClient.post(endpoint, bodyData || {});
          break;
        case 'PUT':
          result = await apiClient.put(endpoint, bodyData || {});
          break;
        case 'DELETE':
          result = await apiClient.delete(endpoint);
          break;
        default:
          throw new Error(`Método no soportado: ${method}`);
      }

      console.log('✅ Respuesta recibida:', result);
      setResponse(result);
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      testEndpoint();
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const prefillExamples = (example: string) => {
    setEndpoint(example);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">🧪 Probador de APIs</h2>
      
      {/* Token Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded border">
        <div className="flex items-center justify-between">
          <div>
            <strong>Token:</strong> 
            <span className={`ml-2 ${token ? 'text-green-600' : 'text-red-600'}`}>
              {token ? '✅ Presente' : '❌ No encontrado'}
            </span>
          </div>
          <button 
            onClick={() => {
              console.log('Token actual:', token);
              navigator.clipboard.writeText(token || '');
            }}
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Copiar Token
          </button>
        </div>
      </div>

      {/* Ejemplos rápidos */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Ejemplos rápidos:</label>
        <div className="flex flex-wrap gap-2">
          {[
            'ordenes-mantenimiento',
            'ordenes-reparacion',
            'clientes',
            'tecnicos',
            'equipos',
            'ubicaciones'
          ].map(example => (
            <button
              key={example}
              onClick={() => prefillExamples(example)}
              className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Controles principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Método */}
        <div>
          <label className="block text-sm font-medium mb-1">Método</label>
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Endpoint */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">Endpoint</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
              /api/
            </span>
            <input
              type="text"
              value= {"/" + endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ordenes-mantenimiento"
              className="flex-1 p-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Body para POST/PUT */}
      {(method === 'POST' || method === 'PUT') && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Cuerpo (JSON) {method === 'POST' ? '(para crear)' : '(para actualizar)'}
          </label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder='{"clave": "valor"}'
            rows={4}
            className="w-full p-2 border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Botón ejecutar */}
      <div className="mb-4">
        <button
          onClick={testEndpoint}
          disabled={loading || !endpoint.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Probando...' : '🚀 Ejecutar API'}
        </button>
      </div>

      {/* Resultados */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-bold text-red-800 mb-2">❌ Error</h3>
          <pre className="text-red-700 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {response && (
        <div className="border rounded">
          <div className="bg-green-50 px-4 py-2 border-b">
            <h3 className="font-bold text-green-800">✅ Respuesta Exitosa</h3>
          </div>
          <pre className="p-4 bg-white overflow-auto max-h-96 text-sm">
            {formatJson(response)}
          </pre>
        </div>
      )}

      {/* Información de uso */}
      <div className="mt-4 p-3 bg-yellow-50 rounded border text-sm">
        <h4 className="font-bold mb-2">💡 Cómo usar:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Escribe el endpoint sin "/api/" (ej: <code>ordenes-mantenimiento</code>)</li>
          <li>Usa GET para obtener datos, POST para crear, PUT para actualizar</li>
          <li>Para POST/PUT, ingresa JSON válido en el campo "Cuerpo"</li>
          <li>El token JWT se incluye automáticamente en cada petición</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTester;