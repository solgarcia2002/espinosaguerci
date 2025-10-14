import { NextRequest, NextResponse } from 'next/server';
import { getCuentasBancarias, getTotalDisponibilidad } from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0];

    // Obtener cuentas bancarias y disponibilidad total
    const cuentasBancarias = getCuentasBancarias(fecha);
    const totalDisponibilidad = getTotalDisponibilidad(fecha);

    // Calcular estadísticas detalladas
    const estadisticas = {
      totalCuentas: cuentasBancarias.length,
      totalDisponibilidad,
      totalPesos: cuentasBancarias.reduce((sum, cuenta) => sum + cuenta.saldo, 0),
      totalDolares: cuentasBancarias.reduce((sum, cuenta) => sum + cuenta.dolares, 0),
      totalPendienteAcreditacion: cuentasBancarias.reduce((sum, cuenta) => sum + cuenta.pendienteAcreditacion, 0)
    };

    // Agrupar por tipo de cuenta
    const porTipo = cuentasBancarias.reduce((acc, cuenta) => {
      const tipo = cuenta.nombre.includes('Caja') ? 'Caja' : 
                   cuenta.nombre.includes('Banco') ? 'Banco' : 'Otros';
      
      if (!acc[tipo]) {
        acc[tipo] = {
          tipo,
          cantidad: 0,
          totalSaldo: 0,
          totalDolares: 0,
          totalPendiente: 0,
          cuentas: []
        };
      }
      
      acc[tipo].cantidad += 1;
      acc[tipo].totalSaldo += cuenta.saldo;
      acc[tipo].totalDolares += cuenta.dolares;
      acc[tipo].totalPendiente += cuenta.pendienteAcreditacion;
      acc[tipo].cuentas.push(cuenta);
      
      return acc;
    }, {} as Record<string, any>);

    // Resumen de liquidez
    const resumenLiquidez = {
      disponibleInmediato: cuentasBancarias
        .filter(c => c.nombre.includes('Caja'))
        .reduce((sum, c) => sum + c.saldo, 0),
      disponibleBanco: cuentasBancarias
        .filter(c => c.nombre.includes('Banco'))
        .reduce((sum, c) => sum + c.saldo, 0),
      pendienteAcreditacion: estadisticas.totalPendienteAcreditacion,
      totalLiquido: estadisticas.totalDisponibilidad
    };

    return NextResponse.json({
      success: true,
      data: {
        fecha,
        totalDisponibilidad,
        estadisticas,
        cuentasBancarias,
        porTipo: Object.values(porTipo),
        resumenLiquidez,
        alertas: {
          cuentasConSaldoNegativo: cuentasBancarias.filter(c => c.saldo < 0).length,
          cuentasConPendientes: cuentasBancarias.filter(c => c.pendienteAcreditacion > 0).length,
          totalPendienteAcreditacion: estadisticas.totalPendienteAcreditacion
        }
      },
      message: 'Reporte de disponibilidad generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de disponibilidad:', error);
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
