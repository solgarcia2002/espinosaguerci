'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MovimientoCaja, Cliente, Proveedor } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { toast } from 'sonner';

const movimientoSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  tipo: z.enum(['ingreso', 'egreso'], { required_error: 'El tipo es requerido' }),
  concepto: z.string().min(1, 'El concepto es requerido'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  clienteId: z.string().optional(),
  proveedorId: z.string().optional(),
  metodoPago: z.enum(['efectivo', 'transferencia', 'cheque', 'tarjeta', 'pendiente'], { 
    required_error: 'El método de pago es requerido' 
  }),
  observaciones: z.string().optional(),
});

type MovimientoFormData = z.infer<typeof movimientoSchema>;

interface MovimientoFormProps {
  movimiento?: MovimientoCaja;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MovimientoForm({ movimiento, onSuccess, onCancel }: MovimientoFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<MovimientoFormData>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: movimiento ? {
      fecha: movimiento.fecha,
      tipo: movimiento.tipo,
      concepto: movimiento.concepto,
      monto: movimiento.monto,
      clienteId: movimiento.clienteId || '',
      proveedorId: movimiento.proveedorId || '',
      metodoPago: movimiento.metodoPago,
      observaciones: movimiento.observaciones || '',
    } : {
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'ingreso',
      concepto: '',
      monto: 0,
      metodoPago: 'efectivo',
    }
  });

  const tipoSeleccionado = watch('tipo');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [clientesData, proveedoresData] = await Promise.all([
        cajaDiariaService.obtenerClientes(),
        cajaDiariaService.obtenerProveedores()
      ]);
      setClientes(clientesData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar clientes y proveedores');
    } finally {
      setLoading(false);
    }
  };

  const sincronizarConColppy = async () => {
    try {
      setSincronizando(true);
      // Usar sincronización completa que incluye clientes, proveedores y pagos
      const result = await colppyService.sincronizarTodos();
      
      if (result.success) {
        toast.success(result.message || 'Sincronización completa exitosa');
      } else {
        toast.error(result.message || 'Error en la sincronización');
      }
      
      await cargarDatos();
    } catch (error) {
      console.error('Error al sincronizar:', error);
      toast.error('Error al sincronizar con Colppy');
    } finally {
      setSincronizando(false);
    }
  };

  const onSubmit = async (data: MovimientoFormData) => {
    try {
      setLoading(true);
      
      const movimientoData = {
        ...data,
        clienteId: data.clienteId || undefined,
        proveedorId: data.proveedorId || undefined,
        usuario: 'usuario_actual' // TODO: obtener del contexto de auth
      };

      if (movimiento) {
        await cajaDiariaService.actualizarMovimiento(movimiento.id, movimientoData);
        toast.success('Movimiento actualizado correctamente');
      } else {
        await cajaDiariaService.crearMovimiento(movimientoData);
        toast.success('Movimiento creado correctamente');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      toast.error('Error al guardar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  {...register('fecha')}
                  className="input"
                />
                {errors.fecha && (
                  <p className="text-red-500 text-xs mt-1">{errors.fecha.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select {...register('tipo')} className="input">
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concepto *
              </label>
              <input
                type="text"
                {...register('concepto')}
                className="input"
                placeholder="Descripción del movimiento"
              />
              {errors.concepto && (
                <p className="text-red-500 text-xs mt-1">{errors.concepto.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('monto', { valueAsNumber: true })}
                  className="input"
                  placeholder="0.00"
                />
                {errors.monto && (
                  <p className="text-red-500 text-xs mt-1">{errors.monto.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago *
                </label>
                <select {...register('metodoPago')} className="input">
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="cheque">Cheque</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="pendiente">Pendiente</option>
                </select>
                {errors.metodoPago && (
                  <p className="text-red-500 text-xs mt-1">{errors.metodoPago.message}</p>
                )}
              </div>
            </div>

            {tipoSeleccionado === 'ingreso' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cliente
                  </label>
                  <button
                    type="button"
                    onClick={sincronizarConColppy}
                    disabled={sincronizando}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}
                  </button>
                </div>
                <select {...register('clienteId')} className="input">
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.cliente}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {tipoSeleccionado === 'egreso' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Proveedor
                  </label>
                  <button
                    type="button"
                    onClick={sincronizarConColppy}
                    disabled={sincronizando}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {sincronizando ? 'Sincronizando...' : 'Sincronizar con Colppy'}
                  </button>
                </div>
                <select {...register('proveedorId')} className="input">
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.proveedor}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                {...register('observaciones')}
                className="input"
                rows={3}
                placeholder="Observaciones adicionales"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : movimiento ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
