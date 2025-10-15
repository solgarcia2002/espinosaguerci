import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

const getTenantId = (): string => {
  return process.env.TENANT || "d9d1c7f9-8909-4d43-a32b-278174459446";
};

// Datos mock locales (temporal hasta conectar con BD real)
const mockMovimientos: MovimientoCaja[] = [];
const mockClientes: Cliente[] = [
  {
    id: "1",
    cliente: "DI ROCCO MARINA NILDA",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0001-00004223",
    vencimiento: "08-08-2025",
    total: 28240.00,
    cobrado: 28240.00,
    pendiente: 0
  },
  {
    id: "2",
    cliente: "A M J S A",
    tipo: "FAV-A",
    fecha: "01-08-2025",
    referencia: "0007-00000407",
    vencimiento: "15-08-2025",
    total: 864774.90,
    cobrado: 990000.00,
    pendiente: 0
  },
  {
    id: "3",
    cliente: "AB 25 DE MAYO 1130 S. A.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0006-00001155",
    vencimiento: "08-08-2025",
    total: 786560.50,
    cobrado: 786560.50,
    pendiente: 0
  },
  {
    id: "4",
    cliente: "AISA SERGIO OSCAR",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0001-00004221",
    vencimiento: "29-08-2025",
    total: 24270.00,
    cobrado: 24270.00,
    pendiente: 0
  },
  {
    id: "5",
    cliente: "ALFARO PEDRO GERARDO",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0001-00004226",
    vencimiento: "15-08-2025",
    total: 183859.50,
    cobrado: 183859.50,
    pendiente: 0
  },
  {
    id: "6",
    cliente: "ALTRADE S.R.L.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0006-00001156",
    vencimiento: "08-08-2025",
    total: 532484.70,
    cobrado: 532484.70,
    pendiente: 0
  },
  {
    id: "7",
    cliente: "ASIM GONZALO",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000360",
    vencimiento: "08-08-2025",
    total: 88063.80,
    cobrado: 88063.80,
    pendiente: 0
  },
  {
    id: "8",
    cliente: "ASOCIACION CIVIL CIRCULO DE DIRECTIVOS DE COMUNICACION",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0008-00000210",
    vencimiento: "29-08-2025",
    total: 144310.00,
    cobrado: 0,
    pendiente: 144310.00
  },
  {
    id: "9",
    cliente: "ASOCIACION CULTURAL ALEMANA MORENO",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0008-00000211",
    vencimiento: "22-08-2025",
    total: 545000.00,
    cobrado: 0,
    pendiente: 545000.00
  },
  {
    id: "10",
    cliente: "ASR FORMOSA S.A.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0001-00004227",
    vencimiento: "29-08-2025",
    total: 328360.00,
    cobrado: 0,
    pendiente: 328360.00
  }
];
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
  },
  {
    id: "6",
    proveedor: "BARGOLD SA",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000364",
    vencimiento: "22-08-2025",
    total: 828436.18,
    pagado: 0,
    pendiente: 828436.18
  },
  {
    id: "7",
    proveedor: "M.H.V S.A.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000367",
    vencimiento: "22-08-2025",
    total: 191143.70,
    pagado: 0,
    pendiente: 191143.70
  },
  {
    id: "8",
    proveedor: "J J SANCHEZ S A",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000366",
    vencimiento: "08-08-2025",
    total: 1501077.60,
    pagado: 1501077.60,
    pendiente: 0
  },
  {
    id: "9",
    proveedor: "AXAL S.A.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000361",
    vencimiento: "08-08-2025",
    total: 467991.70,
    pagado: 467991.70,
    pendiente: 0
  },
  {
    id: "10",
    proveedor: "AZINTER S.A.",
    tipo: "FAV-X",
    fecha: "01-08-2025",
    referencia: "0005-00000363",
    vencimiento: "08-08-2025",
    total: 1004312.10,
    pagado: 1004312.10,
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
    if (endpoint === 'reportes/disponibilidad') {
      const reporteDisponibilidad = {
        fecha: params?.fecha as string || new Date().toISOString().split('T')[0],
        estadisticas: {
          totalDisponibilidad: 7500000,
          totalPesos: 5000000,
          totalDolares: 2500000,
          totalPendienteAcreditacion: 500000
        },
        cuentasBancarias: [
          {
            nombre: "Banco Nación - Caja de Ahorros",
            saldo: 2500000,
            pendienteAcreditacion: 200000,
            dolares: 0
          },
          {
            nombre: "Banco Santander - Cuenta Corriente",
            saldo: 1500000,
            pendienteAcreditacion: 150000,
            dolares: 0
          },
          {
            nombre: "Banco Galicia - Cuenta USD",
            saldo: 0,
            pendienteAcreditacion: 0,
            dolares: 2500000
          },
          {
            nombre: "Caja de Ahorros - Pesos",
            saldo: 1000000,
            pendienteAcreditacion: 150000,
            dolares: 0
          }
        ],
        porTipo: [
          {
            tipo: "Caja de Ahorros",
            cantidad: 2,
            totalSaldo: 3500000,
            totalDolares: 0,
            totalPendiente: 350000,
            cuentas: []
          },
          {
            tipo: "Cuenta Corriente",
            cantidad: 1,
            totalSaldo: 1500000,
            totalDolares: 0,
            totalPendiente: 150000,
            cuentas: []
          },
          {
            tipo: "Cuenta USD",
            cantidad: 1,
            totalSaldo: 0,
            totalDolares: 2500000,
            totalPendiente: 0,
            cuentas: []
          }
        ],
        resumenLiquidez: {
          disponibleInmediato: 5000000,
          disponibleBanco: 2000000,
          pendienteAcreditacion: 500000,
          totalLiquido: 7500000
        }
      };

      return {
        success: true,
        data: reporteDisponibilidad,
        message: 'Reporte de disponibilidad obtenido exitosamente'
      } as T;
    }

    if (endpoint === 'reportes/proveedores') {
      // Parámetros de paginación
      const page = parseInt(params?.page as string) || 1;
      const limit = parseInt(params?.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      // Filtros de fecha
      const fechaDesde = params?.fechaDesde as string;
      const fechaHasta = params?.fechaHasta as string;
      
      // Filtrar proveedores por fecha si se especifica
      let proveedoresFiltrados = mockProveedores;
      if (fechaDesde || fechaHasta) {
        proveedoresFiltrados = mockProveedores.filter(proveedor => {
          const fechaProveedor = new Date(proveedor.fecha.split('-').reverse().join('-'));
          const desde = fechaDesde ? new Date(fechaDesde) : null;
          const hasta = fechaHasta ? new Date(fechaHasta) : null;
          
          if (desde && fechaProveedor < desde) return false;
          if (hasta && fechaProveedor > hasta) return false;
          return true;
        });
      }
      
      // Paginación
      const totalItems = proveedoresFiltrados.length;
      const totalPages = Math.ceil(totalItems / limit);
      const proveedoresPaginados = proveedoresFiltrados.slice(offset, offset + limit);
      
      // Calcular estadísticas de los proveedores filtrados
      const totalFacturado = proveedoresFiltrados.reduce((sum, p) => sum + p.total, 0);
      const totalPagado = proveedoresFiltrados.reduce((sum, p) => sum + p.pagado, 0);
      const totalPendiente = proveedoresFiltrados.reduce((sum, p) => sum + p.pendiente, 0);
      const porcentajePagado = totalFacturado > 0 ? (totalPagado / totalFacturado) * 100 : 0;
      
      const reporteProveedores = {
        totalFacturado,
        totalPagado,
        totalPendiente,
        cantidadFacturas: totalItems,
        porcentajePagado: Math.round(porcentajePagado * 10) / 10,
        facturas: proveedoresPaginados,
        resumenPorEstado: {
          pagado: { 
            cantidad: proveedoresFiltrados.filter(p => p.pagado > 0).length, 
            monto: totalPagado, 
            porcentaje: Math.round(porcentajePagado * 10) / 10
          },
          pendiente: { 
            cantidad: proveedoresFiltrados.filter(p => p.pendiente > 0).length, 
            monto: totalPendiente, 
            porcentaje: Math.round((100 - porcentajePagado) * 10) / 10
          }
        },
        antiguedadSaldos: {
          vencidas: { 
            cantidad: proveedoresFiltrados.filter(p => {
              const vencimiento = new Date(p.vencimiento.split('-').reverse().join('-'));
              return vencimiento < new Date() && p.pendiente > 0;
            }).length, 
            monto: proveedoresFiltrados
              .filter(p => {
                const vencimiento = new Date(p.vencimiento.split('-').reverse().join('-'));
                return vencimiento < new Date() && p.pendiente > 0;
              })
              .reduce((sum, p) => sum + p.pendiente, 0)
          },
          porVencer: { 
            cantidad: proveedoresFiltrados.filter(p => {
              const vencimiento = new Date(p.vencimiento.split('-').reverse().join('-'));
              const en7Dias = new Date();
              en7Dias.setDate(en7Dias.getDate() + 7);
              return vencimiento >= new Date() && vencimiento <= en7Dias && p.pendiente > 0;
            }).length, 
            monto: proveedoresFiltrados
              .filter(p => {
                const vencimiento = new Date(p.vencimiento.split('-').reverse().join('-'));
                const en7Dias = new Date();
                en7Dias.setDate(en7Dias.getDate() + 7);
                return vencimiento >= new Date() && vencimiento <= en7Dias && p.pendiente > 0;
              })
              .reduce((sum, p) => sum + p.pendiente, 0)
          },
          vigentes: { cantidad: 0, monto: 0 }
        },
        paginacion: {
          pagina: page,
          limite: limit,
          totalItems,
          totalPaginas: totalPages,
          tieneSiguiente: page < totalPages,
          tieneAnterior: page > 1
        },
        filtros: {
          fechaDesde,
          fechaHasta
        }
      };

      return {
        success: true,
        data: reporteProveedores,
        message: 'Reporte de proveedores obtenido exitosamente'
      } as T;
    }

    if (endpoint === 'reportes/clientes') {
      const reporteClientes = {
        totalFacturado: 50635161.21,
        totalCobrado: 19346253.80,
        totalPendiente: 33114908.15,
        cantidadFacturas: 124,
        porcentajeCobrado: 38.2,
        facturas: mockClientes,
        resumenPorEstado: {
          cobrado: { 
            cantidad: 75, 
            monto: 19346253.80, 
            porcentaje: 38.2 
          },
          pendiente: { 
            cantidad: 49, 
            monto: 33114908.15, 
            porcentaje: 61.8 
          }
        },
        antiguedadSaldos: {
          vencidas: { cantidad: 20, monto: 12000000 },
          porVencer: { cantidad: 29, monto: 21114908.15 },
          vigentes: { cantidad: 0, monto: 0 }
        },
        filtros: {
          fechaDesde: params?.fechaDesde as string,
          fechaHasta: params?.fechaHasta as string
        }
      };

      return {
        success: true,
        data: reporteClientes,
        message: 'Reporte de clientes obtenido exitosamente'
      } as T;
    }

    // Para otros reportes, retornamos datos vacíos
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