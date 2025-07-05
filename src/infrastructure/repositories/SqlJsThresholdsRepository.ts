import { Thresholds } from "../../domain/valueObjects/Thresholds";
import { IThresholdsRepository } from "../../domain/repositories/IThresholdsRepository";
import { SqlJsConnection } from "../database/SqlJsConnection";
import { Database } from "sql.js";

export class SqlJsThresholdsRepository implements IThresholdsRepository {
  private db: Database;

  constructor() {
    this.db = SqlJsConnection.getInstance().getDatabase();
  }

  async get(): Promise<Thresholds | null> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM thresholds 
        ORDER BY updated_at DESC 
        LIMIT 1
      `);

      const result = stmt.getAsObject();
      stmt.free();

      if (result && Object.keys(result).length > 0) {
        return new Thresholds(
          result.temperature_max as number,
          result.humidity_min as number
        );
      }

      return null;
    } catch (error) {
      console.error("Error getting thresholds:", error);
      return null;
    }
  }

  async save(thresholds: Thresholds): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO thresholds (temperature_max, humidity_min)
        VALUES (?, ?)
      `);

      stmt.run([thresholds.temperatureMax, thresholds.humidityMin]);
      stmt.free();

      // Guardar a archivo después de la inserción
      await SqlJsConnection.getInstance().saveToFile();
    } catch (error) {
      console.error("Error saving thresholds:", error);
      throw error;
    }
  }
}
