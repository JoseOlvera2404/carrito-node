const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: process.env.MYSQLPORT || process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión sin romper el servidor
pool.getConnection()
    .then(() => console.log("Conectado a MySQL (Railway)"))
    .catch(err => console.error("Error de conexión MySQL:", err.message));

module.exports = pool;
