import { Request, Response } from "express";
import { GetLatestSensorDataUseCase } from "../../application/useCases/GetLatestSensorDataUseCase";
import { CheckIrrigationStatusUseCase } from "../../application/useCases/CheckIrrigationStatusUseCase";
import { GetThresholdsUseCase } from "../../application/useCases/GetThresholdsUseCase";
import {
  SensorDataResponse,
  IrrigationStatusResponse,
  ThresholdsResponse,
  ErrorResponse,
} from "../dto/ResponseDTOs";

export class SensorController {
  constructor(
    private getLatestSensorDataUseCase: GetLatestSensorDataUseCase,
    private checkIrrigationStatusUseCase: CheckIrrigationStatusUseCase,
    private getThresholdsUseCase: GetThresholdsUseCase
  ) {}

  public getLatestData = async (req: Request, res: Response): Promise<void> => {
    try {
      const sensorData = await this.getLatestSensorDataUseCase.execute();

      if (sensorData) {
        const response: SensorDataResponse = sensorData.toJSON();
        res.json(response);
      } else {
        const errorResponse: ErrorResponse = {
          error: "No data received yet",
          message: "No sensor data available in the system",
        };
        res.status(404).json(errorResponse);
      }
    } catch (error) {
      console.error("Error getting latest sensor data:", error);
      const errorResponse: ErrorResponse = {
        error: "Internal server error",
        message: "Failed to retrieve sensor data",
      };
      res.status(500).json(errorResponse);
    }
  };

  public getIrrigationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result = await this.checkIrrigationStatusUseCase.execute();

      if (result) {
        const response: IrrigationStatusResponse = result;
        res.json(response);
      } else {
        const errorResponse: ErrorResponse = {
          error: "No data available",
          message: "Cannot determine irrigation status without sensor data",
        };
        res.status(404).json(errorResponse);
      }
    } catch (error) {
      console.error("Error checking irrigation status:", error);
      const errorResponse: ErrorResponse = {
        error: "Internal server error",
        message: "Failed to check irrigation status",
      };
      res.status(500).json(errorResponse);
    }
  };

  public getThresholds = async (req: Request, res: Response): Promise<void> => {
    try {
      const thresholds = await this.getThresholdsUseCase.execute();

      if (thresholds) {
        const response: ThresholdsResponse = thresholds.toJSON();
        res.json(response);
      } else {
        const errorResponse: ErrorResponse = {
          error: "No thresholds found",
          message: "Could not retrieve irrigation thresholds",
        };
        res.status(404).json(errorResponse);
      }
    } catch (error) {
      console.error("Error getting thresholds:", error);
      const errorResponse: ErrorResponse = {
        error: "Internal server error",
        message: "Failed to retrieve thresholds",
      };
      res.status(500).json(errorResponse);
    }
  };
}
