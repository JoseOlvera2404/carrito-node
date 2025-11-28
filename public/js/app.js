console.log("Front-end JS cargado...");

/* Confirmar antes de eliminar del carrito */
document.addEventListener("click", function (e) {
    if (e.target.matches(".btn-remove")) {
        if (!confirm("¿Quieres eliminar este producto del carrito?")) {
            e.preventDefault();
        }
    }
});

/* Validación básica de formularios */
const forms = document.querySelectorAll("form");

forms.forEach(f => {
    f.addEventListener("submit", (e) => {
        const inputs = f.querySelectorAll("input[required]");
        for (let i of inputs) {
            if (i.value.trim() === "") {
                alert("Por favor completa todos los campos.");
                i.focus();
                e.preventDefault();
                return;
            }
        }
    });
});
