import { SensorData } from "../entities/SensorData";

export interface ISensorDataRepository {
  save(sensorData: SensorData): Promise<void>;
  findLatest(): Promise<SensorData | null>;
  findById(id: string): Promise<SensorData | null>;
  findAll(): Promise<SensorData[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<SensorData[]>;
}
