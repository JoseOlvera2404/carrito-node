const Compras = require("../models/comprasModel");

const historialController = {

    verHistorial: async (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        const historial = await Compras.obtenerHistorial(req.session.userID);

        const comprasUnicas = [];
        const ids = new Set();

        historial.forEach(h => {
            if (!ids.has(h.compra_id)) {
                ids.add(h.compra_id);
                comprasUnicas.push({
                    compra_id: h.compra_id,
                    total: h.total,
                    fecha: h.fecha
                });
            }
        });

        res.render("historial", {
            usuario: req.session.user,
            historial: comprasUnicas
        });
    },

    verTicket: async (req, res) => {
        const { id } = req.params;

        const compraItems = await Compras.obtenerDetalleCompra(id);
        if (compraItems.length === 0) return res.redirect("/historial");

        const compra = {
            id,
            fecha: compraItems[0].fecha,
            total: compraItems.reduce((s, i) => s + Number(i.subtotal), 0),
            items: compraItems.map(item => ({
                ...item,
                precio: Number(item.precio),
                subtotal: Number(item.subtotal)
            }))
        };

        res.render("ticket", {
            usuario: req.session.user,
            compra
        });
    }
};

module.exports = historialController;
