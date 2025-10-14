import { NextRequest, NextResponse } from 'next/server';
import { getMovimientosPorMes, getResumenPorMes } from '@/data/mockData';

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

    // Obtener movimientos y resumen para la fecha especificada
    const movimientos = getMovimientosPorMes(fecha);
    const resumen = getResumenPorMes(fecha);

    // Calcular estadísticas adicionales
    const estadisticas = {
      totalMovimientos: movimientos.length,
      totalIngresos: movimientos
        .filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + m.monto, 0),
      totalEgresos: movimientos
        .filter(m => m.tipo === 'egreso')
        .reduce((sum, m) => sum + m.monto, 0),
      saldoNeto: movimientos
        .filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + m.monto, 0) - 
        movimientos
        .filter(m => m.tipo === 'egreso')
        .reduce((sum, m) => sum + m.monto, 0)
    };

    // Agrupar por método de pago
    const porMetodoPago = movimientos.reduce((acc, movimiento) => {
      const metodo = movimiento.metodoPago;
      if (!acc[metodo]) {
        acc[metodo] = {
          metodo,
          cantidad: 0,
          totalIngresos: 0,
          totalEgresos: 0,
          saldo: 0
        };
      }
      
      acc[metodo].cantidad += 1;
      if (movimiento.tipo === 'ingreso') {
        acc[metodo].totalIngresos += movimiento.monto;
      } else {
        acc[metodo].totalEgresos += movimiento.monto;
      }
      acc[metodo].saldo = acc[metodo].totalIngresos - acc[metodo].totalEgresos;
      
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: {
        fecha,
        resumen,
        movimientos,
        estadisticas,
        porMetodoPago: Object.values(porMetodoPago),
        resumenDetallado: {
          saldoInicial: resumen.saldoInicial,
          saldoFinal: resumen.saldoFinal,
          totalIngresos: estadisticas.totalIngresos,
          totalEgresos: estadisticas.totalEgresos,
          saldoNeto: estadisticas.saldoNeto,
          cantidadMovimientos: estadisticas.totalMovimientos
        }
      },
      message: 'Reporte de caja generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de caja:', error);
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
