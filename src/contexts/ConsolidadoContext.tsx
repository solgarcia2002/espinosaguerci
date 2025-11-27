'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { consolidadoService, ConsolidadoSnapshot } from '@/services/consolidadoService';

interface ConsolidadoContextValue {
  snapshot: ConsolidadoSnapshot | null;
  loading: boolean;
  error: string | null;
  fecha: string;
  setFecha: (fecha: string) => void;
  refresh: (fecha?: string) => Promise<void>;
}

const ConsolidadoContext = createContext<ConsolidadoContextValue | null>(null);

export const ConsolidadoProvider = ({ children }: { children: React.ReactNode }) => {
  const [snapshot, setSnapshot] = useState<ConsolidadoSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);

  const refresh = useCallback(
    async (overrideFecha?: string) => {
      const targetFecha = overrideFecha ?? fecha;
      setLoading(true);
      setError(null);

      try {
        const data = await consolidadoService.obtenerSnapshot(targetFecha);
        setSnapshot(data);
      } catch (err: unknown) {
        const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener el consolidado';
        setError(mensaje);
      } finally {
        setLoading(false);
      }
    },
    [fecha]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      snapshot,
      loading,
      error,
      fecha,
      setFecha,
      refresh
    }),
    [snapshot, loading, error, fecha, refresh]
  );

  return <ConsolidadoContext.Provider value={value}>{children}</ConsolidadoContext.Provider>;
};

export const useConsolidadoContext = (): ConsolidadoContextValue => {
  const context = useContext(ConsolidadoContext);
  if (!context) {
    throw new Error('useConsolidadoContext debe usarse dentro del ConsolidadoProvider');
  }
  return context;
};

