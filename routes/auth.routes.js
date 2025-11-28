const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Mostrar formularios
router.get("/login", authController.mostrarLogin);
router.get("/register", authController.mostrarRegistro);

// Procesar formularios
router.post("/login", authController.login);
router.post("/register", authController.registrar);

// Cerrar sesión
router.get("/logout", authController.logout);

module.exports = router;
