# Requerimientos del Backend para Sistema de Caja Diaria

## 🎯 Resumen
El frontend está completamente implementado y funcional, pero necesita un backend que implemente los endpoints de API para que el sistema funcione completamente.

## 📋 Endpoints Requeridos

### 1. **Caja Diaria - Movimientos**

#### `GET /caja-diaria/movimientos`
**Descripción**: Obtener movimientos con filtros opcionales
**Parámetros Query**:
- `fechaDesde` (opcional): Fecha de inicio
- `fechaHasta` (opcional): Fecha de fin
- `tipo` (opcional): 'ingreso' | 'egreso'
- `clienteId` (opcional): ID del cliente
- `proveedorId` (opcional): ID del proveedor
- `metodoPago` (opcional): 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta' | 'pendiente'

**Respuesta**:
```json
[
  {
    "id": "uuid",
    "fecha": "2025-01-15",
    "tipo": "ingreso",
    "concepto": "Venta de producto",
    "monto": 15000.00,
    "clienteId": "uuid",
    "proveedorId": null,
    "cliente": {
      "id": "uuid",
      "nombre": "Cliente ABC",
      "email": "cliente@email.com",
      "telefono": "+54911234567",
      "cuit": "20-12345678-9"
    },
    "proveedor": null,
    "metodoPago": "efectivo",
    "observaciones": "Pago en efectivo",
    "usuario": "usuario_actual",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
]
```

#### `POST /caja-diaria/movimientos`
**Descripción**: Crear nuevo movimiento
**Body**:
```json
{
  "fecha": "2025-01-15",
  "tipo": "ingreso",
  "concepto": "Venta de producto",
  "monto": 15000.00,
  "clienteId": "uuid",
  "proveedorId": null,
  "metodoPago": "efectivo",
  "observaciones": "Pago en efectivo",
  "usuario": "usuario_actual"
}
```

#### `PUT /caja-diaria/movimientos/:id`
**Descripción**: Actualizar movimiento existente
**Body**: Mismo formato que POST, campos opcionales

#### `DELETE /caja-diaria/movimientos/:id`
**Descripción**: Eliminar movimiento
**Respuesta**: 204 No Content

### 2. **Caja Diaria - Resumen**

#### `GET /caja-diaria/resumen`
**Descripción**: Obtener resumen diario
**Parámetros Query**:
- `fecha` (requerido): Fecha del resumen

**Respuesta**:
```json
{
  "fecha": "2025-01-15",
  "saldoInicial": 50000.00,
  "totalIngresos": 25000.00,
  "totalEgresos": 15000.00,
  "saldoFinal": 60000.00,
  "movimientos": [...], // Array de movimientos del día
  "cantidadMovimientos": 15
}
```

### 3. **Caja Diaria - Exportación**

#### `GET /caja-diaria/exportar`
**Descripción**: Exportar movimientos a Excel
**Parámetros Query**: Mismos filtros que GET movimientos
**Respuesta**: Archivo Excel (.xlsx)

### 4. **Clientes y Proveedores**

#### `GET /caja-diaria/clientes`
**Descripción**: Obtener clientes locales
**Respuesta**:
```json
[
  {
    "id": "uuid",
    "nombre": "Cliente ABC",
    "email": "cliente@email.com",
    "telefono": "+54911234567",
    "direccion": "Av. Corrientes 1234",
    "cuit": "20-12345678-9",
    "tipoDocumento": "CUIT",
    "numeroDocumento": "20-12345678-9"
  }
]
```

#### `GET /caja-diaria/proveedores`
**Descripción**: Obtener proveedores locales
**Respuesta**: Mismo formato que clientes

### 5. **Integración con Colppy**

#### `GET /colppy/clientes`
**Descripción**: Obtener clientes desde Colppy
**Headers**: 
- `Authorization: Basic <base64(email:password)>`

