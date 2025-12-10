'use client';

import { useMemo, useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useConsolidadoContext } from '@/contexts/ConsolidadoContext';
import { useDisponibilidadContext } from '@/contexts/DisponibilidadContext';
import { useProveedoresContext } from '@/contexts/ProveedoresContext';
import { useClientesContext } from '@/contexts/ClientesContext';
import { MovimientoCaja, UltimoProcesoSincronizacion, UltimoProcesoResponse } from '@/types/cajaDiaria';
import {
  ReporteCobradoResponse,
  ReporteDashboardResponse,
  ReportePagadoResponse
} from '@/services/reportesService';
import { colppyService } from '@/services/colppyService';

const filasSaldos = [
  { label: 'Disponibilidades', key: 'disponibilidades' },
  { label: 'Cheques en cartera', key: 'chequesEnCartera' },
  { label: 'A Cobrar corrientes', key: 'aCobrar' },
  { label: 'A Pagar proveedores', key: 'aPagar' }
];

const obtenerCashFlow = (
  dashboard: ReporteDashboardResponse | null,
  movimientos: MovimientoCaja[]
) => {
  if (!dashboard) return null;

  const delta = (key: keyof ReporteDashboardResponse['saldos']) => {
    const entry = dashboard.saldos[key];
    return (entry?.diaAnterior ?? 0) - entry.delDia;
  };

  const tarjetas = movimientos.filter((mov) => mov.metodoPago === 'tarjeta' && mov.tipo === 'egreso');
  const planes = movimientos.filter((mov) => mov.metodoPago === 'pendiente' && mov.tipo === 'egreso');

  const cancelacionTarjetas = tarjetas.reduce((sum, movimiento) => sum + movimiento.monto, 0);
  const cancelacionPlanes = planes.reduce((sum, movimiento) => sum + movimiento.monto, 0);
  const cobranzas = dashboard.movimientosDelDia.totalIngresos;
  const pagosProveedores = dashboard.movimientosDelDia.totalEgresos;

  const total =
    delta('disponibilidades') +
    delta('chequesEnCartera') +
    cobranzas +
    pagosProveedores +
    cancelacionTarjetas +
    cancelacionPlanes;

  return {
    reduccionDisponibilidades: delta('disponibilidades'),
    reduccionCheques: delta('chequesEnCartera'),
    cobranzas,
    pagosProveedores,
    cancelacionTarjetas,
    cancelacionPlanes,
    total
  };
};

const cargarDiferenciasCobranza = (reporte: ReporteCobradoResponse | null) => {
  if (!reporte) return [];
  return reporte.clientes
    .map((cliente) => ({
      cliente: cliente.cliente,
      registrado: cliente.totalFacturado,
      cobrado: cliente.totalCobrado,
      diferencia: cliente.totalCobrado - cliente.totalFacturado
    }))
    .filter((item) => Math.abs(item.diferencia) > 1);
};

const cargarPagosPlanes = (movimientos: MovimientoCaja[]) => {
  return movimientos
    .filter((mov) => mov.metodoPago === 'pendiente' && mov.tipo === 'egreso')
    .reduce<Record<string, number>>((acc, mov) => {
      const key = mov.proveedor?.proveedor || mov.proveedorId || 'Sin proveedor';
      acc[key] = (acc[key] ?? 0) + mov.monto;
      return acc;
    }, {});
};

const cargarPagosProveedoresDeMas = (reporte: ReportePagadoResponse | null) => {
  if (!reporte) return [];
  return reporte.proveedores
    .map((proveedor) => ({
      proveedor: proveedor.proveedor,
      registrado: proveedor.totalFacturado,
      pagado: proveedor.totalPagado,
      diferencia: proveedor.totalPagado - proveedor.totalFacturado
    }))
    .filter((item) => item.diferencia > 0);
};

