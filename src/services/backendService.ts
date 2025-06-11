import axios from "axios";
import { BACKEND_URL } from "../constants/backend";
import { SensorData } from "../types/sensor";

export async function sendDataToBackend(data: SensorData): Promise<void> {
  try {
    await axios.post(BACKEND_URL, data);
    console.log("Dato enviado al backend Spring Boot");
  } catch (error) {
    console.error("Error enviando dato al backend:", error);
  }
}
