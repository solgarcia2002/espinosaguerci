'use client';

import { useState } from 'react';
import { MovimientoCaja } from '@/types/cajaDiaria';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { cajaDiariaService } from '@/services/cajaDiariaService';

interface MovimientosTableProps {
  movimientos: MovimientoCaja[];
  onEdit: (movimiento: MovimientoCaja) => void;
  onRefresh: () => void;
}

export default function MovimientosTable({ movimientos, onEdit, onRefresh }: MovimientosTableProps) {
  const [eliminando, setEliminando] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      return;
    }

    try {
      setEliminando(id);
      await cajaDiariaService.eliminarMovimiento(id);
      toast.success('Movimiento eliminado correctamente');
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      toast.error('Error al eliminar el movimiento');
    } finally {
      setEliminando(null);
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'ingreso' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case 'efectivo': return '💵';
      case 'transferencia': return '🏦';
      case 'cheque': return '📄';
      case 'tarjeta': return '💳';
      default: return '💰';
    }
  };

  if (movimientos.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay movimientos
        </h3>
        <p className="text-gray-500">
          No se encontraron movimientos para la fecha seleccionada.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente/Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimientos.map((movimiento) => (
              <tr key={movimiento.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(movimiento.fecha).toLocaleDateString('es-AR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(movimiento.tipo)}`}>
                    {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{movimiento.concepto}</div>
                    {movimiento.observaciones && (
                      <div className="text-gray-500 text-xs mt-1">
                        {movimiento.observaciones}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {movimiento.cliente?.nombre || movimiento.proveedor?.nombre || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${
                    movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movimiento.tipo === 'ingreso' ? '+' : '-'}
                    {formatCurrency(movimiento.monto)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetodoPagoIcon(movimiento.metodoPago)}</span>
                    <span className="capitalize">{movimiento.metodoPago}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(movimiento)}
                      className="text-blue-600 hover:text-blue-900 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(movimiento.id)}
                      disabled={eliminando === movimiento.id}
                      className="text-red-600 hover:text-red-900 transition disabled:opacity-50"
                    >
                      {eliminando === movimiento.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
