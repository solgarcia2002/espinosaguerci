'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, ResumenCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';
import EstadisticasCaja from '../EstadisticasCaja';

export default function ConsolidadoTab() {
  const [reporteConsolidado, setReporteConsolidado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    cargarConsolidado();
  }, [fecha]);

  const cargarConsolidado = async () => {
    try {
      setLoading(true);
      const reporteData = await cajaDiariaService.obtenerReporteConsolidado(fecha);
      setReporteConsolidado(reporteData);
    } catch (error) {
      console.error('Error al cargar consolidado:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos consolidados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de fecha */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <button
            onClick={cargarConsolidado}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas principales */}
      {reporteConsolidado && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Facturado</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(reporteConsolidado.totalFacturado)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Cobrado</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(reporteConsolidado.totalCobrado)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Pagado</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(reporteConsolidado.totalPagado)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Saldo Neto</div>
            <div className={`text-2xl font-bold ${
              reporteConsolidado.saldoNeto >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(reporteConsolidado.saldoNeto)}
            </div>
          </div>
        </div>
      )}

      {/* Resumen de pendientes */}
      {reporteConsolidado && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Resumen de Pendientes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Cobros Pendientes</div>
              <div className="text-xl font-bold text-yellow-600">
                {formatCurrency(reporteConsolidado.totalPendienteCobro)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Pagos Pendientes</div>
              <div className="text-xl font-bold text-orange-600">
                {formatCurrency(reporteConsolidado.totalPendientePago)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen por tipo de factura */}
      {reporteConsolidado && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Resumen por Tipo</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Facturado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cobrado/Pagado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendiente
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Clientes</td>
                  <td className="px-4 py-3 text-sm text-blue-600 text-right font-mono">
                    {formatCurrency(reporteConsolidado.totalFacturadoClientes)}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 text-right font-mono">
                    {formatCurrency(reporteConsolidado.totalCobradoClientes)}
                  </td>
                  <td className="px-4 py-3 text-sm text-yellow-600 text-right font-mono">
                    {formatCurrency(reporteConsolidado.totalPendienteCobro)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {reporteConsolidado.cantidadFacturasClientes}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">Proveedores</td>
                  <td className="px-4 py-3 text-sm text-blue-600 text-right font-mono">
                    {formatCurrency(reporteConsolidado.totalFacturadoProveedores)}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 text-right font-mono">
                    {formatCurrency(reporteConsolidado.totalPagadoProveedores)}
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-600 text-right font-mono">
                    {formatCurrency(reporteConsolidado.totalPendientePago)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {reporteConsolidado.cantidadFacturasProveedores}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

