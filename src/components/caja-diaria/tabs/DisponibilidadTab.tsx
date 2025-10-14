'use client';

import { useState, useEffect } from 'react';
import { ResumenCaja } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';

export default function DisponibilidadTab() {
  const [reporteDisponibilidad, setReporteDisponibilidad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    cargarDisponibilidad();
  }, [fecha]);

  const cargarDisponibilidad = async () => {
    try {
      setLoading(true);
      const reporteData = await cajaDiariaService.obtenerReporteDisponibilidad(fecha);
      setReporteDisponibilidad(reporteData);
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
      {reporteDisponibilidad ? (
        <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Total Disponibilidad</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(reporteDisponibilidad.totalDisponibilidad)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Total Pesos</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(reporteDisponibilidad.estadisticas.totalPesos)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Total Dólares</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(reporteDisponibilidad.estadisticas.totalDolares)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Pendiente Acreditación</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(reporteDisponibilidad.estadisticas.totalPendienteAcreditacion)}
              </div>
            </div>
          </div>

          {/* Cuentas bancarias */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <h3 className="text-lg font-semibold text-gray-900">Cuentas Bancarias</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dólares
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendiente
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reporteDisponibilidad.cuentasBancarias.map((cuenta: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {cuenta.nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(cuenta.saldo)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(cuenta.dolares)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(cuenta.pendienteAcreditacion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

    </div>
  );
}

