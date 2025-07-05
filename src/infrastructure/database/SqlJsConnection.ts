import initSqlJs, { Database } from "sql.js";
import fs from "fs/promises";
import path from "path";

export class SqlJsConnection {
  private static instance: SqlJsConnection;
  private db: Database | null = null;
  private SQL: any = null;
  private dbPath: string;

  private constructor() {
    this.dbPath = path.join(process.cwd(), "data", "edge_api.sqlite");
  }

  public static getInstance(): SqlJsConnection {
    if (!SqlJsConnection.instance) {
      SqlJsConnection.instance = new SqlJsConnection();
    }
    return SqlJsConnection.instance;
  }

  public async initialize(): Promise<void> {
    if (this.db) return; // Ya inicializada

    try {
      // Inicializar sql.js
      this.SQL = await initSqlJs();

      // Crear directorio data si no existe
      await fs.mkdir(path.dirname(this.dbPath), { recursive: true });

      // Cargar base de datos existente o crear nueva
      let fileBuffer: Buffer | null = null;
      try {
        fileBuffer = await fs.readFile(this.dbPath);
        console.log("📁 Loaded existing SQLite database");
      } catch {
        console.log("🆕 Creating new SQLite database");
      }

      // Crear instancia de base de datos
      this.db = new this.SQL.Database(fileBuffer);

      // Inicializar tablas
      this.initializeTables();

      // Guardar al disco
      await this.saveToFile();

      console.log("✅ sql.js SQLite database connected successfully");
    } catch (error) {
      console.error("❌ Error initializing sql.js database:", error);
      throw error;
    }
  }

  private initializeTables(): void {
    if (!this.db) throw new Error("Database not initialized");

    // Crear tabla sensor_data
    this.db.run(`
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
    this.db.run(`
      CREATE TABLE IF NOT EXISTS thresholds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperature_max REAL NOT NULL,
        humidity_min REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices para optimizar consultas
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp 
      ON sensor_data(timestamp DESC)
    `);

    console.log("🗄️ Database tables initialized");
  }

  public getDatabase(): Database {
    if (!this.db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  public async saveToFile(): Promise<void> {
    if (!this.db) return;

    try {
      const data = this.db.export();
      await fs.writeFile(this.dbPath, data);
    } catch (error) {
      console.error("Error saving database to file:", error);
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.saveToFile();
      this.db.close();
      this.db = null;
      console.log("🔒 Database connection closed");
    }
  }
}
