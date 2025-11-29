const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

// Middleware para formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -------------------------------
// SESIONES (corregido)
// -------------------------------
const isProd = process.env.NODE_ENV === "production";

app.use(session({
    secret: process.env.SESSION_SECRET || "carrito123",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProd,
        maxAge: 1000 * 60 * 60 * 24
    },
    store: isProd ? undefined : new session.MemoryStore()
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
app.use("/", require("./routes/productos.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/carrito", require("./routes/carrito.routes"));
app.use("/historial", require("./routes/historial.routes"));

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