export default function ConsolidadoTab() {
  const {
    dashboard,
    reporteCobrado,
    reportePagado,
    movimientos,
    loading,
    error,
    fecha,
    setFecha,
    refresh
  } = useConsolidadoContext();
  
  const { data: disponibilidadData } = useDisponibilidadContext();
  const { totalPendientePago } = useProveedoresContext();
  const { totalPendienteCobro } = useClientesContext();
  
  const [ultimoProceso, setUltimoProceso] = useState<UltimoProcesoSincronizacion | null>(null);
  const [loadingProceso, setLoadingProceso] = useState(true);

  useEffect(() => {
    const cargarUltimoProceso = async () => {
      try {
        setLoadingProceso(true);
        const response = await colppyService.obtenerUltimoProceso();
        if (response?.success && response.lastSync) {
          setUltimoProceso(response.lastSync);
        }
      } catch (error) {
        console.error('Error al cargar último proceso:', error);
      } finally {
        setLoadingProceso(false);
      }
    };
    
    cargarUltimoProceso();
  }, []);

  const cashFlow = useMemo(() => obtenerCashFlow(dashboard, movimientos), [dashboard, movimientos]);
  const diferenciasCobranza = useMemo(() => cargarDiferenciasCobranza(reporteCobrado), [reporteCobrado]);
  const pagosPlanes = useMemo(() => cargarPagosPlanes(movimientos), [movimientos]);
  const diferenciasProveedores = useMemo(() => cargarPagosProveedoresDeMas(reportePagado), [reportePagado]);
  const totalTarjetas = useMemo(
    () => movimientos.filter((m) => m.metodoPago === 'tarjeta' && m.tipo === 'egreso').reduce((sum, mov) => sum + mov.monto, 0),
    [movimientos]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando consolidado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        <button
          onClick={() => refresh()}
          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
        >
          Actualizar consolidado
        </button>
      </div>

      {ultimoProceso && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Último proceso de sincronización</h3>
            {loadingProceso && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          {ultimoProceso.message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900">{ultimoProceso.message}</div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">Scope</div>
              <div className="text-sm font-semibold text-gray-900">{ultimoProceso.scope || '-'}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">Status</div>
              <div className={`text-sm font-semibold ${
                ultimoProceso.status === 'completed' || ultimoProceso.status === 'success' 
                  ? 'text-green-600' 
                  : ultimoProceso.status === 'error' || ultimoProceso.status === 'failed'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {ultimoProceso.status || '-'}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">Fecha</div>
              <div className="text-sm font-semibold text-gray-900">
                {ultimoProceso.createdAt ? new Date(ultimoProceso.createdAt).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '-'}
              </div>
            </div>
            {ultimoProceso.count !== null && ultimoProceso.count !== undefined && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-500 uppercase mb-1">Cantidad</div>
                <div className="text-sm font-semibold text-gray-900">
                  {ultimoProceso.count}
                </div>
              </div>
            )}
          </div>
          {(ultimoProceso.totalDisponibilidad !== null && ultimoProceso.totalDisponibilidad !== undefined) ||
           (ultimoProceso.totalCobrosPendientes !== null && ultimoProceso.totalCobrosPendientes !== undefined) ||
           (ultimoProceso.totalPagosPendientes !== null && ultimoProceso.totalPagosPendientes !== undefined) ? (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Totales</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ultimoProceso.totalDisponibilidad !== null && ultimoProceso.totalDisponibilidad !== undefined && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-600 uppercase mb-1">Total Disponibilidad</div>
                    <div className="text-lg font-semibold text-blue-900">
                      {formatCurrency(ultimoProceso.totalDisponibilidad)}
                    </div>
                  </div>
                )}
                {ultimoProceso.totalCobrosPendientes !== null && ultimoProceso.totalCobrosPendientes !== undefined && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-xs text-orange-600 uppercase mb-1">Total Cobros Pendientes</div>
                    <div className="text-lg font-semibold text-orange-900">
                      {formatCurrency(ultimoProceso.totalCobrosPendientes)}
                    </div>
                  </div>
                )}
                {ultimoProceso.totalPagosPendientes !== null && ultimoProceso.totalPagosPendientes !== undefined && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-xs text-red-600 uppercase mb-1">Total Pagos Pendientes</div>
                    <div className="text-lg font-semibold text-red-900">
                      {formatCurrency(ultimoProceso.totalPagosPendientes)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

    

      <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">Saldos consolidados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Del día
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Día anterior
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filasSaldos.map((fila) => {
                const saldo = dashboard?.saldos[fila.key as keyof typeof dashboard.saldos];
                const esDisponibilidades = fila.key === 'disponibilidades';
                const esAPagar = fila.key === 'aPagar';
                const esACobrar = fila.key === 'aCobrar';
                
                return (
                  <tr key={fila.key}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{fila.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                      {esDisponibilidades && disponibilidadData
                        ? formatCurrency(disponibilidadData.total)
                        : esACobrar && totalPendienteCobro !== 0
                        ? formatCurrency(totalPendienteCobro)
                        : esAPagar && totalPendientePago !== 0
                        ? formatCurrency(totalPendientePago)
                        : formatCurrency(saldo?.delDia ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                      {formatCurrency(saldo?.diaAnterior ?? 0)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 font-semibold">Saldo</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                  {formatCurrency(
                    (disponibilidadData?.total ?? dashboard?.saldos.disponibilidades.delDia ?? 0) +
                      (dashboard?.saldos.chequesEnCartera.delDia ?? 0) +
                      (totalPendienteCobro !== 0 ? totalPendienteCobro : dashboard?.saldos.aCobrar.delDia ?? 0) -
                      (totalPendientePago !== 0 ? totalPendientePago : dashboard?.saldos.aPagar.delDia ?? 0) -
                      totalTarjetas
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                  {formatCurrency(
                    (dashboard?.saldos.disponibilidades.diaAnterior ?? 0) +
                      (dashboard?.saldos.chequesEnCartera.diaAnterior ?? 0) +
                      (dashboard?.saldos.aCobrar.diaAnterior ?? 0) -
                      (dashboard?.saldos.aPagar.diaAnterior ?? 0)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 font-semibold">Diferencia</td>
                <td colSpan={2} className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                  {formatCurrency(dashboard?.saldos.disponibilidades.diferencia ?? 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {cashFlow && (
        <section className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Cash Flow</h4>
            <span className="text-xs text-gray-500">Total: {formatCurrency(cashFlow.total)}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">Reducción disponibilidades</div>
              <div className="text-lg font-semibold text-gray-900 text-right">
                {formatCurrency(cashFlow.reduccionDisponibilidades)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">Reducción cheques</div>
              <div className="text-lg font-semibold text-gray-900 text-right">
                {formatCurrency(cashFlow.reduccionCheques)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">Cobranza</div>
              <div className="text-lg font-semibold text-green-600 text-right">
                {formatCurrency(cashFlow.cobranzas)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">Pagos proveedores</div>
              <div className="text-lg font-semibold text-red-600 text-right">
                {formatCurrency(cashFlow.pagosProveedores)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">Cancelación tarjetas</div>
              <div className="text-lg font-semibold text-gray-900 text-right">
                {formatCurrency(cashFlow.cancelacionTarjetas)}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">Cancelación planes</div>
              <div className="text-lg font-semibold text-gray-900 text-right">
                {formatCurrency(cashFlow.cancelacionPlanes)}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
            <h3 className="text-lg font-semibold text-blue-900">Incremento de saldo tarjetas</h3>
          </div>
          <div className="px-4 py-3 text-sm text-gray-600">
            Total: {formatCurrency(totalTarjetas)}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {movimientos
                  .filter((mov) => mov.metodoPago === 'tarjeta' && mov.tipo === 'egreso')
                  .map((mov) => (
                    <tr key={`${mov.id}-${mov.concepto}`}>
                      <td className="px-4 py-2 text-sm text-gray-900">{mov.concepto || 'Sin descripción'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(mov.monto)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-3">
              <h3 className="text-lg font-semibold text-yellow-900">Cobranza con diferencias</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrado
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobrado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {diferenciasCobranza.map((item) => (
                    <tr key={item.cliente}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.cliente}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(item.registrado)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(item.cobrado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 text-xs text-gray-500">
              Diferencia total: {formatCurrency(diferenciasCobranza.reduce((sum, item) => sum + item.diferencia, 0))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
              <h3 className="text-lg font-semibold text-blue-900">Pago proveedores mediante planes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importe cancelado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {Object.entries(pagosPlanes).map(([proveedor, total]) => (
                    <tr key={proveedor}>
                      <td className="px-4 py-2 text-sm text-gray-900">{proveedor}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
              <h3 className="text-lg font-semibold text-blue-900">Pago proveedores de más</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrado
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pagado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {diferenciasProveedores.map((item) => (
                    <tr key={item.proveedor}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.proveedor}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(item.registrado)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(item.pagado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
