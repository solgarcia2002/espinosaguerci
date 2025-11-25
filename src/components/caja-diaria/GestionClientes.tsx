'use client';

import { useState, useEffect } from 'react';
import { ClientesResponse, ClienteEntity } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { toast } from 'sonner';
import ColppyProgress from '@/components/ColppyProgress';

export default function GestionClientes() {
  const [clientesData, setClientesData] = useState<ClientesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(20);

  useEffect(() => {
    console.log('🔄 useEffect ejecutado - cargando clientes');
    console.log('📄 Paginación:', { paginaActual, itemsPorPagina });
    cargarClientes();
  }, [paginaActual, itemsPorPagina]);

  const cargarClientes = async () => {
    try {
      console.log('🚀 GestionClientes - cargarClientes llamado con:', {
        paginaActual,
        itemsPorPagina
      });
      
      setLoading(true);
      const data = await cajaDiariaService.obtenerClientesConPaginacion({
        page: paginaActual,
        limit: itemsPorPagina
      });
      
      console.log('✅ GestionClientes - Datos recibidos:', data);
      setClientesData(data);
    } catch (error) {
      console.error('❌ Error al cargar clientes:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const sincronizarConColppy = async () => {
    try {
      setSincronizando(true);
      const result = await colppyService.sincronizarClientes({
        email: 'matiespinosa05@gmail.com',
        password: 'Mati.46939'
      });
      toast.success(result.message || 'Sincronización exitosa');
      await cargarClientes();
    } catch (error) {
      console.error('Error al sincronizar:', error);
      toast.error('Error al sincronizar con Colppy');
    } finally {
      setSincronizando(false);
    }
  };

  const [showProgress, setShowProgress] = useState(false);

  const handleSincronizarConProgress = async () => {
    setShowProgress(true);
    try {
      await sincronizarConColppy();
    } finally {
      setTimeout(() => setShowProgress(false), 2000);
    }
  };

  const clientesFiltrados = busqueda 
    ? (clientesData?.data || []).filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (cliente.email && cliente.email.toLowerCase().includes(busqueda.toLowerCase())) ||
        (cliente.cuit && cliente.cuit.includes(busqueda)) ||
        (cliente.telefono && cliente.telefono.includes(busqueda)) ||
        (cliente.direccion && cliente.direccion.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : (clientesData?.data || []);

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const cambiarItemsPorPagina = (nuevoLimit: number) => {
    setItemsPorPagina(nuevoLimit);
    setPaginaActual(1);
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h3>
          <p className="text-sm text-gray-500">
            {clientesData?.pagination.total || 0} clientes registrados
            {clientesData?.pagination && (
              <span className="ml-2 text-blue-600">
                • Página {clientesData.pagination.page} de {clientesData.pagination.totalPages}
                • Mostrando {clientesData.data.length} de {clientesData.pagination.total}
              </span>
            )}
            {busqueda && ` • ${clientesFiltrados.length} con búsqueda local`}
          </p>
        </div>
        <button
          onClick={handleSincronizarConProgress}
          disabled={sincronizando}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 w-auto p-4"
        >
          <span>🔄</span>
          <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}</span>
        </button>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Búsqueda
          </label>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              🗑️ Limpiar búsqueda
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, email, CUIT, teléfono o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        {busqueda && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🔍 "{busqueda}"
              <button
                onClick={() => setBusqueda('')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </span>
          </div>
        )}
      </div>

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
                    Nombre
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUIT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colppy ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">👤</div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                          {cliente.nombre}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {cliente.cuit || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.tipoDocumento || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {cliente.direccion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {cliente.colppyId || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {cliente.saldo !== undefined ? (
                        <span className={`font-medium ${
                          cliente.saldo > 0 
                            ? 'text-red-600' 
                            : cliente.saldo < 0 
                            ? 'text-green-600' 
                            : 'text-gray-600'
                        }`}>
                          ${Math.abs(cliente.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          {cliente.saldo > 0 && ' (Debe)'}
                          {cliente.saldo < 0 && ' (A favor)'}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {clientesData?.pagination && clientesData.pagination.totalPages > 1 && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Mostrar:</label>
                <select
                  value={itemsPorPagina}
                  onChange={(e) => cambiarItemsPorPagina(parseInt(e.target.value))}
                  className="input py-1 px-2 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-500">por página</span>
              </div>
              
              <div className="text-sm text-gray-700">
                Mostrando {((clientesData.pagination.page - 1) * clientesData.pagination.limit) + 1} a{' '}
                {Math.min(clientesData.pagination.page * clientesData.pagination.limit, clientesData.pagination.total)} de{' '}
                {clientesData.pagination.total} resultados
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => cambiarPagina(1)}
                disabled={!clientesData.pagination.hasPrev}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏮️ Primera
              </button>
              
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={!clientesData.pagination.hasPrev}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅️ Anterior
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, clientesData.pagination.totalPages) }, (_, i) => {
                  const startPage = Math.max(1, clientesData.pagination.page - 2);
                  const pageNum = startPage + i;
                  
                  if (pageNum > clientesData.pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => cambiarPagina(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        pageNum === clientesData.pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'btn-secondary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={!clientesData.pagination.hasNext}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente ➡️
              </button>
              
              <button
                onClick={() => cambiarPagina(clientesData.pagination.totalPages)}
                disabled={!clientesData.pagination.hasNext}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Última ⏭️
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgress && (
        <ColppyProgress 
          scope="clientes"
          onComplete={() => {
            setShowProgress(false);
            toast.success('Sincronización completada');
            cargarClientes();
          }}
          onError={(error) => {
            toast.error(`Error: ${error}`);
          }}
        />
      )}
    </div>
  );
}
