'use client';

import { useEffect, useState } from 'react';
import { reportesService } from '@/services/reportesService';

export default function TestAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 TestAPI - Iniciando prueba de API...');
      const data = await reportesService.obtenerReporteProveedores(
        '2025-07-01', // fechaDesde
        '2025-08-01', // fechaHasta
        1,            // page
        10            // limit
      );
      
      console.log('🧪 TestAPI - Datos recibidos:', data);
      setResult(data);
    } catch (err) {
      console.error('🧪 TestAPI - Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Test API Proveedores</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="btn-primary mb-4"
      >
        {loading ? 'Probando...' : 'Probar API'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>✅ API funcionando correctamente!</strong>
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Datos recibidos:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
