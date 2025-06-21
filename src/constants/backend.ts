// URLs del backend Spring Boot
export const BACKEND_BASE_URL =
  process.env.BACKEND_URL || "http://localhost:8080";
export const TEMPERATURE_ENDPOINT = `${BACKEND_BASE_URL}/api/v1/crop/1/temperature`;
export const HUMIDITY_ENDPOINT = `${BACKEND_BASE_URL}/api/v1/crop/1/humidity`;
export const VOLUME_ENDPOINT = `${BACKEND_BASE_URL}/api/v1/water-tanks/1/water-remaining`;
export const THRESHOLDS_ENDPOINT = `${BACKEND_BASE_URL}/api/v1/crop/1/thresholds`;
export const IOT_DATA_ENDPOINT = `${BACKEND_BASE_URL}/api/v1/iot/data`;