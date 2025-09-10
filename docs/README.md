# Arquitectura del Sistem**Flujos incluidos:**

- Proceso de registro de usuarios
- Proceso de autenticación y login
- Proceso de validación de tokens JWT
- Proceso exitoso de creación de orden con autenticación
- Manejo de errores por stock insuficiente
- Manejo de errores de autenticación
- Comunicación asíncrona entre servicios vía NATSicro Store

Esta documentación contiene los diagramas UML que representan la arquitectura del sistema de microservicios Micro Store.

## 📋 Diagramas Disponibles

### 1. Diagrama de Arquitectura Simplificado (`simple-architecture.puml`)

**Propósito:** Vista general simplificada y colorida de la arquitectura completa.

**Componentes incluidos:**

- **Clientes externos** (Web, Mobile, Desktop)
- **API Gateway** (Puerto 3000)
- **NATS Server** (Broker de mensajes)
- **Servicio de Autenticación** (Puerto 3003 + MongoDB)
- **Servicio de Productos** (Puerto 3001 + SQLite)
- **Servicio de Órdenes** (Puerto 3002 + PostgreSQL)

### 2. Diagrama de Arquitectura Detallado (`architecture-diagram.puml`)

**Propósito:** Muestra la vista técnica detallada de la arquitectura de microservicios.

**Componentes incluidos:**

- **Clientes externos** (Web, Mobile, Desktop)
- **API Gateway** (Puerto 3000)
- **NATS Server** (Broker de mensajes)
- **Servicio de Autenticación** (Puerto 3003 + MongoDB)
- **Servicio de Productos** (Puerto 3001 + SQLite)
- **Servicio de Órdenes** (Puerto 3002 + PostgreSQL)
- **Librerías compartidas**
- **Infraestructura Docker**

### 3. Diagrama de Secuencia (`sequence-diagram.puml`)

**Propósito:** Ilustra el flujo de comunicación para procesos de autenticación y creación de órdenes.

**Flujos incluidos:**

- Proceso de registro de usuarios
- Proceso de autenticación y login
- Proceso de validación de tokens JWT
- Proceso exitoso de creación de orden con autenticación
- Manejo de errores por stock insuficiente
- Manejo de errores de autenticación
- Comunicación asíncrona entre servicios vía NATS

### 4. Diagrama de Componentes (`component-diagram.puml`)

**Propósito:** Detalla la estructura interna de cada microservicio.

**Detalles incluidos:**

- Módulos NestJS de cada servicio
- Controladores, servicios y repositorios
- Integración con Prisma ORM
- Configuración de transporte NATS
- Dependencias de librerías compartidas

## 🛠️ Cómo Visualizar los Diagramas

### Opción 1: VS Code con PlantUML

1. Instala la extensión "PlantUML" en VS Code
2. Abre cualquier archivo `.puml`
3. Presiona `Ctrl+Shift+P` y busca "PlantUML: Preview Current Diagram"
4. O usa `Alt+D` para vista previa

### Opción 2: PlantUML Online

1. Ve a [plantuml.com/plantuml](http://www.plantuml.com/plantuml/)
2. Copia el contenido del archivo `.puml`
3. Pega en el editor online
4. Genera la imagen

### Opción 3: PlantUML Local

```bash
# Instalar PlantUML (requiere Java)
npm install -g node-plantuml

# Generar imágenes PNG
puml generate docs/architecture-diagram.puml -o docs/images/
puml generate docs/sequence-diagram.puml -o docs/images/
puml generate docs/component-diagram.puml -o docs/images/
```

## 🏗️ Arquitectura del Sistema

### Patrón de Diseño

- **Arquitectura:** Microservicios
- **Comunicación:** Event-driven con NATS
- **API Gateway:** Punto único de entrada
- **Base de datos:** Por servicio (Database per Service)

### Tecnologías Principales

- **Framework:** NestJS (Node.js + TypeScript)
- **Message Broker:** NATS
- **ORM:** Prisma
- **Bases de datos:** PostgreSQL, SQLite, MongoDB
- **Autenticación:** JWT (JSON Web Tokens)
- **Containerización:** Docker + Docker Compose

### Principios Aplicados

- **Single Responsibility:** Cada servicio tiene una responsabilidad específica
- **Loose Coupling:** Servicios independientes comunicados por eventos
- **High Cohesion:** Funcionalidad relacionada agrupada en módulos
- **Scalability:** Servicios escalables independientemente

## 📊 Métricas y Puertos

| Servicio | Puerto    | Base de Datos | Propósito                      |
| -------- | --------- | ------------- | ------------------------------ |
| Gateway  | 3000      | -             | API REST y ruteo               |
| Auth     | 3003      | MongoDB       | Autenticación y autorización   |
| Products | 3001      | SQLite        | Gestión de productos           |
| Orders   | 3002      | PostgreSQL    | Gestión de órdenes             |
| NATS     | 4222/8222 | -             | Message broker                 |
| MongoDB  | 27017     | -             | Base de datos de usuarios      |

## 🔄 Flujos de Comunicación

### Flujo Principal: Creación de Orden Autenticada

1. Cliente → Gateway (Registro/Login HTTP REST)
2. Gateway → NATS (Evento de autenticación)
3. Auth Service ← NATS (Validar credenciales/crear usuario)
4. Auth Service → NATS (Token JWT generado)
5. Gateway ← NATS (Respuesta de autenticación)
6. Cliente ← Gateway (Token JWT)
7. Cliente → Gateway (Crear orden con token)
8. Gateway → NATS (Validar token)
9. Auth Service ← NATS (Verificar JWT)
10. Auth Service → NATS (Token válido)
11. Gateway → NATS (Evento de validación de producto)
12. Products Service ← NATS (Validar producto/stock)
13. Products Service → NATS (Confirmación)
14. Orders Service ← NATS (Crear orden)
15. Orders Service → NATS (Orden creada)
16. Gateway ← NATS (Respuesta)
17. Cliente ← Gateway (Respuesta HTTP)

### Ventajas de esta Arquitectura

- **Escalabilidad:** Cada servicio puede escalarse independientemente
- **Resiliencia:** Fallo en un servicio no afecta los demás
- **Mantenibilidad:** Código organizado por dominio de negocio
- **Flexibilidad:** Fácil agregar nuevos servicios
- **Performance:** Comunicación asíncrona no bloquea procesos

## 📝 Notas Técnicas

### Shared Libraries

Las librerías compartidas (`shared/`) contienen:

- DTOs comunes entre servicios
- DTOs específicos de autenticación
- Helpers y utilidades
- Enums y constantes
- Tipos TypeScript compartidos

### Docker Network

Todos los servicios ejecutan en una red Docker interna que permite:

- Comunicación entre contenedores por nombre
- Aislamiento del host
- Configuración de puertos específicos
- Volúmenes para desarrollo (hot reload)

### Health Checks

- PostgreSQL incluye health checks
- MongoDB incluye health checks con replica set
- NATS proporciona métricas en puerto 8222
- Servicios NestJS incluyen endpoints de health

---

**Última actualización:** Septiembre 2025  
**Versión:** 1.0  
**Autor:** Sistema de Microservicios Micro Store
