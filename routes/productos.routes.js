const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");

// Página principal
router.get("/", productosController.inicio);

// Página de todos los productos
router.get("/productos", productosController.listar);

module.exports = router;
