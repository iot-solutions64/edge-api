# Edge API for IoT Irrigation System

This Edge API subscribes to the MQTT topic `iot/irrigation/data/david_soto_salis` on `test.mosquitto.org`, receives JSON sensor data, and exposes an HTTP endpoint to retrieve the latest received data.

## Features

- MQTT subscription and message handling
- Express HTTP server
- TypeScript types for all data

## Scripts

- `npm run dev` — Start in development mode (with ts-node)
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run compiled JavaScript

## Usage

1. Run `npm install` to install dependencies.
2. Run `npm run dev` to start the server in development mode.
3. Access `http://localhost:3000/data` to get the latest sensor data received from MQTT.

## Environment

- MQTT Broker: test.mosquitto.org
- MQTT Topic: iot/irrigation/data/david_soto_salis

---
