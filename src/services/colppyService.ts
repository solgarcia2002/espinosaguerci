import { apiClient, getAuthToken } from './apiClient';
import { Cliente, Proveedor, ColppyApiResponse } from '@/types/cajaDiaria';

export interface SincronizarOptions {
  email?: string;
  password?: string;
}

export interface SincronizarFacturasOptions {
  periodo: string; // Formato: "YYYY-MM"
  email?: string;
  password?: string;
}

export class ColppyService {

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

  async sincronizarClientes(options?: SincronizarOptions): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Iniciando sincronización de clientes con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      // Si se pasan credenciales, las incluimos; si no, el backend las tomará del storage seguro
      const body: Record<string, string> = {};
      if (options?.email) body.email = options.email;
      if (options?.password) body.password = options.password;
      
      const response = await apiClient<{ success: boolean; message: string; data?: any }>(
        'caja-diaria/colppy/sincronizar/clientes',
        {
          method: 'POST',
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
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

  async sincronizarProveedores(options?: SincronizarOptions): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Iniciando sincronización de proveedores con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      // Si se pasan credenciales, las incluimos; si no, el backend las tomará del storage seguro
      const body: Record<string, string> = {};
      if (options?.email) body.email = options.email;
      if (options?.password) body.password = options.password;
      
      const response = await apiClient<{ success: boolean; message: string; data?: any }>(
        'caja-diaria/colppy/sincronizar/proveedores',
        {
          method: 'POST',
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
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

  async sincronizarPagos(options?: SincronizarOptions): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Iniciando sincronización de pagos con Colppy...');
      
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      // Si se pasan credenciales, las incluimos; si no, el backend las tomará del storage seguro
      const body: Record<string, string> = {};
      if (options?.email) body.email = options.email;
      if (options?.password) body.password = options.password;
      
      const response = await apiClient<{ success: boolean; message: string; data?: any }>(
        'caja-diaria/colppy/sincronizar/pagos',
        {
          method: 'POST',
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
        }
      );

      console.log('✅ Sincronización de pagos completada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sincronizando pagos con Colppy:', error);
      return {
        success: false,
        message: `Error en la sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async sincronizarFacturas(options: SincronizarFacturasOptions): Promise<{ success: boolean; message: string; data?: any; archivoS3?: string }> {
    try {
      console.log('🔄 Iniciando sincronización de facturas con Colppy...', { periodo: options.periodo });
      
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      const body: Record<string, string> = {
        periodo: options.periodo
      };
      if (options.email) body.email = options.email;
      if (options.password) body.password = options.password;
      
      const response = await apiClient<{ success: boolean; message: string; data?: any; archivoS3?: string }>(
        'caja-diaria/colppy/sincronizar/facturas',
        {
          method: 'POST',
          body: JSON.stringify(body)
        }
      );

      console.log('✅ Sincronización de facturas completada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sincronizando facturas con Colppy:', error);
      return {
        success: false,
        message: `Error en la sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async sincronizarTodos(options?: SincronizarOptions): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Iniciando sincronización completa con Colppy...');
      
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      // Si se pasan credenciales, las incluimos; si no, el backend las tomará del storage seguro
      const body: Record<string, string> = {};
      if (options?.email) body.email = options.email;
      if (options?.password) body.password = options.password;
      
      const response = await apiClient<{ success: boolean; message: string; data?: any }>(
        'caja-diaria/colppy/sincronizar/todos',
        {
          method: 'POST',
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
        }
      );

      console.log('✅ Sincronización completa finalizada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en sincronización completa con Colppy:', error);
      return {
        success: false,
        message: `Error en la sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async autenticar(email?: string, password?: string): Promise<boolean> {
    try {
      console.log('🔄 Autenticando con Colppy...');
      
      // Verificar que el token esté disponible
      const token = getAuthToken();
      if (!token) {
        console.warn('⚠️ No se encontró token JWT en localStorage');
      } else {
        console.log('🔑 Token JWT encontrado, enviando en Authorization header');
      }
      
      // Si se pasan credenciales, las incluimos; si no, el backend las tomará del storage seguro
      const body: Record<string, string> = {};
      if (email) body.email = email;
      if (password) body.password = password;
      
      const response = await apiClient<{ success: boolean; message: string }>(
        'caja-diaria/colppy/autenticar',
        {
          method: 'POST',
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
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