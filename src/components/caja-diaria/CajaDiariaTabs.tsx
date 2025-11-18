'use client';

import { useState } from 'react';
import { MovimientoCaja, ResumenCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import DisponibilidadTab from './tabs/DisponibilidadTab';
import PagadoTab from './tabs/PagadoTab';
import CobradoTab from './tabs/CobradoTab';
import PendienteCobroTab from './tabs/PendienteCobroTab';
import PendientePagoTab from './tabs/PendientePagoTab';
import GestionClientes from './GestionClientes';
import GestionProveedores from './GestionProveedores';
import ConsolidadoTab from './tabs/ConsolidadoTab';
import SelectorMes from './SelectorMes';

interface CajaDiariaTabsProps {
  movimientos: MovimientoCaja[];
  resumen: ResumenCaja | null;
  filtros: FiltrosCajaType;
  loading: boolean;
  onFiltrosChange: (filtros: FiltrosCajaType) => void;
  onExportar: () => void;
  onLimpiar: () => void;
  onEdit: (movimiento: MovimientoCaja) => void;
  onRefresh: () => void;
  onNuevoMovimiento: () => void;
}

const tabs = [
  {
    id: 'disponibilidad',
    name: 'DISPONIBILIDAD',
    icon: '💰',
    description: 'Dinero disponible en caja'
  },
  {
    id: 'pagado',
    name: 'PAGADO',
    icon: '✅',
    description: 'Movimientos ya pagados'
  },
  {
    id: 'cobrado',
    name: 'COBRADO',
    icon: '📈',
    description: 'Dinero cobrado de clientes'
  },
  {
    id: 'pendiente-cobro',
    name: 'PENDIENTE DE COBRO',
    icon: '⏳',
    description: 'Cobros pendientes de clientes'
  },
  {
    id: 'pendiente-pago',
    name: 'PENDIENTE DE PAGO',
    icon: '📋',
    description: 'Pagos pendientes a proveedores'
  },
  {
    id: 'proveedores',
    name: 'PROVEEDORES',
    icon: '🏢',
    description: 'Gestión de proveedores'
  },
  {
    id: 'clientes',
    name: 'CLIENTES',
    icon: '👥',
    description: 'Gestión de clientes'
  },
  {
    id: 'consolidado',
    name: 'CONSOLIDADO',
    icon: '📊',
    description: 'Resumen consolidado de caja'
  }
];

export default function CajaDiariaTabs({
  movimientos,
  resumen,
  filtros,
  loading,
  onFiltrosChange,
  onExportar,
  onLimpiar,
  onEdit,
  onRefresh,
  onNuevoMovimiento
}: CajaDiariaTabsProps) {
  const [activeTab, setActiveTab] = useState('disponibilidad');
  const [mesSeleccionado, setMesSeleccionado] = useState('2025-08');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'disponibilidad':
        return <DisponibilidadTab />;

      case 'pagado':
        return <PagadoTab />;

      case 'cobrado':
        return <CobradoTab />;

      case 'pendiente-cobro':
        return <PendienteCobroTab />;

      case 'pendiente-pago':
        return <PendientePagoTab />;

      case 'clientes':
        return <GestionClientes />;

      case 'proveedores':
        return <GestionProveedores />;

      case 'consolidado':
        return <ConsolidadoTab />;

      default:
        return <div>Tab no encontrada</div>;
    }
  };

  return (
    <div>
     
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
