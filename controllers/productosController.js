const Productos = require("../models/productosModel");

const productosController = {
    // Página principal
    inicio: (req, res) => {
        Productos.obtenerTodos((err, productos) => {
            if (err) throw err;

            res.render("index", {
                usuario: req.session.user,
                productos
            });
        });
    },

    // Página de todos los productos
    listar: (req, res) => {
        Productos.obtenerTodos((err, productos) => {
            if (err) throw err;

            res.render("productos", {
                usuario: req.session.user,
                productos
            });
        });
    }
};

module.exports = productosController;
