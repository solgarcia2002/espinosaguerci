# Directrices Backend - RPA Descarga de Movimientos desde Colppy

## Endpoint

```
POST /caja-diaria/colppy/sincronizar/movimientos
```

## Headers Requeridos

```
Authorization: Bearer <JWT>
tenant-id: d9d1c7f9-8909-4d43-a32b-278174459446
Content-Type: application/json
```

## Body Request

```json
{
  "fechaDesde": "2025-11-01",  // Opcional, formato YYYY-MM-DD
  "fechaHasta": "2025-11-30",  // Opcional, formato YYYY-MM-DD
  "email": "matiespinosa05@gmail.com",  // Opcional, para forzar override
  "password": "Mati.46939"  // Opcional, para forzar override
}
```

**Notas:**
- Si `email` y `password` no se envían, usar credenciales guardadas en storage seguro (si hay `ENCRYPTION_KEY` configurado)
- Si se envían, forzar override de credenciales

## Flujo RPA - Pasos a Automatizar

### 1. Navegar a Tesorería

**Selector:**
```javascript
button#ext-gen48.x-btn-text.treasury-icon
```

**Texto del botón:** "Tesorería"

**Acción:** Click en el botón

### 2. Descargar Excel

**Selector:**
```javascript
div#ext-gen159.x-tool.x-tool-excel
```

**Acción:** Click en el ícono de Excel

### 3. Esperar Descarga

- Esperar a que el archivo Excel se descargue completamente
- El archivo se descargará con un nombre generado por Colppy (probablemente algo como "tesoreria_YYYYMMDD.xlsx")

### 4. Procesar Excel

El Excel contiene las siguientes columnas (en orden):

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **Fecha** | Date | Fecha del movimiento (formato: DD/MM/YYYY o similar) |
| **Cliente/proveedor** | String | Nombre del cliente o proveedor |
| **Tipo** | String | Tipo de transacción |
| **Nro** | String | Número de referencia |
| **Nro Cheque** | String/null | Número de cheque (puede estar vacío) |
| **Descripción** | String | Descripción del movimiento |
| **Importe ME** | Number | Importe en moneda extranjera |
| **Ingresos** | Number | Monto de ingresos |
| **Egresos** | Number | Monto de egresos |
| **Saldo** | Number | Saldo resultante |

## Mapeo de Datos

Mapear cada fila del Excel a un `MovimientoCaja`:

```typescript
interface MovimientoColppyExcel {
  fecha: string;              // Columna "Fecha"
  clienteProveedor: string;   // Columna "Cliente/proveedor"
  tipo: string;               // Columna "Tipo"
  nro: string;                // Columna "Nro"
  nroCheque: string | null;   // Columna "Nro Cheque"
  descripcion: string;        // Columna "Descripción"
  importeME: number;         // Columna "Importe ME"
  ingresos: number;           // Columna "Ingresos"
  egresos: number;            // Columna "Egresos"
  saldo: number;              // Columna "Saldo"
}
```

### Lógica de Mapeo

1. **Determinar tipo de movimiento:**
   - Si `ingresos > 0` → `tipo: 'ingreso'`
   - Si `egresos > 0` → `tipo: 'egreso'`

2. **Monto:**
   - `monto = ingresos > 0 ? ingresos : egresos`

3. **Concepto:**
   - `concepto = descripcion`

4. **Método de pago:**
   - Si `nroCheque` tiene valor → `metodoPago: 'cheque'`
   - Si no, inferir según el tipo o usar `'transferencia'` por defecto

5. **Cliente/Proveedor:**
   - Buscar en base de datos por nombre (`clienteProveedor`)
   - Si existe, asignar `clienteId` o `proveedorId`
   - Si no existe, crear registro o dejar `null`

6. **Número de comprobante:**
   - `numeroComprobante = nro`

7. **Observaciones:**
   - Incluir información adicional si es necesario (ej: `nroCheque`, `importeME`)

## Response Success

```json
{
  "success": true,
  "message": "Movimientos sincronizados exitosamente. Se procesaron 150 registros.",
  "data": {
    "totalProcesados": 150,
    "totalIngresos": 2500000.00,
    "totalEgresos": 1800000.00,
    "movimientosCreados": 150,
    "movimientosActualizados": 0,
    "errores": []
  },
  "archivoS3": "https://s3.amazonaws.com/bucket/archivos/movimientos-2025-11-30.xlsx"  // Opcional
}
```

## Response Error

```json
{
  "success": false,
  "message": "Error al descargar Excel desde Colppy: Timeout esperando descarga",
  "data": null
}
```

## WebSocket Progress Events

