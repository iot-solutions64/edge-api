import express, { Request, Response } from "express";
import cors from "cors";
import { MqttService } from "./services/mqttService";
import { SensorData } from "./types/sensor";
import { getThresholdsFromBackend } from "./services/backendService";

const mqttService = new MqttService();

// Express Setup
const app = express();
app.use(cors());

app.get("/data", (req: Request, res: Response) => {
  const latestData: SensorData | null = mqttService.getLatestData();
  if (latestData) {
    res.json(latestData);
  } else {
    res.status(404).json({ error: "No data received yet" });
  }
});

app.get("/irrigation/status", (req: Request, res: Response) => {
  const latestData: SensorData | null = mqttService.getLatestData();
  if (latestData) {
    const shouldIrrigate = latestData.humidity < 30;
    res.json({ active: shouldIrrigate });
  } else {
    res.status(404).json({ error: "No data available" });
  }
});

app.get("/irrigation/thresholds", async (req: Request, res: Response) => {
  try {
    const response = await getThresholdsFromBackend();
    console.log("Thresholds obtenidos del backend:", response);
    if (response) {
      res.json(response);
    } else {
      res.status(404).json({ error: "No se encontraron thresholds" });
    }
  } catch (error) {
    console.error("Error obteniendo thresholds del backend:", error);
    res.status(500).json({ error: "No se pudo obtener los thresholds" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Edge API listening on port ${PORT}`);
});
