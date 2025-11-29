const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const MySQLStore = require("express-mysql-session")(session);

const app = express();

// -----------------------------------------
// CONFIGURACIÓN BASE
// -----------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Detectar ambiente
const isProd = process.env.NODE_ENV === "production";

// -----------------------------------------
// SESIONES - FUNCIONANDO EN RAILWAY
// -----------------------------------------
let sessionStore = null;

if (isProd) {
    // Usar MySQL en Railway
    sessionStore = new MySQLStore({
        host: process.env.MYSQLHOST || process.env.DB_HOST,
        user: process.env.MYSQLUSER || process.env.DB_USER,
        password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
        database: process.env.MYSQLDATABASE || process.env.DB_NAME,
        port: process.env.MYSQLPORT || process.env.DB_PORT,
        clearExpired: true,
        checkExpirationInterval: 900000, // limpiar cada 15 min
        expiration: 86400000 // 24 horas
    });
}

app.use(session({
    secret: process.env.SESSION_SECRET || "carrito123",
    resave: false,
    saveUninitialized: false,
    store: isProd ? sessionStore : new session.MemoryStore(),
    cookie: {
        secure: false,   // Railway usa proxy HTTPS, Express ve HTTP → debe ser false
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// -----------------------------------------
// VARIABLE GLOBAL PARA TODAS LAS VISTAS
// -----------------------------------------
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// -----------------------------------------
// MOTOR DE VISTAS
// -----------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -----------------------------------------
// ARCHIVOS ESTÁTICOS
// -----------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------------------
// RUTAS
// -----------------------------------------
app.use("/", require("./routes/productos.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/carrito", require("./routes/carrito.routes"));
app.use("/historial", require("./routes/historial.routes"));

// -----------------------------------------
// ERROR 404
// -----------------------------------------
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

// -----------------------------------------
// INICIO DEL SERVIDOR
// -----------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
