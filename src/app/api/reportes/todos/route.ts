import { NextRequest, NextResponse } from 'next/server';
import { 
  mockClientes, 
  mockProveedores, 
  getMovimientosPorMes,
  getResumenPorMes,
  getSaldosConsolidados,
  getCashFlow,
  getAjustes,
  getCuentasBancarias,
  getTarjetas,
  getCobranzasDiferencias,
  getPagosProveedoresPlanes
} from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');

    if (!fecha) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'El parámetro fecha es requerido' 
        },
        { status: 400 }
      );
    }

    // Obtener todos los datos para la fecha especificada
    const movimientos = getMovimientosPorMes(fecha);
    const resumen = getResumenPorMes(fecha);
    const saldosConsolidados = getSaldosConsolidados(fecha);
    const cashFlow = getCashFlow(fecha);
    const ajustes = getAjustes(fecha);
    const cuentasBancarias = getCuentasBancarias(fecha);
    const tarjetas = getTarjetas(fecha);
    const cobranzasDiferencias = getCobranzasDiferencias(fecha);
    const pagosProveedoresPlanes = getPagosProveedoresPlanes(fecha);

    // Filtrar clientes y proveedores con pendientes
    const clientesPendientes = mockClientes.filter(cliente => cliente.pendiente > 0);
    const proveedoresPendientes = mockProveedores.filter(proveedor => proveedor.pendiente > 0);

    // Calcular totales generales
    const totalesGenerales = {
      clientes: {
        total: mockClientes.length,
        conPendientes: clientesPendientes.length,
        totalMonto: mockClientes.reduce((sum, c) => sum + c.total, 0),
        totalCobrado: mockClientes.reduce((sum, c) => sum + c.cobrado, 0),
        totalPendiente: mockClientes.reduce((sum, c) => sum + c.pendiente, 0)
      },
      proveedores: {
        total: mockProveedores.length,
        conPendientes: proveedoresPendientes.length,
        totalMonto: mockProveedores.reduce((sum, p) => sum + p.total, 0),
        totalPagado: mockProveedores.reduce((sum, p) => sum + p.pagado, 0),
        totalPendiente: mockProveedores.reduce((sum, p) => sum + p.pendiente, 0)
      },
      caja: {
        saldoInicial: resumen.saldoInicial,
        saldoFinal: resumen.saldoFinal,
        totalIngresos: movimientos.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0),
        totalEgresos: movimientos.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0),
        cantidadMovimientos: movimientos.length
      },
      consolidado: {
        saldoDelDia: saldosConsolidados.delDia,
        saldoDiaAnterior: saldosConsolidados.diaAnterior,
        diferencia: saldosConsolidados.diferencia,
        totalCashFlow: cashFlow.total,
        totalAjustes: ajustes.diferencia
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        fecha,
        resumen: {
          fecha,
          totalesGenerales
        },
        hojas: {
          clientes: {
            todos: mockClientes,
            pendientes: clientesPendientes,
            totales: totalesGenerales.clientes
          },
          proveedores: {
            todos: mockProveedores,
            pendientes: proveedoresPendientes,
            totales: totalesGenerales.proveedores
          },
          caja: {
            movimientos,
            resumen,
            totales: totalesGenerales.caja
          },
          consolidado: {
            saldosConsolidados,
            cashFlow,
            ajustes,
            cuentasBancarias,
            tarjetas,
            cobranzasDiferencias,
            pagosProveedoresPlanes,
            totales: totalesGenerales.consolidado
          }
        }
      },
      message: 'Reporte completo de todas las hojas generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte completo:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
