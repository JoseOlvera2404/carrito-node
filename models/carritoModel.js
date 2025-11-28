const db = require('./db');

const Carrito = {
    obtenerCarrito: (usuario_id, callback) => {
        const sql = `
            SELECT c.id, c.producto_id, c.cantidad, p.nombre, p.precio, p.imagen
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
        `;
        db.query(sql, [usuario_id], callback);
    },

    agregarProducto: (usuario_id, producto_id, callback) => {
        const sql = `
            INSERT INTO carrito (usuario_id, producto_id, cantidad)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + 1
        `;
        db.query(sql, [usuario_id, producto_id], callback);
    },

    cambiarCantidad: (carrito_id, cantidad, callback) => {
        const sql = "UPDATE carrito SET cantidad = ? WHERE id = ?";
        db.query(sql, [cantidad, carrito_id], callback);
    },

    eliminarProducto: (carrito_id, callback) => {
        const sql = "DELETE FROM carrito WHERE id = ?";
        db.query(sql, [carrito_id], callback);
    },

    vaciarCarrito: (usuario_id, callback) => {
        const sql = "DELETE FROM carrito WHERE usuario_id = ?";
        db.query(sql, [usuario_id], callback);
    }
};

module.exports = Carrito;