Durante la ejecución del RPA, enviar eventos de progreso vía WebSocket:

```json
{
  "type": "colppy-progress",
  "scope": "movimientos",
  "tenantId": "d9d1c7f9-8909-4d43-a32b-278174459446",
  "current": 50,
  "total": 150,
  "message": "Procesando movimiento 50 de 150: Cliente ABC",
  "timestamp": "2025-11-30T12:00:00Z"
}
```

**Eventos a enviar:**
1. `type: 'start'` - Inicio del proceso
2. `type: 'progress'` - Progreso (cada N movimientos procesados)
3. `type: 'complete'` - Finalización exitosa
4. `type: 'error'` - Error en el proceso

## Validaciones

1. **Credenciales:**
   - Si no hay credenciales en el request ni en storage → Error 400
   - Validar formato de email si se proporciona

2. **Fechas:**
   - Si se proporcionan, validar formato YYYY-MM-DD
   - `fechaDesde` debe ser anterior o igual a `fechaHasta`

3. **Excel:**
   - Validar que el archivo descargado sea un Excel válido
   - Validar que contenga las columnas esperadas
   - Manejar archivos vacíos o con formato incorrecto

## Manejo de Errores

### Errores Comunes

1. **Timeout en descarga:**
   - Esperar máximo 60 segundos por la descarga
   - Si timeout → Retornar error con mensaje descriptivo

2. **Excel corrupto o formato incorrecto:**
   - Validar estructura antes de procesar
   - Retornar error con detalles del problema

3. **Fallo en navegación:**
   - Si no se encuentra el botón "Tesorería" → Error
   - Si no se encuentra el botón Excel → Error
   - Implementar retry con backoff exponencial

4. **Errores de procesamiento:**
   - Continuar procesando aunque falle una fila
   - Agregar errores a un array y retornarlos en `data.errores`

## Consideraciones Técnicas

1. **Browser/Headless:**
   - Usar Puppeteer, Playwright o Selenium
   - Configurar timeout adecuado
   - Esperar a que los elementos sean clickeables

2. **Descarga de Archivos:**
   - Configurar el navegador para descargar en una carpeta temporal
   - Esperar a que el archivo aparezca en el sistema de archivos
   - Validar que el archivo esté completo antes de procesar

3. **Procesamiento de Excel:**
   - Usar librería como `xlsx`, `exceljs` o similar
   - Leer todas las filas (excepto header)
   - Validar tipos de datos antes de insertar

4. **Base de Datos:**
   - Usar transacciones para garantizar consistencia
   - Implementar upsert (insert o update si existe)
   - Validar duplicados por fecha + concepto + monto

5. **Almacenamiento S3 (Opcional):**
   - Subir el Excel procesado a S3
   - Retornar URL en `archivoS3` para referencia futura

## Ejemplo de Implementación (Pseudocódigo)

```javascript
async function sincronizarMovimientos(req) {
  const { fechaDesde, fechaHasta, email, password } = req.body;
  
  // 1. Obtener credenciales
  const creds = email && password 
    ? { email, password }
    : await obtenerCredencialesGuardadas();
  
  // 2. Iniciar navegador
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // 3. Login en Colppy
  await loginColppy(page, creds);
  
  // 4. Navegar a Tesorería
  await page.click('button#ext-gen48.x-btn-text.treasury-icon');
  await page.waitForTimeout(2000);
  
  // 5. Descargar Excel
  await page.click('div#ext-gen159.x-tool.x-tool-excel');
  
  // 6. Esperar descarga
  const excelPath = await esperarDescargaExcel('/tmp/downloads', 60000);
  
  // 7. Procesar Excel
  const movimientos = await procesarExcel(excelPath);
  
  // 8. Guardar en BD
  const resultado = await guardarMovimientos(movimientos);
  
  // 9. Limpiar archivo temporal
  await fs.unlink(excelPath);
  
  // 10. Cerrar navegador
  await browser.close();
  
  return {
    success: true,
    message: `Movimientos sincronizados: ${resultado.total} procesados`,
    data: resultado
  };
}
```

## Testing

1. **Test con credenciales válidas**
2. **Test con Excel vacío**
3. **Test con Excel malformado**
4. **Test con timeout en descarga**
5. **Test con elementos no encontrados**
6. **Test con fechas inválidas**

## Notas Adicionales

- El RPA debe ser robusto ante cambios menores en la UI de Colppy
- Considerar usar selectores más estables si es posible (data attributes, texto)
- Implementar logging detallado para debugging
- Considerar rate limiting para evitar bloqueos de Colppy
- Monitorear el tiempo de ejecución y optimizar si excede 5 minutos

