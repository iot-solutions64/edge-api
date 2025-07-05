import mqtt, { MqttClient } from "mqtt";
import { SensorData } from "../../domain/entities/SensorData";
import { IMqttService } from "../../domain/services/IMqttService";

export class MqttClientService implements IMqttService {
  private client: MqttClient;
  private latestData: SensorData | null = null;
  private readonly brokerUrl: string;
  private readonly topic: string;
  private dataCallback?: (data: SensorData) => void;

  constructor() {
    this.brokerUrl =
      process.env.MQTT_BROKER || "mqtt://test.mosquitto.org:1883";
    this.topic =
      process.env.MQTT_TOPIC || "iot/irrigation/data/david_soto_salis";

    this.client = mqtt.connect(this.brokerUrl);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on("connect", this.onConnect);
    this.client.on("message", this.onMessage);
    this.client.on("error", this.onError);
  }

  private onConnect = (): void => {
    console.log("Connected to MQTT broker");
    this.client.subscribe(this.topic, (err) => {
      if (err) {
        console.error("MQTT subscription error:", err);
      } else {
        console.log("Subscribed to topic:", this.topic);
      }
    });
  };

  private onMessage = async (topic: string, message: Buffer): Promise<void> => {
    try {
      const rawData = JSON.parse(message.toString());
      const sensorData = SensorData.fromRawData(rawData);

      this.latestData = sensorData;
      console.log("Received MQTT data:", sensorData.toJSON());

      // Llamar al callback si está registrado
      if (this.dataCallback) {
        this.dataCallback(sensorData);
      }
    } catch (error) {
      console.error("Error parsing MQTT message:", error);
    }
  };

  private onError = (error: Error): void => {
    console.error("MQTT client error:", error);
  };

  public getLatestData(): SensorData | null {
    return this.latestData;
  }

  public subscribe(callback: (data: SensorData) => void): void {
    this.dataCallback = callback;
  }

  public disconnect(): void {
    this.client.end();
  }
}
