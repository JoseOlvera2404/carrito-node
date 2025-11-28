const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

// Middleware para formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || "carrito123",
    resave: false,
    saveUninitialized: false
}));

// Middleware GLOBAL para acceso a usuario en TODAS las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas con prefijos claros
app.use("/", require("./routes/productos.routes"));      // Página principal y /productos
app.use("/auth", require("./routes/auth.routes"));        // login, register, logout
app.use("/carrito", require("./routes/carrito.routes"));  // añadir, ver, comprar
app.use("/historial", require("./routes/historial.routes")); // historial y tickets

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
