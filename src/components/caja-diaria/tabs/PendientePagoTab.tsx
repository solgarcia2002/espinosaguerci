'use client';

import { useState, useEffect } from 'react';
import { MovimientoCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { formatCurrency } from '@/lib/utils';
import MovimientosTable from '../MovimientosTable';
import FiltrosCaja from '../FiltrosCaja';
import MovimientoForm from '../MovimientoForm';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';

export default function PendientePagoTab() {
  const [reportePendientePago, setReportePendientePago] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState<MovimientoCaja | undefined>();
  const [sincronizando, setSincronizando] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    cargarReportePendientePago();
  }, []);

  const cargarReportePendientePago = async () => {
    try {
      setLoading(true);
      const reporteData = await cajaDiariaService.obtenerReportePendientePago();
      setReportePendientePago(reporteData);
    } catch (error) {
      console.error('Error al cargar reporte de pendiente de pago:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoMovimiento = () => {
    setMovimientoEditando(undefined);
    setMostrarFormulario(true);
  };

  const handleEditarMovimiento = (movimiento: MovimientoCaja) => {
    setMovimientoEditando(movimiento);
    setMostrarFormulario(true);
  };

  const handleFormularioSuccess = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
    cargarReportePendientePago();
  };

  const handleFormularioCancel = () => {
    setMostrarFormulario(false);
    setMovimientoEditando(undefined);
  };

  const handleExportar = async () => {
    try {
      const filtros = {};
      const blob = await cajaDiariaService.exportarExcel(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagos-pendientes-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
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
        await cargarReportePendientePago();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pendientes de pago...</p>
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
            cargarReportePendientePago();
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

      {/* Estadísticas principales */}
      {reportePendientePago && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Total Pendiente</div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(reportePendientePago.totalPendiente)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Cantidad de Proveedores</div>
            <div className="text-2xl font-bold text-blue-600">
              {reportePendientePago.cantidadProveedores}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Facturas Pendientes</div>
            <div className="text-2xl font-bold text-purple-600">
              {reportePendientePago.proveedores.reduce((sum: number, p: any) => sum + p.facturas.length, 0)}
            </div>
          </div>
        </div>
      )}

      {/* Resumen por rango de vencimiento */}
      {reportePendientePago && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Resumen por Vencimiento</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Vencidas</div>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(reportePendientePago.porRangoVencimiento.vencidas.monto)}
              </div>
              <div className="text-xs text-gray-500">
                {reportePendientePago.porRangoVencimiento.vencidas.cantidad} facturas
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Próximas 7 días</div>
              <div className="text-xl font-bold text-orange-600">
                {formatCurrency(reportePendientePago.porRangoVencimiento.proximas7Dias.monto)}
              </div>
              <div className="text-xs text-gray-500">
                {reportePendientePago.porRangoVencimiento.proximas7Dias.cantidad} facturas
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Próximas 30 días</div>
              <div className="text-xl font-bold text-yellow-600">
                {formatCurrency(reportePendientePago.porRangoVencimiento.proximas30Dias.monto)}
              </div>
              <div className="text-xs text-gray-500">
                {reportePendientePago.porRangoVencimiento.proximas30Dias.cantidad} facturas
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Más de 30 días</div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(reportePendientePago.porRangoVencimiento.mas30Dias.monto)}
              </div>
              <div className="text-xs text-gray-500">
                {reportePendientePago.porRangoVencimiento.mas30Dias.cantidad} facturas
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de proveedores con pendientes */}
      {reportePendientePago && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Proveedores con Pendientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pendiente
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facturas
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportePendientePago.proveedores
                  .sort((a: any, b: any) => b.totalPendiente - a.totalPendiente)
                  .map((proveedor: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {proveedor.proveedor}
                      </td>
                      <td className="px-4 py-3 text-sm text-orange-600 text-right font-mono font-semibold">
                        {formatCurrency(proveedor.totalPendiente)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {proveedor.facturas.length}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            // Aquí podrías abrir un modal con los detalles del proveedor
                            console.log('Ver detalles de:', proveedor.proveedor);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

