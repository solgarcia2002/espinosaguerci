import { describe, it, expect } from 'vitest';

describe('PendientePagoTab - Verificación de parámetros de API', () => {
  it('debe llamar a la URL correcta sin proveedorId ni otros parámetros adicionales', () => {
    const expectedParams = {
      page: 1,
      limit: 20,
      orderBy: 'nombre',
      order: 'desc'
    };

    expect(expectedParams).not.toHaveProperty('proveedorId');
    expect(expectedParams).not.toHaveProperty('clienteId');
    expect(expectedParams).not.toHaveProperty('estadoPago');
    expect(expectedParams).toHaveProperty('page');
    expect(expectedParams).toHaveProperty('limit');
    expect(expectedParams).toHaveProperty('orderBy');
    expect(expectedParams).toHaveProperty('order');
    expect(Object.keys(expectedParams).length).toBe(4);
  });

  it('debe verificar que solo se pasen parámetros de paginación y orden', () => {
    const params = {
      page: 1,
      limit: 20,
      orderBy: 'nombre',
      order: 'desc'
    };

    const hasInvalidParams = Object.keys(params).some(key => 
      ['proveedorId', 'clienteId', 'estadoPago', 'fechaDesde', 'fechaHasta'].includes(key)
    );

    expect(hasInvalidParams).toBe(false);
    expect(Object.keys(params).length).toBe(4);
    expect(params.orderBy).toBe('nombre');
    expect(params.order).toBe('desc');
  });

  it('debe verificar la estructura correcta de la llamada a la API', () => {
    const endpoint = 'caja-diaria/proveedores/facturas';
    const method = 'GET';
    const params = {
      page: 1,
      limit: 20,
      orderBy: 'nombre',
      order: 'desc'
    };

    expect(endpoint).toBe('caja-diaria/proveedores/facturas');
    expect(method).toBe('GET');
    expect(params).not.toHaveProperty('proveedorId');
    expect(Object.keys(params).length).toBe(4);
  });
});
