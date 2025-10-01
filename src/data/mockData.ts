import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

// Datos EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockClientes: Cliente[] = [
  // Clientes con Saldos Significativos (según Excel)
  {
    id: '1',
    nombre: 'ACOPIADORES DE SEBO S.A.',
    email: 'acopiadores@email.com',
    telefono: '+54 11 3456-7890',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-34567890-1',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-34567890-1'
  },
  {
    id: '2',
    nombre: 'AMPLAN SRL',
    email: 'amplan@email.com',
    telefono: '+54 11 7890-1234',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-78901234-5',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-78901234-5'
  },
  {
    id: '3',
    nombre: 'ALTRADE S.R.L.',
    email: 'altrade@email.com',
    telefono: '+54 11 6789-0123',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-67890123-4',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-67890123-4'
  },
  {
    id: '4',
    nombre: 'ASOCIACION CIVIL CIRCULO DE DIRECTIVOS DE COMUNICACION CIRCULO DIRCOMS',
    email: 'dircoms@email.com',
    telefono: '+54 11 9012-3456',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-90123456-7',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-90123456-7'
  },
  {
    id: '5',
    nombre: 'AEROPAL S.A.S.',
    email: 'aeropal@email.com',
    telefono: '+54 11 4567-8901',
    direccion: 'Buenos Aires, Argentina',
    cuit: '30-45678901-2',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-45678901-2'
  },
  {
    id: '6',
    nombre: 'AISA SERGIO OSCAR',
    email: 'aisa@email.com',
    telefono: '+54 11 5678-9012',
    direccion: 'Buenos Aires, Argentina',
    cuit: '20-56789012-3',
    tipoDocumento: 'CUIT',
    numeroDocumento: '20-56789012-3'
  },
  // Clientes con Saldo Cero (según Excel)
  {
    id: '7',
    nombre: 'DI ROCCO MARINA NILDA',
    email: 'dirocco@email.com',
    telefono: '+54 11 1234-5678',
    direccion: 'Buenos Aires, Argentina',
    cuit: '27-12345678-9',
    tipoDocumento: 'CUIT',
    numeroDocumento: '27-12345678-9'
  },
  {
    id: '8',
    nombre: 'AB 25 DE MAYO 1130 S. A.',
    email: 'ab25mayo@email.com',
    telefono: '+54 11 2345-6789',
    direccion: 'Av. 25 de Mayo 1130, CABA',
    cuit: '30-23456789-0',
    tipoDocumento: 'CUIT',
    numeroDocumento: '30-23456789-0'
  },
  {
    id: '9',
    nombre: 'ASIM GONZALO',
    email: 'asim@email.com',
    telefono: '+54 11 8901-2345',
    direccion: 'Buenos Aires, Argentina',
    cuit: '20-89012345-6',
    tipoDocumento: 'CUIT',
    numeroDocumento: '20-89012345-6'
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

// Mapeo de nombres de clientes a IDs (EXACTOS del Excel)
const clienteMap: { [key: string]: string } = {
  'ACOPIADORES DE SEBO S.A.': '1',
  'AMPLAN SRL': '2',
  'ALTRADE S.R.L.': '3',
  'ASOCIACION CIVIL CIRCULO DE DIRECTIVOS DE COMUNICACION CIRCULO DIRCOMS': '4',
  'AEROPAL S.A.S.': '5',
  'AISA SERGIO OSCAR': '6',
  'DI ROCCO MARINA NILDA': '7',
  'AB 25 DE MAYO 1130 S. A.': '8',
  'ASIM GONZALO': '9',
  'AXAL S.A.': '10'
};

// Proveedores EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
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

// Movimientos EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockMovimientos: MovimientoCaja[] = [
  // Ingresos Cobrados (según Excel)
  {
    id: '1',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Venta de productos - ACOPIADORES DE SEBO S.A.',
    monto: 2816408.10,
    clienteId: '1',
    cliente: mockClientes[0],
    metodoPago: 'transferencia',
    observaciones: 'Pago por transferencia bancaria',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T10:30:00Z',
    updatedAt: '2025-08-15T10:30:00Z'
  },
  {
    id: '2',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Servicios de consultoría - AMPLAN SRL',
    monto: 1875185.40,
    clienteId: '2',
    cliente: mockClientes[1],
    metodoPago: 'transferencia',
    observaciones: 'Pago por transferencia bancaria',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T11:15:00Z',
    updatedAt: '2025-08-15T11:15:00Z'
  },
  {
    id: '3',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Venta de productos - ALTRADE S.R.L.',
    monto: 532484.70,
    clienteId: '3',
    cliente: mockClientes[2],
    metodoPago: 'tarjeta',
    observaciones: 'Pago con tarjeta de crédito',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T14:20:00Z',
    updatedAt: '2025-08-15T14:20:00Z'
  },
  {
    id: '4',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Servicios prestados - ASOCIACION CIVIL CIRCULO DE DIRECTIVOS DE COMUNICACION CIRCULO DIRCOMS',
    monto: 144310.00,
    clienteId: '4',
    cliente: mockClientes[3],
    metodoPago: 'efectivo',
    observaciones: 'Pago en efectivo',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T16:45:00Z',
    updatedAt: '2025-08-15T16:45:00Z'
  },
  {
    id: '5',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Servicios prestados - AEROPAL S.A.S.',
    monto: 54630.00,
    clienteId: '5',
    cliente: mockClientes[4],
    metodoPago: 'efectivo',
    observaciones: 'Pago en efectivo',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T17:30:00Z',
    updatedAt: '2025-08-15T17:30:00Z'
  },
  {
    id: '6',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Venta de mercadería - AISA SERGIO OSCAR',
    monto: 24270.00,
    clienteId: '6',
    cliente: mockClientes[5],
    metodoPago: 'cheque',
    observaciones: 'Cheque a 30 días',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T18:00:00Z',
    updatedAt: '2025-08-15T18:00:00Z'
  },

  // Ingresos Pendientes (según Excel)
  {
    id: '7',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Servicios pendientes - DI ROCCO MARINA NILDA',
    monto: 25000.00,
    clienteId: '7',
    cliente: mockClientes[6],
    metodoPago: 'pendiente',
    observaciones: 'Pago pendiente de confirmación',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T19:00:00Z',
    updatedAt: '2025-08-15T19:00:00Z'
  },
  {
    id: '8',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Venta pendiente - AB 25 DE MAYO 1130 S. A.',
    monto: 15000.00,
    clienteId: '8',
    cliente: mockClientes[7],
    metodoPago: 'pendiente',
    observaciones: 'Pago pendiente de confirmación',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T19:30:00Z',
    updatedAt: '2025-08-15T19:30:00Z'
  },

  // Egresos Pagados (según Excel)
  {
    id: '9',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pago a AFIP - Impuestos',
    monto: 0.00,
    proveedorId: '1',
    proveedor: mockProveedores[0],
    metodoPago: 'transferencia',
    observaciones: 'Pago de impuestos AFIP',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T08:30:00Z',
    updatedAt: '2025-08-15T08:30:00Z'
  },
  {
    id: '10',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pago a AMEX RIO - Comisiones',
    monto: 864774.90,
    proveedorId: '3',
    proveedor: mockProveedores[2],
    metodoPago: 'transferencia',
    observaciones: 'Pago de comisiones tarjeta',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T12:00:00Z',
    updatedAt: '2025-08-15T12:00:00Z'
  },
  {
    id: '11',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pago a AMJ - Servicios',
    monto: 990000.00,
    proveedorId: '5',
    proveedor: mockProveedores[4],
    metodoPago: 'cheque',
    observaciones: 'Cheque a 15 días',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T15:30:00Z',
    updatedAt: '2025-08-15T15:30:00Z'
  },

  // Egresos Pendientes (según Excel)
  {
    id: '12',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'ARBA - Impuestos pendientes',
    monto: 50000.00,
    proveedorId: '2',
    proveedor: mockProveedores[1],
    metodoPago: 'pendiente',
    observaciones: 'Impuestos ARBA pendientes de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T17:00:00Z',
    updatedAt: '2025-08-15T17:00:00Z'
  },
  {
    id: '13',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'MASTER CIUDAD - Comisiones pendientes',
    monto: 25000.00,
    proveedorId: '4',
    proveedor: mockProveedores[3],
    metodoPago: 'pendiente',
    observaciones: 'Comisiones pendientes de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T18:15:00Z',
    updatedAt: '2025-08-15T18:15:00Z'
  }
];

