'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, ResumenCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';
import EstadisticasCaja from '../EstadisticasCaja';

export default function ConsolidadoTab() {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosCajaType>({});
  const [fechaDesde, setFechaDesde] = useState(new Date().toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    cargarDatos();
  }, [fechaDesde, fechaHasta]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const filtrosConFecha = {
        ...filtros,
        fechaDesde,
        fechaHasta
      };
      
      const [movimientosData, resumenData] = await Promise.all([
        cajaDiariaService.obtenerMovimientos(filtrosConFecha),
        cajaDiariaService.obtenerResumenDiario(fechaDesde)
      ]);
      
      setMovimientos(movimientosData);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error al cargar datos consolidados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = async () => {
    try {
      const filtrosConFecha = {
        ...filtros,
        fechaDesde,
        fechaHasta
      };
      
      const blob = await cajaDiariaService.exportarExcel(filtrosConFecha);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consolidado-${fechaDesde}-${fechaHasta}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  // Calcular estadísticas consolidadas
  const totalIngresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = movimientos.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0);
  const saldoNeto = totalIngresos - totalEgresos;
  
  const ingresosCobrados = movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago !== 'pendiente').reduce((sum, m) => sum + m.monto, 0);
  const ingresosPendientes = movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'pendiente').reduce((sum, m) => sum + m.monto, 0);
  
  const egresosPagados = movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago !== 'pendiente').reduce((sum, m) => sum + m.monto, 0);
  const egresosPendientes = movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago === 'pendiente').reduce((sum, m) => sum + m.monto, 0);

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
    <div className="space-y-4">
      {/* Selector de fechas */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Período:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <span className="text-gray-500 text-xs">hasta</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <button
            onClick={cargarDatos}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Actualizar
          </button>
          <button
            onClick={handleExportar}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            📊 Exportar
          </button>
        </div>
      </div>

      {/* Resumen consolidado en formato de grilla */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header de la grilla */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-0">
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Concepto
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
              Total
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
              Realizado
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
              Pendiente
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
              Cantidad
            </div>
          </div>
        </div>

        {/* Datos de la grilla */}
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-5 gap-0 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
              Ingresos
            </div>
            <div className="px-4 py-3 text-sm text-green-600 border-r border-gray-200 text-right font-mono font-semibold">
              {formatCurrency(totalIngresos)}
            </div>
            <div className="px-4 py-3 text-sm text-green-600 border-r border-gray-200 text-right font-mono">
              {formatCurrency(ingresosCobrados)}
            </div>
            <div className="px-4 py-3 text-sm text-yellow-600 border-r border-gray-200 text-right font-mono">
              {formatCurrency(ingresosPendientes)}
            </div>
            <div className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
              {movimientos.filter(m => m.tipo === 'ingreso').length}
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-0 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
              Egresos
            </div>
            <div className="px-4 py-3 text-sm text-red-600 border-r border-gray-200 text-right font-mono font-semibold">
              {formatCurrency(totalEgresos)}
            </div>
            <div className="px-4 py-3 text-sm text-red-600 border-r border-gray-200 text-right font-mono">
              {formatCurrency(egresosPagados)}
            </div>
            <div className="px-4 py-3 text-sm text-orange-600 border-r border-gray-200 text-right font-mono">
              {formatCurrency(egresosPendientes)}
            </div>
            <div className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
              {movimientos.filter(m => m.tipo === 'egreso').length}
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-0 hover:bg-gray-50 bg-gray-50">
            <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 font-semibold">
              Saldo Neto
            </div>
            <div className={`px-4 py-3 text-sm border-r border-gray-200 text-right font-mono font-semibold ${
              saldoNeto >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(saldoNeto)}
            </div>
            <div className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200 text-right font-mono">
              -
            </div>
            <div className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200 text-right font-mono">
              -
            </div>
            <div className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
              {movimientos.length}
            </div>
          </div>
        </div>
      </div>

      {/* Estado de pendientes en formato de grilla */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Estado de Pendientes
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pendiente
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promedio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⏳</span>
                    <span>Cobros Pendientes</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-yellow-600 text-right font-mono font-semibold">
                  {formatCurrency(ingresosPendientes)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                  {movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'pendiente').length}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 text-right font-mono">
                  {movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'pendiente').length > 0 
                    ? formatCurrency(ingresosPendientes / movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'pendiente').length)
                    : '$0.00'
                  }
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⏳</span>
                    <span>Pagos Pendientes</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-orange-600 text-right font-mono font-semibold">
                  {formatCurrency(egresosPendientes)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                  {movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago === 'pendiente').length}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 text-right font-mono">
                  {movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago === 'pendiente').length > 0 
                    ? formatCurrency(egresosPendientes / movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago === 'pendiente').length)
                    : '$0.00'
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <EstadisticasCaja movimientos={movimientos} />

      {/* Resumen diario si está disponible */}
      {resumen && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Resumen del Día {fechaDesde}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Inicial
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Final
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movimientos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    Disponibilidad de Caja
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                    {formatCurrency(resumen.saldoInicial)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono font-semibold">
                    {formatCurrency(resumen.saldoFinal)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono">
                    {resumen.cantidadMovimientos}
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

