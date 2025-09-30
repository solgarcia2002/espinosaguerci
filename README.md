# Espinosa&Guerci - Sistema de Gestión

Sistema completo de gestión empresarial con integración a Colppy y funcionalidades de caja diaria.

## 🚀 Características Principales

### 📑 Sistema de Caja Diaria
Sistema completo de gestión de caja diaria que reemplaza el archivo Excel `CAJA DIARIA 11-08-2025.xlsx` con una interfaz web moderna y funcional.

La interfaz está organizada en **8 tabs principales** que replican la estructura del Excel original:

1. **📊 Resumen Diario**: Vista general del día con métricas clave
2. **💰 Movimientos**: Lista completa de todos los movimientos
3. **📈 Ingresos**: Solo movimientos de ingreso con filtros específicos
4. **📉 Egresos**: Solo movimientos de egreso con filtros específicos
5. **👥 Clientes**: Gestión completa de clientes con sincronización Colppy
6. **🏢 Proveedores**: Gestión completa de proveedores con sincronización Colppy
7. **📋 Reportes**: Estadísticas avanzadas y exportación
8. **⚙️ Configuración**: Configuración de caja y sincronización

### 📊 Gestión de Movimientos
- **Ingresos y Egresos**: Registro completo de todos los movimientos de caja
- **Múltiples Métodos de Pago**: Efectivo, transferencia, cheque, tarjeta
- **Conceptos Personalizables**: Descripción detallada de cada movimiento
- **Observaciones**: Campo adicional para notas importantes

### 👥 Integración con Clientes y Proveedores
- **Sincronización con Colppy**: Descarga automática de clientes y proveedores
- **Asociación de Movimientos**: Vinculación de ingresos con clientes y egresos con proveedores
- **Datos Completos**: Información de contacto, CUIT, documentos
- **Búsqueda Avanzada**: Filtros por nombre, email, CUIT

### 📈 Resumen y Estadísticas
- **Resumen Diario**: Saldo inicial, totales de ingresos/egresos, saldo final
- **Estadísticas por Método de Pago**: Distribución de movimientos
- **Top Clientes y Proveedores**: Principales transacciones
- **Contadores de Movimientos**: Cantidad total de operaciones

### 🔍 Filtros y Búsqueda
- **Filtros por Fecha**: Rango de fechas personalizable
- **Filtros por Tipo**: Ingresos, egresos o todos
- **Filtros por Método de Pago**: Específico o todos
- **Exportación a Excel**: Descarga de reportes filtrados

## 🏗️ Estructura del Proyecto

```
src/
├── types/
│   ├── cajaDiaria.ts              # Tipos para caja diaria
│   ├── supplierPayment.ts         # Tipos para pagos a proveedores
│   └── next-auth.d.ts            # Tipos de autenticación
├── services/
│   ├── cajaDiariaService.ts       # Servicio principal de caja
│   ├── colppyService.ts           # Integración con Colppy
│   ├── apiClient.ts              # Cliente API base
│   └── supplierPaymentService.ts # Servicio de pagos a proveedores
├── components/
│   ├── caja-diaria/
│   │   ├── CajaDiariaTabs.tsx    # Componente principal con tabs
│   │   ├── MovimientoForm.tsx    # Formulario de movimientos
│   │   ├── ResumenCaja.tsx      # Componente de resumen
│   │   ├── MovimientosTable.tsx # Tabla de movimientos
│   │   ├── FiltrosCaja.tsx      # Filtros y exportación
│   │   ├── EstadisticasCaja.tsx # Estadísticas y gráficos
│   │   ├── GestionClientes.tsx  # Gestión de clientes
│   │   └── GestionProveedores.tsx # Gestión de proveedores
│   ├── admin-layout.tsx          # Layout para administración
│   ├── Layout.tsx               # Layout principal
│   ├── Sidebar.tsx              # Barra lateral de navegación
│   └── ExecutionHistory.tsx     # Historial de ejecuciones
├── contexts/
│   ├── AuthContext.tsx          # Contexto de autenticación
│   ├── ProductFiltersContext.tsx # Contexto de filtros
│   └── TenantContext.tsx        # Contexto de tenant
├── app/
│   ├── (admin)/
│   │   ├── caja-diaria/
│   │   │   └── page.tsx         # Página principal de caja diaria
│   │   ├── configuracion/
│   │   │   └── page.tsx         # Página de configuración
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard principal
│   │   └── pago-proveedores/
│   │       └── page.tsx         # Página de pagos a proveedores
│   ├── login/
│   │   └── page.tsx             # Página de login
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Página principal
└── lib/
    ├── amplify.ts               # Configuración de AWS Amplify
    └── utils.ts                 # Utilidades generales
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Authentication**: NextAuth.js
- **Cloud Services**: AWS Amplify
- **Package Manager**: pnpm

## 📋 API Endpoints Requeridos

### Caja Diaria
- `GET /caja-diaria/movimientos` - Obtener movimientos con filtros
- `POST /caja-diaria/movimientos` - Crear nuevo movimiento
- `PUT /caja-diaria/movimientos/:id` - Actualizar movimiento
- `DELETE /caja-diaria/movimientos/:id` - Eliminar movimiento
- `GET /caja-diaria/resumen` - Obtener resumen diario
- `GET /caja-diaria/exportar` - Exportar a Excel

### Clientes y Proveedores
- `GET /caja-diaria/clientes` - Obtener clientes locales
- `GET /caja-diaria/proveedores` - Obtener proveedores locales

### Colppy Integration
- `GET /colppy/clientes` - Obtener clientes de Colppy
- `GET /colppy/proveedores` - Obtener proveedores de Colppy
- `POST /colppy/sincronizar/clientes` - Sincronizar clientes
- `POST /colppy/sincronizar/proveedores` - Sincronizar proveedores

### Pagos a Proveedores
- `GET /supplier-payments/processes` - Obtener procesos de pago
- `POST /supplier-payments/processes/:id/execute` - Ejecutar proceso
- `GET /supplier-payments/executions/:id` - Obtener historial de ejecución

## 🔐 Credenciales de Colppy
- **Email**: matiespinosa05@gmail.com
- **Password**: Mati.46939

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm 8.15.6+

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd espinosaguerci

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
pnpm dev
```

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=your_api_url
TENANT=your_tenant_id
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📖 Uso del Sistema

