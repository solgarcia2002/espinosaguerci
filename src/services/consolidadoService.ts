import { reportesService } from './reportesService';
import { ConsolidadoReport } from '@/types/cajaDiaria';

export type ConsolidadoSnapshot = ConsolidadoReport;

export class ConsolidadoService {
  async obtenerSnapshot(fecha?: string): Promise<ConsolidadoSnapshot> {
    const fechaObjetivo = fecha ?? new Date().toISOString().split('T')[0];
    try {
      return await reportesService.obtenerReporteConsolidado(fechaObjetivo);
    } catch (error) {
      console.error('Error al obtener consolidado:', error);
      throw new Error('No se pudo obtener el consolidado');
    }
  }
}

export const consolidadoService = new ConsolidadoService();

