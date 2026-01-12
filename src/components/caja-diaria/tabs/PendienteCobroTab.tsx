'use client';

import { useEffect, useState } from 'react';
import { ClientesResponse, FacturasClientesResponse, FacturaCliente, FacturasClientesAPIResponse } from '@/types/cajaDiaria';
import { apiClient } from '@/services/apiClient';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
interface PendienteCobroTabProps {
  fechaDesde: string;
  fechaHasta: string;
}

export default function PendienteCobroTab({ fechaDesde, fechaHasta }: PendienteCobroTabProps) {
  const [facturasData, setFacturasData] = useState<FacturasClientesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [error, setError] = useState<string | null>(null);

  const cargarFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiResponse = await apiClient<FacturasClientesAPIResponse>(
        'caja-diaria/clientes/facturas',
        { method: 'GET' },
        {
          estadoCobro: 'pendiente',
          page: paginaActual,
          limit: itemsPorPagina,
          orderBy: 'nombre',
          order: 'desc'
        }
      );

      const facturasMapeadas: FacturaCliente[] = apiResponse.items
        .filter(item => !item.pagada)
        .map(item => ({
          id: item.id,
          cliente: item.clientNombre,
          razonSocial: item.razonSocialEmisor,
          tipo: item.tipoComprobante as 'FAC-C' | 'FAC-A' | 'FAC-X' | 'COB',
          fecha: item.fechaEmision,
          referencia: item.nroComprobante,
          vencimiento: item.fechaVencimiento,
          total: item.importeTotal,
          cobrado: 0,
          pendiente: item.importeTotal,
          clienteId: item.clientId
        }));

      const totalPages = Math.ceil(apiResponse.total / itemsPorPagina);

      const data: FacturasClientesResponse = {
        data: facturasMapeadas,
        pagination: {
          page: paginaActual,
          limit: itemsPorPagina,
          total: apiResponse.total,
          totalPages,
          hasNext: paginaActual < totalPages,
          hasPrev: paginaActual > 1
        }
      };

      setFacturasData(data);
    } catch (err) {
      console.error('Error al cargar facturas pendientes de cobro:', err);
      setError('No se pudieron cargar las facturas pendientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, [paginaActual, itemsPorPagina]);

  const facturas = facturasData?.data || [];
  const pagination = facturasData?.pagination;
  const montoTotal = facturas.reduce((sum, f) => sum + f.pendiente, 0);
  const cantidadFacturas = pagination?.total || 0;


  const cambiarPagina = (pagina: number) => {
    if (!facturasData?.pagination) return;
    setPaginaActual(pagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando facturas pendientes de cobro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Monto Total</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {formatCurrency(montoTotal)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-500">Cantidad de Facturas</p>
          <p className="text-2xl font-semibold text-purple-600">{cantidadFacturas}</p>
        </div>
      </div>


      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {facturas.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas pendientes de cobro</h3>
          <p className="text-gray-500">No se encontraron facturas con estado de cobro pendiente.</p>
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
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
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
                  {facturas.map((factura) => {
                    const fechaVencimiento = factura.vencimiento 
                      ? new Date(factura.vencimiento)
                      : null;
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    const estaVencida = fechaVencimiento && fechaVencimiento < hoy;
                    const proximaSemana = fechaVencimiento && fechaVencimiento <= new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <tr key={factura.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {factura.razonSocial}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            factura.tipo === 'FAC-C' ? 'bg-blue-100 text-blue-800' :
                            factura.tipo === 'FAC-A' ? 'bg-green-100 text-green-800' :
                            factura.tipo === 'FAC-X' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {factura.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {new Date(factura.fecha).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {factura.referencia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {fechaVencimiento ? (
                            <span className={`font-mono ${
                              estaVencida 
                                ? 'text-red-600 font-semibold' 
                                : proximaSemana 
                                ? 'text-orange-600 font-semibold'
                                : 'text-gray-900'
                            }`}>
                              {fechaVencimiento.toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-semibold">
                          {formatCurrency(factura.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-green-600">
                          {formatCurrency(factura.cobrado)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-semibold ${
                          factura.pendiente > 0 ? 'text-orange-600' : 
                          factura.pendiente < 0 ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {formatCurrency(factura.pendiente)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {facturasData?.pagination && facturasData.pagination.totalPages > 1 && (
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
              {`Mostrando ${((facturasData.pagination.page - 1) * facturasData.pagination.limit) + 1} a ${Math.min(
                facturasData.pagination.page * facturasData.pagination.limit,
                facturasData.pagination.total
              )} de ${facturasData.pagination.total}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(1)}
                disabled={!facturasData.pagination.hasPrev}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏮️ Primera
              </button>
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={!facturasData.pagination.hasPrev}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅️ Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, facturasData.pagination.totalPages) }, (_, index) => {
                  const startPage = Math.max(1, facturasData.pagination.page - 2);
                  const currentPage = startPage + index;
                  if (currentPage > facturasData.pagination.totalPages) return null;
                  return (
                    <button
                      key={currentPage}
                      onClick={() => cambiarPagina(currentPage)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === facturasData.pagination.page ? 'bg-blue-600 text-white' : 'btn-secondary'
                      }`}
                    >
                      {currentPage}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={!facturasData.pagination.hasNext}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente ➡️
              </button>
              <button
                onClick={() => cambiarPagina(facturasData.pagination.totalPages)}
                disabled={!facturasData.pagination.hasNext}
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
