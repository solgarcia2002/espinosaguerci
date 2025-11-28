export const obtenerFechasUltimoMes = (
  fechaDesde?: string,
  fechaHasta?: string
): { fechaDesde: string; fechaHasta: string } => {
  const hoy = new Date();
  const mesAnterior = new Date(hoy);
  mesAnterior.setMonth(hoy.getMonth() - 1);

  const fechaHastaDefault = hoy.toISOString().split('T')[0];
  const fechaDesdeDefault = mesAnterior.toISOString().split('T')[0];

  return {
    fechaDesde: fechaDesde ?? fechaDesdeDefault,
    fechaHasta: fechaHasta ?? fechaHastaDefault
  };
};

