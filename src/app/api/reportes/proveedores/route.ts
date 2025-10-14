import { NextRequest, NextResponse } from 'next/server';
import { Proveedor } from '@/types/cajaDiaria';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const proveedoresFiltrados: any[] = [];

    // Calcular totales detallados
    const totalFacturado = proveedoresFiltrados.reduce((sum, proveedor) => sum + proveedor.total, 0);
    const totalPagado = proveedoresFiltrados.reduce((sum, proveedor) => sum + proveedor.pagado, 0);
    const totalPendiente = proveedoresFiltrados.reduce((sum, proveedor) => sum + proveedor.pendiente, 0);
    const cantidadFacturas = proveedoresFiltrados.length;
    const porcentajePagado = totalFacturado > 0 ? (totalPagado / totalFacturado) * 100 : 0;

    // Resumen por estado
    const resumenPorEstado = {
      pagado: {
        cantidad: proveedoresFiltrados.filter(p => p.pendiente === 0).length,
        monto: totalPagado,
        porcentaje: totalFacturado > 0 ? (totalPagado / totalFacturado) * 100 : 0
      },
      pendiente: {
        cantidad: proveedoresFiltrados.filter(p => p.pendiente > 0).length,
        monto: totalPendiente,
        porcentaje: totalFacturado > 0 ? (totalPendiente / totalFacturado) * 100 : 0
      }
    };

    // Antigüedad de saldos (simulado basado en fechas de vencimiento)
    const hoy = new Date();
    const antiguedadSaldos = {
      vencidas: {
        cantidad: proveedoresFiltrados.filter(p => {
          const vencimiento = new Date(p.vencimiento);
          return vencimiento < hoy && p.pendiente > 0;
        }).length,
        monto: proveedoresFiltrados
          .filter(p => {
            const vencimiento = new Date(p.vencimiento);
            return vencimiento < hoy && p.pendiente > 0;
          })
          .reduce((sum, p) => sum + p.pendiente, 0)
      },
      porVencer: {
        cantidad: proveedoresFiltrados.filter(p => {
          const vencimiento = new Date(p.vencimiento);
          const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          return diasDiferencia >= 0 && diasDiferencia <= 30 && p.pendiente > 0;
        }).length,
        monto: proveedoresFiltrados
          .filter(p => {
            const vencimiento = new Date(p.vencimiento);
            const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            return diasDiferencia >= 0 && diasDiferencia <= 30 && p.pendiente > 0;
          })
          .reduce((sum, p) => sum + p.pendiente, 0)
      },
      vigentes: {
        cantidad: proveedoresFiltrados.filter(p => {
          const vencimiento = new Date(p.vencimiento);
          const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          return diasDiferencia > 30 && p.pendiente > 0;
        }).length,
        monto: proveedoresFiltrados
          .filter(p => {
            const vencimiento = new Date(p.vencimiento);
            const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            return diasDiferencia > 30 && p.pendiente > 0;
          })
          .reduce((sum, p) => sum + p.pendiente, 0)
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        totalFacturado,
        totalPagado,
        totalPendiente,
        cantidadFacturas,
        porcentajePagado: Math.round(porcentajePagado * 100) / 100,
        facturas: proveedoresFiltrados,
        resumenPorEstado,
        antiguedadSaldos,
        filtros: {
          fechaDesde,
          fechaHasta
        }
      },
      message: 'Reporte de proveedores generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de proveedores:', error);
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
