# Edge API for IoT Irrigation System

Una API Edge para sistemas de riego IoT desarrollada con **Domain-Driven Design (DDD)** y **TypeScript**. Esta aplicación actúa como intermediario entre sensores IoT, almacenamiento local y servicios backend remotos.

## 🌱 ¿Qué hace este proyecto?

Este sistema permite:

- **Recibir datos de sensores IoT** a través de MQTT (humedad, temperatura, pH, etc.)
- **Almacenar datos localmente** en una base de datos SQLite usando sql.js
- **Sincronizar con backend remoto** para análisis y monitoreo centralizados
- **Determinar necesidades de riego** basado en umbrales configurables de humedad
- **Gestionar umbrales** para diferentes parámetros del sensor
- **Consultar datos históricos** y estado actual del sistema

## 🏗️ Arquitectura DDD

El proyecto implementa una arquitectura de 4 capas:

- **Domain**: Entidades, value objects y contratos de repositorios
- **Application**: Casos de uso y lógica de negocio
- **Infrastructure**: Implementaciones de repositorios y servicios externos
- **Interface**: Controladores REST y DTOs

## 🚀 Cómo ejecutar el proyecto

### Prerequisitos

- Node.js (v18+)
- pnpm

### Instalación y ejecución

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm run dev

# Construir para producción
pnpm run build

# Ejecutar en producción
pnpm run start
```

## 📋 Endpoints API

- `GET /health` - Health check del servicio
- `GET /sensor-data/latest` - Obtener últimos datos del sensor
- `POST /sensor-data` - Guardar nuevos datos del sensor
- `GET /irrigation/status` - Verificar si es necesario regar
- `GET /thresholds` - Obtener umbrales configurados
- `PUT /thresholds` - Actualizar umbrales

## 🛠️ Tecnologías utilizadas

- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **SQLite + sql.js** - Base de datos local (sin compilación nativa)
- **MQTT** - Comunicación IoT
- **Axios** - Cliente HTTP
- **CORS** - Manejo de políticas de origen cruzado
