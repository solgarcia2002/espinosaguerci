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
}

export interface ClientesResponse {
  data: ClienteEntity[];
  pagination: PaginationInfo;
}

export interface MovimientosResponse {
  data: MovimientoCaja[];
  pagination: PaginationInfo;
}
