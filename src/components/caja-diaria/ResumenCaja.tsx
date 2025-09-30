'use client';

import { ResumenCaja } from '@/types/cajaDiaria';
import { formatCurrency } from '@/lib/utils';

interface ResumenCajaProps {
  resumen: ResumenCaja;
}

export default function ResumenCajaComponent({ resumen }: ResumenCajaProps) {
  const fechaFormateada = new Date(resumen.fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Resumen de Caja - {fechaFormateada}
        </h2>
        <span className="text-sm text-gray-500">
          {resumen.cantidadMovimientos} movimientos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Saldo Inicial</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(resumen.saldoInicial)}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(resumen.totalIngresos)}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Egresos</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(resumen.totalEgresos)}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">📉</span>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          resumen.saldoFinal >= 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                resumen.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Saldo Final
              </p>
              <p className={`text-2xl font-bold ${
                resumen.saldoFinal >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {formatCurrency(resumen.saldoFinal)}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              resumen.saldoFinal >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-sm ${
                resumen.saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {resumen.saldoFinal >= 0 ? '✅' : '⚠️'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-500">Movimientos de Ingreso</p>
          <p className="font-semibold text-green-600">
            {resumen.movimientos.filter(m => m.tipo === 'ingreso').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Movimientos de Egreso</p>
          <p className="font-semibold text-red-600">
            {resumen.movimientos.filter(m => m.tipo === 'egreso').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Diferencia</p>
          <p className={`font-semibold ${
            resumen.totalIngresos - resumen.totalEgresos >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {formatCurrency(resumen.totalIngresos - resumen.totalEgresos)}
          </p>
        </div>
      </div>
    </div>
  );
}
