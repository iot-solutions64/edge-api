import { SensorData } from "../../domain/entities/SensorData";
import { ISensorDataRepository } from "../../domain/repositories/ISensorDataRepository";

export class GetLatestSensorDataUseCase {
  constructor(private sensorDataRepository: ISensorDataRepository) {}

  async execute(): Promise<SensorData | null> {
    return await this.sensorDataRepository.findLatest();
  }
}
