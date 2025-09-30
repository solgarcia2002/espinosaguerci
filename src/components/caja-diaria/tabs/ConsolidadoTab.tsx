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
    <div className="space-y-6">
      {/* Selector de fechas */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Período:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="input"
          />
          <span className="text-gray-500">hasta</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="input"
          />
          <button
            onClick={cargarDatos}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Actualizar
          </button>
          <button
            onClick={handleExportar}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            📊 Exportar
          </button>
        </div>
      </div>

      {/* Resumen consolidado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalIngresos)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Cobrado: {formatCurrency(ingresosCobrados)} | Pendiente: {formatCurrency(ingresosPendientes)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Egresos</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalEgresos)}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Pagado: {formatCurrency(egresosPagados)} | Pendiente: {formatCurrency(egresosPendientes)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">📉</span>
            </div>
          </div>
        </div>

        <div className={`card p-6 ${
          saldoNeto >= 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                saldoNeto >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Saldo Neto
              </p>
              <p className={`text-2xl font-bold ${
                saldoNeto >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {formatCurrency(saldoNeto)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              saldoNeto >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-xl ${
                saldoNeto >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {saldoNeto >= 0 ? '✅' : '⚠️'}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Movimientos</p>
              <p className="text-2xl font-bold text-blue-900">
                {movimientos.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Ingresos: {movimientos.filter(m => m.tipo === 'ingreso').length} | 
                Egresos: {movimientos.filter(m => m.tipo === 'egreso').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de pendientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cobros Pendientes
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Pendiente:</span>
              <span className="font-bold text-yellow-600">
                {formatCurrency(ingresosPendientes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cantidad:</span>
              <span className="font-bold text-gray-900">
                {movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'pendiente').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pagos Pendientes
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Pendiente:</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(egresosPendientes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cantidad:</span>
              <span className="font-bold text-gray-900">
                {movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago === 'pendiente').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <EstadisticasCaja movimientos={movimientos} />

      {/* Resumen diario si está disponible */}
      {resumen && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen del Día {fechaDesde}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Saldo Inicial</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(resumen.saldoInicial)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Saldo Final</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(resumen.saldoFinal)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Movimientos del Día</p>
              <p className="text-xl font-bold text-gray-900">
                {resumen.cantidadMovimientos}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

