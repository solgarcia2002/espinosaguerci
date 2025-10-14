'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';
import MovimientosTable from '../MovimientosTable';
import FiltrosCaja from '../FiltrosCaja';
import MovimientoForm from '../MovimientoForm';

export default function CobradoTab() {
  const [reporteCobrado, setReporteCobrado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState<MovimientoCaja | undefined>();
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarReporteCobrado();
  }, [fechaDesde, fechaHasta]);

  const cargarReporteCobrado = async () => {
    try {
      setLoading(true);
      const reporteData = await cajaDiariaService.obtenerReporteCobrado(fechaDesde, fechaHasta);
      setReporteCobrado(reporteData);
    } catch (error) {
      console.error('Error al cargar reporte de cobrado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoMovimiento = () => {
    setMovimientoEditando(undefined);
    setMostrarFormulario(true);
  };

  const handleEditarMovimiento = (movimiento: MovimientoCaja) => {
    setMovimientoEditando(movimiento);
    setMostrarFormulario(true);
  };

  const handleFormularioSuccess = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
    cargarReporteCobrado();
  };

  const handleFormularioCancel = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
  };

  const handleExportar = async () => {
    try {
      const blob = await cajaDiariaService.exportarExcel(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cobros-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte de cobrado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de fecha */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFechaDesde('');
                setFechaHasta('');
              }}
              className="btn-secondary w-full"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      {reporteCobrado && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Cobrado</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(reporteCobrado.totalCobrado)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Facturado</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(reporteCobrado.totalFacturado)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Cantidad Facturas</div>
            <div className="text-2xl font-bold text-purple-600">
              {reporteCobrado.cantidadFacturas}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">% Cobrado</div>
            <div className="text-2xl font-bold text-orange-600">
              {reporteCobrado.porcentajeCobrado}%
            </div>
          </div>
        </div>
      )}

      {/* Tabla de clientes con cobros */}
      {reporteCobrado && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Clientes con Cobros</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cobrado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Facturado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facturas
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reporteCobrado.clientes
                  .sort((a: any, b: any) => b.totalCobrado - a.totalCobrado)
                  .map((cliente: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {cliente.cliente}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 text-right font-mono font-semibold">
                        {formatCurrency(cliente.totalCobrado)}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600 text-right font-mono">
                        {formatCurrency(cliente.totalFacturado)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {cliente.cantidadFacturas}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            // Aquí podrías abrir un modal con los detalles del cliente
                            console.log('Ver detalles de:', cliente.cliente);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

