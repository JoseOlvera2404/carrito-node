const Carrito = require("../models/carritoModel");
const Compras = require("../models/comprasModel");

const carritoController = {
    verCarrito: (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        Carrito.obtenerCarrito(req.session.userID, (err, items) => {
            if (err) throw err;

            // Convertimos precios a números
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
        });
    },

    agregar: (req, res) => {
        if (!req.session.userID) return res.redirect("/auth/login");

        const producto_id = req.body.id;
        const redirectUrl = req.get("referer") || "/"; // obtiene la página anterior

        Carrito.agregarProducto(req.session.userID, producto_id, (err) => {
            if (err) throw err;
            res.redirect(redirectUrl);
        });
    },

    cambiarCantidad: (req, res) => {
        const { id, cantidad } = req.body;

        Carrito.cambiarCantidad(id, cantidad, (err) => {
            if (err) throw err;
            res.json({ success: true });
        });
    },

    eliminar: (req, res) => {
        const { id } = req.params;

        Carrito.eliminarProducto(id, (err) => {
            if (err) throw err;
            res.redirect("/carrito");
        });
    },

    comprar: (req, res) => {
        const usuario_id = req.session.userID;

        if (!usuario_id) return res.redirect("/auth/login");

        Carrito.obtenerCarrito(usuario_id, (err, items) => {
            if (err) throw err;

            if (items.length === 0)
                return res.redirect("/carrito");

            const total = items.reduce((s, p) => s + (p.precio * p.cantidad), 0);

            // Registrar compra
            Compras.crearCompra(usuario_id, total, (err, result) => {
                if (err) throw err;

                const compra_id = result.insertId;

                // Insertar detalle
                items.forEach(item => {
                    const subtotal = item.precio * item.cantidad;

                    Compras.agregarDetalle(
                        compra_id,
                        item.producto_id,
                        item.cantidad,
                        subtotal,
                        () => {}
                    );
                });

                // Vaciar carrito
                Carrito.vaciarCarrito(usuario_id, () => {
                    res.redirect(`/historial/ticket/${compra_id}`);
                });
            });
        });
    }
};

module.exports = carritoController;
