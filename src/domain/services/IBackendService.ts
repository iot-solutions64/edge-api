import { SensorData } from "../entities/SensorData";
import { Thresholds } from "../valueObjects/Thresholds";

export interface IBackendService {
  sendSensorData(data: SensorData): Promise<void>;
  getThresholds(): Promise<Thresholds | null>;
}
