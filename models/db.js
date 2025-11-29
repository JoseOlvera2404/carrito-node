const mysql = require("mysql2");

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

// Probar conexión
pool.getConnection((err, conn) => {
    if (err) {
        console.error("Error de conexión MySQL:", err.message);
    } else {
        console.log("Conectado a MySQL (Railway)");
        conn.release();
    }
});

module.exports = pool;
