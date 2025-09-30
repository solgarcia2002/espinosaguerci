import { apiClient } from './apiClient';
import { Cliente, Proveedor, ColppyApiResponse, ColppyCredentials } from '@/types/cajaDiaria';

export class ColppyService {
  private credentials: ColppyCredentials;

  constructor() {
    this.credentials = {
      email: 'matiespinosa05@gmail.com',
      password: 'Mati.46939'
    };
  }

  async obtenerClientes(): Promise<Cliente[]> {
    try {
      const response = await apiClient<ColppyApiResponse<Cliente[]>>(
        'colppy/clientes',
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`${this.credentials.email}:${this.credentials.password}`)}`
          }
        }
      );
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener clientes de Colppy:', error);
      throw new Error('No se pudieron obtener los clientes de Colppy');
    }
  }

  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      const response = await apiClient<ColppyApiResponse<Proveedor[]>>(
        'colppy/proveedores',
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`${this.credentials.email}:${this.credentials.password}`)}`
          }
        }
      );
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener proveedores de Colppy:', error);
      throw new Error('No se pudieron obtener los proveedores de Colppy');
    }
  }

  async sincronizarClientes(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient<ColppyApiResponse<{ count: number }>>(
        'colppy/sincronizar/clientes',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.credentials.email}:${this.credentials.password}`)}`
          }
        }
      );
      
      return { success: true, count: response.data.count };
    } catch (error) {
      console.error('Error al sincronizar clientes:', error);
      throw new Error('No se pudieron sincronizar los clientes');
    }
  }

  async sincronizarProveedores(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient<ColppyApiResponse<{ count: number }>>(
        'colppy/sincronizar/proveedores',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.credentials.email}:${this.credentials.password}`)}`
          }
        }
      );
      
      return { success: true, count: response.data.count };
    } catch (error) {
      console.error('Error al sincronizar proveedores:', error);
      throw new Error('No se pudieron sincronizar los proveedores');
    }
  }
}

export const colppyService = new ColppyService();
