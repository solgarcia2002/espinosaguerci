'use client';

import { useState } from 'react';
import { MovimientoCaja, ResumenCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import MovimientoForm from './MovimientoForm';
import ResumenCajaComponent from './ResumenCaja';
import MovimientosTable from './MovimientosTable';
import FiltrosCaja from './FiltrosCaja';
import EstadisticasCaja from './EstadisticasCaja';
import GestionClientes from './GestionClientes';
import GestionProveedores from './GestionProveedores';

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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState<MovimientoCaja | undefined>();

  const handleEdit = (movimiento: MovimientoCaja) => {
    setMovimientoEditando(movimiento);
    setMostrarFormulario(true);
  };

  const handleNuevoMovimiento = () => {
    setMovimientoEditando(undefined);
    setMostrarFormulario(true);
  };

  const handleFormularioSuccess = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
    onRefresh();
  };

  const handleFormularioCancel = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
  };

  // Filtrar movimientos según la pestaña activa
  const getMovimientosFiltrados = () => {
    switch (activeTab) {
      case 'cobrado':
        return movimientos.filter(m => m.tipo === 'ingreso');
      case 'pagado':
        return movimientos.filter(m => m.tipo === 'egreso');
      case 'pendiente-cobro':
        return movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'pendiente');
      case 'pendiente-pago':
        return movimientos.filter(m => m.tipo === 'egreso' && m.metodoPago === 'pendiente');
      default:
        return movimientos;
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'disponibilidad':
        return (
          <div>
            {resumen ? (
              <ResumenCajaComponent resumen={resumen} />
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Dinero Disponible en Caja
                </h3>
                <p className="text-gray-500">
                  Aquí se muestra el dinero disponible en caja.
                </p>
              </div>
            )}
          </div>
        );

      case 'pagado':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Movimientos Pagados</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Pago</span>
              </button>
            </div>
            <MovimientosTable
              movimientos={getMovimientosFiltrados()}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          </div>
        );

      case 'cobrado':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Dinero Cobrado</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Cobro</span>
              </button>
            </div>
            <MovimientosTable
              movimientos={getMovimientosFiltrados()}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          </div>
        );

      case 'pendiente-cobro':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pendiente de Cobro</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Cobro Pendiente</span>
              </button>
            </div>
            <MovimientosTable
              movimientos={getMovimientosFiltrados()}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          </div>
        );

      case 'pendiente-pago':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pendiente de Pago</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Pago Pendiente</span>
              </button>
            </div>
            <MovimientosTable
              movimientos={getMovimientosFiltrados()}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          </div>
        );

      case 'clientes':
        return <GestionClientes />;

      case 'proveedores':
        return <GestionProveedores />;

      case 'consolidado':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Consolidado</h3>
            <EstadisticasCaja movimientos={movimientos} />
            <div className="card p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Exportar Reportes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={onExportar}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <h5 className="font-medium text-gray-900">Exportar a Excel</h5>
                    <p className="text-sm text-gray-500">Descargar reporte completo</p>
                  </div>
                </button>
                <button
                  onClick={() => {/* TODO: Implementar más reportes */}}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <h5 className="font-medium text-gray-900">Reportes Avanzados</h5>
                    <p className="text-sm text-gray-500">Gráficos y análisis</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab no encontrada</div>;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
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

      {/* Filtros (solo en tabs de movimientos) */}
      {['pagado', 'cobrado', 'pendiente-cobro', 'pendiente-pago'].includes(activeTab) && (
        <FiltrosCaja
          filtros={filtros}
          onFiltrosChange={onFiltrosChange}
          onExportar={onExportar}
          onLimpiar={onLimpiar}
        />
      )}

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Formulario de movimiento */}
      {mostrarFormulario && (
        <MovimientoForm
          movimiento={movimientoEditando}
          onSuccess={handleFormularioSuccess}
          onCancel={handleFormularioCancel}
        />
      )}
    </div>
  );
}
