import { NextRequest, NextResponse } from 'next/server';
import { 
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

    // Obtener datos consolidados para la fecha especificada
    const saldosConsolidados = getSaldosConsolidados(fecha);
    const cashFlow = getCashFlow(fecha);
    const ajustes = getAjustes(fecha);
    const cuentasBancarias = getCuentasBancarias(fecha);
    const tarjetas = getTarjetas(fecha);
    const cobranzasDiferencias = getCobranzasDiferencias(fecha);
    const pagosProveedoresPlanes = getPagosProveedoresPlanes(fecha);

    // Calcular totales generales
    const totales = {
      saldoDelDia: saldosConsolidados.delDia,
      saldoDiaAnterior: saldosConsolidados.diaAnterior,
      diferencia: saldosConsolidados.diferencia,
      totalCashFlow: cashFlow.total,
      totalAjustes: ajustes.diferencia,
      totalCuentasBancarias: cuentasBancarias.reduce((sum, cuenta) => sum + cuenta.saldo, 0),
      totalTarjetas: tarjetas.reduce((sum, tarjeta) => sum + tarjeta.importe, 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        fecha,
        saldosConsolidados,
        cashFlow,
        ajustes,
        cuentasBancarias,
        tarjetas,
        cobranzasDiferencias,
        pagosProveedoresPlanes,
        totales
      },
      message: 'Reporte consolidado generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte consolidado:', error);
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
