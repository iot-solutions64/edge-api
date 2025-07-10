# Diagrama de clases

```
@startuml HydroSmart Edge API - DDD Class Diagram

skinparam linetype ortho

' Domain Layer
package "Domain Layer" #E1F5FE {
    
    ' Entities
    class SensorData {
        - id: string
        - temperature: number
        - humidity: number
        - volume: number
        - timestamp: Date
        --
        + static fromRawData(data): SensorData
        + shouldIrrigate(humidityThreshold, temperatureThreshold): boolean
        + toJSON(): any
    }
    
    ' Value Objects
    class Thresholds {
        - temperatureMax: number
        - humidityMin: number
        --
        + static default(): Thresholds
        + toJSON(): any
    }
    
    ' Repository Interfaces
    interface ISensorDataRepository {
        + save(sensorData: SensorData): void
        + findLatest(): SensorData
        + findById(id: string): SensorData
        + findAll(): SensorData[]
        + findByDateRange(startDate: Date, endDate: Date): SensorData[]
    }
    
    interface IThresholdsRepository {
        + get(): Thresholds
        + save(thresholds: Thresholds): void
    }
    
    ' Service Interfaces
    interface IBackendService {
        + sendSensorData(data: SensorData): void
        + getThresholds(): Thresholds
    }
    
    interface IMqttService {
        + getLatestData(): SensorData
        + subscribe(callback: (data: SensorData) => void): void
        + publishConfigUpdate(temperatureMax: number, humidityMin: number): void
    }
}

' Application Layer
package "Application Layer" #F3E5F5 {
    
    class GetLatestSensorDataUseCase {
        - sensorDataRepository: ISensorDataRepository
        --
        + execute(): SensorData
    }
    
    class SaveSensorDataUseCase {
        - sensorDataRepository: ISensorDataRepository
        - backendService: IBackendService
        --
        + execute(sensorData: SensorData): void
    }
    
    class CheckIrrigationStatusUseCase {
        - sensorDataRepository: ISensorDataRepository
        --
        + execute(humidityThreshold?): boolean
    }
    
    class GetThresholdsUseCase {
        - thresholdsRepository: IThresholdsRepository
        - backendService: IBackendService
        --
        + execute(): Thresholds
    }
}

' Infrastructure Layer
package "Infrastructure Layer" #E8F5E8 {
    
    ' Database
    class SqlJsConnection {
        - static instance: SqlJsConnection
        - db: Database
        - SQL: any
        - dbPath: string
        --
        + static getInstance(): SqlJsConnection
        + initialize(): void
        + getDatabase(): Database
        + saveToFile(): void
        + close(): void
        - initializeTables(): void
    }
    
    class DatabaseConnection {
        - static instance: DatabaseConnection
        - db: Database.Database
        - dbPath: string
        --
        + static getInstance(): DatabaseConnection
        + getDatabase(): Database.Database
        - initializeTables(): void
    }
    
    ' Repository Implementations
    class SqlJsSensorDataRepository {
        - db: Database
        --
        + save(sensorData: SensorData): void
        + findLatest(): SensorData
        + findById(id: string): SensorData
        + findAll(): SensorData[]
        + findByDateRange(startDate: Date, endDate: Date): SensorData[]
        + delete(id: string): void
        + count(): number
    }
    
    class SqliteSensorDataRepository {
        - db: Database.Database
        --
        + save(sensorData: SensorData): void
        + findLatest(): SensorData
        + findById(id: string): SensorData
        + findAll(): SensorData[]
        + findByDateRange(startDate: Date, endDate: Date): SensorData[]
    }
    
    class InMemorySensorDataRepository {
        - sensorDataList: SensorData[]
        --
        + save(sensorData: SensorData): void
        + findLatest(): SensorData
        + findById(id: string): SensorData
        + findAll(): SensorData[]
        + findByDateRange(startDate: Date, endDate: Date): SensorData[]
    }
    
    class SqlJsThresholdsRepository {
        - db: Database
        --
        + get(): Thresholds
        + save(thresholds: Thresholds): void
    }
    
    class SqliteThresholdsRepository {
        - db: Database.Database
        --
        + get(): Thresholds
        + save(thresholds: Thresholds): void
    }
    
    class InMemoryThresholdsRepository {
        - thresholds: Thresholds | null
        --
        + get(): Thresholds
        + save(thresholds: Thresholds): void
    }
    
    ' Service Implementations
    class BackendHttpService {
        - baseUrl: string
        - temperatureEndpoint: string
        - humidityEndpoint: string
        - volumeEndpoint: string
        - thresholdsEndpoint: string
        - iotDataEndpoint: string
        --
        + sendSensorData(data: SensorData): void
        + getThresholds(): Thresholds
    }
    
    class MqttClientService {
        - client: MqttClient
        - brokerUrl: string
        - topic: string
        - latestData: SensorData
        - dataCallback: ((data: SensorData) => void)
        --
        + getLatestData(): SensorData
        + subscribe(callback: (data: SensorData) => void): void
        + publishConfigUpdate(temperatureMax: number, humidityMin: number): void
        + disconnect(): void
        - setupEventHandlers(): void
        - onConnect(): void
        - onMessage(topic: string, message: Buffer): void
        - onError(error: Error): void
    }
}

' Interface Layer
package "Interface Layer" #FFF3E0 {
    
    ' Controllers
    class SensorController {
        - getLatestSensorDataUseCase: GetLatestSensorDataUseCase
        - checkIrrigationStatusUseCase: CheckIrrigationStatusUseCase
        - getThresholdsUseCase: GetThresholdsUseCase
        --
        + getLatestData(req: Request, res: Response): void
        + getIrrigationStatus(req: Request, res: Response): void
        + getThresholds(req: Request, res: Response): void
    }
    
    ' Routes
    class ApiRoutes {
        - router: express.Router
        - sensorController: SensorController
        --
        + getRouter(): express.Router
        - setupRoutes(): void
    }
    
    ' DTOs
    interface SensorDataResponse {
        id: string
        temperature: number
        humidity: number
        volume: number
        timestamp: number
    }
    
    interface IrrigationStatusResponse {
        active: boolean
    }
    
    interface ThresholdsResponse {
        temperature_max: number
        humidity_min: number
    }
    
    interface ErrorResponse {
        error: string
        message?: string
    }
}

' Relationships

' Domain relationships
ISensorDataRepository --> SensorData : manages
IThresholdsRepository --> Thresholds : manages
IBackendService --> SensorData : sends
IBackendService --> Thresholds : retrieves
IMqttService --> SensorData : receives

' Application relationships
GetLatestSensorDataUseCase --> ISensorDataRepository : uses
SaveSensorDataUseCase --> ISensorDataRepository : uses
SaveSensorDataUseCase --> IBackendService : uses
CheckIrrigationStatusUseCase --> ISensorDataRepository : uses
CheckIrrigationStatusUseCase --> SensorData : checks irrigation logic
GetThresholdsUseCase --> IThresholdsRepository : uses
GetThresholdsUseCase --> IBackendService : uses

' Infrastructure relationships
SqlJsSensorDataRepository ..|> ISensorDataRepository : implements
SqliteSensorDataRepository ..|> ISensorDataRepository : implements
InMemorySensorDataRepository ..|> ISensorDataRepository : implements
SqlJsThresholdsRepository ..|> IThresholdsRepository : implements
SqliteThresholdsRepository ..|> IThresholdsRepository : implements
InMemoryThresholdsRepository ..|> IThresholdsRepository : implements
BackendHttpService ..|> IBackendService : implements
MqttClientService ..|> IMqttService : implements

SqlJsSensorDataRepository --> SqlJsConnection : uses
SqlJsThresholdsRepository --> SqlJsConnection : uses
SqliteSensorDataRepository --> DatabaseConnection : uses
SqliteThresholdsRepository --> DatabaseConnection : uses

' Interface relationships
SensorController --> GetLatestSensorDataUseCase : uses
SensorController --> CheckIrrigationStatusUseCase : uses
SensorController --> GetThresholdsUseCase : uses
SensorController --> SensorDataResponse : returns
SensorController --> IrrigationStatusResponse : returns
SensorController --> ThresholdsResponse : returns
SensorController --> ErrorResponse : returns
ApiRoutes --> SensorController : uses

' MQTT subscription flow (conceptual)
MqttClientService ..> SaveSensorDataUseCase : triggers

@enduml
```