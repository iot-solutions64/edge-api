export interface SensorDataResponse {
  id: string;
  temperature: number;
  humidity: number;
  volume: number;
  timestamp: number;
}

export interface IrrigationStatusResponse {
  active: boolean;
}

export interface ThresholdsResponse {
  temperature_max: number;
  humidity_min: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
