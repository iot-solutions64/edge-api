import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DIContainer } from "./DIContainer";

// Cargar variables de entorno
dotenv.config();

async function startServer() {
  try {
    // Crear e inicializar el contenedor de dependencias
    const container = new DIContainer();
    await container.initialize();

    // Crear la aplicación Express
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Rutas
    app.use("/", container.apiRoutes.getRouter());

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({
        status: "OK",
        message: "Edge API with sql.js SQLite is running",
      });
    });

    // Puerto del servidor
    const PORT = process.env.PORT || 3000;

    // Enviar thresholds periódicamente por MQTT
    setInterval(async () => {
      try {
        const thresholds = await container.backendService.getThresholds();

        if (thresholds) {
          container.mqttService.publishConfigUpdate(
            thresholds.temperatureMax,
            thresholds.humidityMin
          );
        } else {
          console.warn("No se pudo obtener los thresholds desde el backend.");
        }
        console.log("📡 Thresholds enviados por MQTT");
      } catch (error) {
        console.error("❌ Error al enviar thresholds por MQTT:", error);
      }
    }, 20_000); // cada 20 segundos

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Edge API DDD listening on port ${PORT}`);
      console.log(
        `💾 Using sql.js SQLite database (no native compilation required)`
      );
      console.log(
        `📡 MQTT connected to topic: ${
          process.env.MQTT_TOPIC || "iot/irrigation/data/david_soto_salis"
        }`
      );
      console.log(
        `🔗 Backend URL: ${process.env.BACKEND_URL || "http://localhost:8080"}`
      );
    });

    // Manejo de señales de terminación
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      await container.closeDatabase();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      await container.closeDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();
