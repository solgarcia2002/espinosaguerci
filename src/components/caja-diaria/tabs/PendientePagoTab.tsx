'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';
import MovimientosTable from '../MovimientosTable';
import FiltrosCaja from '../FiltrosCaja';
import MovimientoForm from '../MovimientoForm';

export default function PendientePagoTab() {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosCajaType>({
    tipo: 'egreso',
    metodoPago: 'pendiente'
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
      console.error('Error al cargar pagos pendientes:', error);
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
    setFiltros({ ...nuevosFiltros, tipo: 'egreso', metodoPago: 'pendiente' });
  };

  const handleExportar = async () => {
    try {
      const blob = await cajaDiariaService.exportarExcel(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagos-pendientes-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ tipo: 'egreso', metodoPago: 'pendiente' });
  };

  // Calcular totales
  const totalPendiente = movimientos.reduce((sum, m) => sum + m.monto, 0);
  const cantidadPendientes = movimientos.length;

  // Agrupar por proveedor
  const porProveedor = movimientos.reduce((acc, m) => {
    const proveedorNombre = m.proveedor?.nombre || 'Sin proveedor';
    if (!acc[proveedorNombre]) {
      acc[proveedorNombre] = { total: 0, cantidad: 0, movimientos: [] };
    }
    acc[proveedorNombre].total += m.monto;
    acc[proveedorNombre].cantidad += 1;
    acc[proveedorNombre].movimientos.push(m);
    return acc;
  }, {} as Record<string, { total: number; cantidad: number; movimientos: MovimientoCaja[] }>);

  return (
    <div className="space-y-6">
      {/* Resumen de pagos pendientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Pendiente</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatCurrency(totalPendiente)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Cantidad Pendiente</p>
              <p className="text-2xl font-bold text-blue-900">
                {cantidadPendientes}
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
              <p className="text-sm font-medium text-gray-600">Proveedores con Deuda</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(porProveedor).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl">🏢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen por proveedor */}
      {Object.keys(porProveedor).length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen por Proveedor
          </h3>
          <div className="space-y-3">
            {Object.entries(porProveedor)
              .sort(([,a], [,b]) => b.total - a.total)
              .map(([proveedor, datos]) => (
                <div key={proveedor} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{proveedor}</p>
                    <p className="text-sm text-gray-500">
                      {datos.cantidad} movimiento{datos.cantidad !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(datos.total)}
                    </p>
                    <p className="text-sm text-gray-500">Pendiente</p>
                  </div>
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
          <h3 className="text-lg font-semibold text-gray-900">Pagos Pendientes</h3>
          <button
            onClick={handleNuevoMovimiento}
            className="btn-primary flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nuevo Pago Pendiente</span>
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