**Respuesta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "colppy_id",
      "nombre": "Cliente desde Colppy",
      "email": "cliente@colppy.com",
      "telefono": "+54911234567",
      "direccion": "Av. Corrientes 1234",
      "cuit": "20-12345678-9",
      "tipoDocumento": "CUIT",
      "numeroDocumento": "20-12345678-9"
    }
  ],
  "message": "Clientes obtenidos exitosamente"
}
```

#### `GET /colppy/proveedores`
**Descripción**: Obtener proveedores desde Colppy
**Headers**: Mismo que clientes
**Respuesta**: Mismo formato que clientes

#### `POST /colppy/sincronizar/clientes`
**Descripción**: Sincronizar clientes desde Colppy
**Headers**: Mismo que clientes
**Respuesta**:
```json
{
  "success": true,
  "data": {
    "count": 25
  },
  "message": "25 clientes sincronizados exitosamente"
}
```

#### `POST /colppy/sincronizar/proveedores`
**Descripción**: Sincronizar proveedores desde Colppy
**Headers**: Mismo que clientes
**Respuesta**: Mismo formato que clientes

## 🗄️ Estructura de Base de Datos

### Tabla: `movimientos_caja`
```sql
CREATE TABLE movimientos_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    concepto VARCHAR(255) NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    cliente_id UUID REFERENCES clientes(id),
    proveedor_id UUID REFERENCES proveedores(id),
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia', 'cheque', 'tarjeta', 'pendiente')),
    observaciones TEXT,
    usuario VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `clientes`
```sql
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50),
    direccion TEXT,
    cuit VARCHAR(20),
    tipo_documento VARCHAR(50),
    numero_documento VARCHAR(50),
    colppy_id VARCHAR(100), -- ID en Colppy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `proveedores`
```sql
CREATE TABLE proveedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50),
    direccion TEXT,
    cuit VARCHAR(20),
    tipo_documento VARCHAR(50),
    numero_documento VARCHAR(50),
    colppy_id VARCHAR(100), -- ID en Colppy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `configuracion_caja`
```sql
CREATE TABLE configuracion_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    saldo_inicial DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fecha)
);
```

## 🔧 Configuración del Backend

### Variables de Entorno Requeridas
```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/espinosaguerci

# Colppy API
COLPPY_API_URL=https://api.colppy.com
COLPPY_EMAIL=matiespinosa05@gmail.com
COLPPY_PASSWORD=Mati.46939

# Autenticación
JWT_SECRET=your_jwt_secret
TENANT_ID=043ef5db-f30e-48c7-81d8-d3893b9496bb

# Servidor
PORT=3001
NODE_ENV=development
```

### Middleware Requerido
1. **Autenticación**: Verificar token JWT
2. **Tenant**: Verificar tenant-id en headers
3. **CORS**: Permitir requests del frontend
4. **Rate Limiting**: Limitar requests a Colppy
5. **Logging**: Log de todas las operaciones

## 📊 Funcionalidades Específicas

### 1. **Cálculo de Saldo Inicial**
- El saldo inicial debe calcularse automáticamente
- Si no existe configuración para una fecha, usar el saldo final del día anterior
- Permitir configuración manual del saldo inicial

### 2. **Validaciones de Negocio**
- No permitir egresos mayores al saldo disponible
- Validar que clientes/proveedores existan
- Validar formatos de CUIT
- Validar montos positivos

### 3. **Sincronización con Colppy**
- Implementar cache para evitar requests excesivos
- Manejar errores de conexión con Colppy
- Implementar retry logic
- Log de sincronizaciones

### 4. **Exportación a Excel**
- Generar archivos Excel con formato específico
- Incluir todas las columnas relevantes
- Aplicar filtros correctamente
- Formatear números como moneda argentina

## 🚀 Tecnologías Recomendadas

### Backend Framework
- **Node.js + Express** o **NestJS**
- **TypeScript** para consistencia con frontend
- **Prisma** o **TypeORM** para ORM

### Base de Datos
- **PostgreSQL** (recomendado)
- **MySQL** (alternativa)

### Integración con Colppy
- **Axios** para HTTP requests
- **node-cron** para sincronización automática

### Exportación Excel
- **ExcelJS** para generar archivos Excel
- **Multer** para manejo de archivos

## 📝 Próximos Pasos

1. **Configurar Base de Datos**: Crear las tablas necesarias
2. **Implementar Endpoints**: Comenzar con los endpoints básicos
3. **Integrar Colppy**: Implementar la sincronización
4. **Testing**: Crear tests para todos los endpoints
5. **Deploy**: Configurar ambiente de producción

## ⚠️ Consideraciones Importantes

1. **Seguridad**: Validar todos los inputs, sanitizar datos
2. **Performance**: Implementar índices en la base de datos
3. **Backup**: Configurar backup automático de la base de datos
4. **Monitoreo**: Implementar logging y monitoreo de errores
5. **Escalabilidad**: Considerar cache (Redis) para consultas frecuentes

El frontend está listo y esperando estos endpoints. Una vez implementado el backend, el sistema funcionará completamente.

