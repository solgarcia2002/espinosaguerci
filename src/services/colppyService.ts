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
      // Simular delay de API
      await simulateApiDelay(800);
      
      // Usar datos mockeados temporalmente
      console.log('🔗 Simulando conexión con Colppy para obtener clientes...');
      return mockClientes;
      
      /* Código original para cuando esté el backend:
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
      */
    } catch (error) {
      console.error('Error al obtener clientes de Colppy:', error);
      throw new Error('No se pudieron obtener los clientes de Colppy');
    }
  }

  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      // Simular delay de API
      await simulateApiDelay(800);
      
      // Usar datos mockeados temporalmente
      console.log('🔗 Simulando conexión con Colppy para obtener proveedores...');
      return mockProveedores;
      
      /* Código original para cuando esté el backend:
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
      */
    } catch (error) {
      console.error('Error al obtener proveedores de Colppy:', error);
      throw new Error('No se pudieron obtener los proveedores de Colppy');
    }
  }

  async sincronizarClientes(): Promise<{ success: boolean; count: number }> {
    try {
      // Simular delay de API
      await simulateApiDelay(1200);
      
      // Simular sincronización exitosa
      console.log('🔄 Simulando sincronización de clientes con Colppy...');
      return { success: true, count: mockClientes.length };
      
      /* Código original para cuando esté el backend:
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
      */
    } catch (error) {
      console.error('Error al sincronizar clientes:', error);
      throw new Error('No se pudieron sincronizar los clientes');
    }
  }

  async sincronizarProveedores(): Promise<{ success: boolean; count: number }> {
    try {
      // Simular delay de API
      await simulateApiDelay(1200);
      
      // Simular sincronización exitosa
      console.log('🔄 Simulando sincronización de proveedores con Colppy...');
      return { success: true, count: mockProveedores.length };
      
      /* Código original para cuando esté el backend:
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
      */
    } catch (error) {
      console.error('Error al sincronizar proveedores:', error);
      throw new Error('No se pudieron sincronizar los proveedores');
    }
  }
}

export const colppyService = new ColppyService();
