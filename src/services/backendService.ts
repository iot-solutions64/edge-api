import axios from "axios";
import dotenv from "dotenv";
import {
  TEMPERATURE_ENDPOINT,
  HUMIDITY_ENDPOINT,
  VOLUME_ENDPOINT,
  THRESHOLDS_ENDPOINT,
  IOT_DATA_ENDPOINT
} from "../constants/backend";
import { SensorData } from "../types/sensor";

dotenv.config();

export async function sendDataToBackend(data: SensorData): Promise<void> {
  try {
    await axios.patch(TEMPERATURE_ENDPOINT, { temperature: data.temperature });
    console.log("Temperatura enviada al backend Spring Boot");

    await axios.patch(HUMIDITY_ENDPOINT, { humidity: data.humidity });
    console.log("Humedad enviada al backend Spring Boot");

    await axios.patch(VOLUME_ENDPOINT, { waterAmount: data.volume });
    console.log("Volumen enviado al backend Spring Boot");

    await axios.post(IOT_DATA_ENDPOINT, {
      temperature: data.temperature,
      humidity: data.humidity,
      volume: data.volume,
      timestamp: data.timestamp,
    });
    console.log("Datos enviados al nuevo endpoint del backend Spring Boot");
  } catch (error) {
    console.error("Error enviando datos al backend:", error);
  }
}

export async function getThresholdsFromBackend(): Promise<{ temperature_max: number, humidity_min: number } | null> {
  try {
    const response = await axios.get(THRESHOLDS_ENDPOINT);
    const data = response.data;
    return {
      temperature_max: data.temperatureMaxThreshold,
      humidity_min: data.humidityMinThreshold
    };
  } catch (error) {
    console.error("Error obteniendo thresholds del backend:", error);
    return null;
  }
}