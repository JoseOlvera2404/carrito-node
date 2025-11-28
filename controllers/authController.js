const Usuarios = require("../models/usuariosModel");

const authController = {
    mostrarLogin: (req, res) => {
        res.render("login");
    },

    mostrarRegistro: (req, res) => {
        res.render("register");
    },

    registrar: (req, res) => {
        const { nombre, email, password } = req.body;

        Usuarios.registrar(nombre, email, password, (err) => {
            if (err) throw err;
            res.redirect("/auth/login");
        });
    },

    login: (req, res) => {
        const { email, password } = req.body;

        Usuarios.login(email, password, (err, usuario) => {
            if (err) throw err;

            if (usuario.length > 0) {
                req.session.user = usuario[0];
                req.session.userID = usuario[0].id;
                res.redirect("/");
            } else {
                res.render("login", { error: "Correo o contraseña incorrectos" });
            }
        });
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/");
    }
};

module.exports = authController;
