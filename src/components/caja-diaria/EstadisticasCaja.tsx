'use client';

import { MovimientoCaja } from '@/types/cajaDiaria';
import { formatCurrency } from '@/lib/utils';

interface EstadisticasCajaProps {
  movimientos: MovimientoCaja[];
}

export default function EstadisticasCaja({ movimientos }: EstadisticasCajaProps) {
  if (movimientos.length === 0) {
    return null;
  }

  // Calcular estadísticas
  const ingresos = movimientos.filter(m => m.tipo === 'ingreso');
  const egresos = movimientos.filter(m => m.tipo === 'egreso');
  
  const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = egresos.reduce((sum, m) => sum + m.monto, 0);
  
  // Estadísticas por método de pago
  const porMetodoPago = movimientos.reduce((acc, m) => {
    acc[m.metodoPago] = (acc[m.metodoPago] || 0) + m.monto;
    return acc;
  }, {} as Record<string, number>);

  // Top clientes/proveedores
  const topClientes = ingresos
    .filter(m => m.cliente)
    .reduce((acc, m) => {
      const nombre = m.cliente!.nombre;
      acc[nombre] = (acc[nombre] || 0) + m.monto;
      return acc;
    }, {} as Record<string, number>);

  const topProveedores = egresos
    .filter(m => m.proveedor)
    .reduce((acc, m) => {
      const nombre = m.proveedor!.nombre;
      acc[nombre] = (acc[nombre] || 0) + m.monto;
      return acc;
    }, {} as Record<string, number>);

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case 'efectivo': return '💵';
      case 'transferencia': return '🏦';
      case 'cheque': return '📄';
      case 'tarjeta': return '💳';
      case 'pendiente': return '⏳';
      default: return '💰';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Estadísticas por método de pago */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución por Método de Pago
        </h3>
        <div className="space-y-3">
          {Object.entries(porMetodoPago)
            .sort(([,a], [,b]) => b - a)
            .map(([metodo, monto]) => (
              <div key={metodo} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">{getMetodoPagoIcon(metodo)}</span>
                  <span className="capitalize text-sm font-medium text-gray-700">
                    {metodo}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(monto)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Top clientes y proveedores */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Principales Clientes y Proveedores
        </h3>
        
        {Object.keys(topClientes).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-green-600 mb-2">Top Clientes</h4>
            <div className="space-y-2">
              {Object.entries(topClientes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([nombre, monto]) => (
                  <div key={nombre} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{nombre}</span>
                    <span className="text-green-600 font-medium">
                      {formatCurrency(monto)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {Object.keys(topProveedores).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">Top Proveedores</h4>
            <div className="space-y-2">
              {Object.entries(topProveedores)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([nombre, monto]) => (
                  <div key={nombre} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{nombre}</span>
                    <span className="text-red-600 font-medium">
                      {formatCurrency(monto)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {Object.keys(topClientes).length === 0 && Object.keys(topProveedores).length === 0 && (
          <p className="text-gray-500 text-sm">No hay datos de clientes o proveedores</p>
        )}
      </div>
    </div>
  );
}
