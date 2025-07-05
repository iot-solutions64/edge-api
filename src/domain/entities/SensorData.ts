import { v4 as uuidv4 } from "uuid";

export class SensorData {
  public readonly id: string;
  public readonly temperature: number;
  public readonly humidity: number;
  public readonly volume: number;
  public readonly timestamp: Date;

  constructor(
    temperature: number,
    humidity: number,
    volume: number,
    timestamp?: Date,
    id?: string
  ) {
    this.id = id || uuidv4();
    this.temperature = temperature;
    this.humidity = humidity;
    this.volume = volume;
    this.timestamp = timestamp || new Date();
  }

  public static fromRawData(data: {
    temperature: number;
    humidity: number;
    volume: number;
    timestamp?: number;
  }): SensorData {
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    return new SensorData(
      data.temperature,
      data.humidity,
      data.volume,
      timestamp
    );
  }

  public shouldIrrigate(humidityThreshold: number = 30): boolean {
    return this.humidity < humidityThreshold;
  }

  public toJSON(): any {
    return {
      id: this.id,
      temperature: this.temperature,
      humidity: this.humidity,
      volume: this.volume,
      timestamp: this.timestamp.getTime(),
    };
  }
}
