const Usuarios = require("../models/usuariosModel");

const authController = {

    mostrarLogin: (req, res) => {
        res.render("login", { error: null });
    },

    mostrarRegistro: (req, res) => {
        res.render("register", { error: null });
    },

    registrar: async (req, res) => {
        try {
            const { nombre, email, password } = req.body;

            if (!nombre || !email || !password) {
                return res.render("register", { error: "Todos los campos son obligatorios" });
            }

            await Usuarios.registrar(nombre, email, password);

            res.redirect("/auth/login");

        } catch (err) {
            console.error("Error registrando usuario:", err);
            res.render("register", { error: "Error al registrar" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.render("login", { error: "Todos los campos son obligatorios" });
            }

            const usuario = await Usuarios.login(email, password);

            if (!usuario) {
                return res.render("login", { error: "Correo o contraseña incorrectos" });
            }

            // Guardar sesión
            req.session.user = usuario;
            req.session.userID = usuario.id;

            return res.redirect("/");

        } catch (err) {
            console.error("Error en login:", err);
            return res.render("login", { error: "Error al iniciar sesión" });
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    }
};

module.exports = authController;
