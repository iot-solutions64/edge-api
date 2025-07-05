import { SensorData } from "../entities/SensorData";

export interface IMqttService {
  getLatestData(): SensorData | null;
  subscribe(callback: (data: SensorData) => void): void;
}
