const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "spa_db",
});

async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function ensureSchema() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(100),
      service VARCHAR(100),
      date DATE,
      time TIME,
      status VARCHAR(20) DEFAULT 'CONFIRMED',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = { query, ensureSchema };
