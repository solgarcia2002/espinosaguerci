'use client';

import { useEffect, useState } from 'react';
import { ClientesResponse, ClienteEntity } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { formatCurrency } from '@/lib/utils';

export default function ClientesTab() {
  const [clientesData, setClientesData] = useState<ClientesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [error, setError] = useState<string | null>(null);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCuit, setFiltroCuit] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await cajaDiariaService.obtenerClientesConPaginacion({
        page: paginaActual,
        limit: itemsPorPagina,
        orderBy: 'nombre',
        order: 'asc'
      });
      setClientesData(data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [paginaActual, itemsPorPagina]);

  const clientes = clientesData?.data ?? [];
  const pagination = clientesData?.pagination;

  const clientesFiltrados = clientes.filter((cliente) => {
    const nombreMatch = !filtroNombre || cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const cuitMatch = !filtroCuit || (cliente.cuit && cliente.cuit.includes(filtroCuit));
    const emailMatch = !filtroEmail || (cliente.email && cliente.email.toLowerCase().includes(filtroEmail.toLowerCase()));
    return nombreMatch && cuitMatch && emailMatch;
  });

  const cambiarPagina = (pagina: number) => {
    if (!pagination) return;
    setPaginaActual(pagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroCuit('');
    setFiltroEmail('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Listado de Clientes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Buscar por nombre..."
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CUIT</label>
            <input
              type="text"
              value={filtroCuit}
              onChange={(e) => setFiltroCuit(e.target.value)}
              placeholder="Buscar por CUIT..."
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={filtroEmail}
              onChange={(e) => setFiltroEmail(e.target.value)}
              placeholder="Buscar por email..."
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="btn-secondary px-3 py-1 text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Total Clientes</p>
          <p className="text-2xl font-semibold text-purple-600">{pagination?.total ?? 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Saldo Total</p>
          <p className="text-2xl font-semibold text-blue-600">
            {formatCurrency(clientes.reduce((sum, cliente) => sum + (cliente.saldo ?? 0), 0))}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Pendiente de Cobro</p>
          <p className="text-2xl font-semibold text-orange-600">
            {formatCurrency(clientes.reduce((sum, cliente) => sum + (cliente.montoPendienteCobro ?? 0), 0))}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {clientesFiltrados.length === 0 && !loading ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
          <p className="text-gray-500">No se encontraron clientes con los filtros aplicados.</p>
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
