'use client';

import { useState, useEffect } from 'react';
import { Cliente } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { toast } from 'sonner';

export default function GestionClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const clientesData = await cajaDiariaService.obtenerClientes();
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const sincronizarConColppy = async () => {
    try {
      setSincronizando(true);
      const result = await colppyService.sincronizarClientes();
      toast.success(result.message || `Sincronización exitosa: ${result.count} clientes actualizados`);
      await cargarClientes();
    } catch (error) {
      console.error('Error al sincronizar:', error);
      toast.error('Error al sincronizar con Colppy');
    } finally {
      setSincronizando(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.referencia.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.fecha.includes(busqueda) ||
    cliente.vencimiento.includes(busqueda)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Facturas de Clientes</h3>
          <p className="text-sm text-gray-500">
            {clientes.length} facturas registradas desde Excel
          </p>
          <p className="text-xs text-blue-600">
            📄 Facturas del Excel sincronizadas con Colppy vía Backend
          </p>
        </div>
        <button
          onClick={sincronizarConColppy}
          disabled={sincronizando}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 w-auto px-2.5 py-2.5"
        >
          <span>🔄</span>
          <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="card p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por cliente, tipo, referencia, fecha o vencimiento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </h3>
          <p className="text-gray-500 mb-4">
            {busqueda 
              ? 'Intenta con otros términos de búsqueda'
              : 'Sincroniza con Colppy para obtener tus clientes'
            }
          </p>
          {!busqueda && (
            <button
              onClick={sincronizarConColppy}
              disabled={sincronizando}
              className="btn-primary disabled:opacity-50"
            >
              Sincronizar con Colppy
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cobrado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendiente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">👤</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {cliente.cliente}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.tipo === 'FAV-X' 
                          ? 'bg-blue-100 text-blue-800' 
                          : cliente.tipo === 'FAV-A'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {cliente.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {cliente.referencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.vencimiento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">
                        ${cliente.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium text-green-600">
                        ${cliente.cobrado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${
                        cliente.pendiente > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${cliente.pendiente.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
