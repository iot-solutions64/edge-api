import mqtt, { MqttClient } from "mqtt";
import dotenv from "dotenv";
import { MQTT_BROKER, MQTT_TOPIC } from "../constants/mqtt";
import { SensorData } from "../types/sensor";
import { sendDataToBackend } from "./backendService";

dotenv.config();

export class MqttService {
  private client: MqttClient;
  private latestData: SensorData | null = null;

  constructor() {
    this.client = mqtt.connect(MQTT_BROKER);
    this.client.on("connect", this.onConnect);
    this.client.on("message", this.onMessage);
  }

  private onConnect = () => {
    console.log("Connected to MQTT broker");
    this.client.subscribe(MQTT_TOPIC, (err) => {
      if (err) {
        console.error("MQTT subscription error:", err);
      } else {
        console.log("Subscribed to topic:", MQTT_TOPIC);
      }
    });
  };

  private onMessage = async (_topic: string, message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());
      this.latestData = { ...data, timestamp: Date.now() };
      console.log("Received MQTT data:", this.latestData);
      if (this.latestData) {
        await sendDataToBackend(this.latestData);
      }
    } catch (e) {
      console.error("Error parsing MQTT message:", e);
    }
  };

  public getLatestData(): SensorData | null {
    return this.latestData;
  }
}
