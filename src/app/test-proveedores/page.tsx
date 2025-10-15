'use client';

import { useState } from 'react';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { Proveedor } from '@/types/cajaDiaria';

export default function TestProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string>('');

  const testObtenerProveedores = async () => {
    setLoading(true);
    setResultado('');
    try {
      const data = await cajaDiariaService.obtenerProveedores();
      setProveedores(data);
      setResultado(`✅ Se obtuvieron ${data.length} proveedores exitosamente`);
    } catch (error) {
      setResultado(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCrearProveedor = async () => {
    setLoading(true);
    setResultado('');
    try {
      const nuevoProveedor = await cajaDiariaService.crearProveedor({
        proveedor: "PROVEEDOR DE PRUEBA",
        tipo: "FAV-X",
        fecha: "01-08-2025",
        referencia: "TEST-001",
        vencimiento: "15-08-2025",
        total: 100000,
        pagado: 0,
        pendiente: 100000
      });
      setResultado(`✅ Proveedor creado: ${nuevoProveedor.proveedor} (ID: ${nuevoProveedor.id})`);
      // Actualizar la lista
      await testObtenerProveedores();
    } catch (error) {
      setResultado(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testObtenerProveedorPorId = async () => {
    setLoading(true);
    setResultado('');
    try {
      const proveedor = await cajaDiariaService.obtenerProveedorPorId('1');
      if (proveedor) {
        setResultado(`✅ Proveedor encontrado: ${proveedor.proveedor} - Total: $${proveedor.total}`);
      } else {
        setResultado('❌ Proveedor no encontrado');
      }
    } catch (error) {
      setResultado(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Prueba de API de Proveedores
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pruebas de API</h2>
          
          <div className="space-y-4">
            <button
              onClick={testObtenerProveedores}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mr-4"
            >
              {loading ? 'Cargando...' : '1. Obtener Proveedores'}
            </button>

            <button
              onClick={testCrearProveedor}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mr-4"
            >
              {loading ? 'Cargando...' : '2. Crear Proveedor'}
            </button>

            <button
              onClick={testObtenerProveedorPorId}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mr-4"
            >
              {loading ? 'Cargando...' : '3. Obtener por ID'}
            </button>
          </div>

          {resultado && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="font-mono text-sm">{resultado}</p>
            </div>
          )}
        </div>

        {proveedores.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              📋 Proveedores ({proveedores.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Proveedor</th>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Referencia</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Pagado</th>
                    <th className="px-4 py-2 text-left">Pendiente</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((proveedor) => (
                    <tr key={proveedor.id} className="border-t">
                      <td className="px-4 py-2">{proveedor.id}</td>
                      <td className="px-4 py-2 font-medium">{proveedor.proveedor}</td>
                      <td className="px-4 py-2">{proveedor.tipo}</td>
                      <td className="px-4 py-2">{proveedor.referencia}</td>
                      <td className="px-4 py-2">${proveedor.total.toLocaleString()}</td>
                      <td className="px-4 py-2">${proveedor.pagado.toLocaleString()}</td>
                      <td className="px-4 py-2">${proveedor.pendiente.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
