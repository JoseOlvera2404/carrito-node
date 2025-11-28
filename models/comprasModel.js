const db = require("./db");

const Compras = {

    crearCompra: async (usuario_id, total) => {
        const sql = `
            INSERT INTO compras (usuario_id, total)
            VALUES (?, ?)
        `;
        const [result] = await db.query(sql, [usuario_id, total]);
        return result.insertId;
    },

    agregarDetalle: async (compra_id, producto_id, cantidad, subtotal) => {
        const sql = `
            INSERT INTO compras_detalle (compra_id, producto_id, cantidad, subtotal)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [compra_id, producto_id, cantidad, subtotal]);
        return result.insertId;
    },

    obtenerHistorial: async (usuario_id) => {
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
        const [rows] = await db.query(sql, [usuario_id]);
        return rows;
    },

    obtenerDetalleCompra: async (compra_id) => {
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
        const [rows] = await db.query(sql, [compra_id]);
        return rows;
    }
};

module.exports = Compras;
