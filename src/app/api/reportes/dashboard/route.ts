import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0];

    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const totalFacturadoClientes = 0;
    const totalCobradoClientes = 0;
    const totalPendienteClientes = 0;
    
    const totalFacturadoProveedores = 0;
    const totalPagadoProveedores = 0;
    const totalPendienteProveedores = 0;

    const saldosConsolidados = {
      delDia: { disponibilidades: 0, cheques: 0, aCobrar: 0, aPagar: 0, aPagarTarjetas: 0, incrementoTarjetas: 0, incrementoProveedores: 0, saldo: 0 },
      diaAnterior: { disponibilidades: 0, cheques: 0, aCobrar: 0, aPagar: 0, aPagarTarjetas: 0, incrementoTarjetas: 0, incrementoProveedores: 0, saldo: 0 },
      diferencia: 0
    };
    const cuentasBancarias: any[] = [];
    const totalDisponibilidad = 0;

    // Calcular cheques en cartera (datos vacíos)
    const chequesEnCartera = {
      delDia: 0,
      diaAnterior: 0,
      diferencia: 0
    };

    // Estructura de saldos
    const saldos = {
      disponibilidades: {
        delDia: totalDisponibilidad,
        diaAnterior: saldosConsolidados.diaAnterior.disponibilidades,
        diferencia: totalDisponibilidad - saldosConsolidados.diaAnterior.disponibilidades
      },
      chequesEnCartera,
      aCobrar: {
        delDia: totalPendienteClientes,
        diaAnterior: totalPendienteClientes * 0.95, // Simulado
        diferencia: totalPendienteClientes * 0.05
      },
      aPagar: {
        delDia: totalPendienteProveedores,
        diaAnterior: totalPendienteProveedores * 0.95, // Simulado
        diferencia: totalPendienteProveedores * 0.05
      }
    };

    // Calcular KPIs
    const capitalTrabajo = totalDisponibilidad + chequesEnCartera.delDia - totalPendienteProveedores;
    const liquidezCorriente = (totalDisponibilidad + chequesEnCartera.delDia) / totalPendienteProveedores;
    const disponibilidadInmediata = totalDisponibilidad + chequesEnCartera.delDia;
    const eficienciaCobranza = totalFacturadoClientes > 0 ? (totalCobradoClientes / totalFacturadoClientes) * 100 : 0;
    const eficienciaPago = totalFacturadoProveedores > 0 ? (totalPagadoProveedores / totalFacturadoProveedores) * 100 : 0;

    const kpis = {
      capitalTrabajo: Math.round(capitalTrabajo * 100) / 100,
      liquidezCorriente: Math.round(liquidezCorriente * 100) / 100,
      disponibilidadInmediata: Math.round(disponibilidadInmediata * 100) / 100,
      eficienciaCobranza: Math.round(eficienciaCobranza * 100) / 100,
      eficienciaPago: Math.round(eficienciaPago * 100) / 100
    };

    // Generar alertas
    const alertas = [];
    
    if (liquidezCorriente < 1.2) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Liquidez Baja',
        mensaje: `La liquidez corriente es de ${liquidezCorriente}, por debajo del umbral recomendado de 1.2`,
        prioridad: 'alta'
      });
    }

    if (eficienciaCobranza < 40) {
      alertas.push({
        tipo: 'info',
        titulo: 'Eficiencia de Cobranza',
        mensaje: `La eficiencia de cobranza es del ${eficienciaCobranza}%, considera revisar los cobros pendientes`,
        prioridad: 'media'
      });
    }

    if (eficienciaPago < 40) {
      alertas.push({
        tipo: 'info',
        titulo: 'Eficiencia de Pago',
        mensaje: `La eficiencia de pago es del ${eficienciaPago}%, considera revisar los pagos pendientes`,
        prioridad: 'media'
      });
    }

    // Obtener movimientos del día (datos vacíos)
    const movimientosDelDia: any[] = [];
    const movimientosHoy: any[] = [];

    const movimientosDelDiaResumen = {
      totalMovimientos: movimientosHoy.length,
      totalIngresos: movimientosHoy.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0),
      totalEgresos: movimientosHoy.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0),
      saldoNeto: movimientosHoy.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0) - 
                 movimientosHoy.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0),
      movimientos: movimientosHoy.slice(0, 10) // Últimos 10 movimientos
    };

    return NextResponse.json({
      success: true,
      data: {
        fecha,
        saldos,
        kpis,
        alertas,
        movimientosDelDia: movimientosDelDiaResumen,
        resumen: {
          totalClientes: 0,
          totalProveedores: 0,
          clientesConPendientes: 0,
          proveedoresConPendientes: 0,
          cuentasBancarias: cuentasBancarias.length
        }
      },
      message: 'Dashboard generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando dashboard:', error);
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
