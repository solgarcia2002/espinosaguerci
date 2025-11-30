'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { ClientesResponse } from '@/types/cajaDiaria';

interface ClientesContextValue {
  clientesCobrados: ClientesResponse | null;
  clientesPendientes: ClientesResponse | null;
  totalPendienteCobro: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ClientesContext = createContext<ClientesContextValue | null>(null);

export const ClientesProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientesCobrados, setClientesCobrados] = useState<ClientesResponse | null>(null);
  const [clientesPendientes, setClientesPendientes] = useState<ClientesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [cobradosData, pendientesData] = await Promise.all([
        cajaDiariaService.obtenerClientesConPaginacion({
          page: 1,
          limit: 100,
          orderBy: 'saldo',
          order: 'desc',
          estadoCobro: 'cobrado'
        }),
        cajaDiariaService.obtenerClientesConPaginacion({
          page: 1,
          limit: 100,
          orderBy: 'saldo',
          order: 'desc',
          estadoCobro: 'pendiente'
        })
      ]);

      setClientesCobrados(cobradosData);
      setClientesPendientes(pendientesData);
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener clientes';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalPendienteCobro = useMemo(() => {
    return clientesPendientes?.montoTotal ?? 0;
  }, [clientesPendientes]);

  const value = useMemo(
    () => ({
      clientesCobrados,
      clientesPendientes,
      totalPendienteCobro,
      loading,
      error,
      refresh
    }),
    [clientesCobrados, clientesPendientes, totalPendienteCobro, loading, error, refresh]
  );

  return <ClientesContext.Provider value={value}>{children}</ClientesContext.Provider>;
};

export const useClientesContext = (): ClientesContextValue => {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error('useClientesContext debe usarse dentro del ClientesProvider');
  }
  return context;
};

