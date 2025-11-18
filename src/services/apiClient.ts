import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

const getTenantId = (): string => {
  const tenantId = process.env.TENANT || "d9d1c7f9-8909-4d43-a32b-278174459446";
  console.log('🏢 Tenant ID configurado:', tenantId);
  return tenantId;
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Intentar obtener el token de diferentes fuentes
  const accessToken = localStorage.getItem('access_token');
  const cognitoToken = localStorage.getItem('cognito_token');
  const token = localStorage.getItem('token');
  
  // Priorizar access_token, luego cognito_token, luego token
  return accessToken || cognitoToken || token;
};

// API real - Sin datos mock locales


export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | number[]>
): Promise<T> {
  // Usar API real para todos los endpoints
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("❌ NEXT_PUBLIC_API_URL no está configurada");
  }

  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, val]) => {
          acc[key] = Array.isArray(val) ? val.join(",") : String(val);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined && options.body !== null;

  // Obtener token JWT
  const token = getAuthToken();
  
  // Log del token para debugging
  if (token) {
    console.log('🔑 Token JWT encontrado, incluyendo en Authorization header');
  } else {
    console.warn('⚠️ No se encontró token JWT en localStorage - llamada sin autenticación');
  }

  // Log del tenant-id
  const tenantId = getTenantId();
  console.log('🏢 Tenant ID incluido en header:', tenantId);

  const headers: Record<string, string> = {
    "tenant-id": tenantId,
    "Authorization": `Bearer ${token || ''}`,
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Solo agregar Content-Type si hay body y no es FormData
  if (hasBody && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${baseUrl}/${endpoint}${queryString}`;
  console.log(`🌐 Llamando a API real: ${url}`, { 
    method: options.method, 
    params,
    hasToken: !!token,
    hasBody,
    tenantId: headers['tenant-id'],
    headers: {
      'Content-Type': headers['Content-Type'] || 'No Content-Type',
      'tenant-id': headers['tenant-id'],
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'No token'
    }
  });

  // Preparar opciones de fetch
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  // Si no hay body, no incluirlo en la petición
  if (!hasBody) {
    delete fetchOptions.body;
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('🔒 Token expirado o inválido - redirigiendo al login');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('cognito_token');
        localStorage.removeItem('token');
        
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        window.location.href = '/login';
        return Promise.reject(new Error('Sesión expirada. Redirigiendo al login...'));
      }
    }
    
    const errorData = await response.json().catch(() => null);
    console.error(`❌ Error en API: ${response.status} - ${errorData?.message || 'Error desconocido'}`);
    throw new Error(errorData?.message ?? `Error en la petición: ${response.status}`);
  }

  const data = await response.json() as T;
  console.log(`✅ Respuesta de API exitosa:`, data);
  return data;
}