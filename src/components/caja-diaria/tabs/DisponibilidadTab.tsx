'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import ColppyProgress from '@/components/ColppyProgress';
import { toast } from 'sonner';
import { useDisponibilidadContext } from '@/contexts/DisponibilidadContext';

export default function DisponibilidadTab() {
  const { data: disponibilidad, timestamp, loading, error, syncing, refresh } = useDisponibilidadContext();
  const [showProgress, setShowProgress] = useState(false);

  const handleSync = useCallback(() => {
    setShowProgress(true);
    void refresh({ triggeredByButton: true });
  }, [refresh]);

  const handleProgressComplete = useCallback(() => {
    setShowProgress(false);
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando disponibilidad desde Tesorería...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showProgress && (
        <ColppyProgress
          scope="disponibilidad"
          onComplete={handleProgressComplete}
          onError={() => setShowProgress(false)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Disponibilidad en Tesorería</h3>
          {timestamp && (
            <p className="text-xs text-gray-500">
              Última actualización: {new Date(timestamp).toLocaleString()}
            </p>
          )}
        </div>
        <div> <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 w-fit mx-auto"
          >
            <span>🔄</span>
            {syncing ? 'Sincronizando...' : 'Sincronizar con Colppy'}
          </button>
        </div>
       
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {disponibilidad ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Caja Estudio</div>
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(disponibilidad.cajaEstudio)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Bancos</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(disponibilidad.bancos)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Cambio Marcelo</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(disponibilidad.cambioMarcelo)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Total Tesorería</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(disponibilidad.total)}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detalle de saldos</h3>
              <span className="text-sm text-gray-500">
                Total listado: {formatCurrency(disponibilidad.detalle.reduce((sum, item) => sum + item.saldo, 0))}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {disponibilidad.detalle.map((item, index) => (
                    <tr key={`${item.nombre}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                        {formatCurrency(item.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos de Tesorería</h3>
          <p className="text-gray-500 text-sm">Sincronizá para recuperar los saldos desde Colppy.</p>
        </div>
      )}
    </div>
  );
}

