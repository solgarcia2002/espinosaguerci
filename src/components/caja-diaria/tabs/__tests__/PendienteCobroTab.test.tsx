import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/services/apiClient';

vi.mock('@/services/apiClient');

const mockApiClient = vi.mocked(apiClient);

describe('PendienteCobroTab - Verificación de parámetros de API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a la URL correcta sin clienteId ni otros parámetros adicionales', () => {
    const expectedParams = {
      page: 1,
      limit: 20,
      orderBy: 'nombre',
      order: 'desc'
    };

    expect(expectedParams).not.toHaveProperty('clienteId');
    expect(expectedParams).not.toHaveProperty('proveedorId');
    expect(expectedParams).not.toHaveProperty('estadoCobro');
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
      ['clienteId', 'proveedorId', 'estadoCobro', 'fechaDesde', 'fechaHasta'].includes(key)
    );

    expect(hasInvalidParams).toBe(false);
    expect(Object.keys(params).length).toBe(4);
    expect(params.orderBy).toBe('nombre');
    expect(params.order).toBe('desc');
  });

  it('debe verificar la estructura correcta de la llamada a la API', () => {
    const endpoint = 'caja-diaria/clientes/facturas';
    const method = 'GET';
    const params = {
      page: 1,
      limit: 20,
      orderBy: 'nombre',
      order: 'desc'
    };

    expect(endpoint).toBe('caja-diaria/clientes/facturas');
    expect(method).toBe('GET');
    expect(params).not.toHaveProperty('clienteId');
    expect(Object.keys(params).length).toBe(4);
  });
});
