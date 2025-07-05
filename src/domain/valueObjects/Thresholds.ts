export class Thresholds {
  public readonly temperatureMax: number;
  public readonly humidityMin: number;

  constructor(temperatureMax: number, humidityMin: number) {
    if (temperatureMax <= 0) {
      throw new Error("Temperature max threshold must be greater than 0");
    }
    if (humidityMin < 0 || humidityMin > 100) {
      throw new Error("Humidity min threshold must be between 0 and 100");
    }

    this.temperatureMax = temperatureMax;
    this.humidityMin = humidityMin;
  }

  public static default(): Thresholds {
    return new Thresholds(35, 30);
  }

  public toJSON(): any {
    return {
      temperature_max: this.temperatureMax,
      humidity_min: this.humidityMin,
    };
  }
}