### Navegación por Tabs (Caja Diaria)
1. **Acceder a Caja Diaria**: Navegar a `/caja-diaria` desde el sidebar
2. **Seleccionar Tab**: Hacer clic en cualquier tab para cambiar de vista
3. **Resumen Diario**: Ver métricas generales del día
4. **Movimientos**: Gestionar todos los movimientos de caja
5. **Ingresos/Egresos**: Ver solo movimientos específicos
6. **Clientes/Proveedores**: Gestionar contactos y sincronizar con Colppy
7. **Reportes**: Ver estadísticas y exportar datos
8. **Configuración**: Configurar parámetros del sistema

### Funciones Principales
- **Crear Movimiento**: Botón "Nuevo Movimiento" en tabs de movimientos
- **Sincronizar con Colppy**: Botones de sincronización en tabs de clientes/proveedores
- **Filtrar Datos**: Filtros disponibles en tabs de movimientos
- **Exportar Reportes**: Botón "Exportar Excel" en tab de reportes

### Pagos a Proveedores
1. **Acceder**: Navegar a `/pago-proveedores` desde el sidebar
2. **Configurar Proceso**: Crear y configurar procesos de pago automático
3. **Ejecutar**: Ejecutar procesos manualmente o programar automáticamente
4. **Monitorear**: Ver historial de ejecuciones y resultados

## ✅ Funcionalidades Implementadas

### Caja Diaria
- [x] Tipos TypeScript para todas las entidades
- [x] Servicios de API para caja diaria y Colppy
- [x] Sistema de tabs que replica el Excel original
- [x] Formulario completo de movimientos
- [x] Tabla de movimientos con acciones
- [x] Resumen diario con métricas
- [x] Filtros avanzados
- [x] Exportación a Excel
- [x] Estadísticas y gráficos
- [x] Gestión completa de clientes
- [x] Gestión completa de proveedores
- [x] Integración con sidebar
- [x] Formateo de moneda argentina

### Sistema General
- [x] Autenticación con NextAuth.js
- [x] Layout responsive con Tailwind CSS
- [x] Navegación por sidebar
- [x] Contextos de React para estado global
- [x] Integración con AWS Amplify
- [x] Configuración de tenant multi-empresa

## 🔄 En Progreso
- [ ] Implementación del backend API
- [ ] Base de datos para persistencia
- [ ] Validaciones del lado del servidor
- [ ] Notificaciones en tiempo real
- [ ] Más tipos de reportes y gráficos
- [ ] Optimización de la sincronización con Colppy

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Ejecutar en modo desarrollo
pnpm build        # Construir para producción
pnpm start        # Ejecutar en modo producción
pnpm lint         # Ejecutar linter
```

## 📝 Notas de Desarrollo

### Estructura de Componentes
- Todos los componentes están en TypeScript
- Uso de React Hook Form para formularios
- Validación con Zod
- Styling consistente con Tailwind CSS
- Componentes reutilizables y modulares

### Integración con Colppy
- Servicio dedicado para comunicación con Colppy
- Sincronización automática de clientes y proveedores
- Manejo de errores y reintentos
- Credenciales configuradas en el servicio

### Formateo de Moneda
- Formateo específico para Argentina (ARS)
- Función utilitaria `formatCurrency` en `lib/utils.ts`
- Consistencia en toda la aplicación

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial para Espinosa&Guerci.

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.
