'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MovimientoCaja, ResumenCaja, FiltrosCaja as FiltrosCajaType } from '@/types/cajaDiaria';
import { cajaDiariaService } from '@/services/cajaDiariaService';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import CajaDiariaTabs from '@/components/caja-diaria/CajaDiariaTabs';

export default function CajaDiariaPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [filtros, setFiltros] = useState<FiltrosCajaType>({});

  // Fecha actual por defecto
  const fechaActual = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthChecked(true);
      cargarDatos();
    }
  }, [router]);

  useEffect(() => {
    if (authChecked) {
      cargarDatos();
    }
  }, [filtros, authChecked]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar movimientos con filtros
      const movimientosData = await cajaDiariaService.obtenerMovimientos(filtros);
      setMovimientos(movimientosData);

      // Cargar resumen del día actual si no hay filtros de fecha
      if (!filtros.fechaDesde && !filtros.fechaHasta) {
        const resumenData = await cajaDiariaService.obtenerResumenDiario(fechaActual);
        setResumen(resumenData);
      } else {
        setResumen(null);
      }
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

  if (!authChecked) {
    return <div className="p-8">Verificando sesión…</div>;
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Caja Diaria</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los movimientos de caja y mantén el control de tus finanzas diarias
          </p>
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
