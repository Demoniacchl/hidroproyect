// src/hooks/useUbicacion.ts
import { useState, useEffect } from 'react';
import { ubicacionService, Ubicacion } from '../services/ubicacion.service';

export const useUbicacion = () => {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [loading, setLoading] = useState(false); // ← Cambiado a false inicial
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las ubicaciones (NO automáticamente)
  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ubicacionService.getUbicaciones();
      setUbicaciones(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error cargando ubicaciones');
      console.error('Error en useUbicacion - cargarUbicaciones:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar ubicación por ID
  const cargarUbicacionPorId = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ubicacionService.getUbicacionById(id);
      setUbicacion(data);
      return data;
    } catch (err: any) {
      setError(err.message || `Error cargando ubicación ${id}`);
      console.error(`Error en useUbicacion - cargarUbicacionPorId ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar ubicaciones por cliente - MÉTODO PRINCIPAL
  const cargarUbicacionesPorCliente = async (clienteId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Cargando ubicaciones para cliente: ${clienteId}`);
      
      const data = await ubicacionService.getUbicacionesByCliente(clienteId);
      
      console.log(`✅ Ubicaciones cargadas:`, data);
      setUbicaciones(data);
      return data;
    } catch (err: any) {
      const errorMsg = `Error cargando ubicaciones del cliente ${clienteId}`;
      setError(errorMsg);
      console.error(errorMsg, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva ubicación
  const crearUbicacion = async (ubicacionData: any): Promise<Ubicacion | null> => {
    try {
      setLoading(true);
      setError(null);
      const nuevaUbicacion = await ubicacionService.createUbicacion(ubicacionData);
      return nuevaUbicacion;
    } catch (err: any) {
      setError(err.message || 'Error creando ubicación');
      console.error('Error en useUbicacion - crearUbicacion:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ubicación
  const actualizarUbicacion = async (id: number, ubicacionData: any): Promise<Ubicacion | null> => {
    try {
      setLoading(true);
      setError(null);
      const ubicacionActualizada = await ubicacionService.updateUbicacion(id, ubicacionData);
      return ubicacionActualizada;
    } catch (err: any) {
      setError(err.message || `Error actualizando ubicación ${id}`);
      console.error(`Error en useUbicacion - actualizarUbicacion ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ubicación
  const eliminarUbicacion = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ubicacionService.deleteUbicacion(id);
      return true;
    } catch (err: any) {
      setError(err.message || `Error eliminando ubicación ${id}`);
      console.error(`Error en useUbicacion - eliminarUbicacion ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => setError(null);

  // Limpiar ubicación individual
  const clearUbicacion = () => setUbicacion(null);

  // Limpiar todas las ubicaciones
  const clearUbicaciones = () => setUbicaciones([]);

  // NO cargar automáticamente al montar - comentamos este useEffect
  // useEffect(() => {
  //   cargarUbicaciones();
  // }, []);

  return {
    // Estado
    ubicaciones,
    ubicacion,
    loading,
    error,
    
    // Acciones
    cargarUbicaciones,
    cargarUbicacionPorId,
    cargarUbicacionesPorCliente, // ← Este es el método importante
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion,
    
    // Utilidades
    clearError,
    clearUbicacion,
    clearUbicaciones
  };
};