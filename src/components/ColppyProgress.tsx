'use client';

import { useEffect, useState } from 'react';
import { useColppyProgress } from '@/hooks/useColppyProgress';
import { ColppyProgressEvent } from '@/services/colppyRpaService';

interface ColppyProgressProps {
  scope?: 'clientes' | 'proveedores' | 'pagos' | 'facturas' | 'movimientos' | 'todos';
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export default function ColppyProgress({ scope, onComplete, onError }: ColppyProgressProps) {
  const { progress, isConnected, connect, disconnect } = useColppyProgress();
  const [messages, setMessages] = useState<ColppyProgressEvent[]>([]);

  useEffect(() => {
    // Conectar al montar
    connect();

    // Desconectar al desmontar
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (progress) {
      // Filtrar por scope si se especifica
      if (scope && progress.scope !== scope && progress.scope !== 'todos') {
        return;
      }

      // Agregar mensaje a la lista
      setMessages(prev => [...prev, progress]);

      // Manejar eventos especiales
      if (progress.type === 'complete') {
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      } else if (progress.type === 'error') {
        onError?.(progress.message);
      }
    }
  }, [progress, scope, onComplete, onError]);

  // Limpiar mensajes cuando se completa
  useEffect(() => {
    if (progress?.type === 'complete') {
      setTimeout(() => {
        setMessages([]);
      }, 5000);
    }
  }, [progress]);

  if (!isConnected && messages.length === 0) {
    return null;
  }

  const currentProgress = messages[messages.length - 1];
  const percentage = currentProgress 
    ? Math.round((currentProgress.current / currentProgress.total) * 100)
    : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-96 z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Sincronización {scope ? `de ${scope}` : ''}
        </h3>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {currentProgress && (
        <>
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                currentProgress.type === 'error' 
                  ? 'bg-red-500' 
                  : currentProgress.type === 'complete'
                  ? 'bg-green-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Información de progreso */}
          <div className="text-xs text-gray-600 mb-2">
            <div className="flex justify-between">
              <span>{currentProgress.current} / {currentProgress.total}</span>
              <span>{percentage}%</span>
            </div>
          </div>

          {/* Mensaje actual */}
          <div className={`text-sm ${
            currentProgress.type === 'error' 
              ? 'text-red-600' 
              : currentProgress.type === 'complete'
              ? 'text-green-600'
              : 'text-gray-700'
          }`}>
            {currentProgress.message}
          </div>

          {/* Lista de mensajes recientes (últimos 5) */}
          {messages.length > 1 && (
            <div className="mt-3 max-h-32 overflow-y-auto">
              <div className="text-xs text-gray-500 mb-1">Historial:</div>
              {messages.slice(-5).map((msg, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0"
                >
                  <span className="font-mono text-gray-400">
                    [{new Date(msg.timestamp).toLocaleTimeString()}]
                  </span>{' '}
                  <span className={
                    msg.type === 'error' 
                      ? 'text-red-600' 
                      : msg.type === 'complete'
                      ? 'text-green-600'
                      : 'text-gray-700'
                  }>
                    {msg.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!isConnected && (
        <div className="text-xs text-red-600 mt-2">
          ⚠️ Desconectado del servidor
        </div>
      )}
    </div>
  );
}

