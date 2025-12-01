'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MovimientoCaja, ResumenCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { colppyService } from '@/services/colppyService';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import CajaDiariaTabs from '@/components/caja-diaria/CajaDiariaTabs';
import { obtenerFechasUltimoMes } from '@/lib/fecha-utils';

export default function CajaDiariaPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [filtros, setFiltros] = useState<FiltrosCajaType>({});
  const [datosCargados, setDatosCargados] = useState(false);
  const [ejecutandoRPA, setEjecutandoRPA] = useState(false);

  // Fecha actual por defecto
  const fechaActual = new Date().toISOString().split('T')[0];
  const fechasDefault = obtenerFechasUltimoMes();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (authChecked && datosCargados) {
      cargarDatos();
    }
  }, [filtros, authChecked, datosCargados]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar movimientos con filtros
      const movimientosData = await cajaDiariaService.obtenerMovimientos(filtros);
      setMovimientos(movimientosData);

      // Cargar resumen del día actual si no hay filtros de fecha
      if (!filtros.fechaDesde && !filtros.fechaHasta) {
        const resumenData = await cajaDiariaService.obtenerResumen(fechaActual);
        setResumen(resumenData);
      } else {
        setResumen(null);
      }
      
      setDatosCargados(true);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos de caja diaria');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoMovimiento = () => {
    // Esta función será manejada por el componente de tabs
  };

  const handleEditarMovimiento = (movimiento: MovimientoCaja) => {
    // Esta función será manejada por el componente de tabs
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosCajaType) => {
    setFiltros(nuevosFiltros);
  };

  const handleExportar = async () => {
    try {
      const blob = await cajaDiariaService.exportarExcel(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caja-diaria-${fechaActual}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Archivo Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar el archivo Excel');
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
  };

  const ejecutarTodosLosRPA = async () => {
    try {
      setEjecutandoRPA(true);
      const credenciales = {
        email: 'matiespinosa05@gmail.com',
        password: 'Mati.46939'
      };

      toast.info('Iniciando sincronización de los 3 RPA...');

      // Ejecutar los 3 RPA en paralelo
      const [movimientosResult, clientesResult, proveedoresResult] = await Promise.allSettled([
        colppyService.sincronizarMovimientos({
          fechaDesde: fechasDefault.fechaDesde,
          fechaHasta: fechasDefault.fechaHasta,
          ...credenciales
        }),
        colppyService.sincronizarFacturasClientes({
          fechaDesde: fechasDefault.fechaDesde,
          fechaHasta: fechasDefault.fechaHasta,
          ...credenciales
        }),
        colppyService.sincronizarFacturasProveedores({
          fechaDesde: fechasDefault.fechaDesde,
          fechaHasta: fechasDefault.fechaHasta,
          ...credenciales
        })
      ]);

      // Procesar resultados
      const resultados = {
        movimientos: movimientosResult.status === 'fulfilled' && movimientosResult.value.success,
        clientes: clientesResult.status === 'fulfilled' && clientesResult.value.success,
        proveedores: proveedoresResult.status === 'fulfilled' && proveedoresResult.value.success
      };

      const exitosos = Object.values(resultados).filter(Boolean).length;
      
      if (exitosos === 3) {
        toast.success('Todos los RPA se ejecutaron correctamente');
      } else {
        toast.warning(`Se ejecutaron ${exitosos} de 3 RPA correctamente`);
      }

      // Recargar datos después de la sincronización
      if (datosCargados) {
        await cargarDatos();
      }
    } catch (error) {
      console.error('Error ejecutando RPA:', error);
      toast.error('Error al ejecutar los RPA');
    } finally {
      setEjecutandoRPA(false);
    }
  };

  if (!authChecked) {
    return <div className="p-8">Verificando sesión…</div>;
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Caja Diaria</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los movimientos de caja diaria
            </p>
          </div>
          <div>
            <button
              onClick={ejecutarTodosLosRPA}
              disabled={ejecutandoRPA}
              className="px-4 py-2 flex items-center gap-2 disabled:opacity-50 btn-primary"
            >
              <span>🤖</span>
              <span>{ejecutandoRPA ? 'Ejecutando RPA...' : 'Ejecutar todos los Robots de sincronizacion con Colppy'}</span>
            </button>
          </div>
        </div>

        <CajaDiariaTabs
          movimientos={movimientos}
          resumen={resumen}
          filtros={filtros}
          loading={loading}
          onFiltrosChange={handleFiltrosChange}
          onExportar={handleExportar}
          onLimpiar={handleLimpiarFiltros}
          onEdit={handleEditarMovimiento}
          onRefresh={cargarDatos}
          onNuevoMovimiento={handleNuevoMovimiento}
        />
      </div>
    </Layout>
  );
}
