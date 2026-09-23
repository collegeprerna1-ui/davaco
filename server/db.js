const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/dawaco.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite Connected");
  }
});

db.serialize(() => {

  // =========================
  // USERS
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add role column for old databases
  db.run(`
    ALTER TABLE users
    ADD COLUMN role TEXT DEFAULT 'user'
  `, (err) => {
    if (err) {
      console.log("Role column already exists");
    } else {
      console.log("Role column added");
    }
  });

  // =========================
  // REMINDERS
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS reminders(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      dateTime TEXT NOT NULL,
      notified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // =========================
  // MEDICINES
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS medicines(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      image TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // =========================
  // CART
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS cart(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      medicine_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(medicine_id) REFERENCES medicines(id)
    )
  `);

  // =========================
  // ORDERS
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS orders(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      address TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // =========================
  // ORDER ITEMS
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      medicine_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(medicine_id) REFERENCES medicines(id)
    )
  `);

  // =========================
  // PRESCRIPTIONS
  // =========================

  db.run(`
    CREATE TABLE IF NOT EXISTS prescriptions(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      file_name TEXT,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

});

module.exports = db;