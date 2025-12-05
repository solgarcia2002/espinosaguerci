'use client';

import { useState, useEffect } from 'react';
import { ProveedoresResponse, ProveedorEntity } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';
import { useProveedoresContext } from '@/contexts/ProveedoresContext';
import { obtenerFechasUltimoMes } from '@/lib/fecha-utils';

export default function GestionProveedores() {
  const {
    proveedoresPagados,
    proveedoresPendientes,
    totalPendientePago,
    montoTotalPagado,
    loading: contextLoading,
    refresh: refreshContext
  } = useProveedoresContext();

  const fechasDefault = obtenerFechasUltimoMes();
  const [paginaPagados, setPaginaPagados] = useState(1);
  const [paginaPendientes, setPaginaPendientes] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [fechaDesde, setFechaDesde] = useState(fechasDefault.fechaDesde);
  const [fechaHasta, setFechaHasta] = useState(fechasDefault.fechaHasta);
  const [proveedoresPagadosData, setProveedoresPagadosData] = useState<ProveedoresResponse | null>(null);
  const [proveedoresPendientesData, setProveedoresPendientesData] = useState<ProveedoresResponse | null>(null);
  const [loadingPagados, setLoadingPagados] = useState(false);
  const [loadingPendientes, setLoadingPendientes] = useState(false);

  useEffect(() => {
    cargarProveedoresPagados();
  }, [paginaPagados, itemsPorPagina]);

  useEffect(() => {
    cargarProveedoresPendientes();
  }, [paginaPendientes, itemsPorPagina]);

  const cargarProveedoresPagados = async () => {
    try {
      setLoadingPagados(true);
      const data = await cajaDiariaService.obtenerProveedoresConPaginacion(
        paginaPagados,
        itemsPorPagina,
        'pagado'
      );
      setProveedoresPagadosData(data);
    } catch (error) {
      console.error('Error al cargar proveedores pagados:', error);
      toast.error('Error al cargar los proveedores pagados');
    } finally {
      setLoadingPagados(false);
    }
  };

  const cargarProveedoresPendientes = async () => {
    try {
      setLoadingPendientes(true);
      const data = await cajaDiariaService.obtenerProveedoresConPaginacion(
        paginaPendientes,
        itemsPorPagina,
        'pendiente'
      );
      setProveedoresPendientesData(data);
    } catch (error) {
      console.error('Error al cargar proveedores pendientes:', error);
      toast.error('Error al cargar los proveedores pendientes');
    } finally {
      setLoadingPendientes(false);
    }
  };

  const sincronizarFacturasProveedores = async () => {
    try {
      setSincronizando(true);
      setShowProgress(true);

      const resultado = await colppyService.sincronizarFacturasProveedores({
        fechaDesde,
        fechaHasta,
        email: 'matiespinosa05@gmail.com',
        password: 'Mati.46939'
      });

      if (resultado.success) {
        toast.success('Facturas de proveedores sincronizadas correctamente');
        await Promise.all([cargarProveedoresPagados(), cargarProveedoresPendientes(), refreshContext()]);
      } else {
        toast.error(resultado.message || 'Error al sincronizar facturas de proveedores');
      }
    } catch (error) {
      console.error('Error sincronizando facturas de proveedores:', error);
      toast.error('Error al sincronizar facturas de proveedores');
    } finally {
      setSincronizando(false);
      setTimeout(() => setShowProgress(false), 2000);
    }
  };

  const saldo = montoTotalPagado - totalPendientePago;

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  const renderPaginacion = (
    pagina: number,
    setPagina: (nuevaPagina: number) => void,
    pagination: { page: number; totalPages: number; hasPrev: boolean; hasNext: boolean; total: number; limit: number } | undefined
  ) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Mostrar:</label>
              <select
                value={itemsPorPagina}
                onChange={(e) => {
                  setItemsPorPagina(parseInt(e.target.value));
                  setPagina(1);
                }}
                className="input py-1 px-2 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-500">por página</span>
            </div>
            
            <div className="text-sm text-gray-700">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} resultados
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagina(1)}
              disabled={!pagination.hasPrev}
              className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏮️ Primera
            </button>
            
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={!pagination.hasPrev}
              className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⬅️ Anterior
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const startPage = Math.max(1, pagination.page - 2);
                const pageNum = startPage + i;
                
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagina(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'btn-secondary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={!pagination.hasNext}
              className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente ➡️
            </button>
            
            <button
              onClick={() => setPagina(pagination.totalPages)}
              disabled={!pagination.hasNext}
              className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Última ⏭️
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTablaProveedores = (
    proveedores: ProveedorEntity[],
    loading: boolean,
    tipo: 'pagado' | 'pendiente'
  ) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Cargando...</p>
          </div>
        </div>
      );
    }

    if (proveedores.length === 0) {
      return (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">🏢</div>
          <p className="text-gray-500">No hay proveedores {tipo === 'pagado' ? 'pagados' : 'pendientes de pago'}</p>
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CUIT
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tipo === 'pagado' ? 'Monto Pagado' : 'Monto Pendiente'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-xl mr-3">🏢</div>
                      <div className="text-sm font-medium text-gray-900">
                        {proveedor.nombre}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {proveedor.cuit || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`font-medium ${
                      tipo === 'pendiente' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(tipo === 'pagado' ? (proveedor.montoPagado ?? 0) : (proveedor.montoPendiente ?? proveedor.saldo ?? 0))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showProgress && (
        <ColppyProgress
          scope="facturas"
          onComplete={() => {
            setShowProgress(false);
            Promise.all([cargarProveedoresPagados(), cargarProveedoresPendientes(), refreshContext()]);
          }}
          onError={() => {
            setShowProgress(false);
          }}
        />
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sincronización con Colppy</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={sincronizarFacturasProveedores}
              disabled={sincronizando}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 px-3 py-1 text-sm"
            >
              <span>🔄</span>
              <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Pagado</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(montoTotalPagado)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Pendiente de Pago</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalPendientePago)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Saldo</div>
          <div className={`text-2xl font-bold ${
            saldo >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(saldo)}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proveedores Pagados</h3>
          {renderTablaProveedores(
            proveedoresPagadosData?.data || [],
            loadingPagados,
            'pagado'
          )}
          {renderPaginacion(paginaPagados, setPaginaPagados, proveedoresPagadosData?.pagination)}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proveedores Pendientes de Pago</h3>
          {renderTablaProveedores(
            proveedoresPendientesData?.data || [],
            loadingPendientes,
            'pendiente'
          )}
          {renderPaginacion(paginaPendientes, setPaginaPendientes, proveedoresPendientesData?.pagination)}
        </div>
      </div>
    </div>
  );
}
