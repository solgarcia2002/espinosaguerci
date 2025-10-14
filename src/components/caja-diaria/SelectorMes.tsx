'use client';

import { useState } from 'react';

interface SelectorMesProps {
  mesSeleccionado: string;
  onMesChange: (mes: string) => void;
  className?: string;
}

// Generar meses disponibles (últimos 24 meses)
const generarMesesDisponibles = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - i);
    const mes = fecha.toISOString().slice(0, 7);
    const label = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    return { value: mes, label };
  });
};

export default function SelectorMes({ mesSeleccionado, onMesChange, className = '' }: SelectorMesProps) {
  const mesesDisponibles = generarMesesDisponibles();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label htmlFor="mes-selector" className="text-sm font-medium text-gray-700">
        Filtrar por mes:
      </label>
      <select
        id="mes-selector"
        value={mesSeleccionado}
        onChange={(e) => onMesChange(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
      >
        {mesesDisponibles.map((mes) => (
          <option key={mes.value} value={mes.value}>
            {mes.label}
          </option>
        ))}
      </select>
    </div>
  );
}
