import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

const getTenantId = (): string => {
  return process.env.TENANT || "d9d1c7f9-8909-4d43-a32b-278174459446";
};

// Datos mock locales (temporal hasta conectar con BD real)
const mockMovimientos: MovimientoCaja[] = [];
const mockClientes: Cliente[] = [];
const mockProveedores: Proveedor[] = [
  {
    id: "1",
    proveedor: "ACOPIADORES DE SEBO S.A.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000359",
    vencimiento: "15-08-2025",
    total: 2816408.10,
    pagado: 2816408.10,
    pendiente: 0
  },
  {
    id: "2",
    proveedor: "AEROPAL S.A.S.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0001-00004224",
    vencimiento: "22-08-2025",
    total: 54630.00,
    pagado: 54630.00,
    pendiente: 0
  },
  {
    id: "3",
    proveedor: "ALIBABA SRL",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0001-00004222",
    vencimiento: "08-08-2025",
    total: 1335000.00,
    pagado: 1335000.00,
    pendiente: 0
  },
  {
    id: "4",
    proveedor: "AMPLAN SRL",
    tipo: "FAV-A",
    fecha: "01-08-2025",
    referencia: "0007-00000406",
    vencimiento: "22-08-2025",
    total: 1875185.40,
    pagado: 1875185.40,
    pendiente: 0
  },
  {
    id: "5",
    proveedor: "FLEXICO SA",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000365",
    vencimiento: "08-08-2025",
    total: 2072040.30,
    pagado: 2072040.30,
    pendiente: 0
  }
];

