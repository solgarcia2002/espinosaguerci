import { MovimientoCaja, ResumenCaja, Cliente, Proveedor } from '@/types/cajaDiaria';

// Clientes EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockClientes: Cliente[] = [
  {
    id: '1',
    cliente: 'DI ROCCO MARINA NILDA',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0001-00004223',
    vencimiento: '08-08-2025',
    total: 28240.00,
    cobrado: 28240.00,
    pendiente: 0.00
  },
  {
    id: '2',
    cliente: 'A M J   S A',
    tipo: 'FAV-A',
    fecha: '01-08-2025',
    referencia: '0007-00000407',
    vencimiento: '15-08-2025',
    total: 864774.90,
    cobrado: 990000.00,
    pendiente: 0.00
  },
  {
    id: '3',
    cliente: 'AB 25 DE MAYO 1130 S. A.',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0006-00001155',
    vencimiento: '08-08-2025',
    total: 786560.50,
    cobrado: 786560.50,
    pendiente: 0.00
  },
  {
    id: '4',
    cliente: 'ACOPIADORES DE SEBO S.A.',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0005-00000359',
    vencimiento: '15-08-2025',
    total: 2816408.10,
    cobrado: 0.00,
    pendiente: 2816408.10
  },
  {
    id: '5',
    cliente: 'AEROPAL S.A.S.',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0001-00004224',
    vencimiento: '22-08-2025',
    total: 54630.00,
    cobrado: 0.00,
    pendiente: 54630.00
  },
  {
    id: '6',
    cliente: 'AISA SERGIO OSCAR',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0001-00004221',
    vencimiento: '29-08-2025',
    total: 24270.00,
    cobrado: 0.00,
    pendiente: 24270.00
  },
  {
    id: '7',
    cliente: 'ALFARO PEDRO GERARDO',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0001-00004226',
    vencimiento: '15-08-2025',
    total: 183859.50,
    cobrado: 0.00,
    pendiente: 183859.50
  },
  {
    id: '8',
    cliente: 'ALIBABA SRL',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0001-00004222',
    vencimiento: '08-08-2025',
    total: 1335000.00,
    cobrado: 1335000.00,
    pendiente: 0.00
  },
  {
    id: '9',
    cliente: 'ALTRADE S.R.L.',
    tipo: 'FAV-X',
    fecha: '01-08-2025',
    referencia: '0006-00001156',
    vencimiento: '08-08-2025',
    total: 532484.70,
    cobrado: 0.00,
    pendiente: 532484.70
  },
  {
    id: '10',
    cliente: 'AMPLAN SRL',
    tipo: 'FAV-A',
    fecha: '01-08-2025',
    referencia: '0007-00000406',
    vencimiento: '22-08-2025',
    total: 1875185.40,
    cobrado: 0.00,
    pendiente: 1875185.40
  }
];

// Mapeo de nombres de clientes a IDs (EXACTOS del Excel)
export const clienteMap: { [key: string]: string } = {
  'DI ROCCO MARINA NILDA': '1',
  'A M J   S A': '2',
  'AB 25 DE MAYO 1130 S. A.': '3',
  'ACOPIADORES DE SEBO S.A.': '4',
  'AEROPAL S.A.S.': '5',
  'AISA SERGIO OSCAR': '6',
  'ALFARO PEDRO GERARDO': '7',
  'ALIBABA SRL': '8',
  'ALTRADE S.R.L.': '9',
  'AMPLAN SRL': '10'
};