// Cuentas bancarias EXACTAS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockCuentasBancarias = [
  { nombre: 'EFECTIVO', saldo: 468910.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'CIUDAD', saldo: 77482.00, pendienteAcreditacion: 150000.00, dolares: 0 },
  { nombre: 'CREDICOOP', saldo: 324000.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'CREDICOOP MATIAS', saldo: 240000.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'FRANCES VALENTINA', saldo: 0.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'FRANCES SIL', saldo: 0.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'FRANCES EDUARDO', saldo: 6673.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'BCO RIO SIL', saldo: -600000.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'BCO PCIA EDU', saldo: 2378900.00, pendienteAcreditacion: 0, dolares: 0 }
];

// Saldos consolidados EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockSaldosConsolidados = {
  delDia: {
    disponibilidades: 3645965.00,
    chequesEnCartera: 3659126.21,
    aCobrarCorrientes: 33114908.15,
    aPagarProveedores: 32098070.93,
    aPagarTarjetas: 20589291.32,
    incrementoTarjetas: 0,
    incrementoProveedores: 0,
    saldo: 12267362.89
  },
  diaAnterior: {
    disponibilidades: 3576405.40,
    chequesEnCartera: 3659126.21,
    aCobrarCorrientes: 34267073.05,
    aPagarProveedores: 32098070.93,
    aPagarTarjetas: 20589291.32,
    incrementoTarjetas: 0,
    incrementoProveedores: 0,
    saldo: 11184757.59
  },
  diferencia: 1082605.30
};

