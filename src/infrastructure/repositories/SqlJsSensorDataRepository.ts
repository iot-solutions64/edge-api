import { SensorData } from "../../domain/entities/SensorData";
import { ISensorDataRepository } from "../../domain/repositories/ISensorDataRepository";
import { SqlJsConnection } from "../database/SqlJsConnection";
import { Database } from "sql.js";

export class SqlJsSensorDataRepository implements ISensorDataRepository {
  private db: Database;

  constructor() {
    this.db = SqlJsConnection.getInstance().getDatabase();
  }

  async save(sensorData: SensorData): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO sensor_data (id, temperature, humidity, volume, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run([
        sensorData.id,
        sensorData.temperature,
        sensorData.humidity,
        sensorData.volume,
        sensorData.timestamp.getTime(),
      ]);

      stmt.free();

      // Guardar a archivo después de cada inserción
      await SqlJsConnection.getInstance().saveToFile();
    } catch (error) {
      console.error("Error saving sensor data:", error);
      throw error;
    }
  }

  async findLatest(): Promise<SensorData | null> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM sensor_data 
        ORDER BY timestamp DESC 
        LIMIT 1
      `);

      const result = stmt.getAsObject();
      stmt.free();

      if (result && Object.keys(result).length > 0) {
        return new SensorData(
          result.temperature as number,
          result.humidity as number,
          result.volume as number,
          new Date(result.timestamp as number),
          result.id as string
        );
      }

      return null;
    } catch (error) {
      console.error("Error finding latest sensor data:", error);
      return null;
    }
  }

  async findById(id: string): Promise<SensorData | null> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM sensor_data WHERE id = ?
      `);

      const result = stmt.getAsObject([id]);
      stmt.free();

      if (result && Object.keys(result).length > 0) {
        return new SensorData(
          result.temperature as number,
          result.humidity as number,
          result.volume as number,
          new Date(result.timestamp as number),
          result.id as string
        );
      }

      return null;
    } catch (error) {
      console.error("Error finding sensor data by id:", error);
      return null;
    }
  }

  async findAll(): Promise<SensorData[]> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM sensor_data 
        ORDER BY timestamp DESC
      `);

      const results = stmt.get();
      stmt.free();

      if (!results || !Array.isArray(results)) {
        return [];
      }

      return results.map(
        (row: any) =>
          new SensorData(
            row.temperature,
            row.humidity,
            row.volume,
            new Date(row.timestamp),
            row.id
          )
      );
    } catch (error) {
      console.error("Error finding all sensor data:", error);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM sensor_data WHERE id = ?
      `);

      stmt.run([id]);
      stmt.free();

      await SqlJsConnection.getInstance().saveToFile();
    } catch (error) {
      console.error("Error deleting sensor data:", error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const stmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM sensor_data
      `);

      const result = stmt.getAsObject();
      stmt.free();

      return (result.count as number) || 0;
    } catch (error) {
      console.error("Error counting sensor data:", error);
      return 0;
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<SensorData[]> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM sensor_data 
        WHERE timestamp BETWEEN ? AND ?
        ORDER BY timestamp DESC
      `);

      const results = stmt.get([startDate.getTime(), endDate.getTime()]);
      stmt.free();

      if (!results || !Array.isArray(results)) {
        return [];
      }

      return results.map(
        (row: any) =>
          new SensorData(
            row.temperature,
            row.humidity,
            row.volume,
            new Date(row.timestamp),
            row.id
          )
      );
    } catch (error) {
      console.error("Error finding sensor data by date range:", error);
      return [];
    }
  }
}
