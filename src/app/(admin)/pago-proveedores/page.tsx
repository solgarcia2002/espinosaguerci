"use client";

import { useState, useEffect } from 'react';
import Layout from "../../../components/Layout";
import ExecutionHistory from "../../../components/ExecutionHistory";
import { SupplierPaymentService } from "../../../services/supplierPaymentService";
import { SupplierPaymentProcess, ProcessExecution } from "../../../types/supplierPayment";

export default function PagoProveedoresPage() {
  const [processInfo, setProcessInfo] = useState<SupplierPaymentProcess | null>(null);
  const [executions, setExecutions] = useState<ProcessExecution[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProcessInfo = async () => {
    try {
      const info = await SupplierPaymentService.getProcessInfo();
      setProcessInfo(info);
    } catch (err) {
      console.error('Error loading process info:', err);
      setError('Error al cargar información del proceso');
    }
  };

  const loadExecutionHistory = async () => {
    try {
      const history = await SupplierPaymentService.getExecutionHistory(20);
      setExecutions(history);
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
    loadData();
  }, []);

  const handleExecuteProcess = async () => {
    if (!processInfo) return;
    
    setIsExecuting(true);
    try {
      const response = await SupplierPaymentService.executeProcess({
        processId: processInfo.id
      });
      
      // Show success message
      alert(`Proceso iniciado exitosamente. ID de ejecución: ${response.executionId}`);
      
      // Refresh the execution history after a short delay
      setTimeout(() => {
        loadExecutionHistory();
      }, 1000);
      
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