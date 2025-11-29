'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { reportesService } from '@/services/reportesService';
import {
  ReporteCobradoResponse,
  ReporteDashboardResponse,
  ReportePagadoResponse
} from '@/services/reportesService';
import { MovimientoCaja } from '@/types/cajaDiaria';

interface ConsolidadoContextValue {
  dashboard: ReporteDashboardResponse | null;
  reporteCobrado: ReporteCobradoResponse | null;
  reportePagado: ReportePagadoResponse | null;
  movimientos: MovimientoCaja[];
  loading: boolean;
  error: string | null;
  fecha: string;
  setFecha: (fecha: string) => void;
  refresh: (fecha?: string) => Promise<void>;
}

const ConsolidadoContext = createContext<ConsolidadoContextValue | null>(null);

export const ConsolidadoProvider = ({ children }: { children: React.ReactNode }) => {
  const [dashboard, setDashboard] = useState<ReporteDashboardResponse | null>(null);
  const [reporteCobrado, setReporteCobrado] = useState<ReporteCobradoResponse | null>(null);
  const [reportePagado, setReportePagado] = useState<ReportePagadoResponse | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);

  const refresh = useCallback(
    async (overrideFecha?: string) => {
      const targetFecha = overrideFecha ?? fecha;
      setLoading(true);
      setError(null);

      try {
        const [dashboardData, reporteCobradoData, reportePagadoData] = await Promise.all([
          reportesService.obtenerReporteDashboard(targetFecha),
          reportesService.obtenerReporteCobrado(targetFecha, targetFecha),
          reportesService.obtenerReportePagado(targetFecha, targetFecha)
        ]);

        setDashboard(dashboardData);
        setReporteCobrado(reporteCobradoData);
        setReportePagado(reportePagadoData);
        setMovimientos(dashboardData.movimientosDelDia.movimientos);

        if (dashboardData?.saldos?.disponibilidades) {
          console.log('Disponibilidades - Del día:', dashboardData.saldos.disponibilidades.delDia);
          console.log('Disponibilidades - Día anterior:', dashboardData.saldos.disponibilidades.diaAnterior);
        }
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
      dashboard,
      reporteCobrado,
      reportePagado,
      movimientos,
      loading,
      error,
      fecha,
      setFecha,
      refresh
    }),
    [dashboard, reporteCobrado, reportePagado, movimientos, loading, error, fecha, refresh]
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