// Proveedores EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockProveedores: Proveedor[] = [
  {
    id: '1',
    proveedor: 'ANTICIPOS GANANCIAS SILVINA',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000462',
    vencimiento: '15-08-2025',
    total: 50000.00,
    pagado: 0.00,
    pendiente: 50000.00
  },
  {
    id: '2',
    proveedor: 'BANCO CIUDAD - PRESTAMO',
    tipo: 'FAC-X',
    fecha: '01-08-2025',
    referencia: '41654-00000460',
    vencimiento: '15-08-2025',
    total: 150000.00,
    pagado: 150000.00,
    pendiente: 0.00
  },
  {
    id: '3',
    proveedor: 'CABLEVISION - FIBERTEL',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000465',
    vencimiento: '22-08-2025',
    total: 25000.00,
    pagado: 0.00,
    pendiente: 25000.00
  },
  {
    id: '4',
    proveedor: 'CLARO',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000466',
    vencimiento: '22-08-2025',
    total: 15000.00,
    pagado: 0.00,
    pendiente: 15000.00
  },
  {
    id: '5',
    proveedor: 'COMIDA CANDELARIA',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000467',
    vencimiento: '15-08-2025',
    total: 30000.00,
    pagado: 30000.00,
    pendiente: 0.00
  },
  {
    id: '6',
    proveedor: 'DISTRIBUIDORA Y COMERCIALIZADORA NORTE SOCIEDAD ANONIMA',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000468',
    vencimiento: '29-08-2025',
    total: 75000.00,
    pagado: 0.00,
    pendiente: 75000.00
  },
  {
    id: '7',
    proveedor: 'MAXI SISTEMAS',
    tipo: 'FAC-X',
    fecha: '01-08-2025',
    referencia: '00009-00000469',
    vencimiento: '15-08-2025',
    total: 45000.00,
    pagado: 45000.00,
    pendiente: 0.00
  },
  {
    id: '8',
    proveedor: 'MONOTRIBUTO ALE',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000470',
    vencimiento: '22-08-2025',
    total: 12000.00,
    pagado: 0.00,
    pendiente: 12000.00
  },
  {
    id: '9',
    proveedor: 'MOVISTAR',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000471',
    vencimiento: '22-08-2025',
    total: 18000.00,
    pagado: 0.00,
    pendiente: 18000.00
  },
  {
    id: '10',
    proveedor: 'NATURGY',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000472',
    vencimiento: '29-08-2025',
    total: 35000.00,
    pagado: 0.00,
    pendiente: 35000.00
  },
  {
    id: '11',
    proveedor: 'PLANES AFIP EDUARDO Q167723',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000473',
    vencimiento: '15-08-2025',
    total: 200000.00,
    pagado: 0.00,
    pendiente: 200000.00
  },
  {
    id: '12',
    proveedor: 'PLANES AFIP EYS NUEVA 774008',
    tipo: 'FAC-X',
    fecha: '01-08-2025',
    referencia: '00009-00000474',
    vencimiento: '15-08-2025',
    total: 300000.00,
    pagado: 300000.00,
    pendiente: 0.00
  },
  {
    id: '13',
    proveedor: 'PLANES AFIP SILVINA 246086',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000475',
    vencimiento: '22-08-2025',
    total: 150000.00,
    pagado: 0.00,
    pendiente: 150000.00
  },
  {
    id: '14',
    proveedor: 'PROSEGUR ACTIVA ARGENTINA SA',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000476',
    vencimiento: '29-08-2025',
    total: 40000.00,
    pagado: 0.00,
    pendiente: 40000.00
  },
  {
    id: '15',
    proveedor: 'SUELDOS',
    tipo: 'FAC-X',
    fecha: '01-08-2025',
    referencia: '00009-00000477',
    vencimiento: '15-08-2025',
    total: 500000.00,
    pagado: 500000.00,
    pendiente: 0.00
  },
  {
    id: '16',
    proveedor: 'TELECOM ARGENTINA SOCIEDAD ANONIMA',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000478',
    vencimiento: '22-08-2025',
    total: 22000.00,
    pagado: 0.00,
    pendiente: 22000.00
  },
  {
    id: '17',
    proveedor: 'TOYOTA PLAN ARGENTINA S.A. DE AHORRO PARA FINES DETERMINADOS',
    tipo: 'FAC-C',
    fecha: '01-08-2025',
    referencia: '00009-00000479',
    vencimiento: '29-08-2025',
    total: 80000.00,
    pagado: 0.00,
    pendiente: 80000.00
  },
  {
    id: '18',
    proveedor: 'APORTES Y CONTRIBUCIONES SUSS (EDUARDO)',
    tipo: 'FAC-X',
    fecha: '01-08-2025',
    referencia: '00009-00000480',
    vencimiento: '15-08-2025',
    total: 1366115.61,
    pagado: 0.00,
    pendiente: 1366115.61
  },
  {
    id: '19',
    proveedor: 'APORTES Y CONTRIBUCIONES SUSS (EYS)',
    tipo: 'FAC-A',
    fecha: '01-08-2025',
    referencia: '00009-00000481',
    vencimiento: '22-08-2025',
    total: 1560000.00,
    pagado: 0.00,
    pendiente: 1560000.00
  }
];

