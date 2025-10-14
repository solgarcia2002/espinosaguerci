import { apiClient } from './apiClient';
import { Cliente, Proveedor, MovimientoCaja } from '@/types/cajaDiaria';

// Interfaces para las respuestas de los reportes
export interface ReporteClientesResponse {
  totalFacturado: number;
  totalCobrado: number;
  totalPendiente: number;
  cantidadFacturas: number;
  porcentajeCobrado: number;
  facturas: Cliente[];
  resumenPorEstado: {
    cobrado: { cantidad: number; monto: number; porcentaje: number };
    pendiente: { cantidad: number; monto: number; porcentaje: number };
  };
  antiguedadSaldos: {
    vencidas: { cantidad: number; monto: number };
    porVencer: { cantidad: number; monto: number };
    vigentes: { cantidad: number; monto: number };
  };
  filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
  };
}

export interface ReporteProveedoresResponse {
  totalFacturado: number;
  totalPagado: number;
  totalPendiente: number;
  cantidadFacturas: number;
  porcentajePagado: number;
  facturas: Proveedor[];
  resumenPorEstado: {
    pagado: { cantidad: number; monto: number; porcentaje: number };
    pendiente: { cantidad: number; monto: number; porcentaje: number };
  };
  antiguedadSaldos: {
    vencidas: { cantidad: number; monto: number };
    porVencer: { cantidad: number; monto: number };
    vigentes: { cantidad: number; monto: number };
  };
  filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
  };
}

export interface ReportePendienteCobroResponse {
  totalPendiente: number;
  cantidadClientes: number;
  clientes: Array<{
    cliente: string;
    totalPendiente: number;
    porFecha: Record<string, number>;
    facturas: Cliente[];
  }>;
  porRangoVencimiento: {
    vencidas: { cantidad: number; monto: number; clientes: string[] };
    proximas7Dias: { cantidad: number; monto: number; clientes: string[] };
    proximas30Dias: { cantidad: number; monto: number; clientes: string[] };
    mas30Dias: { cantidad: number; monto: number; clientes: string[] };
  };
}

export interface ReportePendientePagoResponse {
  totalPendiente: number;
  cantidadProveedores: number;
  proveedores: Array<{
    proveedor: string;
    totalPendiente: number;
    porFecha: Record<string, number>;
    facturas: Cliente[];
  }>;
  porRangoVencimiento: {
    vencidas: { cantidad: number; monto: number; proveedores: string[] };
    proximas7Dias: { cantidad: number; monto: number; proveedores: string[] };
    proximas30Dias: { cantidad: number; monto: number; proveedores: string[] };
    mas30Dias: { cantidad: number; monto: number; proveedores: string[] };
  };
}

export interface ReporteCobradoResponse {
  totalCobrado: number;
  totalFacturado: number;
  cantidadFacturas: number;
  cantidadClientes: number;
  porcentajeCobrado: number;
  clientes: Array<{
    cliente: string;
    totalCobrado: number;
    totalFacturado: number;
    cantidadFacturas: number;
    porFecha: Record<string, number>;
    facturas: Cliente[];
  }>;
  resumenPorMes: Record<string, {
    cantidadFacturas: number;
    totalCobrado: number;
    cantidadClientes: number;
  }>;
  filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
  };
}

export interface ReportePagadoResponse {
  totalPagado: number;
  totalFacturado: number;
  cantidadFacturas: number;
  cantidadProveedores: number;
  porcentajePagado: number;
  proveedores: Array<{
    proveedor: string;
    totalPagado: number;
    totalFacturado: number;
    cantidadFacturas: number;
    porFecha: Record<string, number>;
    facturas: Cliente[];
  }>;
  resumenPorMes: Record<string, {
    cantidadFacturas: number;
    totalPagado: number;
    cantidadProveedores: number;
  }>;
  filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
  };
}

export interface ReporteDisponibilidadResponse {
  fecha: string;
  totalDisponibilidad: number;
  estadisticas: {
    totalCuentas: number;
    totalDisponibilidad: number;
    totalPesos: number;
    totalDolares: number;
    totalPendienteAcreditacion: number;
  };
  cuentasBancarias: Array<{
    nombre: string;
    saldo: number;
    pendienteAcreditacion: number;
    dolares: number;
  }>;
  porTipo: Array<{
    tipo: string;
    cantidad: number;
    totalSaldo: number;
    totalDolares: number;
    totalPendiente: number;
    cuentas: Array<{
      nombre: string;
      saldo: number;
      pendienteAcreditacion: number;
      dolares: number;
    }>;
  }>;
  resumenLiquidez: {
    disponibleInmediato: number;
    disponibleBanco: number;
    pendienteAcreditacion: number;
    totalLiquido: number;
  };
  alertas: {
    cuentasConSaldoNegativo: number;
    cuentasConPendientes: number;
    totalPendienteAcreditacion: number;
  };
}

