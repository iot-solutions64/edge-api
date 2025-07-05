import { SensorData } from "../../domain/entities/SensorData";
import { ISensorDataRepository } from "../../domain/repositories/ISensorDataRepository";

export class CheckIrrigationStatusUseCase {
  constructor(private sensorDataRepository: ISensorDataRepository) {}

  async execute(
    humidityThreshold: number = 30
  ): Promise<{ active: boolean } | null> {
    const latestData = await this.sensorDataRepository.findLatest();

    if (!latestData) {
      return null;
    }

    return {
      active: latestData.shouldIrrigate(humidityThreshold),
    };
  }
}
