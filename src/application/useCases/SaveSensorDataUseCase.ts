import { SensorData } from "../../domain/entities/SensorData";
import { ISensorDataRepository } from "../../domain/repositories/ISensorDataRepository";
import { IBackendService } from "../../domain/services/IBackendService";

export class SaveSensorDataUseCase {
  constructor(
    private sensorDataRepository: ISensorDataRepository,
    private backendService: IBackendService
  ) {}

  async execute(sensorData: SensorData): Promise<void> {
    // Guardar en base de datos local
    await this.sensorDataRepository.save(sensorData);

    // Enviar al backend externo
    try {
      await this.backendService.sendSensorData(sensorData);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // En un caso real, podrías implementar un retry o queue
    }
  }
}
