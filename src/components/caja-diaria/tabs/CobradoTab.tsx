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
    <div className="space-y-4">
      {/* Resumen en formato de grilla */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header de la grilla */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-0">
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Concepto
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
              Total Cobrado
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
              Cantidad
            </div>
            <div className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
              Promedio
            </div>
          </div>
        </div>

        {/* Datos de la grilla */}
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-4 gap-0 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
              Cobros Realizados
            </div>
            <div className="px-4 py-3 text-sm text-green-600 border-r border-gray-200 text-right font-mono font-semibold">
              {formatCurrency(totalCobrado)}
            </div>
            <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 text-right font-mono">
              {cantidadCobros}
            </div>
            <div className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
              {cantidadCobros > 0 ? formatCurrency(totalCobrado / cantidadCobros) : '$0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por método de pago en formato de grilla */}
      {Object.keys(porMetodoPago).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Distribución por Método de Pago
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto Total
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porcentaje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(porMetodoPago).map(([metodo, monto]) => {
                  const cantidad = movimientos.filter(m => m.metodoPago === metodo).length;
                  const porcentaje = totalCobrado > 0 ? (monto / totalCobrado) * 100 : 0;
                  
                  return (
                    <tr key={metodo} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {metodo === 'efectivo' ? '💵' : 
                             metodo === 'transferencia' ? '🏦' : 
                             metodo === 'cheque' ? '📄' : 
                             metodo === 'tarjeta' ? '💳' : '⏳'}
                          </span>
                          <span className="capitalize">{metodo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                        {cantidad}
                      </td>
                      <td className="px-4 py-2 text-sm text-green-600 text-right font-mono font-semibold">
                        {formatCurrency(monto)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 text-right font-mono">
                        {porcentaje.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

      {/* Tabla de movimientos en formato de grilla */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Movimientos Cobrados ({cantidadCobros})
            </h3>
            <button
              onClick={handleNuevoMovimiento}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center space-x-1"
            >
              <span>➕</span>
              <span>Nuevo Cobro</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método de Pago
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movimientos.map((movimiento) => (
                  <tr key={movimiento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                      {new Date(movimiento.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {movimiento.cliente?.cliente || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {movimiento.concepto}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 capitalize">
                      {movimiento.metodoPago}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {movimiento.observaciones || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-green-600 text-right font-mono font-semibold">
                      +{formatCurrency(movimiento.monto)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEditarMovimiento(movimiento)}
                        className="text-blue-600 hover:text-blue-800 text-xs px-1 py-0.5 rounded hover:bg-blue-50"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {movimientos.length === 0 && !loading && (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay cobros registrados
            </h3>
            <p className="text-gray-500 text-sm">
              Los cobros realizados aparecerán aquí.
            </p>
          </div>
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

