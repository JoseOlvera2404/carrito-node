const Carrito = require("../models/carritoModel");
const Compras = require("../models/comprasModel");

const carritoController = {
    verCarrito: async (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

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
    },

    agregar: async (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        const producto_id = req.body.id;
        const redirectUrl = req.get("referer") || "/";

        await Carrito.agregarProducto(req.session.userID, producto_id);
        res.redirect(redirectUrl);
    },

    cambiarCantidad: async (req, res) => {
        const { id, cantidad } = req.body;
        await Carrito.cambiarCantidad(id, cantidad);
        res.json({ success: true });
    },

    eliminar: async (req, res) => {
        const { id } = req.params;
        await Carrito.eliminarProducto(id);
        res.redirect("/carrito");
    },

    comprar: async (req, res) => {
        const usuario_id = req.session.userID;
        if (!usuario_id) return res.redirect("/auth/login");

        const items = await Carrito.obtenerCarrito(usuario_id);
        if (items.length === 0) return res.redirect("/carrito");

        const total = items.reduce((s, p) => s + (p.precio * p.cantidad), 0);

        const compra_id = await Compras.crearCompra(usuario_id, total);

        for (let item of items) {
            const subtotal = item.precio * item.cantidad;
            await Compras.agregarDetalle(compra_id, item.producto_id, item.cantidad, subtotal);
        }

        await Carrito.vaciarCarrito(usuario_id);

        res.redirect(`/historial/ticket/${compra_id}`);
    }
};

module.exports = carritoController;
