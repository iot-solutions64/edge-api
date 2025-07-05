import { SensorData } from "../../domain/entities/SensorData";
import { ISensorDataRepository } from "../../domain/repositories/ISensorDataRepository";
import { DatabaseConnection } from "../database/DatabaseConnection";
import Database from "better-sqlite3";

export class SqliteSensorDataRepository implements ISensorDataRepository {
  private db: Database.Database;

  constructor() {
    this.db = DatabaseConnection.getInstance().getDatabase();
  }

  async save(sensorData: SensorData): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO sensor_data (id, temperature, humidity, volume, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      sensorData.id,
      sensorData.temperature,
      sensorData.humidity,
      sensorData.volume,
      sensorData.timestamp.getTime()
    );
  }

  async findLatest(): Promise<SensorData | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM sensor_data 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    const row = stmt.get() as any;

    if (row) {
      return new SensorData(
        row.temperature,
        row.humidity,
        row.volume,
        new Date(row.timestamp),
        row.id
      );
    }

    return null;
  }

  async findById(id: string): Promise<SensorData | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM sensor_data WHERE id = ?
    `);

    const row = stmt.get(id) as any;

    if (row) {
      return new SensorData(
        row.temperature,
        row.humidity,
        row.volume,
        new Date(row.timestamp),
        row.id
      );
    }

    return null;
  }

  async findAll(): Promise<SensorData[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM sensor_data 
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all() as any[];

    return rows.map(
      (row) =>
        new SensorData(
          row.temperature,
          row.humidity,
          row.volume,
          new Date(row.timestamp),
          row.id
        )
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<SensorData[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM sensor_data 
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all(startDate.getTime(), endDate.getTime()) as any[];

    return rows.map(
      (row) =>
        new SensorData(
          row.temperature,
          row.humidity,
          row.volume,
          new Date(row.timestamp),
          row.id
        )
    );
  }
}
