import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar conexión real con base de datos
    // Por ahora retornamos datos vacíos
    const clientesPendientes: any[] = [];

    // Agrupar por cliente para obtener totales
    const clientesAgrupados = clientesPendientes.reduce((acc, cliente) => {
      const key = cliente.cliente;
      if (!acc[key]) {
        acc[key] = {
          cliente: cliente.cliente,
          totalPendiente: 0,
          porFecha: {} as Record<string, number>,
          facturas: []
        };
      }
      
      acc[key].totalPendiente += cliente.pendiente;
      acc[key].facturas.push(cliente);
      
      // Agrupar por fecha de vencimiento
      const fechaVencimiento = cliente.vencimiento;
      if (!acc[key].porFecha[fechaVencimiento]) {
        acc[key].porFecha[fechaVencimiento] = 0;
      }
      acc[key].porFecha[fechaVencimiento] += cliente.pendiente;
      
      return acc;
    }, {} as Record<string, any>);

    const clientesArray = Object.values(clientesAgrupados);

    // Calcular totales
    const totalPendiente = clientesPendientes.reduce((sum, cliente) => sum + cliente.pendiente, 0);
    const cantidadClientes = clientesArray.length;

    // Calcular por rango de vencimiento
    const hoy = new Date();
    const porRangoVencimiento = {
      vencidas: {
        cantidad: 0,
        monto: 0,
        clientes: [] as string[]
      },
      proximas7Dias: {
        cantidad: 0,
        monto: 0,
        clientes: [] as string[]
      },
      proximas30Dias: {
        cantidad: 0,
        monto: 0,
        clientes: [] as string[]
      },
      mas30Dias: {
        cantidad: 0,
        monto: 0,
        clientes: [] as string[]
      }
    };

    clientesPendientes.forEach(cliente => {
      const vencimiento = new Date(cliente.vencimiento);
      const diasDiferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasDiferencia < 0) {
        // Vencidas
        porRangoVencimiento.vencidas.cantidad += 1;
        porRangoVencimiento.vencidas.monto += cliente.pendiente;
        if (!porRangoVencimiento.vencidas.clientes.includes(cliente.cliente)) {
          porRangoVencimiento.vencidas.clientes.push(cliente.cliente);
        }
      } else if (diasDiferencia <= 7) {
        // Próximas 7 días
        porRangoVencimiento.proximas7Dias.cantidad += 1;
        porRangoVencimiento.proximas7Dias.monto += cliente.pendiente;
        if (!porRangoVencimiento.proximas7Dias.clientes.includes(cliente.cliente)) {
          porRangoVencimiento.proximas7Dias.clientes.push(cliente.cliente);
        }
      } else if (diasDiferencia <= 30) {
        // Próximas 30 días
        porRangoVencimiento.proximas30Dias.cantidad += 1;
        porRangoVencimiento.proximas30Dias.monto += cliente.pendiente;
        if (!porRangoVencimiento.proximas30Dias.clientes.includes(cliente.cliente)) {
          porRangoVencimiento.proximas30Dias.clientes.push(cliente.cliente);
        }
      } else {
        // Más de 30 días
        porRangoVencimiento.mas30Dias.cantidad += 1;
        porRangoVencimiento.mas30Dias.monto += cliente.pendiente;
        if (!porRangoVencimiento.mas30Dias.clientes.includes(cliente.cliente)) {
          porRangoVencimiento.mas30Dias.clientes.push(cliente.cliente);
        }
      }
    });

    // Ordenar por monto pendiente descendente
    clientesArray.sort((a: any, b: any) => b.totalPendiente - a.totalPendiente);

    return NextResponse.json({
      success: true,
      data: {
        totalPendiente,
        cantidadClientes,
        clientes: clientesArray,
        porRangoVencimiento
      },
      message: 'Reporte de pendiente de cobro generado exitosamente'
    });

  } catch (error) {
    console.error('Error generando reporte de pendiente de cobro:', error);
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
