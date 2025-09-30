export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
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
