const sqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'meshnetworks.db');
const db = new sqlite3(dbPath, {});
console.log("Connected to SQLite database.");

db.prepare(`CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deviceId TEXT,
  paymentRef TEXT,
  amount INTEGER,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

module.exports = db;

