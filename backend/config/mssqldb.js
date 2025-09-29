require('dotenv').config();
const sql = require('mssql');

// Configuration object
const config = {
  user: process.env.DB_USER,                // your SQL username
  password: process.env.DB_PASSWORD, // your SQL password
  server: process.env.DB_SERVER,       // or 'DESKTOP-XXXX' (check SSMS connection)
  database: process.env.DB_DATABASE, // database name
  options: {
    encrypt: false,          // use true if on Azure
    trustServerCertificate: true // required for local dev
  },
  port: parseInt(process.env.DB_PORT)                 // default SQL Server port
};

const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool => {
    console.log('Connected to DB');
    return pool;
})
.catch(err => {
    console.error('DB connection failed: ', err);
    throw err;
})

module.exports = {sql, config, poolPromise};
