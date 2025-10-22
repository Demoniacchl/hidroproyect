// src/hooks/useCalendario.ts
import { useState, useEffect } from 'react';
import { calendarioService, type EventoCalendario, type EventoCreateRequest } from '../services/calendario.service';

interface UseCalendarioReturn {
  eventos: EventoCalendario[];
  loading: boolean;
  error: string | null;
  loadEventos: () => Promise<void>;
  createEvento: (eventoData: EventoCreateRequest) => Promise<EventoCalendario>;
  updateEvento: (id: number, eventoData: Partial<EventoCreateRequest>) => Promise<EventoCalendario>;
  deleteEvento: (id: number) => Promise<void>;
  getEventosPorCliente: (clienteId: number) => Promise<EventoCalendario[]>;
  getEventosPorFecha: (fecha: string) => Promise<EventoCalendario[]>;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export const useCalendario = (): UseCalendarioReturn => {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los eventos - SIN CACHE
  const loadEventos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await calendarioService.getEventos();
      setEventos(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los eventos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Crear evento
  const createEvento = async (eventoData: EventoCreateRequest): Promise<EventoCalendario> => {
    try {
      setError(null);
      const nuevoEvento = await calendarioService.createEvento(eventoData);
      setEventos(prev => [...prev, nuevoEvento]);
      return nuevoEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Actualizar evento
  const updateEvento = async (id: number, eventoData: Partial<EventoCreateRequest>): Promise<EventoCalendario> => {
    try {
      setError(null);
      const eventoActualizado = await calendarioService.updateEvento(id, eventoData);
      setEventos(prev => prev.map(evento => evento.id === id ? eventoActualizado : evento));
      return eventoActualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ELIMINAR EVENTO - VERSIÓN DEFINITIVA
  const deleteEvento = async (id: number): Promise<void> => {
    try {
      setError(null);
      
      // 1. GUARDAR ESTADO ANTERIOR (para rollback si falla)
      const eventosAnteriores = eventos;
      
      // 2. ACTUALIZACIÓN OPTIMISTA INMEDIATA
      setEventos(prev => {
        const nuevosEventos = prev.filter(evento => evento.id !== id);
        console.log('🗑️ Estado optimista:', prev.length, '→', nuevosEventos.length, 'eventos');
        return nuevosEventos;
      });

      // 3. ELIMINAR DEL BACKEND
      await calendarioService.deleteEvento(id);
      
      console.log('✅ Evento eliminado correctamente');
      
    } catch (err) {
      // 4. SI HAY ERROR, RECARGAR DATOS FRESCOS
      console.log('🔄 Error detectado, recargando datos...');
      await loadEventos();
      
      // No lanzar error - la recarga ya solucionó el estado
    }
  };

  // Buscar eventos por cliente
  const getEventosPorCliente = async (clienteId: number): Promise<EventoCalendario[]> => {
    try {
      setError(null);
      return await calendarioService.getEventosPorCliente(clienteId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener eventos del cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Buscar eventos por fecha
  const getEventosPorFecha = async (fecha: string): Promise<EventoCalendario[]> => {
    try {
      setError(null);
      return await calendarioService.getEventosPorFecha(fecha);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener eventos de la fecha';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Utilidades
  const clearError = (): void => {
    setError(null);
  };

  const refetch = async (): Promise<void> => {
    await loadEventos();
  };

  // Cargar eventos al montar el hook
  useEffect(() => {
    loadEventos();
  }, []);

  return {
    eventos,
    loading,
    error,
    loadEventos,
    createEvento,
    updateEvento,
    deleteEvento,
    getEventosPorCliente,
    getEventosPorFecha,
    clearError,
    refetch
  };
};