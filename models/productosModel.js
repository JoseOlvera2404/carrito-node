const db = require("./db");

const Productos = {

    obtenerTodos: async () => {
        const sql = "SELECT * FROM productos";
        const [rows] = await db.query(sql);
        return rows;
    },

    obtenerPorId: async (id) => {
        const sql = "SELECT * FROM productos WHERE id = ?";
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }
};

module.exports = Productos;
