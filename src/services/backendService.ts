import axios from "axios";
import dotenv from "dotenv";
import { BACKEND_URL } from "../constants/backend";
import { SensorData } from "../types/sensor";

dotenv.config();

const AUTH_URL =
  process.env.BACKEND_AUTH_URL ||
  "http://localhost:8080/api/v1/authentication/sign-in";
const BACKEND_USER = process.env.BACKEND_USER;
const BACKEND_PASS = process.env.BACKEND_PASS;

let bearerToken: string | null = null;

async function getBearerToken(): Promise<string> {
  if (bearerToken) return bearerToken;
  const response = await axios.post(AUTH_URL, {
    username: BACKEND_USER,
    password: BACKEND_PASS,
  });
  bearerToken = response.data.token;
  if (!bearerToken) {
    throw new Error("Failed to obtain bearer token");
  }
  return bearerToken;
}

export async function sendDataToBackend(data: SensorData): Promise<void> {
  try {
    const token = await getBearerToken();
    await axios.post(BACKEND_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Dato enviado al backend Spring Boot");
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      bearerToken = null;
      const token = await getBearerToken();
      await axios.post(BACKEND_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Dato reenviado tras renovar token");
    } else {
      console.error("Error enviando dato al backend:", error);
    }
  }
}
