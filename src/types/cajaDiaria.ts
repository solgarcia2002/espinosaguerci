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
  clienteId?: string;
  proveedorId?: string;
  cliente?: Cliente;
  proveedor?: Proveedor;
  metodoPago: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta' | 'pendiente';
  observaciones?: string;
  usuario: string;
  createdAt: string;
  updatedAt: string;
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