// Cash Flow EXACTO del Excel
export const mockCashFlow = {
  reduccionDisponibilidades: 69559.60,
  reduccionCheques: 0,
  cobranzas: 1152164.90,
  pagosProveedores: 0,
  cancelacionTarjetas: 0,
  cancelacionPlanes: 0,
  total: 1082605.30
};

// Ajustes EXACTOS del Excel
export const mockAjustes = {
  ajusteCobranzas: 125225.10,
  ajustePagos: 0,
  diferencia: 1207830.40
};

// Tarjetas EXACTAS del Excel
export const mockTarjetas = [
  { tarjeta: 'AMEX RIO', titular: 'MARY', importe: 0 },
  { tarjeta: 'MASTER CIUDAD', titular: 'SIL', importe: 0 },
  { tarjeta: 'MASTER PCIA', titular: 'EDU', importe: 0 },
  { tarjeta: 'VISA PCIA', titular: 'EDU', importe: 0 },
  { tarjeta: 'VISA COMAFI', titular: 'SIL', importe: 0 },
  { tarjeta: 'VISA RIO SIL', titular: 'sil', importe: 0 },
  { tarjeta: 'AMEX RIO SIL', titular: 'SIL', importe: 0 },
  { tarjeta: 'VISA ICBC', titular: 'SIL', importe: 0 },
  { tarjeta: 'MASTER ICBC', titular: 'SIL', importe: 0 },
  { tarjeta: 'VISA GALICIA', titular: 'EDU', importe: 0 },
  { tarjeta: 'MASTER GALICIA', titular: 'EDU', importe: 0 },
  { tarjeta: 'CABAL CREDICOOP', titular: 'SIL', importe: 0 },
  { tarjeta: 'VISA CREDICOOP', titular: 'SIL', importe: 0 },
  { tarjeta: 'VISA FRANCES', titular: 'EDUARDO', importe: 0 },
  { tarjeta: 'MASTER FRANCES', titular: 'EDUARDO', importe: 0 },
  { tarjeta: 'VISA FRANCES', titular: 'SIL', importe: 0 },
  { tarjeta: 'MASTER FRANCES', titular: 'SIL', importe: 0 },
  { tarjeta: 'CENCOSUD', titular: 'SIL', importe: 0 },
  { tarjeta: 'CENCOSUD', titular: 'EDUARDO', importe: 0 },
  { tarjeta: 'VISA FRANCES', titular: 'VALENTINA', importe: 0 }
];

// Cobranzas con diferencias EXACTAS del Excel
export const mockCobranzasDiferencias = {
  cliente: 'AMJ',
  registrado: 864774.90,
  cobrado: 990000.00,
  diferencia: 125225.10
};

// Pagos a proveedores mediante planes EXACTOS del Excel
export const mockPagosProveedoresPlanes = [
  { proveedor: 'AFIP', importeCancelado: 0.00 },
  { proveedor: 'ARBA', importeCancelado: 0 },
  { proveedor: 'Sindicatos', importeCancelado: 0 }
];

