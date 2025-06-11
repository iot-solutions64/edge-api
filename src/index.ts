import express, { Request, Response } from "express";
import cors from "cors";
import { MqttService } from "./services/mqttService";
import { SensorData } from "./types/sensor";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Edge API listening on port ${PORT}`);
});
