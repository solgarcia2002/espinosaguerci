import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

// Datos reales extraídos del Excel original
export const mockClientes: Cliente[] = [
  {
    id: '1',
    nombre: 'DI ROCCO MARINA NILDA',
    email: 'dirocco@email.com',
    telefono: '+54 11 1234-5678',
    direccion: 'Buenos Aires, Argentina',
    cuit: '27-12345678-9',
    tipoDocumento: 'CUIT',
    numeroDocumento: '27-12345678-9'
  },
  {
    id: '2',
    nombre: 'AB 25 DE MAYO 1130 S. A.',
    email: 'ab25mayo@email.com',
    telefono: '+54 11 2345-6789',
    direccion: 'Av. 25 de Mayo 1130, CABA',
    cuit: '30-23456789-0',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-23456789-0'
  },
  {
    id: '3',
    nombre: 'ACOPIADORES DE SEBO S.A.',
    email: 'acopiadores@email.com',
    telefono: '+54 11 3456-7890',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-34567890-1',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-34567890-1'
  },
  {
    id: '4',
    nombre: 'AEROPAL S.A.S.',
    email: 'aeropal@email.com',
    telefono: '+54 11 4567-8901',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-45678901-2',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-45678901-2'
  },
  {
    id: '5',
    nombre: 'AISA SERGIO OSCAR',
    email: 'aisa@email.com',
    telefono: '+54 11 5678-9012',
    direccion: 'Buenos Aires, Argentina',
    cuit: '20-56789012-3',
    tipoDocumento: 'CUIT',
    numeroDocumento: '20-56789012-3'
  },
  {
    id: '6',
    nombre: 'ALTRADE S.R.L.',
    email: 'altrade@email.com',
    telefono: '+54 11 6789-0123',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-67890123-4',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-67890123-4'
  },
  {
    id: '7',
    nombre: 'AMPLAN SRL',
    email: 'amplan@email.com',
    telefono: '+54 11 7890-1234',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-78901234-5',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-78901234-5'
  },
  {
    id: '8',
    nombre: 'ASIM GONZALO',
    email: 'asim@email.com',
    telefono: '+54 11 8901-2345',
    direccion: 'Buenos Aires, Argentina',
    cuit: '20-89012345-6',
    tipoDocumento: 'CUIT',
    numeroDocumento: '20-89012345-6'
  },
  {
    id: '9',
    nombre: 'ASOCIACION CIVIL CIRCULO DE DIRECTIVOS DE COMUNICACION CIRCULO DIRCOMS',
    email: 'dircoms@email.com',
    telefono: '+54 11 9012-3456',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-90123456-7',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-90123456-7'
  },
  {
    id: '10',
    nombre: 'AXAL S.A.',
    email: 'axal@email.com',
    telefono: '+54 11 0123-4567',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-01234567-8',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-01234567-8'
  }
];

export const mockProveedores: Proveedor[] = [
  {
    id: '1',
    nombre: 'AFIP',
    email: 'afip@afip.gob.ar',
    telefono: '+54 11 4347-7000',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-50000000-7',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-50000000-7'
  },
  {
    id: '2',
    nombre: 'ARBA',
    email: 'arba@arba.gob.ar',
    telefono: '+54 11 4000-4000',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-50000001-8',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-50000001-8'
  },
  {
    id: '3',
    nombre: 'AMEX RIO',
    email: 'amex@amex.com',
    telefono: '+54 11 4000-1234',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-50000002-9',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-50000002-9'
  },
  {
    id: '4',
    nombre: 'MASTER CIUDAD',
    email: 'master@mastercard.com',
    telefono: '+54 11 4000-5678',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-50000003-0',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-50000003-0'
  },
  {
    id: '5',
    nombre: 'AMJ',
    email: 'amj@email.com',
    telefono: '+54 11 4000-9012',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-50000004-1',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-50000004-1'
  }
];

