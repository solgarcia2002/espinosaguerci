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
   */
  static async getProcessInfo(): Promise<SupplierPaymentProcess> {
    return apiClient<SupplierPaymentProcess>('supplier-payment/process');
  }

  /**
   * Execute supplier payment process on demand
   */
  static async executeProcess(request: ProcessExecutionRequest): Promise<ProcessExecutionResponse> {
    return apiClient<ProcessExecutionResponse>('supplier-payment/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get execution history
   */
  static async getExecutionHistory(limit: number = 10): Promise<ProcessExecution[]> {
    return apiClient<ProcessExecution[]>('supplier-payment/executions', {}, { limit });
  }

  /**
   * Get specific execution details
   */
  static async getExecutionDetails(executionId: string): Promise<ProcessExecution> {
    return apiClient<ProcessExecution>(`supplier-payment/executions/${executionId}`);
  }

  /**
   * Cancel running execution
   */
  static async cancelExecution(executionId: string): Promise<void> {
    await apiClient<void>(`supplier-payment/executions/${executionId}/cancel`, {
      method: 'POST',
    });
  }
}