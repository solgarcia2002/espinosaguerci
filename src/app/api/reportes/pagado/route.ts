import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');

    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const proveedoresPagados: any[] = [];

    // Agrupar por proveedor
    const proveedoresAgrupados = proveedoresPagados.reduce((acc, proveedor) => {
      const key = proveedor.proveedor;
      if (!acc[key]) {
        acc[key] = {
          proveedor: proveedor.proveedor,
          totalPagado: 0,
          totalFacturado: 0,
          cantidadFacturas: 0,
          porFecha: {} as Record<string, number>,
          facturas: []
        };
      }
      
      acc[key].totalPagado += proveedor.pagado;
      acc[key].totalFacturado += proveedor.total;
      acc[key].cantidadFacturas += 1;
      acc[key].facturas.push(proveedor);
      
      // Agrupar por fecha
      const fecha = proveedor.fecha;
      if (!acc[key].porFecha[fecha]) {
        acc[key].porFecha[fecha] = 0;
      }
      acc[key].porFecha[fecha] += proveedor.pagado;
      
      return acc;
    }, {} as Record<string, any>);

    const proveedoresArray = Object.values(proveedoresAgrupados);

    // Calcular totales
    const totalPagado = proveedoresPagados.reduce((sum, proveedor) => sum + proveedor.pagado, 0);
    const totalFacturado = proveedoresPagados.reduce((sum, proveedor) => sum + proveedor.total, 0);
    const cantidadFacturas = proveedoresPagados.length;
    const cantidadProveedores = proveedoresArray.length;
    const porcentajePagado = totalFacturado > 0 ? (totalPagado / totalFacturado) * 100 : 0;

    // Resumen por mes (últimos 6 meses)
    const resumenPorMes = {};
    const hoy = new Date();
    for (let i = 0; i < 6; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mesKey = fecha.toISOString().substring(0, 7); // YYYY-MM
      
      const facturasDelMes = proveedoresPagados.filter(proveedor => {
        const fechaProveedor = new Date(proveedor.fecha);
        return fechaProveedor.getFullYear() === fecha.getFullYear() && 
               fechaProveedor.getMonth() === fecha.getMonth();
      });

      (resumenPorMes as any)[mesKey] = {
        cantidadFacturas: facturasDelMes.length,
        totalPagado: facturasDelMes.reduce((sum, p) => sum + p.pagado, 0),
        cantidadProveedores: new Set(facturasDelMes.map(p => p.proveedor)).size
      };
    }

    // Ordenar por monto pagado descendente
    proveedoresArray.sort((a: any, b: any) => b.totalPagado - a.totalPagado);

    return NextResponse.json({
      success: true,
      data: {
        totalPagado,
        totalFacturado,
        cantidadFacturas,
        cantidadProveedores,
        porcentajePagado: Math.round(porcentajePagado * 100) / 100,
        proveedores: proveedoresArray,
        resumenPorMes,
        filtros: {
          fechaDesde,
          fechaHasta
        }
      },
      message: 'Reporte de pagado generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de pagado:', error);
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