export interface ReporteDashboardResponse {
  fecha: string;
  saldos: {
    disponibilidades: { delDia: number; diaAnterior: number; diferencia: number };
    chequesEnCartera: { delDia: number; diaAnterior: number; diferencia: number };
    aCobrar: { delDia: number; diaAnterior: number; diferencia: number };
    aPagar: { delDia: number; diaAnterior: number; diferencia: number };
  };
  kpis: {
    capitalTrabajo: number;
    liquidezCorriente: number;
    disponibilidadInmediata: number;
    eficienciaCobranza: number;
    eficienciaPago: number;
  };
  alertas: Array<{
    tipo: string;
    titulo: string;
    mensaje: string;
    prioridad: string;
  }>;
  movimientosDelDia: {
    totalMovimientos: number;
    totalIngresos: number;
    totalEgresos: number;
    saldoNeto: number;
    movimientos: MovimientoCaja[];
  };
  resumen: {
    totalClientes: number;
    totalProveedores: number;
    clientesConPendientes: number;
    proveedoresConPendientes: number;
    cuentasBancarias: number;
  };
}

export class ReportesService {
  async obtenerReporteClientes(fechaDesde?: string, fechaHasta?: string): Promise<ReporteClientesResponse> {
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await apiClient<{ success: boolean; data: ReporteClientesResponse }>(
        'api/reportes/clientes',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de clientes:', error);
      throw new Error('No se pudo obtener el reporte de clientes');
    }
  }

  async obtenerReporteProveedores(fechaDesde?: string, fechaHasta?: string): Promise<ReporteProveedoresResponse> {
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await apiClient<{ success: boolean; data: ReporteProveedoresResponse }>(
        'api/reportes/proveedores',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de proveedores:', error);
      throw new Error('No se pudo obtener el reporte de proveedores');
    }
  }

  async obtenerReportePendienteCobro(): Promise<ReportePendienteCobroResponse> {
    try {
      const response = await apiClient<{ success: boolean; data: ReportePendienteCobroResponse }>(
        'api/reportes/pendiente-cobro',
        { method: 'GET' }
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de pendiente de cobro:', error);
      throw new Error('No se pudo obtener el reporte de pendiente de cobro');
    }
  }

  async obtenerReportePendientePago(): Promise<ReportePendientePagoResponse> {
    try {
      const response = await apiClient<{ success: boolean; data: ReportePendientePagoResponse }>(
        'api/reportes/pendiente-pago',
        { method: 'GET' }
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de pendiente de pago:', error);
      throw new Error('No se pudo obtener el reporte de pendiente de pago');
    }
  }

  async obtenerReporteCobrado(fechaDesde?: string, fechaHasta?: string): Promise<ReporteCobradoResponse> {
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await apiClient<{ success: boolean; data: ReporteCobradoResponse }>(
        'api/reportes/cobrado',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de cobrado:', error);
      throw new Error('No se pudo obtener el reporte de cobrado');
    }
  }

  async obtenerReportePagado(fechaDesde?: string, fechaHasta?: string): Promise<ReportePagadoResponse> {
    try {
      const params: Record<string, string> = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await apiClient<{ success: boolean; data: ReportePagadoResponse }>(
        'api/reportes/pagado',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de pagado:', error);
      throw new Error('No se pudo obtener el reporte de pagado');
    }
  }

  async obtenerReporteDisponibilidad(fecha?: string): Promise<ReporteDisponibilidadResponse> {
    try {
      const params: Record<string, string> = {};
      if (fecha) params.fecha = fecha;

      const response = await apiClient<{ success: boolean; data: ReporteDisponibilidadResponse }>(
        'api/reportes/disponibilidad',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de disponibilidad:', error);
      throw new Error('No se pudo obtener el reporte de disponibilidad');
    }
  }

  async obtenerReporteDashboard(fecha?: string): Promise<ReporteDashboardResponse> {
    try {
      const params: Record<string, string> = {};
      if (fecha) params.fecha = fecha;

      const response = await apiClient<{ success: boolean; data: ReporteDashboardResponse }>(
        'api/reportes/dashboard',
        { method: 'GET' },
        params
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de dashboard:', error);
      throw new Error('No se pudo obtener el reporte de dashboard');
    }
  }

  async obtenerReporteConsolidado(fecha: string): Promise<{
    fecha: string;
    totalFacturado: number;
    totalCobrado: number;
    totalPagado: number;
    saldoNeto: number;
    totalPendienteCobro: number;
    totalPendientePago: number;
    saldosConsolidados: any;
    cashFlow: any;
    ajustes: any;
    cuentasBancarias: any[];
    tarjetas: any[];
    cobranzasDiferencias: any[];
    pagosProveedoresPlanes: any[];
    totales: any;
    resumenPorTipo: any;
  }> {
    try {
      const response = await apiClient<{ success: boolean; data: any }>(
        'api/reportes/consolidado',
        { method: 'GET' },
        { fecha }
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte consolidado:', error);
      throw new Error('No se pudo obtener el reporte consolidado');
    }
  }

  async obtenerReporteCaja(fecha: string): Promise<any> {
    try {
      const response = await apiClient<{ success: boolean; data: any }>(
        'api/reportes/caja',
        { method: 'GET' },
        { fecha }
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de caja:', error);
      throw new Error('No se pudo obtener el reporte de caja');
    }
  }

  async obtenerReporteTodos(fecha: string): Promise<any> {
    try {
      const response = await apiClient<{ success: boolean; data: any }>(
        'api/reportes/todos',
        { method: 'GET' },
        { fecha }
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte completo:', error);
      throw new Error('No se pudo obtener el reporte completo');
    }
  }
}

export const reportesService = new ReportesService();
