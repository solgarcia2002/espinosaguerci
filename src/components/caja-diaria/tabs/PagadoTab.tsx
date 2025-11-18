'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, MovimientosResponse } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import MovimientosTable from '../MovimientosTable';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';

export default function PagadoTab() {
  const [movimientosData, setMovimientosData] = useState<MovimientosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [proveedorId, setProveedorId] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [orderBy, setOrderBy] = useState<'fecha' | 'monto'>('fecha');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    cargarMovimientos();
  }, [fechaDesde, fechaHasta, proveedorId, paginaActual, itemsPorPagina]);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      const data = await cajaDiariaService.obtenerMovimientosConPaginacion({
        tipo: 'egreso',
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
        proveedorId: proveedorId || undefined,
        page: paginaActual,
        limit: itemsPorPagina
      });
      setMovimientosData(data);
    } catch (error) {
      console.error('Error al cargar movimientos de pagado:', error);
      toast.error('Error al cargar los movimientos');
    } finally {
      setLoading(false);
    }
  };

  const movimientosOrdenados = movimientosData?.data ? [...movimientosData.data].sort((a, b) => {
    if (orderBy === 'fecha') {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return order === 'desc' ? fechaB - fechaA : fechaA - fechaB;
    } else {
      return order === 'desc' ? b.monto - a.monto : a.monto - b.monto;
    }
  }) : [];

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

  const sincronizarMovimientos = async () => {
    try {
      setSincronizando(true);
      setShowProgress(true);
      
      const resultado = await colppyService.sincronizarMovimientos({
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
        email: 'matiespinosa05@gmail.com',
        password: 'Mati.46939'
      });

      if (resultado.success) {
        toast.success('Movimientos sincronizados correctamente');
        await cargarMovimientos();
      } else {
        toast.error(resultado.message || 'Error al sincronizar movimientos');
      }
    } catch (error) {
      console.error('Error sincronizando movimientos:', error);
      toast.error('Error al sincronizar movimientos');
    } finally {
      setSincronizando(false);
      setTimeout(() => setShowProgress(false), 2000);
    }
  };

  const totalPagado = movimientosData?.data.reduce((sum, m) => sum + m.monto, 0) || 0;
  const cantidadMovimientos = movimientosData?.pagination.total || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando movimientos de pagado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showProgress && (
        <ColppyProgress
          scope="movimientos"
          onComplete={() => {
            setShowProgress(false);
            cargarMovimientos();
          }}
          onError={() => {
            setShowProgress(false);
          }}
        />
      )}
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Movimientos Pagados</h3>
          <button
            onClick={sincronizarMovimientos}
            disabled={sincronizando}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>🔄</span>
            <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as 'fecha' | 'monto')}
              className="input"
            >
              <option value="fecha">Fecha</option>
              <option value="monto">Importe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="input"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFechaDesde('');
                setFechaHasta('');
                setProveedorId('');
                setOrderBy('fecha');
                setOrder('desc');
              }}
              className="btn-secondary w-full"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Pagado</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalPagado)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Cantidad de Movimientos</div>
          <div className="text-2xl font-bold text-purple-600">
            {cantidadMovimientos}
          </div>
        </div>
      </div>

      {movimientosData && movimientosOrdenados.length > 0 ? (
        <>
          <MovimientosTable
            movimientos={movimientosOrdenados}
            onEdit={() => {}}
            onRefresh={cargarMovimientos}
          />

          {movimientosData.pagination.totalPages > 1 && (
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Mostrar:</label>
                    <select
                      value={itemsPorPagina}
                      onChange={(e) => cambiarItemsPorPagina(parseInt(e.target.value))}
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
                    Mostrando {((movimientosData.pagination.page - 1) * movimientosData.pagination.limit) + 1} a{' '}
                    {Math.min(movimientosData.pagination.page * movimientosData.pagination.limit, movimientosData.pagination.total)} de{' '}
                    {movimientosData.pagination.total} resultados
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => cambiarPagina(1)}
                    disabled={!movimientosData.pagination.hasPrev}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⏮️ Primera
                  </button>
                  
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={!movimientosData.pagination.hasPrev}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⬅️ Anterior
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, movimientosData.pagination.totalPages) }, (_, i) => {
                      const startPage = Math.max(1, movimientosData.pagination.page - 2);
                      const pageNum = startPage + i;
                      
                      if (pageNum > movimientosData.pagination.totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => cambiarPagina(pageNum)}
                          className={`px-3 py-1 text-sm rounded ${
                            pageNum === movimientosData.pagination.page
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
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={!movimientosData.pagination.hasNext}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente ➡️
                  </button>
                  
                  <button
                    onClick={() => cambiarPagina(movimientosData.pagination.totalPages)}
                    disabled={!movimientosData.pagination.hasNext}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Última ⏭️
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay movimientos de pagado
          </h3>
          <p className="text-gray-500">
            No se encontraron egresos para los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
}
