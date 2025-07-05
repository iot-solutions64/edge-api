import { Thresholds } from "../../domain/valueObjects/Thresholds";
import { IThresholdsRepository } from "../../domain/repositories/IThresholdsRepository";
import { DatabaseConnection } from "../database/DatabaseConnection";
import Database from "better-sqlite3";

export class SqliteThresholdsRepository implements IThresholdsRepository {
  private db: Database.Database;

  constructor() {
    this.db = DatabaseConnection.getInstance().getDatabase();
  }

  async get(): Promise<Thresholds | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM thresholds 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);

    const row = stmt.get() as any;

    if (row) {
      return new Thresholds(row.temperature_max, row.humidity_min);
    }

    return null;
  }

  async save(thresholds: Thresholds): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO thresholds (temperature_max, humidity_min)
      VALUES (?, ?)
    `);

    stmt.run(thresholds.temperatureMax, thresholds.humidityMin);
  }
}
