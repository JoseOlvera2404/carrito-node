const Usuarios = require("../models/usuariosModel");

const authController = {

    mostrarLogin: (req, res) => res.render("login"),

    mostrarRegistro: (req, res) => res.render("register"),

    registrar: async (req, res) => {
        const { nombre, email, password } = req.body;

        try {
            await Usuarios.registrar(nombre, email, password);
            res.redirect("/auth/login");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error registrando usuario");
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const usuario = await Usuarios.login(email, password);

            if (!usuario) {
                return res.render("login", { error: "Correo o contraseña incorrectos" });
            }

            req.session.user = usuario;
            req.session.userID = usuario.id;

            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error en login");
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    }
};

module.exports = authController;
