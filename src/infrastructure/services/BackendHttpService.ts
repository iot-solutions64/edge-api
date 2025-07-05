import axios from "axios";
import { SensorData } from "../../domain/entities/SensorData";
import { Thresholds } from "../../domain/valueObjects/Thresholds";
import { IBackendService } from "../../domain/services/IBackendService";

export class BackendHttpService implements IBackendService {
  private readonly baseUrl: string;
  private readonly temperatureEndpoint: string;
  private readonly humidityEndpoint: string;
  private readonly volumeEndpoint: string;
  private readonly thresholdsEndpoint: string;
  private readonly iotDataEndpoint: string;

  constructor() {
    this.baseUrl = process.env.BACKEND_URL || "http://localhost:8080";
    this.temperatureEndpoint = `${this.baseUrl}/api/v1/crop/1/temperature`;
    this.humidityEndpoint = `${this.baseUrl}/api/v1/crop/1/humidity`;
    this.volumeEndpoint = `${this.baseUrl}/api/v1/water-tanks/1/water-remaining`;
    this.thresholdsEndpoint = `${this.baseUrl}/api/v1/crop/1/thresholds`;
    this.iotDataEndpoint = `${this.baseUrl}/api/v1/iot/data`;
  }

  async sendSensorData(data: SensorData): Promise<void> {
    try {
      const promises = [
        axios.patch(this.temperatureEndpoint, {
          temperature: data.temperature,
        }),
        axios.patch(this.humidityEndpoint, { humidity: data.humidity }),
        axios.patch(this.volumeEndpoint, { waterAmount: data.volume }),
        axios.post(this.iotDataEndpoint, {
          temperature: data.temperature,
          humidity: data.humidity,
          volume: data.volume,
          timestamp: data.timestamp.getTime(),
        }),
      ];

      await Promise.all(promises);
      console.log("Datos enviados al backend Spring Boot exitosamente");
    } catch (error) {
      console.error("Error enviando datos al backend:", error);
      throw error;
    }
  }

  async getThresholds(): Promise<Thresholds | null> {
    try {
      const response = await axios.get(this.thresholdsEndpoint);
      const data = response.data;

      return new Thresholds(
        data.temperatureMaxThreshold,
        data.humidityMinThreshold
      );
    } catch (error) {
      console.error("Error obteniendo thresholds del backend:", error);
      throw error;
    }
  }
}
