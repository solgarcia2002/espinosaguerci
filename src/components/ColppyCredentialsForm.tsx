'use client';

import { useState, useEffect } from 'react';
import { colppyCredentialsService, ColppyCredentials } from '@/services/colppyCredentialsService';
import { toast } from 'sonner';

interface ColppyCredentialsFormProps {
  onCredentialsSaved?: () => void;
}

export default function ColppyCredentialsForm({ onCredentialsSaved }: ColppyCredentialsFormProps) {
  const [credentials, setCredentials] = useState<ColppyCredentials>({
    email: '',
    password: '',
    isActive: false
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const response = await colppyCredentialsService.getCredentials();
      if (response.success && response.data) {
        setCredentials(response.data);
      }
    } catch (error) {
      console.error('Error cargando credenciales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const response = await colppyCredentialsService.saveCredentials({
        email: credentials.email,
        password: credentials.password
      });

      if (response.success) {
        toast.success('Credenciales guardadas exitosamente');
        setCredentials(prev => ({ ...prev, isActive: true }));
        onCredentialsSaved?.();
      } else {
        toast.error(response.message || 'Error al guardar credenciales');
      }
    } catch (error) {
      console.error('Error guardando credenciales:', error);
      toast.error('Error al guardar credenciales');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      const response = await colppyCredentialsService.testConnection();
      
      if (response.success) {
        toast.success('Conexión exitosa con Colppy');
      } else {
        toast.error(response.message || 'Error al conectar con Colppy');
      }
    } catch (error) {
      console.error('Error probando conexión:', error);
      toast.error('Error al probar conexión');
    } finally {
      setTesting(false);
    }
  };

  const handleInputChange = (field: keyof ColppyCredentials, value: string | boolean) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-negro">Credenciales de Colppy</h2>
          <p className="text-sm text-brand-gris-600 mt-1">
            Configura tus credenciales para sincronizar datos con Colppy
          </p>
        </div>
        {credentials.isActive && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Activo</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-gris-700 mb-2">
            Email de Colppy
          </label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-brand-gris-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-verde focus:border-transparent"
            placeholder="usuario@colppy.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand-gris-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-brand-gris-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-verde focus:border-transparent"
              placeholder="Tu contraseña de Colppy"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-gris-400 hover:text-brand-gris-600"
              disabled={loading}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={credentials.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="mr-2 rounded border-brand-gris-300 text-brand-verde focus:ring-brand-verde"
              disabled={loading}
            />
            <span className="text-sm text-brand-gris-700">Activar sincronización automática</span>
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || !credentials.email || !credentials.password}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <span className="loader animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Guardar Credenciales</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !credentials.email || !credentials.password}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-auto p-4"
          >
            {testing ? (
              <>
                <span className="loader animate-spin border-2 border-t-transparent border-brand-verde rounded-full w-4 h-4"></span>
                <span>Probando...</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>Probar Conexión</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Información de seguridad */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded">
        <div className="flex items-start space-x-2">
          <span className="text-lg">🔒</span>
          <div>
            <strong>Seguridad:</strong> Tus credenciales se almacenan de forma segura y encriptada. 
            Solo se utilizan para sincronizar datos con Colppy y nunca se comparten con terceros.
          </div>
        </div>
      </div>
    </div>
  );
}
