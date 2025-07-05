import { SensorData } from "../../domain/entities/SensorData";
import { ISensorDataRepository } from "../../domain/repositories/ISensorDataRepository";

export class InMemorySensorDataRepository implements ISensorDataRepository {
  private sensorDataList: SensorData[] = [];

  async save(sensorData: SensorData): Promise<void> {
    this.sensorDataList.push(sensorData);
    // Mantener solo los últimos 1000 registros para evitar problemas de memoria
    if (this.sensorDataList.length > 1000) {
      this.sensorDataList = this.sensorDataList.slice(-1000);
    }
  }

  async findLatest(): Promise<SensorData | null> {
    if (this.sensorDataList.length === 0) {
      return null;
    }
    return this.sensorDataList[this.sensorDataList.length - 1];
  }

  async findById(id: string): Promise<SensorData | null> {
    return this.sensorDataList.find((data) => data.id === id) || null;
  }

  async findAll(): Promise<SensorData[]> {
    return [...this.sensorDataList].reverse(); // Más recientes primero
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<SensorData[]> {
    return this.sensorDataList
      .filter(
        (data) => data.timestamp >= startDate && data.timestamp <= endDate
      )
      .reverse(); // Más recientes primero
  }
}
