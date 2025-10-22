import { useState, useEffect } from 'react';
import { 
  clientesService, 
  Cliente, 
  ClienteCreateRequest, 
  ClienteUpdateRequest,
  UbicacionCreateRequest,
  MotorCreateRequest,
  Region,
  Comuna
} from '../services/clientes.service';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteDetalle, setClienteDetalle] = useState<Cliente | null>(null);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      
      // Cargar clientes primero
      const clientesData = await clientesService.getClientes();
      setClientes(clientesData);
      
      // Intentar cargar regiones y comunas, pero no fallar si no existen
      try {
        const [regionesData, comunasData] = await Promise.all([
          clientesService.getRegiones(),
          clientesService.getComunas()
        ]);
        
        setRegiones(regionesData);
        setComunas(comunasData);
      } catch (regionesError) {
        console.warn('No se pudieron cargar regiones y comunas, usando valores por defecto');
        // Los servicios ya manejan el fallo y devuelven valores por defecto
      }
      
    } catch (err: any) {
      setError('Error al cargar datos iniciales');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clientesService.getClientes();
      setClientes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const getClienteConUbicaciones = async (id: number): Promise<Cliente> => {
    try {
      setLoading(true);
      setError('');
      const cliente = await clientesService.getCliente(id);
      
      // Cargar motores para cada ubicación
      const ubicacionesConMotores = await Promise.all(
        cliente.ubicaciones.map(async (ubicacion) => {
          try {
            const motores = await clientesService.getMotoresByUbicacion(ubicacion.idUbicacion);
            return { ...ubicacion, motores };
          } catch (error) {
            console.error(`Error cargando motores para ubicación ${ubicacion.idUbicacion}:`, error);
            return { ...ubicacion, motores: [] };
          }
        })
      );
      
      return { ...cliente, ubicaciones: ubicacionesConMotores };
    } catch (err: any) {
      setError(err.message || 'Error al cargar cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadClienteDetalle = async (id: number) => {
    try {
      setLoading(true);
      setError('');
      const cliente = await getClienteConUbicaciones(id);
      setClienteDetalle(cliente);
      return cliente;
    } catch (err: any) {
      setError(err.message || 'Error al cargar detalle del cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (clienteData: ClienteCreateRequest) => {
    try {
      setLoading(true);
      setError('');
      const nuevoCliente = await clientesService.createCliente(clienteData);
      setClientes(prev => [...prev, nuevoCliente]);
      return nuevoCliente;
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id: number, clienteData: ClienteUpdateRequest) => {
    try {
      setLoading(true);
      setError('');
      const clienteActualizado = await clientesService.updateCliente(id, clienteData);
      setClientes(prev => prev.map(c => c.idCliente === id ? clienteActualizado : c));
      if (clienteDetalle && clienteDetalle.idCliente === id) {
        setClienteDetalle(clienteActualizado);
      }
      return clienteActualizado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      setLoading(true);
      setError('');
      await clientesService.deleteCliente(id);
      setClientes(prev => prev.filter(c => c.idCliente !== id));
      if (clienteDetalle && clienteDetalle.idCliente === id) {
        setClienteDetalle(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Métodos para ubicaciones
  const createUbicacion = async (ubicacionData: UbicacionCreateRequest) => {
    try {
      setLoading(true);
      const nuevaUbicacion = await clientesService.createUbicacion(ubicacionData);
      
      // Actualizar el cliente con la nueva ubicación
      setClientes(prev => prev.map(cliente => 
        cliente.idCliente === ubicacionData.idCliente 
          ? { ...cliente, ubicaciones: [...cliente.ubicaciones, nuevaUbicacion] }
          : cliente
      ));
      
      // Actualizar también el cliente detalle si está cargado
      if (clienteDetalle && clienteDetalle.idCliente === ubicacionData.idCliente) {
        setClienteDetalle(prev => prev ? {
          ...prev,
          ubicaciones: [...prev.ubicaciones, nuevaUbicacion]
        } : null);
      }
      
      return nuevaUbicacion;
    } catch (err: any) {
      setError(err.message || 'Error al crear ubicación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Métodos para motores
  const createMotor = async (motorData: MotorCreateRequest) => {
    try {
      setLoading(true);
      const nuevoMotor = await clientesService.createMotor(motorData);
      
      // Actualizar el cliente con el nuevo motor
      setClientes(prev => prev.map(cliente => ({
        ...cliente,
        ubicaciones: cliente.ubicaciones.map(ubicacion =>
          ubicacion.idUbicacion === motorData.idUbicacion
            ? { 
                ...ubicacion, 
                motores: [...(ubicacion.motores || []), nuevoMotor] 
              }
            : ubicacion
        )
      })));
      
      // Actualizar también el cliente detalle si está cargado
      if (clienteDetalle) {
        const ubicacionActualizada = clienteDetalle.ubicaciones.map(ubicacion =>
          ubicacion.idUbicacion === motorData.idUbicacion
            ? { 
                ...ubicacion, 
                motores: [...(ubicacion.motores || []), nuevoMotor] 
              }
            : ubicacion
        );
        
        setClienteDetalle(prev => prev ? { ...prev, ubicaciones: ubicacionActualizada } : null);
      }
      
      return nuevoMotor;
    } catch (err: any) {
      setError(err.message || 'Error al crear motor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');
  const clearClienteDetalle = () => setClienteDetalle(null);

  return {
    clientes,
    clienteDetalle,
    regiones,
    comunas,
    loading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    getClienteConUbicaciones,
    loadClienteDetalle,
    createUbicacion,
    createMotor,
    clearError,
    clearClienteDetalle,
    refetch: cargarClientes
  };
};