import { NextRequest, NextResponse } from 'next/server';
import { 
  mockClientes, 
  mockProveedores, 
  getSaldosConsolidados,
  getCuentasBancarias,
  getTotalDisponibilidad,
  getMovimientosPorMes
} from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0];

    // Calcular totales de clientes y proveedores
    const totalFacturadoClientes = mockClientes.reduce((sum, cliente) => sum + cliente.total, 0);
    const totalCobradoClientes = mockClientes.reduce((sum, cliente) => sum + cliente.cobrado, 0);
    const totalPendienteClientes = mockClientes.reduce((sum, cliente) => sum + cliente.pendiente, 0);
    
    const totalFacturadoProveedores = mockProveedores.reduce((sum, proveedor) => sum + proveedor.total, 0);
    const totalPagadoProveedores = mockProveedores.reduce((sum, proveedor) => sum + proveedor.pagado, 0);
    const totalPendienteProveedores = mockProveedores.reduce((sum, proveedor) => sum + proveedor.pendiente, 0);

    // Obtener saldos consolidados y disponibilidades
    const saldosConsolidados = getSaldosConsolidados(fecha);
    const cuentasBancarias = getCuentasBancarias(fecha);
    const totalDisponibilidad = getTotalDisponibilidad(fecha);

    // Calcular cheques en cartera (simulado)
    const chequesEnCartera = {
      delDia: 3659126.21,
      diaAnterior: 3500000.00,
      diferencia: 159126.21
    };

    // Estructura de saldos
    const saldos = {
      disponibilidades: {
        delDia: totalDisponibilidad,
        diaAnterior: saldosConsolidados.diaAnterior,
        diferencia: totalDisponibilidad - saldosConsolidados.diaAnterior
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

    // Obtener movimientos del día
    const movimientosDelDia = getMovimientosPorMes(fecha);
    const movimientosHoy = movimientosDelDia.filter(m => {
      const fechaMovimiento = new Date(m.fecha);
      const fechaConsulta = new Date(fecha);
      return fechaMovimiento.toDateString() === fechaConsulta.toDateString();
    });

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
          totalClientes: mockClientes.length,
          totalProveedores: mockProveedores.length,
          clientesConPendientes: mockClientes.filter(c => c.pendiente > 0).length,
          proveedoresConPendientes: mockProveedores.filter(p => p.pendiente > 0).length,
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
