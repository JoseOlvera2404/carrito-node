const express = require("express");
const router = express.Router();
const historialController = require("../controllers/historialController");

// Historial del usuario
router.get("/", historialController.verHistorial);

// Ver ticket de una compra específica
router.get("/ticket/:id", historialController.verTicket);

module.exports = router;
