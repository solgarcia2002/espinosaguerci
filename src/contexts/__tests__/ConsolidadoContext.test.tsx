import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, type MockedFunction } from 'vitest';
import { ConsolidadoProvider, useConsolidado } from '../ConsolidadoContext';
import { ConsolidadoSnapshot, consolidadoService } from '@/services/consolidadoService';

vi.mock('@/services/consolidadoService', () => ({
  consolidadoService: {
    fetchAll: vi.fn()
  }
}));

const mockSnapshot: ConsolidadoSnapshot = {
  dashboard: {
    fecha: '2025-11-26',
    saldos: {
      disponibilidades: { delDia: 1000, diaAnterior: 900, diferencia: 100 },
      chequesEnCartera: { delDia: 500, diaAnterior: 400, diferencia: 100 },
      aCobrar: { delDia: 2000, diaAnterior: 1800, diferencia: 200 },
      aPagar: { delDia: 1500, diaAnterior: 1400, diferencia: 100 }
    },
    kpis: {
      capitalTrabajo: 1,
      liquidezCorriente: 1,
      disponibilidadInmediata: 1,
      eficienciaCobranza: 1,
      eficienciaPago: 1
    },
    alertas: [],
    movimientosDelDia: {
      totalMovimientos: 0,
      totalIngresos: 100,
      totalEgresos: 50,
      saldoNeto: 50,
      movimientos: []
    },
    resumen: {
      totalClientes: 1,
      totalProveedores: 1,
      clientesConPendientes: 0,
      proveedoresConPendientes: 0,
      cuentasBancarias: 1
    }
  },
  cobrado: {
    totalCobrado: 100,
    totalFacturado: 200,
    cantidadFacturas: 1,
    cantidadClientes: 1,
    porcentajeCobrado: 50,
    clientes: [
      {
        cliente: 'Cliente UAT',
        totalCobrado: 100,
        totalFacturado: 200,
        cantidadFacturas: 1,
        porFecha: {},
        facturas: []
      }
    ],
    resumenPorMes: {},
    filtros: {}
  },
  pagado: {
    totalPagado: 150,
    totalFacturado: 200,
    cantidadFacturas: 1,
    cantidadProveedores: 1,
    porcentajePagado: 75,
    proveedores: [
      {
        proveedor: 'Proveedor UAT',
        totalPagado: 150,
        totalFacturado: 200,
        cantidadFacturas: 1,
        porFecha: {},
        facturas: []
      }
    ],
    resumenPorMes: {},
    filtros: {}
  },
  movimientos: [],
  disponibilidad: null,
  fecha: '2025-11-26',
  timestamp: '2025-11-26T10:00:00Z'
};

const mockedFetchAll = consolidadoService.fetchAll as MockedFunction<typeof consolidadoService.fetchAll>;

beforeEach(() => {
  vi.clearAllMocks();
  mockedFetchAll.mockResolvedValue(mockSnapshot);
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConsolidadoProvider>{children}</ConsolidadoProvider>
);

describe('ConsolidadoContext', () => {
  it('sincroniza al montarse y expone datos', async () => {
    const { result } = renderHook(() => useConsolidado(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockSnapshot));
    expect(mockedFetchAll).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.syncAll();
    });

    expect(mockedFetchAll).toHaveBeenCalledTimes(2);
  });

  it('mantiene la fecha luego de sincronizar', async () => {
    const { result } = renderHook(() => useConsolidado(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockSnapshot));
    const fechaInicial = result.current.fecha;

    await act(async () => {
      await result.current.syncAll();
    });

    expect(result.current.fecha).toBe(fechaInicial);
  });

  it('expone error cuando la sincronización falla', async () => {
    mockedFetchAll.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useConsolidado(), { wrapper });

    await waitFor(() => expect(result.current.error).toBe('No se pudo sincronizar los datos'));
    expect(result.current.loading).toBe(false);
  });
});

