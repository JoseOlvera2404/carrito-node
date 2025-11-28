const db = require("./db");

const Compras = {

    // Crear una compra
    crearCompra: (usuario_id, total, callback) => {
        const sql = `
            INSERT INTO compras (usuario_id, total)
            VALUES (?, ?)
        `;
        db.query(sql, [usuario_id, total], callback);
    },

    // Agregar detalle a una compra
    agregarDetalle: (compra_id, producto_id, cantidad, subtotal, callback) => {
        const sql = `
            INSERT INTO compras_detalle (compra_id, producto_id, cantidad, subtotal)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [compra_id, producto_id, cantidad, subtotal], callback);
    },

    // Obtener historial completo de compras de un usuario
    obtenerHistorial: (usuario_id, callback) => {
        const sql = `
            SELECT 
                c.id AS compra_id, 
                c.total, 
                c.fecha,
                d.producto_id, 
                d.cantidad, 
                d.subtotal,
                p.nombre, 
                p.imagen
            FROM compras c
            INNER JOIN compras_detalle d ON c.id = d.compra_id
            INNER JOIN productos p ON d.producto_id = p.id
            WHERE c.usuario_id = ?
            ORDER BY c.fecha DESC
        `;
        db.query(sql, [usuario_id], callback);
    },

    obtenerDetalleCompra: (compra_id, callback) => {
        const sql = `
            SELECT 
                c.id AS compra_id,
                c.total,
                c.fecha,
                p.nombre,
                p.precio,
                p.imagen,
                d.cantidad,
                d.subtotal
            FROM compras c
            INNER JOIN compras_detalle d ON c.id = d.compra_id
            INNER JOIN productos p ON p.id = d.producto_id
            WHERE c.id = ?
        `;
        db.query(sql, [compra_id], callback);
    }

};

module.exports = Compras;
