import { NextRequest, NextResponse } from 'next/server';
import { Cliente } from '@/types/cajaDiaria';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const clientesFiltrados: Cliente[] = [];

    // Calcular totales detallados
    const totalFacturado = clientesFiltrados.reduce((sum, cliente) => sum + cliente.total, 0);
    const totalCobrado = clientesFiltrados.reduce((sum, cliente) => sum + cliente.cobrado, 0);
    const totalPendiente = clientesFiltrados.reduce((sum, cliente) => sum + cliente.pendiente, 0);
    const cantidadFacturas = clientesFiltrados.length;
    const porcentajeCobrado = totalFacturado > 0 ? (totalCobrado / totalFacturado) * 100 : 0;

    // Resumen por estado
    const resumenPorEstado = {
      cobrado: {
        cantidad: clientesFiltrados.filter(c => c.pendiente === 0).length,
        monto: totalCobrado,
        porcentaje: totalFacturado > 0 ? (totalCobrado / totalFacturado) * 100 : 0
      },
      pendiente: {
        cantidad: clientesFiltrados.filter(c => c.pendiente > 0).length,
        monto: totalPendiente,
        porcentaje: totalFacturado > 0 ? (totalPendiente / totalFacturado) * 100 : 0
      }
    };

    // Antigüedad de saldos (simulado basado en fechas de vencimiento)
    const hoy = new Date();
    const antiguedadSaldos = {
      vencidas: {
        cantidad: clientesFiltrados.filter(c => {
          const vencimiento = new Date(c.vencimiento);
          return vencimiento < hoy && c.pendiente > 0;
        }).length,
        monto: clientesFiltrados
          .filter(c => {
            const vencimiento = new Date(c.vencimiento);
            return vencimiento < hoy && c.pendiente > 0;
          })
          .reduce((sum, c) => sum + c.pendiente, 0)
      },
      porVencer: {
        cantidad: clientesFiltrados.filter(c => {
          const vencimiento = new Date(c.vencimiento);
          const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          return diasDiferencia >= 0 && diasDiferencia <= 30 && c.pendiente > 0;
        }).length,
        monto: clientesFiltrados
          .filter(c => {
            const vencimiento = new Date(c.vencimiento);
            const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            return diasDiferencia >= 0 && diasDiferencia <= 30 && c.pendiente > 0;
          })
          .reduce((sum, c) => sum + c.pendiente, 0)
      },
      vigentes: {
        cantidad: clientesFiltrados.filter(c => {
          const vencimiento = new Date(c.vencimiento);
          const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          return diasDiferencia > 30 && c.pendiente > 0;
        }).length,
        monto: clientesFiltrados
          .filter(c => {
            const vencimiento = new Date(c.vencimiento);
            const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            return diasDiferencia > 30 && c.pendiente > 0;
          })
          .reduce((sum, c) => sum + c.pendiente, 0)
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        totalFacturado,
        totalCobrado,
        totalPendiente,
        cantidadFacturas,
        porcentajeCobrado: Math.round(porcentajeCobrado * 100) / 100,
        facturas: clientesFiltrados,
        resumenPorEstado,
        antiguedadSaldos,
        filtros: {
          fechaDesde,
          fechaHasta
        }
      },
      message: 'Reporte de clientes generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de clientes:', error);
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
