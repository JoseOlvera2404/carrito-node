const db = require('./db');

const Productos = {
    obtenerTodos: (callback) => {
        const sql = "SELECT * FROM productos";
        db.query(sql, callback);
    },

    obtenerPorId: (id, callback) => {
        const sql = "SELECT * FROM productos WHERE id = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = Productos;
