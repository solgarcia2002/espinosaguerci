'use client';

import { useState, useEffect } from 'react';
import { FacturasProveedoresResponse, FacturaProveedor, ProveedoresResponse } from '@/types/cajaDiaria';
import { apiClient } from '@/services/apiClient';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';
import { obtenerFechasUltimoMes } from '@/lib/fecha-utils';

export default function PendientePagoTab() {
  const fechasDefault = obtenerFechasUltimoMes();
  const [facturasData, setFacturasData] = useState<FacturasProveedoresResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [fechaDesde, setFechaDesde] = useState(fechasDefault.fechaDesde);
  const [fechaHasta, setFechaHasta] = useState(fechasDefault.fechaHasta);

  useEffect(() => {
    cargarFacturas();
  }, [paginaActual, itemsPorPagina]);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const proveedoresData = await apiClient<ProveedoresResponse>(
        'caja-diaria/proveedores',
        { method: 'GET' },
        {
          page: paginaActual,
          limit: itemsPorPagina,
          orderBy: 'nombre',
          order: 'desc',
          estadoPago: 'pendiente'
        }
      );

      const facturasPromises = proveedoresData.data.map(proveedor =>
        apiClient<FacturasProveedoresResponse>(
          'caja-diaria/proveedores/facturas',
          { method: 'GET' },
          {
            page: 1,
            limit: 1000,
            proveedorId: proveedor.id
          }
        ).then(result => ({
          proveedorNombre: proveedor.nombre,
          facturas: result.data.filter((f: FacturaProveedor) => f.pendiente > 0)
        }))
      );

      const facturasResults = await Promise.all(facturasPromises);
      const todasLasFacturas = facturasResults.flatMap(result => 
        result.facturas.map(factura => ({
          ...factura,
          proveedorNombre: result.proveedorNombre
        }))
      ).sort((a: FacturaProveedor & { proveedorNombre?: string }, b: FacturaProveedor & { proveedorNombre?: string }) => {
        const nombreA = a.proveedorNombre || a.razonSocial || '';
        const nombreB = b.proveedorNombre || b.razonSocial || '';
        return nombreB.localeCompare(nombreA);
      });

      setFacturasData({
        data: todasLasFacturas,
        pagination: proveedoresData.pagination
      });
    } catch (error) {
      console.error('Error al cargar facturas pendientes de pago:', error);
      toast.error('Error al cargar las facturas');
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
        await cargarFacturas();
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

  const facturas = facturasData?.data || [];
  const montoTotal = facturas.reduce((sum, f) => sum + f.pendiente, 0);
  const cantidadFacturas = facturasData?.pagination.total || 0;

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
            cargarFacturas();
          }}
          onError={() => {
            setShowProgress(false);
          }}
        />
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pendientes de Pago</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Monto Total</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(montoTotal)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Cantidad de Facturas</div>
          <div className="text-2xl font-bold text-purple-600">
            {cantidadFacturas}
          </div>
        </div>
      </div>

      {facturas.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas pendientes de pago</h3>
          <p className="text-gray-500">No se encontraron facturas con estado de pago pendiente.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razón Social
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
                      Pagado
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
                          {formatCurrency(factura.pagado)}
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

          {facturasData?.pagination && facturasData.pagination.totalPages > 1 && (
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
                    Mostrando {((facturasData.pagination.page - 1) * facturasData.pagination.limit) + 1} a{' '}
                    {Math.min(facturasData.pagination.page * facturasData.pagination.limit, facturasData.pagination.total)} de{' '}
                    {facturasData.pagination.total} resultados
                  </div>
                </div>

                <div className="flex items-center space-x-2">
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

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, facturasData.pagination.totalPages) }, (_, i) => {
                      const startPage = Math.max(1, facturasData.pagination.page - 2);
                      const pageNum = startPage + i;

                      if (pageNum > facturasData.pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => cambiarPagina(pageNum)}
                          className={`px-3 py-1 text-sm rounded ${
                            pageNum === facturasData.pagination.page
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
        </>
      )}
    </div>
  );
}
