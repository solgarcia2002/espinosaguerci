import { useEffect, useState, useCallback } from 'react';
import { colppyRpaService, ColppyProgressEvent } from '@/services/colppyRpaService';

export interface UseColppyProgressReturn {
  progress: ColppyProgressEvent | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Hook para usar el servicio de progreso de Colppy
 * 
 * @example
 * const { progress, isConnected, connect, disconnect } = useColppyProgress();
 * 
 * useEffect(() => {
 *   connect();
 *   return () => disconnect();
 * }, []);
 * 
 * {progress && (
 *   <div>
 *     {progress.message} ({progress.current}/{progress.total})
 *   </div>
 * )}
 */
export function useColppyProgress(): UseColppyProgressReturn {
  const [progress, setProgress] = useState<ColppyProgressEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    colppyRpaService.connect();
    setIsConnected(colppyRpaService.connected);
    
    // Registrar callback para recibir eventos
    const unsubscribe = colppyRpaService.onProgress((event) => {
      setProgress(event);
      
      // Actualizar estado de conexión
      setIsConnected(colppyRpaService.connected);
    });

    // Verificar conexión periódicamente
    const interval = setInterval(() => {
      setIsConnected(colppyRpaService.connected);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const disconnect = useCallback(() => {
    colppyRpaService.disconnect();
    setIsConnected(false);
    setProgress(null);
  }, []);

  // Verificar conexión al montar
  useEffect(() => {
    setIsConnected(colppyRpaService.connected);
  }, []);

  return {
    progress,
    isConnected,
    connect,
    disconnect,
  };
}

