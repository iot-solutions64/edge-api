import { SqlJsSensorDataRepository } from "./infrastructure/repositories/SqlJsSensorDataRepository";
import { SqlJsThresholdsRepository } from "./infrastructure/repositories/SqlJsThresholdsRepository";

// Database
import { SqlJsConnection } from "./infrastructure/database/SqlJsConnection";

// Services
import { BackendHttpService } from "./infrastructure/services/BackendHttpService";
import { MqttClientService } from "./infrastructure/services/MqttClientService";

// Use Cases
import { GetLatestSensorDataUseCase } from "./application/useCases/GetLatestSensorDataUseCase";
import { SaveSensorDataUseCase } from "./application/useCases/SaveSensorDataUseCase";
import { CheckIrrigationStatusUseCase } from "./application/useCases/CheckIrrigationStatusUseCase";
import { GetThresholdsUseCase } from "./application/useCases/GetThresholdsUseCase";

// Controllers
import { SensorController } from "./interface/controllers/SensorController";

// Routes
import { ApiRoutes } from "./interface/routes/ApiRoutes";

// Entities
import { SensorData } from "./domain/entities/SensorData";
import { DatabaseConnection } from "./infrastructure/database/DatabaseConnection";

export class DIContainer {
  // Repositories
  public sensorDataRepository!: SqlJsSensorDataRepository;
  public thresholdsRepository!: SqlJsThresholdsRepository;

  // Services
  public backendService!: BackendHttpService;
  public mqttService!: MqttClientService;

  // Use Cases
  public getLatestSensorDataUseCase!: GetLatestSensorDataUseCase;
  public saveSensorDataUseCase!: SaveSensorDataUseCase;
  public checkIrrigationStatusUseCase!: CheckIrrigationStatusUseCase;
  public getThresholdsUseCase!: GetThresholdsUseCase;

  // Controllers
  public sensorController!: SensorController;

  // Routes
  public apiRoutes!: ApiRoutes;

  constructor() {
    // NOTE: Los repositorios se inicializarán después de que la BD esté lista
  }

  public async initialize(): Promise<void> {
    // Inicializar base de datos
    await SqlJsConnection.getInstance().initialize();

    // Initialize repositories
    this.sensorDataRepository = new SqlJsSensorDataRepository();
    this.thresholdsRepository = new SqlJsThresholdsRepository();

    // Initialize services
    this.backendService = new BackendHttpService();
    this.mqttService = new MqttClientService();

    // Initialize use cases
    this.getLatestSensorDataUseCase = new GetLatestSensorDataUseCase(
      this.sensorDataRepository
    );
    this.saveSensorDataUseCase = new SaveSensorDataUseCase(
      this.sensorDataRepository,
      this.backendService
    );
    this.checkIrrigationStatusUseCase = new CheckIrrigationStatusUseCase(
      this.sensorDataRepository
    );
    this.getThresholdsUseCase = new GetThresholdsUseCase(
      this.thresholdsRepository,
      this.backendService
    );

    // Initialize controllers
    this.sensorController = new SensorController(
      this.getLatestSensorDataUseCase,
      this.checkIrrigationStatusUseCase,
      this.getThresholdsUseCase
    );

    // Initialize routes
    this.apiRoutes = new ApiRoutes(this.sensorController);

    // Setup MQTT subscription
    this.setupMqttSubscription();
  }

  private setupMqttSubscription(): void {
    this.mqttService.subscribe(async (sensorData: SensorData) => {
      try {
        await this.saveSensorDataUseCase.execute(sensorData);
      } catch (error) {
        console.error("Error saving sensor data:", error);
      }
    });
  }

  public async closeDatabase(): Promise<void> {
    await SqlJsConnection.getInstance().close();
  }
}
