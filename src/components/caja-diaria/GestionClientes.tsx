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
      toast.success(`Sincronización exitosa: ${result.count} clientes actualizados`);
      await cargarClientes();
    } catch (error) {
      console.error('Error al sincronizar:', error);
      toast.error('Error al sincronizar con Colppy');
    } finally {
      setSincronizando(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.cuit?.includes(busqueda)
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
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h3>
          <p className="text-sm text-gray-500">
            {clientes.length} clientes registrados
          </p>
        </div>
        <button
          onClick={sincronizarConColppy}
          disabled={sincronizando}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
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
            placeholder="Buscar clientes por nombre, email o CUIT..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="card p-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {cliente.nombre}
                  </h4>
                  {cliente.cuit && (
                    <p className="text-sm text-gray-500">CUIT: {cliente.cuit}</p>
                  )}
                </div>
                <span className="text-2xl">👤</span>
              </div>
              
              <div className="space-y-2 text-sm">
                {cliente.email && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📧</span>
                    <span className="truncate">{cliente.email}</span>
                  </div>
                )}
                {cliente.telefono && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📞</span>
                    <span>{cliente.telefono}</span>
                  </div>
                )}
                {cliente.direccion && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    <span className="truncate">{cliente.direccion}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Documento: {cliente.tipoDocumento || 'N/A'}</span>
                  <span>{cliente.numeroDocumento || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
