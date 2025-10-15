'use client';

import { useState, useEffect } from 'react';
import { Proveedor } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { reportesService, ReporteProveedoresResponse } from '@/services/reportesService';
import { colppyService } from '@/services/colppyService';
import { toast } from 'sonner';

export default function GestionProveedores() {
  const [reporteProveedores, setReporteProveedores] = useState<ReporteProveedoresResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  
  // Fechas dinámicas por defecto (último mes)
  const getDefaultDates = () => {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);
    
    return {
      desde: haceUnMes.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [fechaDesde, setFechaDesde] = useState(defaultDates.desde);
  const [fechaHasta, setFechaHasta] = useState(defaultDates.hasta);
  
  console.log('🎯 GestionProveedores - Fechas por defecto:', defaultDates);

  useEffect(() => {
    console.log('🔄 useEffect ejecutado - cargando reporte de proveedores');
    console.log('📅 Fechas:', { fechaDesde, fechaHasta });
    console.log('📄 Paginación:', { paginaActual, itemsPorPagina });
    cargarReporteProveedores();
  }, [fechaDesde, fechaHasta, paginaActual, itemsPorPagina]);

  const cargarReporteProveedores = async () => {
    try {
      console.log('🚀 GestionProveedores - cargarReporteProveedores llamado con:', {
        fechaDesde,
        fechaHasta,
        paginaActual,
        itemsPorPagina
      });
      
      setLoading(true);
      const reporteData = await reportesService.obtenerReporteProveedores(
        fechaDesde, 
        fechaHasta, 
        paginaActual, 
        itemsPorPagina
      );
      
      console.log('✅ GestionProveedores - Datos recibidos:', reporteData);
      setReporteProveedores(reporteData);
    } catch (error) {
      console.error('❌ Error al cargar reporte de proveedores:', error);
      toast.error('Error al cargar el reporte de proveedores');
    } finally {
      setLoading(false);
    }
  };

  const sincronizarConColppy = async () => {
    try {
      setSincronizando(true);
      const result = await colppyService.sincronizarProveedores();
      toast.success(result.message || 'Sincronización exitosa');
      await cargarReporteProveedores();
    } catch (error) {
      console.error('Error al sincronizar:', error);
      toast.error('Error al sincronizar con Colppy');
    } finally {
      setSincronizando(false);
    }
  };

  // Los datos ya vienen filtrados y paginados desde la API
  const proveedoresFiltrados = reporteProveedores?.facturas || [];

  // Estadísticas dinámicas basadas en los filtros aplicados (solo para búsqueda local)
  const proveedoresConBusqueda = busqueda 
    ? proveedoresFiltrados.filter(proveedor =>
        proveedor.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
        proveedor.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
        proveedor.referencia.toLowerCase().includes(busqueda.toLowerCase()) ||
        proveedor.fecha.includes(busqueda) ||
        proveedor.vencimiento.includes(busqueda)
      )
    : proveedoresFiltrados;

  const estadisticasFiltradas = {
    totalFacturado: proveedoresConBusqueda.reduce((sum, p) => sum + p.total, 0),
    totalPagado: proveedoresConBusqueda.reduce((sum, p) => sum + p.pagado, 0),
    totalPendiente: proveedoresConBusqueda.reduce((sum, p) => sum + p.pendiente, 0),
    cantidadFacturas: proveedoresConBusqueda.length,
    porcentajePagado: 0
  };

  if (estadisticasFiltradas.totalFacturado > 0) {
    estadisticasFiltradas.porcentajePagado = (estadisticasFiltradas.totalPagado / estadisticasFiltradas.totalFacturado) * 100;
  }

  // Funciones de paginación
  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1); // Reset a la primera página
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Facturas de Proveedores</h3>
          <p className="text-sm text-gray-500">
            {reporteProveedores?.cantidadFacturas || 0} facturas registradas desde Excel
            {reporteProveedores?.paginacion && (
              <span className="ml-2 text-blue-600">
                • Página {reporteProveedores.paginacion.pagina} de {reporteProveedores.paginacion.totalPaginas}
                • Mostrando {proveedoresFiltrados.length} de {reporteProveedores.paginacion.totalItems}
              </span>
            )}
            {busqueda && ` • ${estadisticasFiltradas.cantidadFacturas} con búsqueda local`}
          </p>
          <p className="text-xs text-blue-600">
            📄 Facturas del Excel sincronizadas con Colppy vía Backend
          </p>
          
          {/* Estadísticas generales */}
          {reporteProveedores && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Total Facturado:</span> ${reporteProveedores.totalFacturado.toLocaleString()} | 
              <span className="font-medium ml-2">Total Pagado:</span> ${reporteProveedores.totalPagado.toLocaleString()} | 
              <span className="font-medium ml-2">Total Pendiente:</span> ${reporteProveedores.totalPendiente.toLocaleString()} | 
              <span className="font-medium ml-2">% Pagado:</span> {reporteProveedores.porcentajePagado}%
            </div>
          )}

          {/* Estadísticas filtradas (si hay filtros activos) */}
          {(busqueda || fechaDesde || fechaHasta) && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <span className="font-medium">📊 Filtros Activos:</span>
              <span className="font-medium ml-2">Facturado:</span> ${estadisticasFiltradas.totalFacturado.toLocaleString()} | 
              <span className="font-medium ml-2">Pagado:</span> ${estadisticasFiltradas.totalPagado.toLocaleString()} | 
              <span className="font-medium ml-2">Pendiente:</span> ${estadisticasFiltradas.totalPendiente.toLocaleString()} | 
              <span className="font-medium ml-2">% Pagado:</span> {estadisticasFiltradas.porcentajePagado.toFixed(1)}%
            </div>
          )}
        </div>
        <button
          onClick={sincronizarConColppy}
          disabled={sincronizando}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 w-auto p-4"
        >
          <span>🔄</span>
          <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}</span>
        </button>
      </div>

      {/* Filtros de fecha */}
      <div className="card p-4">
        {/* Filtros rápidos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtros Rápidos
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const hoy = new Date();
                setFechaDesde(hoy.toISOString().split('T')[0]);
                setFechaHasta(hoy.toISOString().split('T')[0]);
              }}
              className="btn-secondary text-xs px-3 py-1"
            >
              Hoy
            </button>
            <button
              onClick={() => {
                const hoy = new Date();
                const ayer = new Date();
                ayer.setDate(hoy.getDate() - 1);
                setFechaDesde(ayer.toISOString().split('T')[0]);
                setFechaHasta(ayer.toISOString().split('T')[0]);
              }}
              className="btn-secondary text-xs px-3 py-1"
            >
              Ayer
            </button>
            <button
              onClick={() => {
                const hoy = new Date();
                const hace7Dias = new Date();
                hace7Dias.setDate(hoy.getDate() - 7);
                setFechaDesde(hace7Dias.toISOString().split('T')[0]);
                setFechaHasta(hoy.toISOString().split('T')[0]);
              }}
              className="btn-secondary text-xs px-3 py-1"
            >
              Últimos 7 días
            </button>
            <button
              onClick={() => {
                const hoy = new Date();
                const hace30Dias = new Date();
                hace30Dias.setDate(hoy.getDate() - 30);
                setFechaDesde(hace30Dias.toISOString().split('T')[0]);
                setFechaHasta(hoy.toISOString().split('T')[0]);
              }}
              className="btn-secondary text-xs px-3 py-1"
            >
              Últimos 30 días
            </button>
            <button
              onClick={() => {
                const hoy = new Date();
                const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                setFechaDesde(inicioMes.toISOString().split('T')[0]);
                setFechaHasta(hoy.toISOString().split('T')[0]);
              }}
              className="btn-secondary text-xs px-3 py-1"
            >
              Este mes
            </button>
            <button
              onClick={() => {
                const hoy = new Date();
                const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
                const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
                setFechaDesde(inicioMesAnterior.toISOString().split('T')[0]);
                setFechaHasta(finMesAnterior.toISOString().split('T')[0]);
              }}
              className="btn-secondary text-xs px-3 py-1"
            >
              Mes anterior
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex items-end">
            <button
              onClick={() => {
                setFechaDesde(defaultDates.desde);
                setFechaHasta(defaultDates.hasta);
              }}
              className="btn-secondary w-full"
            >
              Restaurar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Búsqueda Avanzada
          </label>
          {(busqueda || fechaDesde !== defaultDates.desde || fechaHasta !== defaultDates.hasta) && (
            <button
              onClick={() => {
                setBusqueda('');
                setFechaDesde(defaultDates.desde);
                setFechaHasta(defaultDates.hasta);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              🗑️ Limpiar todos los filtros
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por proveedor, tipo, referencia, fecha o vencimiento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Indicador de filtros activos */}
        {(busqueda || fechaDesde !== defaultDates.desde || fechaHasta !== defaultDates.hasta) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {busqueda && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔍 "{busqueda}"
                <button
                  onClick={() => setBusqueda('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
            {fechaDesde !== defaultDates.desde && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                📅 Desde: {fechaDesde}
              </span>
            )}
            {fechaHasta !== defaultDates.hasta && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                📅 Hasta: {fechaHasta}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tabla de proveedores */}
      {proveedoresFiltrados.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {busqueda ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
          </h3>
          <p className="text-gray-500 mb-4">
            {busqueda 
              ? 'Intenta con otros términos de búsqueda'
              : 'Sincroniza con Colppy para obtener tus proveedores'
            }
          </p>
          {!busqueda && (
            <button
              onClick={sincronizarConColppy}
              disabled={sincronizando}
              className="btn-primary disabled:opacity-50"
            >
              Sincronizar con Colppy
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendiente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proveedoresFiltrados.map((proveedor) => (
                  <tr key={proveedor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">📄</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {proveedor.proveedor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        proveedor.tipo === 'FAC-C' 
                          ? 'bg-blue-100 text-blue-800' 
                          : proveedor.tipo === 'FAC-X'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {proveedor.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proveedor.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {proveedor.referencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proveedor.vencimiento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">
                        ${proveedor.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium text-green-600">
                        ${proveedor.pagado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${
                        proveedor.pendiente > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${proveedor.pendiente.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Controles de paginación */}
      {reporteProveedores?.paginacion && reporteProveedores.paginacion.totalPaginas > 1 && (
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-500">por página</span>
              </div>
              
              <div className="text-sm text-gray-700">
                Mostrando {((reporteProveedores.paginacion.pagina - 1) * reporteProveedores.paginacion.limite) + 1} a{' '}
                {Math.min(reporteProveedores.paginacion.pagina * reporteProveedores.paginacion.limite, reporteProveedores.paginacion.totalItems)} de{' '}
                {reporteProveedores.paginacion.totalItems} resultados
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => cambiarPagina(1)}
                disabled={!reporteProveedores.paginacion.tieneAnterior}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏮️ Primera
              </button>
              
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={!reporteProveedores.paginacion.tieneAnterior}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅️ Anterior
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, reporteProveedores.paginacion.totalPaginas) }, (_, i) => {
                  const startPage = Math.max(1, reporteProveedores.paginacion.pagina - 2);
                  const pageNum = startPage + i;
                  
                  if (pageNum > reporteProveedores.paginacion.totalPaginas) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => cambiarPagina(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        pageNum === reporteProveedores.paginacion.pagina
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
                disabled={!reporteProveedores.paginacion.tieneSiguiente}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente ➡️
              </button>
              
              <button
                onClick={() => cambiarPagina(reporteProveedores.paginacion.totalPaginas)}
                disabled={!reporteProveedores.paginacion.tieneSiguiente}
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
