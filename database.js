require('dotenv').config();
const mysql = require('mysql2/promise');

class DatabaseConnection
{
  constructor()
  {
    if(DatabaseConnection.instance)
    {
      return DatabaseConnection.instance; 
    }
    this.pool = mysql.createPool(
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectionLimit: process.env.DB_CONNECTION_LIMIT,
      }
    );
    DatabaseConnection.instance = this;
  }
  async query(query,values)
  {
    const [result] = await this.pool.
  }
};
class APIInterface
{
  constructor() {
    this.database = new DatabaseConnection;
    const requiredMethod = ["get","set","delete","update"];
    for(const method of required)
    {
      if(this[method] === APIInterface.prototype[method] || typeof this[method] !== "function")
      {
        throw "Not every Interface method is implemented";
      }
    }
  }
  async get() {throw new Error("method not implemented");}
  async set() {throw new Error("method not implemented");}
  async update() {throw new Error("method not implemented");}
  async delete() {throw new Error("method not implemented");}
};
class RefreshTokens extends APIInterface
{
  async get() 
  {

  }
  async set()
  {

  }
  async delete()
  {

  }
  async update()
  {

  }
};


// (async () => {
//   try {
//     const [result,fields] = await pool.query(
//       'INSERT INTO Categories (Name) VALUES (?)',
//       ['Azure']
//     );
//     console.log('insertId:', result.insertId);
//     console.log(fields[0].name,
//     fields[0].type,
//     fields[0].table,
//     fields[0].db)
//   } catch (err) {
//     console.error('DB error:', err);
//   } finally {
//     await pool.end(); // żeby proces się ładnie zamknął w testach
//   }
// })();