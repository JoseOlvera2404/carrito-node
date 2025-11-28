const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

// Ver carrito
router.get("/", carritoController.verCarrito);

// Agregar producto
router.post("/agregar", carritoController.agregar);

// Cambiar cantidad (AJAX)
router.post("/cambiar-cantidad", carritoController.cambiarCantidad);

// Eliminar producto
router.get("/eliminar/:id", carritoController.eliminar);

// Confirmar compra
router.post("/comprar", carritoController.comprar);

module.exports = router;
