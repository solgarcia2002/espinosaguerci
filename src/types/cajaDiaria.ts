export interface Cliente {
  id: string;
  cliente: string;
  tipo: string;
  fecha: string;
  referencia: string;
  vencimiento: string;
  total: number;
  cobrado: number;
  pendiente: number;
}

export interface Proveedor {
  id: string;
  proveedor: string;
  tipo: string;
  fecha: string;
  referencia: string;
  vencimiento: string;
  total: number;
  pagado: number;
  pendiente: number;
}

export interface MovimientoCaja {
  id: string;
  fecha: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  clienteId?: string | null;
  proveedorId?: string | null;
  cliente?: Cliente;
  proveedor?: Proveedor;
  metodoPago: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta' | 'pendiente';
  estado?: string;
  numeroComprobante?: string | null;
  colppyId?: string | null;
  observaciones?: string;
  usuario: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovimientoColppyExcel {
  fecha: string;
  clienteProveedor: string;
  tipo: string;
  nro: string;
  nroCheque: string | null;
  descripcion: string;
  importeME: number;
  ingresos: number;
  egresos: number;
  saldo: number;
}

export interface ResumenCaja {
  fecha: string;
  saldoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoFinal: number;
  movimientos: MovimientoCaja[];
  cantidadMovimientos: number;
}

export interface FiltrosCaja {
  fechaDesde?: string;
  fechaHasta?: string;
  tipo?: 'ingreso' | 'egreso' | 'todos';
  clienteId?: string;
  proveedorId?: string;
  metodoPago?: string;
  mes?: string;
}

export interface ColppyCredentials {
  email: string;
  password: string;
}

export interface ColppyApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProveedorEntity {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  cuit: string | null;
  tipoDocumento: string | null;
  numeroDocumento: string | null;
  colppyId: string | null;
  saldo?: number;
  montoPagado?: number;
  montoPendiente?: number;
  cbu?: string | null;
  conceptoPreestablecido?: string | null;
  fechaVencimiento?: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProveedoresResponse {
  data: ProveedorEntity[];
  montoTotal?: number;
  pagination: PaginationInfo;
}

export interface ClienteEntity {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  cuit: string | null;
  tipoDocumento: string | null;
  numeroDocumento: string | null;
  colppyId: string | null;
  saldo?: number;
  montoCobrado?: number;
  montoPendienteCobro?: number;
  fechaVencimiento?: string | null;
}

export interface ClientesResponse {
  data: ClienteEntity[];
  montoTotal?: number;
  pagination: PaginationInfo;
}

export interface MovimientosResponse {
  data: MovimientoCaja[];
  pagination: PaginationInfo;
}

export interface ConsolidadoSaldosValues {
  disponibilidades: number;
  cheques: number;
  aCobrar: number;
  aPagar: number;
  aPagarTarjetas: number;
  incrementoTarjetas: number;
  incrementoProveedores: number;
  saldo: number;
}

export interface ConsolidadoSaldos {
  delDia: ConsolidadoSaldosValues;
  diaAnterior: ConsolidadoSaldosValues;
  diferencia: number;
}

export interface ConsolidadoCashFlow {
  reduccionDisponibilidades: number;
  reduccionCheques: number;
  cobranzas: number;
  pagosProveedores: number;
  cancelacionTarjetas: number;
  cancelacionPlanes: number;
  total: number;
}

export interface ConsolidadoAjustes {
  ajustesCobranzas: number;
  ajustesPagos: number;
  diferencia: number;
}

export interface ConsolidadoTarjeta {
  tarjeta: string;
  titular: string;
  importe: number;
}

export interface ConsolidadoCobranzasDiferencias {
  cliente: string;
  registrado: number;
  cobrado: number;
  diferencia: number;
}

export interface ConsolidadoPagoProveedoresPlan {
  proveedor: string;
  importeCancelado: number;
}

export interface ConsolidadoTotales {
  incrementoSaldoClientes?: number;
  incrementoSaldoProveedores?: number;
  incrementoSaldoTarjetas?: number;
}

export interface ConsolidadoReport {
  fecha: string;
  saldosConsolidados: ConsolidadoSaldos;
  cashFlow: ConsolidadoCashFlow;
  ajustes: ConsolidadoAjustes;
  tarjetas: ConsolidadoTarjeta[];
  cobranzasDiferencias: ConsolidadoCobranzasDiferencias[];
  pagosProveedoresPlanes: ConsolidadoPagoProveedoresPlan[];
  totales?: ConsolidadoTotales;
}

export interface TesoreriaDisponibilidadDetalle {
  nombre: string;
  saldo: number;
}

export interface TesoreriaDisponibilidadData {
  cajaEstudio: number;
  bancos: number;
  cambioMarcelo: number;
  total: number;
  detalle: TesoreriaDisponibilidadDetalle[];
}

export interface TesoreriaDisponibilidadResponse {
  success: boolean;
  message: string;
  data: TesoreriaDisponibilidadData;
  timestamp: string;
}

export interface FacturaProveedor {
  id: string;
  proveedor: string;
  razonSocial: string;
  tipo: 'FAC-C' | 'FAC-A' | 'FAC-X' | 'PAG';
  fecha: string;
  referencia: string;
  vencimiento?: string | null;
  total: number;
  totalME?: number | null;
  tipoCambio?: string | null;
  pagado: number;
  pendiente: number;
  proveedorId?: string;
  colppyId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FacturaProveedorAPI {
  id: string;
  fechaEmision: string;
  nroComprobante: string;
  tipoComprobante: string;
  cuitEmisor: string | null;
  razonSocialEmisor: string;
  importeTotal: number;
  fechaVencimiento: string | null;
  pagada: boolean;
  fechaPago: string | null;
  medioPago: string | null;
  fileUrl: string | null;
  clientId: string;
  clientNombre: string;
  pagos: unknown[];
  items: unknown[];
}

export interface FacturasProveedoresAPIResponse {
  success: boolean;
  total: number;
  items: FacturaProveedorAPI[];
}

export interface FacturasProveedoresResponse {
  data: FacturaProveedor[];
  pagination: PaginationInfo;
}

export interface FacturaCliente {
  id: string;
  cliente: string;
  razonSocial: string;
  tipo: 'FAC-C' | 'FAC-A' | 'FAC-X' | 'COB';
  fecha: string;
  referencia: string;
  vencimiento?: string | null;
  total: number;
  totalME?: number | null;
  tipoCambio?: string | null;
  cobrado: number;
  pendiente: number;
  clienteId?: string;
  colppyId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FacturasClientesResponse {
  data: FacturaCliente[];
  pagination: PaginationInfo;
}

export interface UltimoProcesoSincronizacion {
  id: string;
  scope: string;
  status: string;
  count: number | null;
  message: string | null;
  totalDisponibilidad: number | null;
  totalCobrosPendientes: number | null;
  totalPagosPendientes: number | null;
  createdAt: string;
}

export interface UltimoProcesoResponse {
  success: boolean;
  lastSync: {
    tesoreria: UltimoProcesoSincronizacion;
    facturas_proveedores: UltimoProcesoSincronizacion;
    facturas_clientes: UltimoProcesoSincronizacion;
  };
}