// Movimientos EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockMovimientos: MovimientoCaja[] = [
  // Ingresos Cobrados (según Excel)
  {
    id: '1',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Cobro de DI ROCCO MARINA NILDA',
    monto: 28240.00,
    clienteId: '1',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '1'),
    proveedor: undefined,
    metodoPago: 'transferencia',
    observaciones: 'Cobro completo realizado',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T10:30:00Z',
    updatedAt: '2025-08-15T10:30:00Z'
  },
  {
    id: '2',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Cobro de A M J S A',
    monto: 990000.00,
    clienteId: '2',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '2'),
    proveedor: undefined,
    metodoPago: 'transferencia',
    observaciones: 'Cobro con diferencia positiva',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T11:15:00Z',
    updatedAt: '2025-08-15T11:15:00Z'
  },
  {
    id: '3',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Cobro de AB 25 DE MAYO 1130 S. A.',
    monto: 786560.50,
    clienteId: '3',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '3'),
    proveedor: undefined,
    metodoPago: 'transferencia',
    observaciones: 'Cobro exacto del monto',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T12:00:00Z',
    updatedAt: '2025-08-15T12:00:00Z'
  },
  {
    id: '4',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Cobro de ALIBABA SRL',
    monto: 1335000.00,
    clienteId: '8',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '8'),
    proveedor: undefined,
    metodoPago: 'transferencia',
    observaciones: 'Cobro completo realizado',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T13:30:00Z',
    updatedAt: '2025-08-15T13:30:00Z'
  },
  {
    id: '5',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Cobro de ASIM GONZALO',
    monto: 88063.80,
    clienteId: '9',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '9'),
    proveedor: undefined,
    metodoPago: 'transferencia',
    observaciones: 'Cobro exacto del monto',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T14:15:00Z',
    updatedAt: '2025-08-15T14:15:00Z'
  },
  {
    id: '6',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Cobro de AXAL S.A.',
    monto: 467991.70,
    clienteId: '10',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '10'),
    proveedor: undefined,
    metodoPago: 'transferencia',
    observaciones: 'Cobro exacto del monto',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T15:00:00Z',
    updatedAt: '2025-08-15T15:00:00Z'
  },
  // Ingresos Pendientes (según Excel)
  {
    id: '7',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Pendiente ACOPIADORES DE SEBO S.A.',
    monto: 2816408.10,
    clienteId: '4',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '4'),
    proveedor: undefined,
    metodoPago: 'pendiente',
    observaciones: 'Pendiente de cobro',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T16:00:00Z',
    updatedAt: '2025-08-15T16:00:00Z'
  },
  {
    id: '8',
    fecha: '2025-08-15',
    tipo: 'ingreso',
    concepto: 'Pendiente AMPLAN SRL',
    monto: 1875185.40,
    clienteId: '10',
    proveedorId: undefined,
    cliente: mockClientes.find(c => c.id === '10'),
    proveedor: undefined,
    metodoPago: 'pendiente',
    observaciones: 'Pendiente de cobro',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T16:30:00Z',
    updatedAt: '2025-08-15T16:30:00Z'
  },
  // Egresos Pagados (según Excel)
  {
    id: '9',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pago BANCO CIUDAD - PRESTAMO',
    monto: 150000.00,
    clienteId: undefined,
    proveedorId: '2',
    cliente: undefined,
    proveedor: mockProveedores.find(p => p.id === '2'),
    metodoPago: 'transferencia',
    observaciones: 'Pago de préstamo bancario',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-08-15T09:00:00Z'
  },
  {
    id: '10',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pago COMIDA CANDELARIA',
    monto: 30000.00,
    clienteId: undefined,
    proveedorId: '5',
    cliente: undefined,
    proveedor: mockProveedores.find(p => p.id === '5'),
    metodoPago: 'efectivo',
    observaciones: 'Pago de servicios de comida',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T09:30:00Z',
    updatedAt: '2025-08-15T09:30:00Z'
  },
  {
    id: '11',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pago MAXI SISTEMAS',
    monto: 45000.00,
    clienteId: undefined,
    proveedorId: '7',
    cliente: undefined,
    proveedor: mockProveedores.find(p => p.id === '7'),
    metodoPago: 'transferencia',
    observaciones: 'Pago de servicios informáticos',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T10:00:00Z',
    updatedAt: '2025-08-15T10:00:00Z'
  },
  // Egresos Pendientes (según Excel)
  {
    id: '12',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pendiente ANTICIPOS GANANCIAS SILVINA',
    monto: 50000.00,
    clienteId: undefined,
    proveedorId: '1',
    cliente: undefined,
    proveedor: mockProveedores.find(p => p.id === '1'),
    metodoPago: 'pendiente',
    observaciones: 'Pendiente de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T17:00:00Z',
    updatedAt: '2025-08-15T17:00:00Z'
  },
  {
    id: '13',
    fecha: '2025-08-15',
    tipo: 'egreso',
    concepto: 'Pendiente APORTES Y CONTRIBUCIONES SUSS (EDUARDO)',
    monto: 1366115.61,
    clienteId: undefined,
    proveedorId: '18',
    cliente: undefined,
    proveedor: mockProveedores.find(p => p.id === '18'),
    metodoPago: 'pendiente',
    observaciones: 'Pendiente de pago',
    usuario: 'usuario_actual',
    createdAt: '2025-08-15T17:30:00Z',
    updatedAt: '2025-08-15T17:30:00Z'
  }
];

