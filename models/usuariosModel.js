const db = require('./db');

const Usuarios = {
    registrar: (nombre, email, password, callback) => {
        const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
        db.query(sql, [nombre, email, password], callback);
    },

    login: (email, password, callback) => {
        const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
        db.query(sql, [email, password], callback);
    },

    obtenerPorId: (id, callback) => {
        const sql = "SELECT * FROM usuarios WHERE id = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = Usuarios;
