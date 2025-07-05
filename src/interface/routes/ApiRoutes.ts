import express from "express";
import { SensorController } from "../controllers/SensorController";

export class ApiRoutes {
  private router = express.Router();

  constructor(private sensorController: SensorController) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/data", this.sensorController.getLatestData);
    this.router.get(
      "/irrigation/status",
      this.sensorController.getIrrigationStatus
    );
    this.router.get(
      "/irrigation/thresholds",
      this.sensorController.getThresholds
    );
  }

  public getRouter(): express.Router {
    return this.router;
  }
}
