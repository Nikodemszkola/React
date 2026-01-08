require('dotenv').config();
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
});
(async () => {
  try {
    const [result,fields] = await pool.query(
      'INSERT INTO Categories (Name) VALUES (?)',
      ['Azure']
    );
    console.log('insertId:', result.insertId);
    console.log(fields[0].name,
    fields[0].type,
    fields[0].table,
    fields[0].db)
  } catch (err) {
    console.error('DB error:', err);
  } finally {
    await pool.end(); // żeby proces się ładnie zamknął w testach
  }
})();