import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { reportesService } from '@/services/reportesService';
import { MovimientoCaja, TesoreriaDisponibilidadResponse } from '@/types/cajaDiaria';
import {
  ReporteCobradoResponse,
  ReporteDashboardResponse,
  ReportePagadoResponse
} from '@/services/reportesService';
import { COLPPY_CREDENTIALS } from '@/constants/colppyCredentials';

export interface ConsolidadoSnapshot {
  dashboard: ReporteDashboardResponse;
  cobrado: ReporteCobradoResponse;
  pagado: ReportePagadoResponse;
  movimientos: MovimientoCaja[];
  disponibilidad: TesoreriaDisponibilidadResponse | null;
  fecha: string;
  timestamp: string;
}

class ConsolidadoService {
  async fetchAll(fecha: string): Promise<ConsolidadoSnapshot> {
    const fechaDesde = fecha;
    const fechaHasta = fecha;

    const [dashboard, cobrado, pagado, movimientos, disponibilidad] = await Promise.all([
      reportesService.obtenerReporteDashboard(fecha),
      reportesService.obtenerReporteCobrado(fechaDesde, fechaHasta),
      reportesService.obtenerReportePagado(fechaDesde, fechaHasta),
      cajaDiariaService.obtenerMovimientos({ fechaDesde, fechaHasta }),
      colppyService.obtenerDisponibilidadTesoreria(COLPPY_CREDENTIALS)
    ]);

    return {
      dashboard,
      cobrado,
      pagado,
      movimientos,
      disponibilidad,
      fecha,
      timestamp: new Date().toISOString()
    };
  }
}

export const consolidadoService = new ConsolidadoService();

