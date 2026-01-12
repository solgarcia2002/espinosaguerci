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
  const fechasDefault = obtenerFechasUltimoMes();
  const [fechaDesde, setFechaDesde] = useState(fechasDefault.fechaDesde);
  const [fechaHasta, setFechaHasta] = useState(fechasDefault.fechaHasta);

  const fechaActual = new Date().toISOString().split('T')[0];

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
        password: 'Mati.46939',
        fechaDesde,
        fechaHasta
      };

      toast.info('Iniciando sincronización completa con Colppy...');

      const resultado = await colppyService.sincronizarTodos(credenciales);

      if (resultado.success) {
        toast.success(resultado.message || 'Todos los robots se ejecutaron correctamente');
      } else {
        toast.error(resultado.message || 'Error al ejecutar los robots');
      }

      if (datosCargados) {
        await cargarDatos();
      }
    } catch (error) {
      console.error('Error ejecutando robots:', error);
      toast.error('Error al ejecutar los robots');
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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Caja Diaria</h1>
              <p className="text-gray-600 mt-1">
                Gestiona los movimientos de caja diaria
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
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
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
        />
      </div>
    </Layout>
  );
}
