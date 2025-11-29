const Carrito = require("../models/carritoModel");
const Compras = require("../models/comprasModel");

const carritoController = {

    verCarrito: async (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        try {
            const items = await Carrito.obtenerCarrito(req.session.userID);

            const carrito = items.map(i => ({
                ...i,
                precio: Number(i.precio)
            }));

            const total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);

            res.render("carrito", {
                usuario: req.session.user,
                carrito,
                total
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error obteniendo carrito");
        }
    },

    agregar: async (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        const producto_id = req.body.id;
        const redirectUrl = req.get("referer") || "/";

        try {
            await Carrito.agregarProducto(req.session.userID, producto_id);
            res.redirect(redirectUrl);
        } catch (err) {
            console.error(err);
            res.status(500).send("Error agregando producto");
        }
    },

    cambiarCantidad: async (req, res) => {
        const { id, cantidad } = req.body;

        try {
            await Carrito.cambiarCantidad(id, cantidad);
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: true });
        }
    },

    eliminar: async (req, res) => {
        try {
            await Carrito.eliminarProducto(req.params.id);
            res.redirect("/carrito");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error eliminando");
        }
    },

    comprar: async (req, res) => {
        const usuario_id = req.session.userID;

        if (!usuario_id) return res.redirect("/auth/login");

        try {
            const items = await Carrito.obtenerCarrito(usuario_id);

            if (items.length === 0) return res.redirect("/carrito");

            const total = items.reduce((s, p) => s + (p.precio * p.cantidad), 0);

            // Crear compra
            const compra_id = await Compras.crearCompra(usuario_id, total);

            // Guardar detalle
            for (const item of items) {
                const subtotal = item.precio * item.cantidad;
                await Compras.agregarDetalle(compra_id, item.producto_id, item.cantidad, subtotal);
            }

            // Vaciar carrito
            await Carrito.vaciarCarrito(usuario_id);

            res.redirect(`/historial/ticket/${compra_id}`);

        } catch (err) {
            console.error(err);
            res.status(500).send("Error procesando compra");
        }
    }
};

module.exports = carritoController;
