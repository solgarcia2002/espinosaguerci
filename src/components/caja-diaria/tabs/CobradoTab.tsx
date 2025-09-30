'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';
import MovimientosTable from '../MovimientosTable';
import FiltrosCaja from '../FiltrosCaja';
import MovimientoForm from '../MovimientoForm';

export default function CobradoTab() {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosCajaType>({
    tipo: 'ingreso' // Solo ingresos (cobros)
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState<MovimientoCaja | undefined>();

  useEffect(() => {
    cargarMovimientos();
  }, [filtros]);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      const movimientosData = await cajaDiariaService.obtenerMovimientos(filtros);
      setMovimientos(movimientosData);
    } catch (error) {
      console.error('Error al cargar movimientos cobrados:', error);
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
    cargarMovimientos();
  };

  const handleFormularioCancel = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosCajaType) => {
    setFiltros({ ...nuevosFiltros, tipo: 'ingreso' });
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

  const handleLimpiarFiltros = () => {
    setFiltros({ tipo: 'ingreso' });
  };

  // Calcular totales
  const totalCobrado = movimientos.reduce((sum, m) => sum + m.monto, 0);
  const cantidadCobros = movimientos.length;

  // Estadísticas por método de pago
  const porMetodoPago = movimientos.reduce((acc, m) => {
    acc[m.metodoPago] = (acc[m.metodoPago] || 0) + m.monto;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Resumen de cobros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Cobrado</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalCobrado)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Cantidad de Cobros</p>
              <p className="text-2xl font-bold text-blue-900">
                {cantidadCobros}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio por Cobro</p>
              <p className="text-2xl font-bold text-gray-900">
                {cantidadCobros > 0 ? formatCurrency(totalCobrado / cantidadCobros) : '$0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por método de pago */}
      {Object.keys(porMetodoPago).length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Método de Pago
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(porMetodoPago).map(([metodo, monto]) => (
              <div key={metodo} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {metodo === 'efectivo' ? '💵' : 
                   metodo === 'transferencia' ? '🏦' : 
                   metodo === 'cheque' ? '📄' : 
                   metodo === 'tarjeta' ? '💳' : '⏳'}
                </div>
                <p className="text-sm font-medium text-gray-700 capitalize">{metodo}</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(monto)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <FiltrosCaja
        filtros={filtros}
        onFiltrosChange={handleFiltrosChange}
        onExportar={handleExportar}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* Tabla de movimientos */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Movimientos Cobrados</h3>
          <button
            onClick={handleNuevoMovimiento}
            className="btn-primary flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nuevo Cobro</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <MovimientosTable
            movimientos={movimientos}
            onEdit={handleEditarMovimiento}
            onRefresh={cargarMovimientos}
          />
        )}
      </div>

      {/* Formulario de movimiento */}
      {mostrarFormulario && (
        <MovimientoForm
          movimiento={movimientoEditando}
          onSuccess={handleFormularioSuccess}
          onCancel={handleFormularioCancel}
        />
      )}
    </div>
  );
}

