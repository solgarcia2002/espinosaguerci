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
    <div className="space-y-6">
      {/* Selector de fecha */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input"
          />
          <button
            onClick={cargarDisponibilidad}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Resumen de disponibilidad */}
      {resumen ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Saldo Inicial</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(resumen.saldoInicial)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(resumen.totalIngresos)}
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
                  {formatCurrency(resumen.totalEgresos)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">📉</span>
              </div>
            </div>
          </div>

          <div className={`card p-6 ${
            resumen.saldoFinal >= 0 ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  resumen.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Dinero Disponible
                </p>
                <p className={`text-2xl font-bold ${
                  resumen.saldoFinal >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatCurrency(resumen.saldoFinal)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                resumen.saldoFinal >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-xl ${
                  resumen.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {resumen.saldoFinal >= 0 ? '✅' : '⚠️'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos de disponibilidad
          </h3>
          <p className="text-gray-500">
            Selecciona una fecha para ver el dinero disponible en caja.
          </p>
        </div>
      )}

      {/* Detalle de movimientos del día */}
      {resumen && resumen.movimientos.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Movimientos del Día
          </h3>
          <div className="space-y-2">
            {resumen.movimientos.slice(0, 10).map((movimiento) => (
              <div key={movimiento.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${
                    movimiento.tipo === 'ingreso' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <div>
                    <p className="font-medium text-gray-900">{movimiento.concepto}</p>
                    <p className="text-sm text-gray-500">
                      {movimiento.cliente?.nombre || movimiento.proveedor?.nombre || 'Sin asociar'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movimiento.tipo === 'ingreso' ? '+' : '-'}
                    {formatCurrency(movimiento.monto)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {movimiento.metodoPago}
                  </p>
                </div>
              </div>
            ))}
            {resumen.movimientos.length > 10 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                Y {resumen.movimientos.length - 10} movimientos más...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

