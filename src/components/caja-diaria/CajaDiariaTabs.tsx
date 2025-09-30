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
    id: 'resumen',
    name: 'Resumen Diario',
    icon: '📊',
    description: 'Vista general del día'
  },
  {
    id: 'movimientos',
    name: 'Movimientos',
    icon: '💰',
    description: 'Lista de todos los movimientos'
  },
  {
    id: 'ingresos',
    name: 'Ingresos',
    icon: '📈',
    description: 'Solo movimientos de ingreso'
  },
  {
    id: 'egresos',
    name: 'Egresos',
    icon: '📉',
    description: 'Solo movimientos de egreso'
  },
  {
    id: 'clientes',
    name: 'Clientes',
    icon: '👥',
    description: 'Gestión de clientes'
  },
  {
    id: 'proveedores',
    name: 'Proveedores',
    icon: '🏢',
    description: 'Gestión de proveedores'
  },
  {
    id: 'reportes',
    name: 'Reportes',
    icon: '📋',
    description: 'Reportes y estadísticas'
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    icon: '⚙️',
    description: 'Configuración de caja'
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
  const [activeTab, setActiveTab] = useState('resumen');
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
      case 'ingresos':
        return movimientos.filter(m => m.tipo === 'ingreso');
      case 'egresos':
        return movimientos.filter(m => m.tipo === 'egreso');
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
      case 'resumen':
        return (
          <div>
            {resumen ? (
              <ResumenCajaComponent resumen={resumen} />
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay resumen disponible
                </h3>
                <p className="text-gray-500">
                  Selecciona una fecha específica para ver el resumen diario.
                </p>
              </div>
            )}
          </div>
        );

      case 'movimientos':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Todos los Movimientos</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Movimiento</span>
              </button>
            </div>
            <MovimientosTable
              movimientos={getMovimientosFiltrados()}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          </div>
        );

      case 'ingresos':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Movimientos de Ingreso</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Ingreso</span>
              </button>
            </div>
            <MovimientosTable
              movimientos={getMovimientosFiltrados()}
              onEdit={handleEdit}
              onRefresh={onRefresh}
            />
          </div>
        );

      case 'egresos':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Movimientos de Egreso</h3>
              <button
                onClick={handleNuevoMovimiento}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Egreso</span>
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

      case 'reportes':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes y Estadísticas</h3>
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

      case 'configuracion':
        return (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Caja</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Saldo Inicial</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Configura el saldo inicial para el día.
                </p>
                <button
                  onClick={() => {/* TODO: Implementar configuración de saldo */}}
                  className="btn-primary"
                >
                  Configurar Saldo Inicial
                </button>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sincronización con Colppy</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Gestiona la sincronización automática de clientes y proveedores.
                </p>
                <button
                  onClick={() => {/* TODO: Implementar configuración de sincronización */}}
                  className="btn-primary"
                >
                  Configurar Sincronización
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
      {['movimientos', 'ingresos', 'egresos'].includes(activeTab) && (
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
