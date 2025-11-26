'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { consolidadoService, ConsolidadoSnapshot } from '@/services/consolidadoService';

interface ConsolidadoContextValue {
  data: ConsolidadoSnapshot | null;
  fecha: string;
  loading: boolean;
  error: string | null;
  setFecha: (value: string) => void;
  syncAll: () => Promise<void>;
}

const ConsolidadoContext = createContext<ConsolidadoContextValue | undefined>(undefined);

export const ConsolidadoProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ConsolidadoSnapshot | null>(null);
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await consolidadoService.fetchAll(fecha);
      setData(snapshot);
    } catch (err) {
      console.error('Error sincronizando consolidado:', err);
      setError('No se pudo sincronizar los datos');
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    syncAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      data,
      fecha,
      loading,
      error,
      setFecha,
      syncAll
    }),
    [data, fecha, loading, error, syncAll]
  );

  return <ConsolidadoContext.Provider value={value}>{children}</ConsolidadoContext.Provider>;
};

export const useConsolidado = () => {
  const context = useContext(ConsolidadoContext);
  if (!context) {
    throw new Error('useConsolidado debe usarse dentro de ConsolidadoProvider');
  }
  return context;
};

