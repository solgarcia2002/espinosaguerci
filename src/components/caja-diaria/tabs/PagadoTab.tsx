'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';
import MovimientosTable from '../MovimientosTable';
import FiltrosCaja from '../FiltrosCaja';
import MovimientoForm from '../MovimientoForm';

export default function PagadoTab() {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosCajaType>({
    tipo: 'egreso' // Solo egresos (pagos)
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
      console.error('Error al cargar movimientos pagados:', error);
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
    setFiltros({ ...nuevosFiltros, tipo: 'egreso' });
  };

  const handleExportar = async () => {
    try {
      const blob = await cajaDiariaService.exportarExcel(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagos-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ tipo: 'egreso' });
  };

  // Calcular totales
  const totalPagado = movimientos.reduce((sum, m) => sum + m.monto, 0);
  const cantidadPagos = movimientos.length;

  return (
    <div className="space-y-6">
      {/* Resumen de pagos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Pagado</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalPagado)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Cantidad de Pagos</p>
              <p className="text-2xl font-bold text-blue-900">
                {cantidadPagos}
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
              <p className="text-sm font-medium text-gray-600">Promedio por Pago</p>
              <p className="text-2xl font-bold text-gray-900">
                {cantidadPagos > 0 ? formatCurrency(totalPagado / cantidadPagos) : '$0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

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
          <h3 className="text-lg font-semibold text-gray-900">Movimientos Pagados</h3>
          <button
            onClick={handleNuevoMovimiento}
            className="btn-primary flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nuevo Pago</span>
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