// Funciones locales para manejar endpoints de caja diaria
const handleLocalEndpoint = async <T>(
  endpoint: string,
  method: string,
  body?: any,
  params?: Record<string, string | number | number[]>
): Promise<T> => {
  // Endpoints de movimientos
  if (endpoint.startsWith('caja-diaria/movimientos')) {
    if (endpoint === 'caja-diaria/movimientos' && method === 'GET') {
      // Filtrar movimientos por parámetros
      let filteredMovimientos = [...mockMovimientos];
      
      if (params?.fechaInicio) {
        filteredMovimientos = filteredMovimientos.filter(m => m.fecha >= String(params.fechaInicio));
      }
      if (params?.fechaFin) {
        filteredMovimientos = filteredMovimientos.filter(m => m.fecha <= String(params.fechaFin));
      }
      if (params?.tipo) {
        filteredMovimientos = filteredMovimientos.filter(m => m.tipo === String(params.tipo));
      }
      if (params?.clienteId) {
        filteredMovimientos = filteredMovimientos.filter(m => m.clienteId === String(params.clienteId));
      }
      if (params?.proveedorId) {
        filteredMovimientos = filteredMovimientos.filter(m => m.proveedorId === String(params.proveedorId));
      }
      if (params?.metodoPago) {
        filteredMovimientos = filteredMovimientos.filter(m => m.metodoPago === String(params.metodoPago));
      }

      return {
        success: true,
        data: filteredMovimientos,
        message: 'Movimientos obtenidos exitosamente'
      } as T;
    }

    if (endpoint === 'caja-diaria/movimientos' && method === 'POST') {
      const nuevoMovimiento: MovimientoCaja = {
        id: Date.now().toString(),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockMovimientos.push(nuevoMovimiento);
      
      return {
        success: true,
        data: nuevoMovimiento,
        message: 'Movimiento creado exitosamente'
      } as T;
    }

    if (endpoint.includes('/resumen/diario') && method === 'GET') {
      const fecha = params?.fecha as string || new Date().toISOString().split('T')[0];
      const movimientosDelDia = mockMovimientos.filter(m => m.fecha === fecha);
      
      const resumen: ResumenCaja = {
        fecha,
        saldoInicial: 0,
        totalIngresos: movimientosDelDia.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0),
        totalEgresos: movimientosDelDia.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0),
        saldoFinal: 0,
        movimientos: movimientosDelDia,
        cantidadMovimientos: movimientosDelDia.length
      };

      return {
        success: true,
        data: resumen,
        message: 'Resumen diario obtenido exitosamente'
      } as T;
    }

    // Endpoint dinámico para operaciones por ID
    if (endpoint.includes('/caja-diaria/movimientos/') && !endpoint.includes('/resumen/')) {
      const id = endpoint.split('/').pop();
      
      if (method === 'GET') {
        const movimiento = mockMovimientos.find(m => m.id === id);
        if (!movimiento) {
          throw new Error('Movimiento no encontrado');
        }
        return {
          success: true,
          data: movimiento,
          message: 'Movimiento obtenido exitosamente'
        } as T;
      }

      if (method === 'PUT') {
        const index = mockMovimientos.findIndex(m => m.id === id);
        if (index === -1) {
          throw new Error('Movimiento no encontrado');
        }
        const movimientoActualizado = {
          ...mockMovimientos[index],
          ...body,
          updatedAt: new Date().toISOString()
        };
        mockMovimientos[index] = movimientoActualizado;
        
        return {
          success: true,
          data: movimientoActualizado,
          message: 'Movimiento actualizado exitosamente'
        } as T;
      }

      if (method === 'DELETE') {
        const index = mockMovimientos.findIndex(m => m.id === id);
        if (index === -1) {
          throw new Error('Movimiento no encontrado');
        }
        mockMovimientos.splice(index, 1);
        
        return {
          success: true,
          message: 'Movimiento eliminado exitosamente'
        } as T;
      }
    }
  }

  // Endpoints de clientes
  if (endpoint.startsWith('caja-diaria/clientes')) {
    if (endpoint === 'caja-diaria/clientes' && method === 'GET') {
      let filteredClientes = [...mockClientes];
      
      if (params?.fechaInicio) {
        filteredClientes = filteredClientes.filter(c => c.fecha >= String(params.fechaInicio));
      }
      if (params?.fechaFin) {
        filteredClientes = filteredClientes.filter(c => c.fecha <= String(params.fechaFin));
      }

      return {
        success: true,
        data: filteredClientes,
        message: 'Clientes obtenidos exitosamente'
      } as T;
    }

    if (endpoint === 'caja-diaria/clientes' && method === 'POST') {
      const nuevoCliente: Cliente = {
        id: Date.now().toString(),
        ...body
      };
      mockClientes.push(nuevoCliente);
      
      return {
        success: true,
        data: nuevoCliente,
        message: 'Cliente creado exitosamente'
      } as T;
    }
  }

  // Endpoints de proveedores
  if (endpoint.startsWith('caja-diaria/proveedores')) {
    if (endpoint === 'caja-diaria/proveedores' && method === 'GET') {
      let filteredProveedores = [...mockProveedores];
      
      if (params?.fechaInicio) {
        filteredProveedores = filteredProveedores.filter(p => p.fecha >= String(params.fechaInicio));
      }
      if (params?.fechaFin) {
        filteredProveedores = filteredProveedores.filter(p => p.fecha <= String(params.fechaFin));
      }

      return {
        success: true,
        data: filteredProveedores,
        message: 'Proveedores obtenidos exitosamente'
      } as T;
    }

    if (endpoint === 'caja-diaria/proveedores' && method === 'POST') {
      const nuevoProveedor: Proveedor = {
        id: Date.now().toString(),
        ...body
      };
      mockProveedores.push(nuevoProveedor);
      
      return {
        success: true,
        data: nuevoProveedor,
        message: 'Proveedor creado exitosamente'
      } as T;
    }

    // Endpoint dinámico para operaciones por ID de proveedores
    if (endpoint.includes('/caja-diaria/proveedores/') && endpoint !== 'caja-diaria/proveedores') {
      const id = endpoint.split('/').pop();
      
      if (method === 'GET') {
        const proveedor = mockProveedores.find(p => p.id === id);
        if (!proveedor) {
          throw new Error('Proveedor no encontrado');
        }
        return {
          success: true,
          data: proveedor,
          message: 'Proveedor obtenido exitosamente'
        } as T;
      }

      if (method === 'PUT') {
        const index = mockProveedores.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error('Proveedor no encontrado');
        }
        const proveedorActualizado = {
          ...mockProveedores[index],
          ...body
        };
        mockProveedores[index] = proveedorActualizado;
        
        return {
          success: true,
          data: proveedorActualizado,
          message: 'Proveedor actualizado exitosamente'
        } as T;
      }

      if (method === 'DELETE') {
        const index = mockProveedores.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error('Proveedor no encontrado');
        }
        mockProveedores.splice(index, 1);
        
        return {
          success: true,
          message: 'Proveedor eliminado exitosamente'
        } as T;
      }
    }

    // Endpoints de búsqueda de proveedores
    if (endpoint.includes('/buscar/cuit/')) {
      const cuit = endpoint.split('/').pop();
      const proveedor = mockProveedores.find(p => p.id === cuit); // Asumiendo que id es el CUIT
      
      return {
        success: true,
        data: proveedor || null,
        message: proveedor ? 'Proveedor encontrado' : 'Proveedor no encontrado'
      } as T;
    }

    if (endpoint.includes('/buscar/email/')) {
      const email = endpoint.split('/').pop();
      const proveedor = mockProveedores.find(p => p.id === email); // Asumiendo que id es el email
      
      return {
        success: true,
        data: proveedor || null,
        message: proveedor ? 'Proveedor encontrado' : 'Proveedor no encontrado'
      } as T;
    }

    if (endpoint.includes('/movimientos')) {
      const id = endpoint.split('/')[2]; // caja-diaria/proveedores/{id}/movimientos
      const movimientos = mockMovimientos.filter(m => m.proveedorId === id);
      
      return {
        success: true,
        data: movimientos,
        message: 'Movimientos del proveedor obtenidos exitosamente'
      } as T;
    }
  }

  // Endpoints de reportes
  if (endpoint.startsWith('reportes/')) {
    // Por ahora retornamos datos vacíos para todos los reportes
    return {
      success: true,
      data: {},
      message: 'Reporte obtenido exitosamente'
    } as T;
  }

  throw new Error(`Endpoint no encontrado: ${endpoint}`);
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | number[]>
): Promise<T> {
  // Si es un endpoint local, manejarlo localmente
  if (endpoint.startsWith('caja-diaria/') || endpoint.startsWith('reportes/')) {
    return handleLocalEndpoint<T>(endpoint, options.method || 'GET', options.body, params);
  }

  // Si es un endpoint externo, usar la lógica original
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "tenant-id": getTenantId(),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(`${baseUrl}/${endpoint}${queryString}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message ?? "Error en la petición");
  }

  return response.json() as Promise<T>;
}