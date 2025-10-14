import { apiClient } from './apiClient';
import { MovimientoCaja, ResumenCaja, FiltrosCaja, Cliente, Proveedor } from '@/types/cajaDiaria';
import { reportesService } from './reportesService';

export class CajaDiariaService {
  async obtenerMovimientos(filtros?: FiltrosCaja): Promise<MovimientoCaja[]> {
    try {
      const params: Record<string, string> = {};
      if (filtros?.fechaDesde) params.fechaInicio = filtros.fechaDesde;
      if (filtros?.fechaHasta) params.fechaFin = filtros.fechaHasta;
      if (filtros?.tipo && filtros.tipo !== 'todos') params.tipo = filtros.tipo;
      if (filtros?.clienteId) params.clienteId = filtros.clienteId;
      if (filtros?.proveedorId) params.proveedorId = filtros.proveedorId;
      if (filtros?.metodoPago) params.metodoPago = filtros.metodoPago;

      const response = await apiClient<{ success: boolean; data: MovimientoCaja[] }>(
        'caja-diaria/movimientos',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      return [];
    }
  }

  async obtenerResumen(fecha?: string): Promise<ResumenCaja> {
    try {
      const params: Record<string, string> = {};
      if (fecha) params.fecha = fecha;

      const response = await apiClient<{ success: boolean; data: ResumenCaja }>(
        'caja-diaria/movimientos/resumen/diario',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen:', error);
      return {
        fecha: fecha || new Date().toISOString().split('T')[0],
        saldoInicial: 0,
        totalIngresos: 0,
        totalEgresos: 0,
        saldoFinal: 0,
        movimientos: [],
        cantidadMovimientos: 0
      };
    }
  }

  async obtenerClientes(fechaDesde?: string, fechaHasta?: string): Promise<Cliente[]> {
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.fechaInicio = fechaDesde;
      if (fechaHasta) params.fechaFin = fechaHasta;

      const response = await apiClient<{ success: boolean; data: Cliente[] }>(
        'caja-diaria/clientes',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      return [];
    }
  }

  async obtenerProveedores(fechaDesde?: string, fechaHasta?: string): Promise<Proveedor[]> {
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.fechaInicio = fechaDesde;
      if (fechaHasta) params.fechaFin = fechaHasta;

      const response = await apiClient<{ success: boolean; data: Proveedor[] }>(
        'caja-diaria/proveedores',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error obteniendo proveedores:', error);
      return [];
    }
  }

  async crearMovimiento(movimiento: Omit<MovimientoCaja, 'id' | 'createdAt' | 'updatedAt'>): Promise<MovimientoCaja> {
    try {
      const response = await apiClient<{ success: boolean; data: MovimientoCaja }>(
        'caja-diaria/movimientos',
        { 
          method: 'POST',
          body: JSON.stringify(movimiento)
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creando movimiento:', error);
      throw error;
    }
  }

  async actualizarMovimiento(id: string, movimiento: Partial<MovimientoCaja>): Promise<MovimientoCaja> {
    try {
      const response = await apiClient<{ success: boolean; data: MovimientoCaja }>(
        `caja-diaria/movimientos/${id}`,
        { 
          method: 'PUT',
          body: JSON.stringify(movimiento)
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error actualizando movimiento:', error);
      throw error;
    }
  }

  async eliminarMovimiento(id: string): Promise<void> {
    try {
      await apiClient<{ success: boolean }>(
        `caja-diaria/movimientos/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error('Error eliminando movimiento:', error);
      throw error;
    }
  }

  async exportarExcel(filtros?: any): Promise<Blob> {
    try {
      const params: Record<string, string> = {};
      if (filtros?.fechaDesde) params.fechaInicio = filtros.fechaDesde;
      if (filtros?.fechaHasta) params.fechaFin = filtros.fechaHasta;

      const response = await fetch(`caja-diaria/export/movimientos/excel?${new URLSearchParams(params)}`);
      
      if (!response.ok) {
        throw new Error('Error al exportar Excel');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exportando Excel:', error);
      throw error;
    }
  }

  // Métodos que usan reportesService
  async obtenerReporteDisponibilidad(fecha?: string) {
    try {
      return await reportesService.obtenerReporteDisponibilidad(fecha);
    } catch (error) {
      console.error('Error obteniendo reporte de disponibilidad:', error);
      return null;
    }
  }

  async obtenerReporteCobrado(fechaDesde?: string, fechaHasta?: string) {
    try {
      return await reportesService.obtenerReporteCobrado(fechaDesde, fechaHasta);
    } catch (error) {
      console.error('Error obteniendo reporte de cobrado:', error);
      return null;
    }
  }

  async obtenerReportePagado(fechaDesde?: string, fechaHasta?: string) {
    try {
      return await reportesService.obtenerReportePagado(fechaDesde, fechaHasta);
    } catch (error) {
      console.error('Error obteniendo reporte de pagado:', error);
      return null;
    }
  }

  async obtenerReportePendienteCobro() {
    try {
      return await reportesService.obtenerReportePendienteCobro();
    } catch (error) {
      console.error('Error obteniendo reporte de pendiente de cobro:', error);
      return null;
    }
  }

  async obtenerReportePendientePago() {
    try {
      return await reportesService.obtenerReportePendientePago();
    } catch (error) {
      console.error('Error obteniendo reporte de pendiente de pago:', error);
      return null;
    }
  }

  async obtenerReporteConsolidado(fecha: string) {
    try {
      return await reportesService.obtenerReporteConsolidado(fecha);
    } catch (error) {
      console.error('Error obteniendo reporte consolidado:', error);
      return null;
    }
  }

  async obtenerReporteDashboard(fecha?: string) {
    try {
      return await reportesService.obtenerReporteDashboard(fecha);
    } catch (error) {
      console.error('Error obteniendo reporte de dashboard:', error);
      return null;
    }
  }
}

export const cajaDiariaService = new CajaDiariaService();