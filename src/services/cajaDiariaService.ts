import { apiClient } from './apiClient';
import { MovimientoCaja, ResumenCaja, FiltrosCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

export class CajaDiariaService {
  async obtenerMovimientos(filtros?: FiltrosCaja): Promise<MovimientoCaja[]> {
    try {
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
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw new Error('No se pudieron obtener los movimientos de caja');
    }
  }

  async crearMovimiento(movimiento: Omit<MovimientoCaja, 'id' | 'createdAt' | 'updatedAt'>): Promise<MovimientoCaja> {
    try {
      const response = await apiClient<MovimientoCaja>(
        'caja-diaria/movimientos',
        {
          method: 'POST',
          body: JSON.stringify(movimiento)
        }
      );
      
      return response;
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
      const response = await apiClient<ResumenCaja>(
        'caja-diaria/resumen',
        {
          method: 'GET'
        },
        { fecha }
      );
      
      return response;
    } catch (error) {
      console.error('Error al obtener resumen diario:', error);
      throw new Error('No se pudo obtener el resumen diario');
    }
  }

  async obtenerClientes(): Promise<Cliente[]> {
    try {
      const response = await apiClient<Cliente[]>(
        'caja-diaria/clientes',
        {
          method: 'GET'
        }
      );
      
      return response || [];
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw new Error('No se pudieron obtener los clientes');
    }
  }

  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      const response = await apiClient<Proveedor[]>(
        'caja-diaria/proveedores',
        {
          method: 'GET'
        }
      );
      
      return response || [];
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
