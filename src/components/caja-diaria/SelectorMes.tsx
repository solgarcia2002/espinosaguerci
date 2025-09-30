'use client';

import { useState } from 'react';
import { mesesDisponibles } from '@/data/mockData';

interface SelectorMesProps {
  mesSeleccionado: string;
  onMesChange: (mes: string) => void;
  className?: string;
}

export default function SelectorMes({ mesSeleccionado, onMesChange, className = '' }: SelectorMesProps) {
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
