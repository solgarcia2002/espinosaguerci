import { apiClient } from './apiClient';
import { Cliente, Proveedor, ColppyApiResponse, ColppyCredentials } from '@/types/cajaDiaria';
import { mockClientes, mockProveedores, simulateApiDelay } from '@/data/mockData';

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
      // El backend maneja la conexión con Colppy y devuelve los datos del Excel
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
      // Fallback a datos del Excel si falla la conexión
      console.log('🔄 Usando datos del Excel como fallback...');
      return mockClientes;
    }
  }

  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      // El backend maneja la conexión con Colppy y devuelve los datos del Excel
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
      // Fallback a datos del Excel si falla la conexión
      console.log('🔄 Usando datos del Excel como fallback...');
      return mockProveedores;
    }
  }

  async sincronizarClientes(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      // El backend maneja la sincronización con Colppy usando los datos del Excel
      const response = await apiClient<ColppyApiResponse<{ count: number }>>(
        'colppy/sincronizar/clientes',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.credentials.email}:${this.credentials.password}`)}`
          }
        }
      );
      
      return { 
        success: true, 
        count: response.data.count,
        message: `${response.data.count} clientes sincronizados exitosamente desde Colppy`
      };
    } catch (error) {
      console.error('Error al sincronizar clientes:', error);
      throw new Error('No se pudieron sincronizar los clientes con Colppy');
    }
  }

  async sincronizarProveedores(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      // El backend maneja la sincronización con Colppy usando los datos del Excel
      const response = await apiClient<ColppyApiResponse<{ count: number }>>(
        'colppy/sincronizar/proveedores',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.credentials.email}:${this.credentials.password}`)}`
          }
        }
      );
      
      return { 
        success: true, 
        count: response.data.count,
        message: `${response.data.count} proveedores sincronizados exitosamente desde Colppy`
      };
    } catch (error) {
      console.error('Error al sincronizar proveedores:', error);
      throw new Error('No se pudieron sincronizar los proveedores con Colppy');
    }
  }
}

export const colppyService = new ColppyService();
