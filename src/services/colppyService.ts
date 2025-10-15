import { apiClient, getAuthToken } from './apiClient';
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
      console.log('🔄 Obteniendo clientes desde Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const response = await apiClient<{ success: boolean; data: Cliente[]; message: string }>(
        'caja-diaria/colppy/clientes',
        {
          method: 'GET'
        }
      );

      console.log('✅ Clientes obtenidos desde Colppy:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error obteniendo clientes de Colppy:', error);
      return [];
    }
  }

  async obtenerProveedores(): Promise<Proveedor[]> {
    try {
      console.log('🔄 Obteniendo proveedores desde Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const response = await apiClient<{ success: boolean; data: Proveedor[]; message: string }>(
        'caja-diaria/colppy/proveedores',
        {
          method: 'GET'
        }
      );

      console.log('✅ Proveedores obtenidos desde Colppy:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error obteniendo proveedores de Colppy:', error);
      return [];
    }
  }

  async sincronizarClientes(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Iniciando sincronización de clientes con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const response = await apiClient<{ success: boolean; message: string; data?: any }>(
        'caja-diaria/colppy/sincronizar/clientes',
        {
          method: 'POST',
          body: JSON.stringify({
            email: this.credentials.email,
            password: this.credentials.password
          })
        }
      );

      console.log('✅ Sincronización de clientes completada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sincronizando clientes con Colppy:', error);
      return {
        success: false,
        message: `Error en la sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async sincronizarProveedores(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Iniciando sincronización de proveedores con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const response = await apiClient<{ success: boolean; message: string; data?: any }>(
        'caja-diaria/colppy/sincronizar/proveedores',
        {
          method: 'POST',
          body: JSON.stringify({
            email: this.credentials.email,
            password: this.credentials.password
          })
        }
      );

      console.log('✅ Sincronización de proveedores completada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sincronizando proveedores con Colppy:', error);
      return {
        success: false,
        message: `Error en la sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async autenticar(): Promise<boolean> {
    try {
      console.log('🔄 Autenticando con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const response = await apiClient<{ success: boolean; message: string }>(
        'caja-diaria/colppy/autenticar',
        {
          method: 'POST',
          body: JSON.stringify({
            email: this.credentials.email,
            password: this.credentials.password
          })
        }
      );

      console.log('✅ Autenticación con Colppy:', response);
      return response.success;
    } catch (error) {
      console.error('❌ Error autenticando con Colppy:', error);
      return false;
    }
  }

  async verificarConexion(): Promise<{ conectado: boolean; mensaje: string }> {
    try {
      console.log('🔄 Verificando conexión con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const response = await apiClient<{ success: boolean; conectado: boolean; mensaje: string }>(
        'caja-diaria/colppy/verificar-conexion',
        {
          method: 'GET'
        }
      );

      console.log('✅ Verificación de conexión con Colppy:', response);
      return {
        conectado: response.conectado,
        mensaje: response.mensaje
      };
    } catch (error) {
      console.error('❌ Error verificando conexión con Colppy:', error);
      return {
        conectado: false,
        mensaje: `Error verificando conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

export const colppyService = new ColppyService();