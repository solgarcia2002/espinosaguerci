import { apiClient } from './apiClient';
import { 
  SupplierPaymentProcess, 
  ProcessExecution, 
  ProcessExecutionRequest, 
  ProcessExecutionResponse 
} from '../types/supplierPayment';

export class SupplierPaymentService {
  
  /**
   * Get supplier payment process information
   * Endpoint: GET /caja-diaria/pago-proveedores/process
   */
  static async getProcessInfo(): Promise<SupplierPaymentProcess> {
    try {
      console.log('🔄 Obteniendo información del proceso desde el backend...');
      const response = await apiClient<SupplierPaymentProcess>('caja-diaria/pago-proveedores/process');
      console.log('✅ Información del proceso obtenida:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo información del proceso:', error);
      throw error;
    }
  }

  /**
   * Execute supplier payment process on demand
   * Endpoint: POST /caja-diaria/pago-proveedores/execute
   */
  static async executeProcess(request: ProcessExecutionRequest): Promise<ProcessExecutionResponse> {
    try {
      console.log('🔄 Ejecutando proceso desde el backend...', request);
      const response = await apiClient<ProcessExecutionResponse>('caja-diaria/pago-proveedores/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    });
      console.log('✅ Proceso ejecutado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error ejecutando proceso:', error);
      throw error;
    }
  }

  /**
   * Get execution history
   * Endpoint: GET /caja-diaria/pago-proveedores/executions?limit=20
   */
  static async getExecutionHistory(limit: number = 10): Promise<ProcessExecution[]> {
    try {
      console.log('🔄 Obteniendo historial de ejecuciones desde el backend...', { limit });
      const response = await apiClient<ProcessExecution[]>('caja-diaria/pago-proveedores/executions', {}, { limit });
      console.log('✅ Historial de ejecuciones obtenido:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo historial de ejecuciones:', error);
      throw error;
    }
  }

  /**
   * Get specific execution details
   * Endpoint: GET /caja-diaria/pago-proveedores/executions/:id
   */
  static async getExecutionDetails(executionId: string): Promise<ProcessExecution> {
    try {
      console.log('🔄 Obteniendo detalles de ejecución desde el backend...', { executionId });
      const response = await apiClient<ProcessExecution>(`caja-diaria/pago-proveedores/executions/${executionId}`);
      console.log('✅ Detalles de ejecución obtenidos:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo detalles de ejecución:', error);
      throw error;
    }
  }

  /**
   * Cancel running execution
   * Endpoint: POST /caja-diaria/pago-proveedores/executions/:id/cancel
   */
  static async cancelExecution(executionId: string): Promise<void> {
    try {
      console.log('🔄 Cancelando ejecución desde el backend...', { executionId });
      await apiClient<void>(`caja-diaria/pago-proveedores/executions/${executionId}/cancel`, {
      method: 'POST',
    });
      console.log('✅ Ejecución cancelada');
    } catch (error) {
      console.error('❌ Error cancelando ejecución:', error);
      throw error;
    }
  }
}