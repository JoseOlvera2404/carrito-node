const db = require("./db");

const Usuarios = {

    registrar: async (nombre, email, password) => {
        const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [nombre, email, password]);
        return result.insertId;
    },

    login: async (email, password) => {
        const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
        const [rows] = await db.query(sql, [email, password]);
        return rows[0];
    },

    obtenerPorId: async (id) => {
        const sql = "SELECT * FROM usuarios WHERE id = ?";
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }
};

module.exports = Usuarios;
