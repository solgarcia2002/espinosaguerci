'use client';

import { useState, useEffect } from 'react';
import { FacturaProveedor, FacturasProveedoresResponse } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';
import { obtenerFechasUltimoMes } from '@/lib/fecha-utils';

export default function GestionProveedores() {
  const fechasDefault = obtenerFechasUltimoMes();
  const [facturas, setFacturas] = useState<FacturaProveedor[]>([]);
  const [facturasData, setFacturasData] = useState<FacturasProveedoresResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [fechaDesde, setFechaDesde] = useState(fechasDefault.fechaDesde);
  const [fechaHasta, setFechaHasta] = useState(fechasDefault.fechaHasta);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  useEffect(() => {
    cargarFacturas();
  }, [paginaActual, itemsPorPagina, fechaDesde, fechaHasta, filtroTipo]);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const data = await cajaDiariaService.obtenerFacturasProveedores({
        page: paginaActual,
        limit: itemsPorPagina,
        fechaDesde,
        fechaHasta,
        tipo: filtroTipo || undefined,
        busqueda: busqueda || undefined
      });
      setFacturasData(data);
      setFacturas(data.data);
    } catch (error) {
      console.error('Error al cargar facturas de proveedores:', error);
      toast.error('Error al cargar las facturas de proveedores');
    } finally {
      setLoading(false);
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

  const facturasFiltradas = busqueda 
    ? facturas.filter(factura =>
        factura.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
        factura.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
        factura.referencia.toLowerCase().includes(busqueda.toLowerCase())
      )
    : facturas;

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

  // Calcular totales
  const totalGeneral = facturasFiltradas.reduce((sum, f) => sum + f.total, 0);
  const totalPagado = facturasFiltradas.reduce((sum, f) => sum + f.pagado, 0);
  const totalPendiente = facturasFiltradas.reduce((sum, f) => sum + f.pendiente, 0);

  if (loading && !facturasData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando facturas de proveedores...</p>
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

      {/* Sincronización con Colppy */}
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

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalGeneral)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Pagado</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalPagado)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Pendiente</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalPendiente)}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Proveedor, razón social o referencia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPaginaActual(1);
              }}
              className="input w-full"
            >
              <option value="">Todos</option>
              <option value="FAC-C">FAC-C</option>
              <option value="FAC-A">FAC-A</option>
              <option value="FAC-X">FAC-X</option>
              <option value="PAG">PAG</option>
            </select>
          </div>
          <div className="flex items-end">
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="btn-secondary text-sm"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de facturas */}
      {facturasFiltradas.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay facturas de proveedores
          </h3>
          <p className="text-gray-500 text-sm">
            {busqueda || filtroTipo 
              ? 'No se encontraron facturas con los filtros aplicados'
              : 'Sincroniza con Colppy para obtener las facturas de proveedores'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Razón Social
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total ME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo Cambio
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendiente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {factura.proveedor}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {factura.razonSocial}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        factura.tipo === 'FAC-C' ? 'bg-blue-100 text-blue-800' :
                        factura.tipo === 'FAC-A' ? 'bg-green-100 text-green-800' :
                        factura.tipo === 'FAC-X' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {factura.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {new Date(factura.fecha).toLocaleDateString('es-AR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {factura.referencia}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {factura.vencimiento 
                        ? new Date(factura.vencimiento).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold">
                      {formatCurrency(factura.total)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-gray-400">
                      {factura.totalME ? formatCurrency(factura.totalME) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {factura.tipoCambio || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-green-600">
                      {formatCurrency(factura.pagado)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold ${
                      factura.pendiente > 0 ? 'text-orange-600' : 
                      factura.pendiente < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {formatCurrency(factura.pendiente)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      {facturasData?.pagination && facturasData.pagination.totalPages > 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
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
    </div>
  );
}
