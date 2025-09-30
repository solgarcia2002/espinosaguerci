import { apiClient } from './apiClient';
import { MovimientoCaja, ResumenCaja, FiltrosCaja, Cliente, Proveedor } from '@/types/cajaDiaria';
import { 
  mockMovimientos, 
  mockResumen, 
  mockResumenes,
  mockClientes, 
  mockProveedores, 
  filterMovimientos, 
  getMovimientosPorMes,
  getResumenPorMes,
  getResumenPorFecha,
  simulateApiDelay 
} from '@/data/mockData';

export class CajaDiariaService {
  async obtenerMovimientos(filtros?: FiltrosCaja): Promise<MovimientoCaja[]> {
    try {
      // Simular delay de API
      await simulateApiDelay(300);
      
      // Usar datos mockeados temporalmente
      const movimientosFiltrados = filterMovimientos(mockMovimientos, filtros || {});
      
      return movimientosFiltrados;
      
      /* Código original para cuando esté el backend:
      const params: Record<string, string> = {};
      
      if (filtros?.fechaDesde) params.fechaDesde = filtros.fechaDesde;
      if (filtros?.fechaHasta) params.fechaHasta = filtros.fechaHasta;
      if (filtros?.tipo && filtros.tipo !== 'todos') params.tipo = filtros.tipo;
      if (filtros?.clienteId) params.clienteId = filtros.clienteId;
      if (filtros?.proveedorId) params.proveedorId = filtros.proveedorId;
      if (filtros?.metodoPago) params.metodoPago = filtros.metodoPago;

      const response = await apiClient<MovimientoCaja[]>(
        'caja-diaria/movimientos',
        {
          method: 'GET'
        },
        params
      );
      
      return response || [];
      */
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw new Error('No se pudieron obtener los movimientos de caja');
    }
  }

  async crearMovimiento(movimiento: Omit<MovimientoCaja, 'id' | 'createdAt' | 'updatedAt'>): Promise<MovimientoCaja> {
    try {
      // Simular delay de API
      await simulateApiDelay(500);
      
      // Crear nuevo movimiento con datos mockeados
      const nuevoMovimiento: MovimientoCaja = {
        ...movimiento,
        id: `mock_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cliente: movimiento.clienteId ? mockClientes.find(c => c.id === movimiento.clienteId) : undefined,
        proveedor: movimiento.proveedorId ? mockProveedores.find(p => p.id === movimiento.proveedorId) : undefined
      };
      
      // Agregar a la lista mockeada (solo en memoria)
      mockMovimientos.push(nuevoMovimiento);
      
      return nuevoMovimiento;
      
      /* Código original para cuando esté el backend:
      const response = await apiClient<MovimientoCaja>(
        'caja-diaria/movimientos',
        {
          method: 'POST',
          body: JSON.stringify(movimiento)
        }
      );
      
      return response;
      */
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      throw new Error('No se pudo crear el movimiento');
    }
  }

  async actualizarMovimiento(id: string, movimiento: Partial<MovimientoCaja>): Promise<MovimientoCaja> {
    try {
      const response = await apiClient<MovimientoCaja>(
        `caja-diaria/movimientos/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(movimiento)
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error al actualizar movimiento:', error);
      throw new Error('No se pudo actualizar el movimiento');
    }
  }

  async eliminarMovimiento(id: string): Promise<void> {
    try {
      await apiClient(
        `caja-diaria/movimientos/${id}`,
        {
          method: 'DELETE'
        }
      );
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      throw new Error('No se pudo eliminar el movimiento');
    }
  }

  async obtenerResumenDiario(fecha: string): Promise<ResumenCaja> {
    try {
      // Simular delay de API
      await simulateApiDelay(400);
      
      // Usar datos mockeados con resúmenes por fecha
      const resumen = getResumenPorFecha(fecha);
      if (resumen) {
        return resumen;
      }
      
      // Si no existe resumen para esa fecha, crear uno dinámico
      const movimientosDelDia = mockMovimientos.filter(m => m.fecha === fecha);
      const totalIngresos = movimientosDelDia.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
      const totalEgresos = movimientosDelDia.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0);
      
      const resumenDinamico: ResumenCaja = {
        fecha,
        saldoInicial: 100000.00, // Mock
        totalIngresos,
        totalEgresos,
        saldoFinal: 100000.00 + totalIngresos - totalEgresos,
        movimientos: movimientosDelDia,
        cantidadMovimientos: movimientosDelDia.length
      };
      
      return resumenDinamico;
      
      /* Código original para cuando esté el backend:
      const response = await apiClient<ResumenCaja>(
        'caja-diaria/resumen',
        {
          method: 'GET'
        },
        { fecha }
      );
      
      return response;
      */
    } catch (error) {
      console.error('Error al obtener resumen diario:', error);
      throw new Error('No se pudo obtener el resumen diario');
    }
  }

  async obtenerResumenPorMes(mes: string): Promise<any> {
    try {
      // Simular delay de API
      await simulateApiDelay(400);
      
      // Usar datos mockeados con resúmenes por mes
      return getResumenPorMes(mes);
      
      /* Código original para cuando esté el backend:
      const response = await apiClient<any>(
        'caja-diaria/resumen-mes',
        {
          method: 'GET'
        },
        { mes }
      );
      
      return response;
      */
    } catch (error) {
      console.error('Error al obtener resumen por mes:', error);
      throw new Error('No se pudo obtener el resumen por mes');
    }
  }

  async obtenerClientes(): Promise<Cliente[]> {
    try {
      // Simular delay de API
      await simulateApiDelay(200);
      
      // Usar datos mockeados temporalmente
      return mockClientes;
      
      /* Código original para cuando esté el backend:
      const response = await apiClient<Cliente[]>(
        'caja-diaria/clientes',
        {
          method: 'GET'
        }
      );
      
      return response || [];
      */
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw new Error('No se pudieron obtener los clientes');
    }
  }

  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      // Simular delay de API
      await simulateApiDelay(200);
      
      // Usar datos mockeados temporalmente
      return mockProveedores;
      
      /* Código original para cuando esté el backend:
      const response = await apiClient<Proveedor[]>(
        'caja-diaria/proveedores',
        {
          method: 'GET'
        }
      );
      
      return response || [];
      */
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw new Error('No se pudieron obtener los proveedores');
    }
  }

  async exportarExcel(filtros?: FiltrosCaja): Promise<Blob> {
    try {
      const params: Record<string, string> = {};
      
      if (filtros?.fechaDesde) params.fechaDesde = filtros.fechaDesde;
      if (filtros?.fechaHasta) params.fechaHasta = filtros.fechaHasta;
      if (filtros?.tipo && filtros.tipo !== 'todos') params.tipo = filtros.tipo;

      const queryString = new URLSearchParams(params).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/caja-diaria/exportar?${queryString}`;
      
      const response = await fetch(url, {
        headers: {
          'tenant-id': process.env.TENANT || "043ef5db-f30e-48c7-81d8-d3893b9496bb"
        }
      });

      if (!response.ok) {
        throw new Error('Error al exportar el archivo');
      }

      return response.blob();
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      throw new Error('No se pudo exportar el archivo Excel');
    }
  }
}

export const cajaDiariaService = new CajaDiariaService();