// Cuentas bancarias EXACTAS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockCuentasBancarias = [
  { nombre: 'FRANCES VALENTINA', saldo: 0.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'FRANCES SIL', saldo: 0.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'FRANCES EDUARDO', saldo: 6673.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'BCO RIO SIL', saldo: -600000.00, pendienteAcreditacion: 0, dolares: 0 },
  { nombre: 'BCO PCIA EDU', saldo: 2378900.00, pendienteAcreditacion: 0, dolares: 0 }
];

// Saldos consolidados EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockSaldosConsolidados = {
  delDia: {
    disponibilidades: 1782573.00,
    cheques: 0.00,
    aCobrar: 0.00,
    aPagar: 0.00,
    total: 1782573.00
  },
  diaAnterior: {
    disponibilidades: 1782573.00,
    cheques: 0.00,
    aCobrar: 0.00,
    aPagar: 0.00,
    total: 1782573.00
  }
};

// Cash Flow EXACTO del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockCashFlow = {
  reduccionDisponibilidades: 0.00,
  cobranzas: 0.00,
  total: 0.00
};

// Ajustes EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockAjustes = {
  ajustesCobranzas: 0.00,
  totalDiferencias: 0.00
};

// Tarjetas EXACTAS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockTarjetas = [
  { tarjeta: 'VISA FRANCES', titular: 'SIL', importe: 0 },
  { tarjeta: 'MASTER FRANCES', titular: 'SIL', importe: 0 },
  { tarjeta: 'CENCOSUD', titular: 'SIL', importe: 0 },
  { tarjeta: 'CENCOSUD', titular: 'EDUARDO', importe: 0 },
  { tarjeta: 'VISA FRANCES', titular: 'VALENTINA', importe: 0 }
];