// Resúmenes EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockResumenes: { [fecha: string]: ResumenCaja } = {
  '2025-10-01': {
    fecha: '2025-10-01',
    saldoInicial: 3645965.00, // Disponibilidades del día
    totalIngresos: 1152164.90, // Cobranzas del cash flow
    totalEgresos: 0, // Sin pagos registrados
    saldoFinal: 4798129.90, // Saldo inicial + ingresos - egresos
    movimientos: mockMovimientos.filter(m => m.fecha === '2025-08-15'),
    cantidadMovimientos: mockMovimientos.filter(m => m.fecha === '2025-08-15').length
  }
};

// Resumen por defecto (datos del Excel)
export const mockResumen: ResumenCaja = mockResumenes['2025-10-01'];

// Datos EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const datosPorMes = {
  '2025-10': {
    mes: '2025-10',
    mesNombre: 'Octubre 2025',
    fechas: ['2025-10-01'],
    totalIngresos: 1152164.90, // Cobranzas del cash flow
    totalEgresos: 0, // Sin pagos registrados
    totalMovimientos: 13, // 8 ingresos + 5 egresos del Excel
    resumenes: mockResumenes,
    cuentasBancarias: mockCuentasBancarias,
    saldosConsolidados: mockSaldosConsolidados,
    cashFlow: mockCashFlow,
    ajustes: mockAjustes,
    tarjetas: mockTarjetas,
    cobranzasDiferencias: mockCobranzasDiferencias,
    pagosProveedoresPlanes: mockPagosProveedoresPlanes
  }
};

// Lista de meses disponibles (datos del Excel)
export const mesesDisponibles = [
  { value: '2025-10', label: 'Octubre 2025' }
];

// Función para filtrar movimientos
export const filterMovimientos = (movimientos: MovimientoCaja[], filtros: any) => {
  return movimientos.filter(movimiento => {
    if (filtros.fechaDesde && movimiento.fecha < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && movimiento.fecha > filtros.fechaHasta) return false;
    if (filtros.tipo && movimiento.tipo !== filtros.tipo) return false;
    if (filtros.clienteId && movimiento.clienteId !== filtros.clienteId) return false;
    if (filtros.proveedorId && movimiento.proveedorId !== filtros.proveedorId) return false;
    if (filtros.metodoPago && movimiento.metodoPago !== filtros.metodoPago) return false;
    if (filtros.mes && !movimiento.fecha.startsWith(filtros.mes)) return false;
    return true;
  });
};

// Función para obtener movimientos por mes
export const getMovimientosPorMes = (mes: string) => {
  return mockMovimientos.filter(movimiento => movimiento.fecha.startsWith(mes));
};

// Función para obtener resumen por mes
export const getResumenPorMes = (mes: string) => {
  const movimientosDelMes = getMovimientosPorMes(mes);
  const totalIngresos = movimientosDelMes.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = movimientosDelMes.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0);
  
  return {
    mes,
    totalIngresos,
    totalEgresos,
    totalMovimientos: movimientosDelMes.length,
    movimientos: movimientosDelMes
  };
};

// Función para obtener resumen por fecha
export const getResumenPorFecha = (fecha: string) => {
  return mockResumenes[fecha] || null;
};

// Función para obtener cuentas bancarias
export const getCuentasBancarias = () => {
  return mockCuentasBancarias;
};

// Función para obtener total de disponibilidad
export const getTotalDisponibilidad = () => {
  const totalSaldo = mockCuentasBancarias.reduce((sum, cuenta) => sum + cuenta.saldo, 0);
  const totalPendiente = mockCuentasBancarias.reduce((sum, cuenta) => sum + cuenta.pendienteAcreditacion, 0);
  return {
    totalSaldo,
    totalPendiente,
    totalGeneral: totalSaldo + totalPendiente
  };
};

// Función para obtener saldos consolidados
export const getSaldosConsolidados = () => {
  return mockSaldosConsolidados;
};

// Función para obtener cash flow
export const getCashFlow = () => {
  return mockCashFlow;
};

// Función para obtener ajustes
export const getAjustes = () => {
  return mockAjustes;
};

// Función para obtener tarjetas
export const getTarjetas = () => {
  return mockTarjetas;
};

// Función para obtener cobranzas con diferencias
export const getCobranzasDiferencias = () => {
  return mockCobranzasDiferencias;
};

// Función para obtener pagos a proveedores mediante planes
export const getPagosProveedoresPlanes = () => {
  return mockPagosProveedoresPlanes;
};

// Función para simular delay de API
export const simulateApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
