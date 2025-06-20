// MQTT connection and topic constants
export const MQTT_BROKER =
  process.env.MQTT_BROKER || "mqtt://test.mosquitto.org:1883";
export const MQTT_TOPIC =
  process.env.MQTT_TOPIC || "iot/irrigation/data/iot-solutions64";
