import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

const getTenantId = (): string => {
  return process.env.TENANT || "d9d1c7f9-8909-4d43-a32b-278174459446";
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

  // Obtener token JWT
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Log del token para debugging
  if (token) {
    console.log('🔑 Token JWT encontrado, incluyendo en Authorization header');
  } else {
    console.warn('⚠️ No se encontró token JWT en localStorage - llamada sin autenticación');
  }

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "tenant-id": getTenantId(),
    "Authorization": `Bearer ${token || ''}`,
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const url = `${baseUrl}/${endpoint}${queryString}`;
  console.log(`🌐 Llamando a API real: ${url}`, { 
    method: options.method, 
    params,
    hasToken: !!token,
    headers: {
      'Content-Type': headers['Content-Type'],
      'tenant-id': headers['tenant-id'],
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'No token'
    }
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error(`❌ Error en API: ${response.status} - ${errorData?.message || 'Error desconocido'}`);
    throw new Error(errorData?.message ?? `Error en la petición: ${response.status}`);
  }

  const data = await response.json() as T;
  console.log(`✅ Respuesta de API exitosa:`, data);
  return data;
}