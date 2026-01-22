import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

class DatabaseService {
    private db: Database;

    constructor() {
        this.db = new sqlite3.Database('./database.sqlite', (err) => {
            if (err) {
                console.error('Error opening database', err.message);
            } else {
                console.log('Connected to the SQLite database.');
                this.init();
            }
        });
    }

    public getDb(): Database {
        return this.db;
    }

    private init() {
        this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
            if (err) {
                console.error('Error creating users table', err.message);
            } else {
                console.log('Users table initialized.');
            }
        });
    }
}

export const dbService = new DatabaseService();
export const db = dbService.getDb();
