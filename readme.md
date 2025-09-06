# Micro Store - Microservices Architecture

🛍️ **Micro Store** es un sistema de comercio electrónico basado en arquitectura de microservicios desarrollado con NestJS, NATS y Docker.

## 🏗️ Arquitectura

El proyecto implementa un patrón de microservicios con los siguientes componentes:

- **Gateway**: API REST que actúa como punto único de entrada
- **Products Service**: Gestión de catálogo de productos e inventario
- **Orders Service**: Procesamiento de órdenes y gestión de pagos
- **NATS**: Message broker para comunicación asíncrona entre servicios
- **PostgreSQL**: Base de datos para el servicio de órdenes
- **SQLite**: Base de datos para el servicio de productos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- Git

### Instalación

```bash
# Clonar el proyecto principal
git clone https://github.com/Kevin-Caballero/micro-store.git
cd micro-store

# Instalar dependencias del proyecto principal
npm install

# Clonar todos los microservicios
npm run pull

# Preparar microservicios (instalar dependencias y hacer build)
npm run prepare

# Iniciar todos los servicios
npm start
```

### Instalación Rápida

```bash
# Clonar, preparar e iniciar todo en un comando
git clone https://github.com/Kevin-Caballero/micro-store.git
cd micro-store
npm install
npm run setup
```

## 🔧 Flujo de Desarrollo

### Primer Setup (Desarrollo Inicial)

```bash
npm install          # Instalar deps del proyecto principal
npm run pull         # Clonar microservicios desde GitHub
npm run prepare      # Instalar deps y build de cada servicio
npm start            # Iniciar con Docker
```

### Desarrollo Diario

```bash
npm start            # Iniciar servicios
# ... desarrollar ...
npm stop             # Detener servicios
```

### Actualizar Servicios

```bash
npm run pull         # Actualizar código desde repos
npm run prepare      # Reinstalar deps y rebuild
npm start            # Reiniciar servicios
```

## 📋 Scripts Disponibles

| Comando                 | Descripción                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run pull`          | Clona/actualiza todos los microservicios                 |
| `npm run prepare`       | Instala dependencias y hace build de todos los servicios |
| `npm start`             | Inicia todos los servicios con Docker                    |
| `npm stop`              | Detiene todos los servicios                              |
| `npm run setup`         | Ejecuta pull + prepare + start (instalación completa)    |
| `npm run update:shared` | Actualiza librerías compartidas                          |

## 🌐 Endpoints y Puertos

| Servicio     | Puerto | URL                   | Descripción                |
| ------------ | ------ | --------------------- | -------------------------- |
| Gateway      | 3000   | http://localhost:3000 | API REST principal         |
| Products     | 3001   | http://localhost:3001 | API de productos (interno) |
| Orders       | 3002   | http://localhost:3002 | API de órdenes (interno)   |
| NATS         | 4222   | nats://localhost:4222 | Message broker             |
| NATS Monitor | 8222   | http://localhost:8222 | Monitoreo NATS             |
| PostgreSQL   | 5432   | localhost:5432        | Base de datos órdenes      |

## 🛠️ Configuración de Desarrollo

### Desarrollo Local

Para desarrollar servicios individuales:

```bash
# Entrar al servicio específico
cd services/gateway  # o products, orders

# Instalar dependencias del servicio
npm install

# Modo desarrollo (requiere NATS corriendo)
npm run start:dev
```

## 📊 Monitoreo y Logs

### Docker Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f gateway
docker-compose logs -f products
docker-compose logs -f orders
```

### NATS Monitoring

- Interfaz web: http://localhost:8222
- Métricas en tiempo real
- Estado de conexiones y suscripciones

## 🏛️ Estructura del Proyecto

```
micro-store/
├── docs/                    # Documentación y diagramas UML
│   ├── architecture-diagram.puml
│   ├── sequence-diagram.puml
│   ├── component-diagram.puml
│   └── README.md
├── scripts/                 # Scripts de automatización
│   ├── pull.js             # Clonado de microservicios
│   ├── prepare.js          # Preparación de servicios (deps + build)
│   └── update-shared.js    # Actualización de librerías
├── services/               # Microservicios (clonados automáticamente)
│   ├── gateway/           # API Gateway
│   ├── products/          # Servicio de productos
│   └── orders/            # Servicio de órdenes
├── shared/                # Librerías compartidas
│   └── src/
│       ├── common/        # DTOs y utilities comunes
│       ├── products/      # DTOs de productos
│       └── orders/        # DTOs de órdenes
├── docker-compose.yml     # Configuración Docker
├── package.json          # Scripts y dependencias
└── README.md            # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **Backend**: NestJS (Node.js + TypeScript)
- **Message Broker**: NATS
- **ORM**: Prisma
- **Bases de Datos**: PostgreSQL, SQLite
- **Containerización**: Docker, Docker Compose
- **Validación**: class-validator, class-transformer
- **Documentación**: PlantUML para diagramas

## 📚 Documentación Adicional

- [Diagramas de Arquitectura](./docs/README.md) - Diagramas UML detallados
- [Gateway Service](./services/gateway/README.md) - Documentación del Gateway
- [Products Service](./services/products/README.md) - Servicio de productos
- [Orders Service](./services/orders/README.md) - Servicio de órdenes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Kevin Caballero**

- GitHub: [@Kevin-Caballero](https://github.com/Kevin-Caballero)

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!
