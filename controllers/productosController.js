const Productos = require("../models/productosModel");

const productosController = {

    inicio: async (req, res) => {
        try {
            const productos = await Productos.obtenerTodos();
            res.render("index", {
                usuario: req.session.user,
                productos
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error cargando productos");
        }
    },

    listar: async (req, res) => {
        try {
            const productos = await Productos.obtenerTodos();
            res.render("productos", {
                usuario: req.session.user,
                productos
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error listando productos");
        }
    }
};

module.exports = productosController;