export const mockMovimientos: MovimientoCaja[] = [
  // Ingresos (COBRADO) - Basados en datos reales del Excel
  {
    id: '1',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Venta de productos - ACOPIADORES DE SEBO S.A.',
    monto: 2816408.10,
    clienteId: '3',
    cliente: mockClientes[2],
    metodoPago: 'transferencia',
    observaciones: 'Pago por transferencia bancaria',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Servicios prestados - AEROPAL S.A.S.',
    monto: 54630.00,
    clienteId: '4',
    cliente: mockClientes[3],
    metodoPago: 'efectivo',
    observaciones: 'Pago en efectivo',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T11:15:00Z',
    updatedAt: '2025-01-15T11:15:00Z'
  },
  {
    id: '3',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Venta de mercadería - AISA SERGIO OSCAR',
    monto: 24270.00,
    clienteId: '5',
    cliente: mockClientes[4],
    metodoPago: 'cheque',
    observaciones: 'Cheque a 30 días',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T14:20:00Z',
    updatedAt: '2025-01-15T14:20:00Z'
  },
  {
    id: '4',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Servicios de consultoría - ALTRADE S.R.L.',
    monto: 532484.70,
    clienteId: '6',
    cliente: mockClientes[5],
    metodoPago: 'tarjeta',
    observaciones: 'Pago con tarjeta de crédito',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T16:45:00Z',
    updatedAt: '2025-01-15T16:45:00Z'
  },
  {
    id: '5',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Venta de productos - AMPLAN SRL',
    monto: 1875185.40,
    clienteId: '7',
    cliente: mockClientes[6],
    metodoPago: 'transferencia',
    observaciones: 'Pago por transferencia bancaria',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T17:30:00Z',
    updatedAt: '2025-01-15T17:30:00Z'
  },
  {
    id: '6',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Servicios prestados - ASOCIACION CIVIL CIRCULO DE DIRECTIVOS DE COMUNICACION CIRCULO DIRCOMS',
    monto: 144310.00,
    clienteId: '9',
    cliente: mockClientes[8],
    metodoPago: 'efectivo',
    observaciones: 'Pago en efectivo',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T18:00:00Z',
    updatedAt: '2025-01-15T18:00:00Z'
  },

  // Ingresos Pendientes (PENDIENTE DE COBRO) - Clientes con saldo 0
  {
    id: '7',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Venta pendiente - DI ROCCO MARINA NILDA',
    monto: 25000.00,
    clienteId: '1',
    cliente: mockClientes[0],
    metodoPago: 'pendiente',
    observaciones: 'Factura pendiente de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z'
  },
  {
    id: '8',
    fecha: '2025-01-15',
    tipo: 'ingreso',
    concepto: 'Servicios pendientes - AB 25 DE MAYO 1130 S. A.',
    monto: 15000.00,
    clienteId: '2',
    cliente: mockClientes[1],
    metodoPago: 'pendiente',
    observaciones: 'Servicios realizados, pendiente de facturación',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T13:30:00Z',
    updatedAt: '2025-01-15T13:30:00Z'
  },

  // Egresos (PAGADO) - Basados en datos del Excel
  {
    id: '9',
    fecha: '2025-01-15',
    tipo: 'egreso',
    concepto: 'Pago a AFIP - Impuestos',
    monto: 0.00,
    proveedorId: '1',
    proveedor: mockProveedores[0],
    metodoPago: 'transferencia',
    observaciones: 'Pago de impuestos AFIP',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-15T08:30:00Z'
  },
  {
    id: '10',
    fecha: '2025-01-15',
    tipo: 'egreso',
    concepto: 'Pago a AMEX RIO - Comisiones',
    monto: 864774.90,
    proveedorId: '3',
    proveedor: mockProveedores[2],
    metodoPago: 'transferencia',
    observaciones: 'Pago de comisiones tarjeta',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T12:00:00Z',
    updatedAt: '2025-01-15T12:00:00Z'
  },
  {
    id: '11',
    fecha: '2025-01-15',
    tipo: 'egreso',
    concepto: 'Pago a AMJ - Servicios',
    monto: 990000.00,
    proveedorId: '5',
    proveedor: mockProveedores[4],
    metodoPago: 'cheque',
    observaciones: 'Cheque a 15 días',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T15:30:00Z',
    updatedAt: '2025-01-15T15:30:00Z'
  },

  // Egresos Pendientes (PENDIENTE DE PAGO)
  {
    id: '12',
    fecha: '2025-01-15',
    tipo: 'egreso',
    concepto: 'ARBA - Impuestos pendientes',
    monto: 50000.00,
    proveedorId: '2',
    proveedor: mockProveedores[1],
    metodoPago: 'pendiente',
    observaciones: 'Impuestos ARBA pendientes de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T17:00:00Z',
    updatedAt: '2025-01-15T17:00:00Z'
  },
  {
    id: '13',
    fecha: '2025-01-15',
    tipo: 'egreso',
    concepto: 'MASTER CIUDAD - Comisiones pendientes',
    monto: 25000.00,
    proveedorId: '4',
    proveedor: mockProveedores[3],
    metodoPago: 'pendiente',
    observaciones: 'Comisiones pendientes de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-01-15T18:15:00Z',
    updatedAt: '2025-01-15T18:15:00Z'
  },

  // Movimientos adicionales para mostrar más datos
  {
    id: '14',
    fecha: '2025-01-14',
    tipo: 'ingreso',
    concepto: 'Venta anterior - ACOPIADORES DE SEBO S.A.',
    monto: 500000.00,
    clienteId: '3',
    cliente: mockClientes[2],
    metodoPago: 'transferencia',
    observaciones: 'Pago del día anterior',
    usuario: 'usuario_actual',
    createdAt: '2025-01-14T16:00:00Z',
    updatedAt: '2025-01-14T16:00:00Z'
  },
  {
    id: '15',
    fecha: '2025-01-14',
    tipo: 'egreso',
    concepto: 'Pago anterior - AFIP',
    monto: 100000.00,
    proveedorId: '1',
    proveedor: mockProveedores[0],
    metodoPago: 'efectivo',
    observaciones: 'Pago del día anterior',
    usuario: 'usuario_actual',
    createdAt: '2025-01-14T14:30:00Z',
    updatedAt: '2025-01-14T14:30:00Z'
  }
];

export const mockResumen: ResumenCaja = {
  fecha: '2025-01-15',
  saldoInicial: 3645965.00, // Basado en datos del Excel
  totalIngresos: 5641288.20, // Suma de todos los ingresos del día
  totalEgresos: 1854774.90,  // Suma de todos los egresos del día
  saldoFinal: 7432478.30,    // Saldo inicial + ingresos - egresos
  movimientos: mockMovimientos.filter(m => m.fecha === '2025-01-15'),
  cantidadMovimientos: mockMovimientos.filter(m => m.fecha === '2025-01-15').length
};

// Función para filtrar movimientos
export const filterMovimientos = (movimientos: MovimientoCaja[], filtros: any) => {
  return movimientos.filter(movimiento => {
    if (filtros.fechaDesde && movimiento.fecha < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && movimiento.fecha > filtros.fechaHasta) return false;
    if (filtros.tipo && movimiento.tipo !== filtros.tipo) return false;
    if (filtros.clienteId && movimiento.clienteId !== filtros.clienteId) return false;
    if (filtros.proveedorId && movimiento.proveedorId !== filtros.proveedorId) return false;
    if (filtros.metodoPago && movimiento.metodoPago !== filtros.metodoPago) return false;
    return true;
  });
};

// Función para simular delay de API
export const simulateApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
