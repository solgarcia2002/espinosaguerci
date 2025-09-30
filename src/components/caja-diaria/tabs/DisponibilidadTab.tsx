'use client';

import { useState, useEffect } from 'react';
import { ResumenCaja } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';

export default function DisponibilidadTab() {
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    cargarDisponibilidad();
  }, [fecha]);

  const cargarDisponibilidad = async () => {
    try {
      setLoading(true);
      const resumenData = await cajaDiariaService.obtenerResumenDiario(fecha);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
            onClick={cargarDisponibilidad}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Resumen en formato de grilla */}
      {resumen ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header de la grilla */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-5 gap-0">
              <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                Concepto
              </div>
              <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
                Saldo Inicial
              </div>
              <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
                Ingresos
              </div>
              <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 text-right">
                Egresos
              </div>
              <div className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Saldo Final
              </div>
            </div>
          </div>

          {/* Datos de la grilla */}
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-5 gap-0 hover:bg-gray-50">
              <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                Disponibilidad de Caja
              </div>
              <div className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 text-right font-mono">
                {formatCurrency(resumen.saldoInicial)}
              </div>
              <div className="px-4 py-3 text-sm text-green-600 border-r border-gray-200 text-right font-mono">
                {formatCurrency(resumen.totalIngresos)}
              </div>
              <div className="px-4 py-3 text-sm text-red-600 border-r border-gray-200 text-right font-mono">
                {formatCurrency(resumen.totalEgresos)}
              </div>
              <div className={`px-4 py-3 text-sm text-right font-mono font-semibold ${
                resumen.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(resumen.saldoFinal)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos de disponibilidad
          </h3>
          <p className="text-gray-500 text-sm">
            Selecciona una fecha para ver el dinero disponible en caja.
          </p>
        </div>
      )}

      {/* Tabla de movimientos del día */}
      {resumen && resumen.movimientos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Movimientos del Día ({resumen.movimientos.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Proveedor
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resumen.movimientos.slice(0, 20).map((movimiento) => (
                  <tr key={movimiento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                      {new Date(movimiento.createdAt).toLocaleTimeString('es-AR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        movimiento.tipo === 'ingreso' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {movimiento.concepto}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {movimiento.cliente?.nombre || movimiento.proveedor?.nombre || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 capitalize">
                      {movimiento.metodoPago}
                    </td>
                    <td className={`px-4 py-2 text-sm text-right font-mono ${
                      movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movimiento.tipo === 'ingreso' ? '+' : '-'}
                      {formatCurrency(movimiento.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {resumen.movimientos.length > 20 && (
            <div className="bg-gray-50 px-4 py-2 text-center">
              <p className="text-sm text-gray-500">
                Mostrando 20 de {resumen.movimientos.length} movimientos
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

