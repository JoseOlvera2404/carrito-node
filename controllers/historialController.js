const Compras = require("../models/comprasModel");

const historialController = {

    verHistorial: async (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        try {
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

        } catch (err) {
            console.error(err);
            res.status(500).send("Error cargando historial");
        }
    },

    verTicket: async (req, res) => {
        try {
            const compraItems = await Compras.obtenerDetalleCompra(req.params.id);

            if (compraItems.length === 0) return res.redirect("/historial");

            const compra = {
                id: req.params.id,
                fecha: compraItems[0].fecha,
                total: compraItems.reduce((s, i) => s + Number(i.subtotal), 0),
                items: compraItems.map(i => ({
                    ...i,
                    precio: Number(i.precio),
                    subtotal: Number(i.subtotal)
                }))
            };

            res.render("ticket", {
                usuario: req.session.user,
                compra
            });

        } catch (err) {
            console.error(err);
            res.status(500).send("Error mostrando ticket");
        }
    }
};

module.exports = historialController;
