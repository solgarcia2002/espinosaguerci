'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { colppyService } from '@/services/colppyService';
import { TesoreriaDisponibilidadData } from '@/types/cajaDiaria';

const COLPPY_CREDENTIALS = {
  email: 'matiespinosa05@gmail.com',
  password: 'Mati.46939'
};

interface DisponibilidadContextValue {
  data: TesoreriaDisponibilidadData | null;
  timestamp: string | null;
  loading: boolean;
  syncing: boolean;
  error: string | null;
  refresh: (options?: { triggeredByButton?: boolean }) => Promise<void>;
}

const DisponibilidadContext = createContext<DisponibilidadContextValue | null>(null);

export const DisponibilidadProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<TesoreriaDisponibilidadData | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatosGuardados = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await colppyService.obtenerDisponibilidadTesoreriaGuardada();
      if (response?.success && response.data) {
        setData(response.data);
        setTimestamp(response.timestamp ?? new Date().toISOString());
      } else {
        const message = response?.message ?? 'No se pudieron obtener los datos de disponibilidad guardados';
        setError(message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener disponibilidad guardada';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async ({ triggeredByButton = false } = {}) => {
    if (triggeredByButton) {
      setSyncing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await colppyService.obtenerDisponibilidadTesoreria(COLPPY_CREDENTIALS);
      if (response?.success && response.data) {
        setData(response.data);
        setTimestamp(response.timestamp ?? new Date().toISOString());
        return;
      }

      const message = response?.message ?? 'No se pudieron obtener los datos de disponibilidad';
      setError(message);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener disponibilidad';
      setError(message);
    } finally {
      if (triggeredByButton) {
        setSyncing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void cargarDatosGuardados();
  }, [cargarDatosGuardados]);

  const value = useMemo(
    () => ({
      data,
      timestamp,
      loading,
      syncing,
      error,
      refresh
    }),
    [data, timestamp, loading, syncing, error, refresh]
  );

  return <DisponibilidadContext.Provider value={value}>{children}</DisponibilidadContext.Provider>;
};

export const useDisponibilidadContext = (): DisponibilidadContextValue => {
  const context = useContext(DisponibilidadContext);
  if (!context) {
    throw new Error('useDisponibilidadContext debe usarse dentro del DisponibilidadProvider');
  }
  return context;
};

