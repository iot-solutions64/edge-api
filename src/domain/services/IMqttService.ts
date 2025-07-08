import { SensorData } from "../entities/SensorData";

export interface IMqttService {
  getLatestData(): SensorData | null;
  subscribe(callback: (data: SensorData) => void): void;
  publishConfigUpdate(temperatureMax: number, humidityMin: number): void;
}
