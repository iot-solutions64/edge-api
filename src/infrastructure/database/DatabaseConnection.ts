import Database from "better-sqlite3";
import path from "path";

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database;

  private constructor() {
    const dbPath = path.join(
      process.cwd(),
      "ddd",
      "infrastructure",
      "database",
      "edge_api.db"
    );
    this.db = new Database(dbPath);
    console.log("Connected to SQLite database");
    this.initializeTables();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  private initializeTables(): void {
    // Crear tabla sensor_data
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id TEXT PRIMARY KEY,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        volume REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla thresholds
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS thresholds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperature_max REAL NOT NULL,
        humidity_min REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices para optimizar consultas
    this.db.exec(
      `CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC)`
    );
  }

  public close(): void {
    this.db.close();
    console.log("Database connection closed");
  }
}
