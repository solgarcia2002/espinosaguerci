import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const clientesCobrados: any[] = [];

    // Agrupar por cliente
    const clientesAgrupados = clientesCobrados.reduce((acc, cliente) => {
      const key = cliente.cliente;
      if (!acc[key]) {
        acc[key] = {
          cliente: cliente.cliente,
          totalCobrado: 0,
          totalFacturado: 0,
          cantidadFacturas: 0,
          porFecha: {} as Record<string, number>,
          facturas: []
        };
      }
      
      acc[key].totalCobrado += cliente.cobrado;
      acc[key].totalFacturado += cliente.total;
      acc[key].cantidadFacturas += 1;
      acc[key].facturas.push(cliente);
      
      // Agrupar por fecha
      const fecha = cliente.fecha;
      if (!acc[key].porFecha[fecha]) {
        acc[key].porFecha[fecha] = 0;
      }
      acc[key].porFecha[fecha] += cliente.cobrado;
      
      return acc;
    }, {} as Record<string, any>);

    const clientesArray = Object.values(clientesAgrupados);

    // Calcular totales
    const totalCobrado = clientesCobrados.reduce((sum, cliente) => sum + cliente.cobrado, 0);
    const totalFacturado = clientesCobrados.reduce((sum, cliente) => sum + cliente.total, 0);
    const cantidadFacturas = clientesCobrados.length;
    const cantidadClientes = clientesArray.length;
    const porcentajeCobrado = totalFacturado > 0 ? (totalCobrado / totalFacturado) * 100 : 0;

    // Resumen por mes (últimos 6 meses)
    const resumenPorMes = {};
    const hoy = new Date();
    for (let i = 0; i < 6; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mesKey = fecha.toISOString().substring(0, 7); // YYYY-MM
      
      const facturasDelMes = clientesCobrados.filter(cliente => {
        const fechaCliente = new Date(cliente.fecha);
        return fechaCliente.getFullYear() === fecha.getFullYear() && 
               fechaCliente.getMonth() === fecha.getMonth();
      });

      (resumenPorMes as any)[mesKey] = {
        cantidadFacturas: facturasDelMes.length,
        totalCobrado: facturasDelMes.reduce((sum, c) => sum + c.cobrado, 0),
        cantidadClientes: new Set(facturasDelMes.map(c => c.cliente)).size
      };
    }

    // Ordenar por monto cobrado descendente
    clientesArray.sort((a: any, b: any) => b.totalCobrado - a.totalCobrado);

    return NextResponse.json({
      success: true,
      data: {
        totalCobrado,
        totalFacturado,
        cantidadFacturas,
        cantidadClientes,
        porcentajeCobrado: Math.round(porcentajeCobrado * 100) / 100,
        clientes: clientesArray,
        resumenPorMes,
        filtros: {
          fechaDesde,
          fechaHasta
        }
      },
      message: 'Reporte de cobrado generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de cobrado:', error);
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
