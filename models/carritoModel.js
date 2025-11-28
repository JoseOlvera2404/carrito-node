const db = require("./db");

const Carrito = {

    obtenerCarrito: async (usuario_id) => {
        const sql = `
            SELECT c.id, c.producto_id, c.cantidad, p.nombre, p.precio, p.imagen
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
        `;
        const [rows] = await db.query(sql, [usuario_id]);
        return rows;
    },

    agregarProducto: async (usuario_id, producto_id) => {
        const sql = `
            INSERT INTO carrito (usuario_id, producto_id, cantidad)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + 1
        `;
        const [result] = await db.query(sql, [usuario_id, producto_id]);
        return result;
    },

    cambiarCantidad: async (carrito_id, cantidad) => {
        const sql = "UPDATE carrito SET cantidad = ? WHERE id = ?";
        const [result] = await db.query(sql, [cantidad, carrito_id]);
        return result;
    },

    eliminarProducto: async (carrito_id) => {
        const sql = "DELETE FROM carrito WHERE id = ?";
        const [result] = await db.query(sql, [carrito_id]);
        return result;
    },

    vaciarCarrito: async (usuario_id) => {
        const sql = "DELETE FROM carrito WHERE usuario_id = ?";
        const [result] = await db.query(sql, [usuario_id]);
        return result;
    }
};

module.exports = Carrito;
