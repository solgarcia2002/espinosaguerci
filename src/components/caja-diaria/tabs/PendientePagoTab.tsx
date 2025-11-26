'use client';

import { useState, useEffect } from 'react';
import { ProveedoresResponse, ProveedorEntity } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';

export default function PendientePagoTab() {
  const [proveedoresData, setProveedoresData] = useState<ProveedoresResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarProveedores();
  }, [fechaDesde, fechaHasta, paginaActual, itemsPorPagina]);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await cajaDiariaService.obtenerProveedoresConPaginacion(
        paginaActual,
        itemsPorPagina,
        'pendiente',
        fechaDesde || undefined,
        fechaHasta || undefined
      );
      setProveedoresData(data);
    } catch (error) {
      console.error('Error al cargar proveedores pendientes de pago:', error);
      toast.error('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

  const obtenerFechasPorDefecto = () => {
    const hoy = new Date();
    const mesAnterior = new Date(hoy);
    mesAnterior.setMonth(hoy.getMonth() - 1);

    const fechaHastaDefault = hoy.toISOString().split('T')[0];
    const fechaDesdeDefault = mesAnterior.toISOString().split('T')[0];

    return {
      fechaDesde: fechaDesdeDefault,
      fechaHasta: fechaHastaDefault
    };
  };

  const sincronizarFacturasProveedores = async () => {
    try {
      setSincronizando(true);
      setShowProgress(true);

      const fechas = obtenerFechasPorDefecto();

      const resultado = await colppyService.sincronizarFacturasProveedores({
        fechaDesde: fechas.fechaDesde,
        fechaHasta: fechas.fechaHasta,
        email: 'matiespinosa05@gmail.com',
        password: 'Mati.46939'
      });

      if (resultado.success) {
        toast.success('Facturas de proveedores sincronizadas correctamente');
        await cargarProveedores();
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

  const proveedoresFiltrados = busqueda
    ? (proveedoresData?.data || []).filter(proveedor =>
        proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (proveedor.email && proveedor.email.toLowerCase().includes(busqueda.toLowerCase())) ||
        (proveedor.cuit && proveedor.cuit.includes(busqueda)) ||
        (proveedor.telefono && proveedor.telefono.includes(busqueda)) ||
        (proveedor.direccion && proveedor.direccion.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : (proveedoresData?.data || []);

  const totalSaldo = proveedoresFiltrados.reduce((sum, p) => sum + (p.saldo || 0), 0);
  const cantidadProveedores = proveedoresData?.pagination.total || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proveedores pendientes de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showProgress && (
        <ColppyProgress
          scope="facturas"
          onComplete={() => {
            setShowProgress(false);
            cargarProveedores();
          }}
          onError={() => {
            setShowProgress(false);
          }}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pendientes de Pago</h3>
        <button
          onClick={sincronizarFacturasProveedores}
          disabled={sincronizando}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <span>🔄</span>
          <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="input w-full"
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
              className="input w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar proveedor por nombre, CUIT, email, teléfono o dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input w-full"
            />
          </div>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="btn-secondary"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Saldo</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalSaldo)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Cantidad de Proveedores</div>
          <div className="text-2xl font-bold text-purple-600">
            {cantidadProveedores}
          </div>
        </div>
      </div>

      {proveedoresFiltrados.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {busqueda ? 'No se encontraron proveedores' : 'No hay proveedores pendientes de pago'}
          </h3>
          <p className="text-gray-500">
            {busqueda
              ? 'Intenta con otros términos de búsqueda'
              : 'No se encontraron proveedores con estado de pago pendiente para el período seleccionado.'
            }
          </p>
        </div>
      ) : (
        <>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colppy ID
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Pendiente
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proveedoresFiltrados.map((proveedor) => (
                    <tr key={proveedor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">🏢</div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {proveedor.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {proveedor.cuit || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.tipoDocumento || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        {proveedor.direccion || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {proveedor.colppyId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {proveedor.montoPendiente !== undefined ? (
                          <span className="font-medium text-orange-600">
                            {formatCurrency(proveedor.montoPendiente)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {proveedor.saldo !== undefined ? (
                          <span className={`font-medium ${
                            proveedor.saldo > 0 
                              ? 'text-red-600' 
                              : proveedor.saldo < 0 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            {formatCurrency(Math.abs(proveedor.saldo))}
                            {proveedor.saldo > 0 && ' (Debe)'}
                            {proveedor.saldo < 0 && ' (A favor)'}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {proveedoresData?.pagination && proveedoresData.pagination.totalPages > 1 && (
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
                    Mostrando {((proveedoresData.pagination.page - 1) * proveedoresData.pagination.limit) + 1} a{' '}
                    {Math.min(proveedoresData.pagination.page * proveedoresData.pagination.limit, proveedoresData.pagination.total)} de{' '}
                    {proveedoresData.pagination.total} resultados
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => cambiarPagina(1)}
                    disabled={!proveedoresData.pagination.hasPrev}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⏮️ Primera
                  </button>

                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={!proveedoresData.pagination.hasPrev}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⬅️ Anterior
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, proveedoresData.pagination.totalPages) }, (_, i) => {
                      const startPage = Math.max(1, proveedoresData.pagination.page - 2);
                      const pageNum = startPage + i;

                      if (pageNum > proveedoresData.pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => cambiarPagina(pageNum)}
                          className={`px-3 py-1 text-sm rounded ${
                            pageNum === proveedoresData.pagination.page
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
                    disabled={!proveedoresData.pagination.hasNext}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente ➡️
                  </button>

                  <button
                    onClick={() => cambiarPagina(proveedoresData.pagination.totalPages)}
                    disabled={!proveedoresData.pagination.hasNext}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Última ⏭️
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
