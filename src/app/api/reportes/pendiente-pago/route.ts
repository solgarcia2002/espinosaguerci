import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const proveedoresPendientes: any[] = [];

    // Agrupar por proveedor para obtener totales
    const proveedoresAgrupados = proveedoresPendientes.reduce((acc, proveedor) => {
      const key = proveedor.proveedor;
      if (!acc[key]) {
        acc[key] = {
          proveedor: proveedor.proveedor,
          totalPendiente: 0,
          porFecha: {} as Record<string, number>,
          facturas: []
        };
      }
      
      acc[key].totalPendiente += proveedor.pendiente;
      acc[key].facturas.push(proveedor);
      
      // Agrupar por fecha de vencimiento
      const fechaVencimiento = proveedor.vencimiento;
      if (!acc[key].porFecha[fechaVencimiento]) {
        acc[key].porFecha[fechaVencimiento] = 0;
      }
      acc[key].porFecha[fechaVencimiento] += proveedor.pendiente;
      
      return acc;
    }, {} as Record<string, any>);

    const proveedoresArray = Object.values(proveedoresAgrupados);

    // Calcular totales
    const totalPendiente = proveedoresPendientes.reduce((sum, proveedor) => sum + proveedor.pendiente, 0);
    const cantidadProveedores = proveedoresArray.length;

    // Calcular por rango de vencimiento
    const hoy = new Date();
    const porRangoVencimiento = {
      vencidas: {
        cantidad: 0,
        monto: 0,
        proveedores: [] as string[]
      },
      proximas7Dias: {
        cantidad: 0,
        monto: 0,
        proveedores: [] as string[]
      },
      proximas30Dias: {
        cantidad: 0,
        monto: 0,
        proveedores: [] as string[]
      },
      mas30Dias: {
        cantidad: 0,
        monto: 0,
        proveedores: [] as string[]
      }
    };

    proveedoresPendientes.forEach(proveedor => {
      const vencimiento = new Date(proveedor.vencimiento);
      const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasDiferencia < 0) {
        // Vencidas
        porRangoVencimiento.vencidas.cantidad += 1;
        porRangoVencimiento.vencidas.monto += proveedor.pendiente;
        if (!porRangoVencimiento.vencidas.proveedores.includes(proveedor.proveedor)) {
          porRangoVencimiento.vencidas.proveedores.push(proveedor.proveedor);
        }
      } else if (diasDiferencia <= 7) {
        // Próximas 7 días
        porRangoVencimiento.proximas7Dias.cantidad += 1;
        porRangoVencimiento.proximas7Dias.monto += proveedor.pendiente;
        if (!porRangoVencimiento.proximas7Dias.proveedores.includes(proveedor.proveedor)) {
          porRangoVencimiento.proximas7Dias.proveedores.push(proveedor.proveedor);
        }
      } else if (diasDiferencia <= 30) {
        // Próximas 30 días
        porRangoVencimiento.proximas30Dias.cantidad += 1;
        porRangoVencimiento.proximas30Dias.monto += proveedor.pendiente;
        if (!porRangoVencimiento.proximas30Dias.proveedores.includes(proveedor.proveedor)) {
          porRangoVencimiento.proximas30Dias.proveedores.push(proveedor.proveedor);
        }
      } else {
        // Más de 30 días
        porRangoVencimiento.mas30Dias.cantidad += 1;
        porRangoVencimiento.mas30Dias.monto += proveedor.pendiente;
        if (!porRangoVencimiento.mas30Dias.proveedores.includes(proveedor.proveedor)) {
          porRangoVencimiento.mas30Dias.proveedores.push(proveedor.proveedor);
        }
      }
    });

    // Ordenar por monto pendiente descendente
    proveedoresArray.sort((a: any, b: any) => b.totalPendiente - a.totalPendiente);

    return NextResponse.json({
      success: true,
      data: {
        totalPendiente,
        cantidadProveedores,
        proveedores: proveedoresArray,
        porRangoVencimiento
      },
      message: 'Reporte de pendiente de pago generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de pendiente de pago:', error);
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