// Cobranzas con diferencias EXACTAS del Excel
export const mockCobranzasDiferencias = [
  { cliente: 'AMJ', registrado: 864774.90, cobrado: 990000.00, diferencia: 125225.10 }
];

// Pagos a proveedores mediante planes EXACTOS del Excel
export const mockPagosProveedoresPlanes = [
  { proveedor: 'AFIP', importeCancelado: 0.00 },
  { proveedor: 'ARBA', importeCancelado: 0 },
  { proveedor: 'Sindicatos', importeCancelado: 0 }
];

// Resúmenes EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const mockResumenes: { [key: string]: ResumenCaja } = {
  '2025-10-01': {
    fecha: '2025-10-01',
    saldoInicial: 1782573.00,
    totalIngresos: 0.00,
    totalEgresos: 0.00,
    saldoFinal: 1782573.00,
    movimientos: [],
    cantidadMovimientos: 0
  }
};

// Resumen por defecto (datos del Excel)
export const mockResumen: ResumenCaja = mockResumenes['2025-10-01'];

// Datos EXACTOS del Excel original CAJA DIARIA 11-08-2025.xlsx
export const datosPorMes: { [key: string]: any } = {
  '2025-10': {
    resumen: mockResumenes['2025-10-01'],
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
export const filtrarMovimientos = (movimientos: MovimientoCaja[], filtros: any) => {
  return movimientos.filter(movimiento => {
    if (filtros.fechaDesde && movimiento.fecha < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && movimiento.fecha > filtros.fechaHasta) return false;
    if (filtros.tipo && filtros.tipo !== 'todos' && movimiento.tipo !== filtros.tipo) return false;
    if (filtros.clienteId && movimiento.clienteId !== filtros.clienteId) return false;
    if (filtros.proveedorId && movimiento.proveedorId !== filtros.proveedorId) return false;
    if (filtros.metodoPago && movimiento.metodoPago !== filtros.metodoPago) return false;
    return true;
  });
};

// Funciones para obtener datos específicos
export const getCuentasBancarias = () => mockCuentasBancarias;
export const getTotalDisponibilidad = () => mockCuentasBancarias.reduce((total, cuenta) => total + cuenta.saldo, 0);
export const getSaldosConsolidados = () => mockSaldosConsolidados;
export const getCashFlow = () => mockCashFlow;
export const getAjustes = () => mockAjustes;
export const getTarjetas = () => mockTarjetas;
export const getCobranzasDiferencias = () => mockCobranzasDiferencias;
export const getPagosProveedoresPlanes = () => mockPagosProveedoresPlanes;

// Función para obtener resumen por mes
export const getResumenPorMes = (mes: string) => {
  return datosPorMes[mes] || null;
};

// Función para simular delay de API
export const simulateApiDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


// Función para obtener resumen por fecha
export const getResumenPorFecha = (fecha: string) => {
  return mockResumenes[fecha] || null;
};

// Función para filtrar movimientos (alias de filtrarMovimientos)
export const filterMovimientos = filtrarMovimientos;

// Función para obtener movimientos por mes
export const getMovimientosPorMes = (mes: string) => {
  return mockMovimientos.filter(movimiento => {
    const fechaMovimiento = new Date(movimiento.fecha);
    const mesMovimiento = `${fechaMovimiento.getFullYear()}-${String(fechaMovimiento.getMonth() + 1).padStart(2, '0')}`;
    return mesMovimiento === mes;
  });
};
