'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClientesResponse, ClienteEntity } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import ColppyProgress from '@/components/ColppyProgress';
import { toast } from 'sonner';

type ClienteOrderBy = 'saldo' | 'nombre';
type ClienteOrder = 'asc' | 'desc';

export default function CobradoTab() {
  const [clientesData, setClientesData] = useState<ClientesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [orderBy, setOrderBy] = useState<ClienteOrderBy>('saldo');
  const [order, setOrder] = useState<ClienteOrder>('desc');
  const [busqueda, setBusqueda] = useState('');
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await cajaDiariaService.obtenerClientesConPaginacion({
        page: paginaActual,
        limit: itemsPorPagina,
        orderBy,
        order,
        estadoCobro: 'cobrado',
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined
      });
      setClientesData(data);
    } catch (err) {
      console.error('Error al cargar clientes cobrados:', err);
      setError('No se pudieron cargar los clientes cobrados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaDesde, fechaHasta, paginaActual, itemsPorPagina, orderBy, order]);

  const clientes = clientesData?.data ?? [];
  const pagination = clientesData?.pagination;

  const clientesFiltrados = useMemo(() => {
    if (!busqueda) return clientes;
    const term = busqueda.toLowerCase();
    return clientes.filter((cliente) => {
      const nombre = cliente.nombre.toLowerCase();
      const cuit = cliente.cuit?.toLowerCase() ?? '';
      return nombre.includes(term) || cuit.includes(term);
    });
  }, [busqueda, clientes]);

  const totalCobrado = clientes.reduce((sum, cliente) => sum + (cliente.montoCobrado ?? 0), 0);
  const totalSaldo = clientes.reduce((sum, cliente) => sum + (cliente.saldo ?? 0), 0);
  const cantidadClientes = pagination?.total ?? 0;

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
        cargarClientes();
      } else {
        toast.error(resultado.message || 'Error al sincronizar movimientos');
      }
    } catch (err) {
      console.error('Error sincronizando movimientos:', err);
      toast.error('Error al sincronizar movimientos');
    } finally {
      setSincronizando(false);
      setTimeout(() => setShowProgress(false), 1500);
    }
  };

  const cambiarPagina = (pagina: number) => {
    if (!pagination) return;
    setPaginaActual(pagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setBusqueda('');
    setOrderBy('saldo');
    setOrder('desc');
    setPaginaActual(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes cobrados...</p>
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
            cargarClientes();
          }}
          onError={() => {
            setShowProgress(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Total cobrado</p>
          <p className="text-2xl font-semibold text-green-600">
            {formatCurrency(totalCobrado)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Saldo de clientes</p>
          <p className="text-2xl font-semibold text-blue-600">
            {formatCurrency(totalSaldo)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Clientes</p>
          <p className="text-2xl font-semibold text-purple-600">{cantidadClientes}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Clientes cobrados</h3>
          <div className="flex items-center gap-3">
            <button onClick={cargarClientes} className="btn-secondary px-3 py-1 text-sm">
              🔄 Actualizar
            </button>
            <button
              onClick={sincronizarMovimientos}
              disabled={sincronizando}
              className="btn-primary px-3 py-1 text-sm disabled:opacity-50"
            >
              {sincronizando ? 'Sincronizando...' : 'Sincronizar movimientos'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => {
                setFechaDesde(e.target.value);
                setPaginaActual(1);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => {
                setFechaHasta(e.target.value);
                setPaginaActual(1);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select
              value={orderBy}
              onChange={(e) => {
                setOrderBy(e.target.value as ClienteOrderBy);
                setPaginaActual(1);
              }}
              className="input"
            >
              <option value="nombre">Nombre</option>
              <option value="saldo">Saldo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sentido</label>
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as ClienteOrder);
                setPaginaActual(1);
              }}
              className="input"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar cliente</label>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              placeholder="Nombre o CUIT"
              className="input"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={limpiarFiltros} className="btn-secondary px-3 py-1 text-sm">
            Limpiar filtros
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {clientesFiltrados.length === 0 && !loading ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes cobrados</h3>
          <p className="text-gray-500">No se encontraron clientes para los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUIT
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cobrado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendiente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente: ClienteEntity) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {cliente.cuit || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {formatCurrency(cliente.saldo ?? 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">
                      {formatCurrency(cliente.montoCobrado ?? 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600 font-semibold">
                      {formatCurrency(cliente.montoPendienteCobro ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="card p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Mostrar</label>
              <select
                value={itemsPorPagina}
                onChange={(e) => cambiarItemsPorPagina(parseInt(e.target.value, 10))}
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
              {`Mostrando ${(pagination.page - 1) * pagination.limit + 1} a ${Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )} de ${pagination.total}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(1)}
                disabled={!pagination.hasPrev}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏮️ Primera
              </button>
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={!pagination.hasPrev}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅️ Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
                  const startPage = Math.max(1, pagination.page - 2);
                  const currentPage = startPage + index;
                  if (currentPage > pagination.totalPages) return null;
                  return (
                    <button
                      key={currentPage}
                      onClick={() => cambiarPagina(currentPage)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pagination.page ? 'bg-blue-600 text-white' : 'btn-secondary'
                      }`}
                    >
                      {currentPage}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={!pagination.hasNext}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente ➡️
              </button>
              <button
                onClick={() => cambiarPagina(pagination.totalPages)}
                disabled={!pagination.hasNext}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Última ⏭️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
