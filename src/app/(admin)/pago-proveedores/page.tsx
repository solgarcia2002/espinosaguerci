"use client";

import { useState, useEffect } from 'react';
import Layout from "../../../components/Layout";
import ExecutionHistory from "../../../components/ExecutionHistory";
import { SupplierPaymentService } from "../../../services/supplierPaymentService";
import { SupplierPaymentProcess, ProcessExecution } from "../../../types/supplierPayment";

// Mock data for UI visualization
const mockProcessInfo: SupplierPaymentProcess = {
  id: "supplier-payment-process-001",
  name: "Sincronización de Pagos a Proveedores",
  description: "Proceso automatizado que sincroniza los pagos realizados a proveedores desde Colppy hacia el sistema interno de gestión.",
  isActive: true,
  schedule: "0 8 * * 1-5", // Monday to Friday at 8 AM
  nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow at same time
  lastExecution: {
    id: "exec-20241208-001",
    status: "success",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(), // 3 minutes duration
    message: "Proceso completado exitosamente. Se procesaron 45 pagos a proveedores.",
    recordsProcessed: 45
  }
};

const mockExecutions: ProcessExecution[] = [
  {
    id: "exec-20241208-001",
    status: "success",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
    message: "Proceso completado exitosamente. Se procesaron 45 pagos a proveedores.",
    recordsProcessed: 45
  },
  {
    id: "exec-20241207-001",
    status: "success",
    startTime: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 26 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
    message: "Sincronización completada. Se procesaron 38 registros de pagos.",
    recordsProcessed: 38
  },
  {
    id: "exec-20241206-001",
    status: "error",
    startTime: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 50 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
    message: "Error de conexión con Colppy. Timeout en la respuesta del servidor.",
    recordsProcessed: 0
  },
  {
    id: "exec-20241205-001",
    status: "success",
    startTime: new Date(Date.now() - 74 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 74 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    message: "Proceso completado. Se sincronizaron 52 pagos a proveedores.",
    recordsProcessed: 52
  },
  {
    id: "exec-20241204-001",
    status: "success",
    startTime: new Date(Date.now() - 98 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 98 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
    message: "Sincronización exitosa. 29 registros procesados.",
    recordsProcessed: 29
  },
  {
    id: "exec-20241203-001",
    status: "running",
    startTime: new Date(Date.now() - 122 * 60 * 60 * 1000).toISOString(),
    message: "Proceso en ejecución. Conectando con Colppy...",
    recordsProcessed: 12
  }
];

export default function PagoProveedoresPage() {
  const [processInfo, setProcessInfo] = useState<SupplierPaymentProcess | null>(mockProcessInfo);
  const [executions, setExecutions] = useState<ProcessExecution[]>(mockExecutions);
  const [isExecuting, setIsExecuting] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false to show mock data immediately
  const [error, setError] = useState<string | null>(null);

  const loadProcessInfo = async () => {
    // Simulate API call with mock data
    try {
      setTimeout(() => {
        setProcessInfo(mockProcessInfo);
      }, 500);
    } catch (err) {
      console.error('Error loading process info:', err);
      setError('Error al cargar información del proceso');
    }
  };

  const loadExecutionHistory = async () => {
    // Simulate API call with mock data
    try {
      setTimeout(() => {
        setExecutions(mockExecutions);
      }, 300);
    } catch (err) {
      console.error('Error loading execution history:', err);
      setError('Error al cargar historial de ejecuciones');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadProcessInfo(), loadExecutionHistory()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Using mock data directly, no need to load
    setProcessInfo(mockProcessInfo);
    setExecutions(mockExecutions);
    setLoading(false);
  }, []);

  const handleExecuteProcess = async () => {
    if (!processInfo) return;
    
    setIsExecuting(true);
    try {
      // Simulate API call with mock response
      const mockResponse = {
        executionId: `exec-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'started' as const,
        message: 'Proceso de sincronización iniciado correctamente'
      };
      
      // Show success message
      alert(`Proceso iniciado exitosamente. ID de ejecución: ${mockResponse.executionId}`);
      
      // Add new execution to the beginning of the list
      const newExecution: ProcessExecution = {
        id: mockResponse.executionId,
        status: 'running',
        startTime: new Date().toISOString(),
        message: 'Proceso en ejecución. Sincronizando con Colppy...',
        recordsProcessed: 0
      };
      
      setExecutions(prev => [newExecution, ...prev]);
      
      // Simulate process completion after 3 seconds
      setTimeout(() => {
        const completedExecution: ProcessExecution = {
          ...newExecution,
          status: 'success',
          endTime: new Date().toISOString(),
          message: `Proceso completado exitosamente. Se procesaron ${Math.floor(Math.random() * 50) + 20} pagos a proveedores.`,
          recordsProcessed: Math.floor(Math.random() * 50) + 20
        };
        
        setExecutions(prev => prev.map(exec => 
          exec.id === newExecution.id ? completedExecution : exec
        ));
        
        // Update process info with new last execution
        setProcessInfo(prev => prev ? {
          ...prev,
          lastExecution: completedExecution
        } : prev);
      }, 3000);
      
    } catch (err) {
      console.error('Error executing process:', err);
      alert('Error al ejecutar el proceso. Por favor, intente nuevamente.');
    } finally {
      setIsExecuting(false);
    }
  };

  const formatNextExecution = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadData}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Pago a Proveedores</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión y ejecución del proceso de sincronización con Colppy
          </p>
        </div>

        {/* Process Information */}
        {processInfo && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{processInfo.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{processInfo.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  processInfo.isActive 
                    ? 'text-green-600 bg-green-100' 
                    : 'text-gray-600 bg-gray-100'
                }`}>
                  {processInfo.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={handleExecuteProcess}
                  disabled={isExecuting || !processInfo.isActive}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExecuting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ejecutando...
                    </>
                  ) : (
                    'Ejecutar Proceso'
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Próxima Ejecución</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatNextExecution(processInfo.nextExecution)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Programación</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">
                  {processInfo.schedule}
                </dd>
              </div>
              {processInfo.lastExecution && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Última Ejecución</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatNextExecution(processInfo.lastExecution.startTime)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado Anterior</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        processInfo.lastExecution.status === 'success' 
                          ? 'text-green-600 bg-green-100'
                          : processInfo.lastExecution.status === 'error'
                          ? 'text-red-600 bg-red-100'
                          : 'text-blue-600 bg-blue-100'
                      }`}>
                        {processInfo.lastExecution.status === 'success' ? 'Exitoso' : 
                         processInfo.lastExecution.status === 'error' ? 'Error' : 'Ejecutando'}
                      </span>
                    </dd>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Integración con Colppy</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Este proceso sincroniza automáticamente los pagos a proveedores desde Colppy hacia el sistema.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Execution History */}
        <ExecutionHistory 
          executions={executions} 
          onRefresh={loadExecutionHistory}
        />
      </div>
    </Layout>
  );
}