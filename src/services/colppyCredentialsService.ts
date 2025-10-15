import { apiClient } from './apiClient';

export interface ColppyCredentials {
  email: string;
  password: string;
  isActive: boolean;
}

export interface ColppyCredentialsResponse {
  success: boolean;
  message: string;
  data?: ColppyCredentials;
}

export class ColppyCredentialsService {
  async getCredentials(): Promise<ColppyCredentialsResponse> {
    try {
      console.log('🔄 Obteniendo credenciales de Colppy...');
      
      const response = await apiClient<ColppyCredentialsResponse>(
        'caja-diaria/colppy/credentials',
        {
          method: 'GET'
        }
      );

      console.log('✅ Credenciales de Colppy obtenidas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo credenciales de Colppy:', error);
      return {
        success: false,
        message: `Error obteniendo credenciales: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async saveCredentials(credentials: Omit<ColppyCredentials, 'isActive'>): Promise<ColppyCredentialsResponse> {
    try {
      console.log('🔄 Guardando credenciales de Colppy...');
      
      const response = await apiClient<ColppyCredentialsResponse>(
        'caja-diaria/colppy/credentials',
        {
          method: 'POST',
          body: JSON.stringify({
            ...credentials,
            isActive: true
          })
        }
      );

      console.log('✅ Credenciales de Colppy guardadas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error guardando credenciales de Colppy:', error);
      return {
        success: false,
        message: `Error guardando credenciales: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async updateCredentials(credentials: ColppyCredentials): Promise<ColppyCredentialsResponse> {
    try {
      console.log('🔄 Actualizando credenciales de Colppy...');
      
      const response = await apiClient<ColppyCredentialsResponse>(
        'caja-diaria/colppy/credentials',
        {
          method: 'PUT',
          body: JSON.stringify(credentials)
        }
      );

      console.log('✅ Credenciales de Colppy actualizadas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error actualizando credenciales de Colppy:', error);
      return {
        success: false,
        message: `Error actualizando credenciales: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Probando conexión con Colppy...');
      
      const response = await apiClient<{ success: boolean; message: string }>(
        'caja-diaria/colppy/test-connection',
        {
          method: 'POST'
        }
      );

      console.log('✅ Prueba de conexión con Colppy:', response);
      return response;
    } catch (error) {
      console.error('❌ Error probando conexión con Colppy:', error);
      return {
        success: false,
        message: `Error probando conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

export const colppyCredentialsService = new ColppyCredentialsService();
