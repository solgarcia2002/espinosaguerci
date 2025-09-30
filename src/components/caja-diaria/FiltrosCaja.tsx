'use client';

import { useState } from 'react';
import { FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';

interface FiltrosCajaProps {
  filtros: FiltrosCajaType;
  onFiltrosChange: (filtros: FiltrosCajaType) => void;
  onExportar: () => void;
  onLimpiar: () => void;
}

export default function FiltrosCaja({ filtros, onFiltrosChange, onExportar, onLimpiar }: FiltrosCajaProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFiltroChange = (key: keyof FiltrosCajaType, value: any) => {
    onFiltrosChange({
      ...filtros,
      [key]: value
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
    onLimpiar();
  };

  return (
    <div className="card p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
          <button
            onClick={onExportar}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde || ''}
              onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta || ''}
              onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filtros.tipo || 'todos'}
              onChange={(e) => handleFiltroChange('tipo', e.target.value === 'todos' ? undefined : e.target.value)}
              className="input"
            >
              <option value="todos">Todos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              value={filtros.metodoPago || ''}
              onChange={(e) => handleFiltroChange('metodoPago', e.target.value || undefined)}
              className="input"
            >
              <option value="">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {Object.keys(filtros).filter(key => filtros[key as keyof FiltrosCajaType]).length > 0 && (
            <span>
              Filtros activos: {Object.keys(filtros).filter(key => filtros[key as keyof FiltrosCajaType]).length}
            </span>
          )}
        </div>
        <button
          onClick={limpiarFiltros}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
