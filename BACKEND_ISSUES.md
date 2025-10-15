# 🚨 Problemas del Backend Identificados

## 📋 Resumen de Errores

### 1. **Tenant Undefined**
```
LOG [ReportesService] Generando reporte de proveedores para tenant undefined
```

**Problema**: El backend no está recibiendo el header `tenant-id` correctamente.

**Headers que envía el frontend**:
```
tenant-id: d9d1c7f9-8909-4d43-a32b-278174459446
Authorization: Bearer <token>
Content-Type: application/json
```

**Solución Backend**:
- Verificar que el middleware de autenticación esté extrayendo el header `tenant-id`
- Asegurar que el header se esté pasando al servicio de reportes

### 2. **Tabla MovimientoCaja No Existe**
```
The table `contador_schema.MovimientoCaja` does not exist in the current database.
```

**Problema**: La tabla `MovimientoCaja` no existe en el esquema de la base de datos.

**Solución Backend**:
1. **Crear la tabla en la base de datos**:
```sql
CREATE TABLE contador_schema.MovimientoCaja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    concepto VARCHAR(255) NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    cliente_id UUID REFERENCES contador_schema.clientes(id),
    proveedor_id UUID REFERENCES contador_schema.proveedores(id),
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia', 'cheque', 'tarjeta', 'pendiente')),
    observaciones TEXT,
    usuario VARCHAR(100) NOT NULL,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **O ejecutar migración de Prisma**:
```bash
npx prisma migrate dev --name create-movimiento-caja
npx prisma generate
```

## 🔧 Acciones Requeridas en el Backend

### 1. **Verificar Middleware de Autenticación**
```typescript
// En el middleware de autenticación
const tenantId = req.headers['tenant-id'];
if (!tenantId) {
  throw new UnauthorizedException('Tenant ID is required');
}
```

### 2. **Verificar Esquema de Prisma**
```prisma
// En schema.prisma
model MovimientoCaja {
  id          String   @id @default(uuid())
  fecha       DateTime
  tipo        String
  concepto    String
  monto       Decimal
  clienteId   String?
  proveedorId String?
  metodoPago  String
  observaciones String?
  usuario     String
  tenantId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("MovimientoCaja")
  @@schema("contador_schema")
}
```

### 3. **Verificar Configuración de Base de Datos**
- Asegurar que el esquema `contador_schema` existe
- Verificar permisos de la base de datos
- Confirmar que Prisma está conectado correctamente

## 🎯 Estado del Frontend

✅ **Frontend funcionando correctamente**:
- Headers enviados correctamente
- Token JWT incluido
- Tenant ID incluido
- Llamadas a API configuradas

## 📞 Próximos Pasos

1. **Backend**: Crear tabla `MovimientoCaja` en la base de datos
2. **Backend**: Verificar middleware de autenticación para `tenant-id`
3. **Backend**: Ejecutar migraciones de Prisma si es necesario
4. **Testing**: Probar endpoint `/reportes/proveedores` después de las correcciones
