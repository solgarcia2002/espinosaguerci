'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { ProveedoresResponse } from '@/types/cajaDiaria';

interface ProveedoresContextValue {
  proveedoresPagados: ProveedoresResponse | null;
  proveedoresPendientes: ProveedoresResponse | null;
  totalPendientePago: number;
  montoTotalPagado: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ProveedoresContext = createContext<ProveedoresContextValue | null>(null);

export const ProveedoresProvider = ({ children }: { children: React.ReactNode }) => {
  const [proveedoresPagados, setProveedoresPagados] = useState<ProveedoresResponse | null>(null);
  const [proveedoresPendientes, setProveedoresPendientes] = useState<ProveedoresResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [pagadosData, pendientesData] = await Promise.all([
        cajaDiariaService.obtenerProveedoresConPaginacion(1, 100, 'pagado'),
        cajaDiariaService.obtenerProveedoresConPaginacion(1, 100, 'pendiente')
      ]);

      setProveedoresPagados(pagadosData);
      setProveedoresPendientes(pendientesData);
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener proveedores';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalPendientePago = useMemo(() => {
    if (!proveedoresPendientes?.data) return 0;
    return proveedoresPendientes.data.reduce((sum, proveedor) => {
      return sum + (proveedor.montoPendiente ?? proveedor.saldo ?? 0);
    }, 0);
  }, [proveedoresPendientes]);

  const montoTotalPagado = useMemo(() => {
    return proveedoresPagados?.montoTotal ?? 0;
  }, [proveedoresPagados]);

  const value = useMemo(
    () => ({
      proveedoresPagados,
      proveedoresPendientes,
      totalPendientePago,
      montoTotalPagado,
      loading,
      error,
      refresh
    }),
    [proveedoresPagados, proveedoresPendientes, totalPendientePago, montoTotalPagado, loading, error, refresh]
  );

  return <ProveedoresContext.Provider value={value}>{children}</ProveedoresContext.Provider>;
};

export const useProveedoresContext = (): ProveedoresContextValue => {
  const context = useContext(ProveedoresContext);
  if (!context) {
    throw new Error('useProveedoresContext debe usarse dentro del ProveedoresProvider');
  }
  return context;
};

