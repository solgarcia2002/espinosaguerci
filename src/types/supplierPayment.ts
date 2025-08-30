export interface ProcessExecution {
  id: string;
  status: 'success' | 'error' | 'running';
  startTime: string;
  endTime?: string;
  message?: string;
  recordsProcessed?: number;
}

export interface SupplierPaymentProcess {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  schedule: string; // cron expression
  nextExecution: string;
  lastExecution?: ProcessExecution;
}

export interface ProcessExecutionRequest {
  processId: string;
  force?: boolean;
}

export interface ProcessExecutionResponse {
  executionId: string;
  status: 'started' | 'queued';
  message: string;
}