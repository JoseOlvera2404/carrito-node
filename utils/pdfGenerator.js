const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Genera un PDF con los datos de la compra
 * @param {Object} compra  Objeto con info de la compra
 * @param {Array} productos Lista de productos en la compra
 * @returns {string} ruta del PDF generado
 */
function generarTicketPDF(compra, productos) {

    // Carpeta donde se guardarán los tickets
    const dir = path.join(__dirname, "../public/tickets");

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `ticket_${compra.id}.pdf`);
    const doc = new PDFDocument({ margin: 40 });

    // Guardar el PDF
    doc.pipe(fs.createWriteStream(filePath));

    // ENCABEZADO
    doc
        .fontSize(22)
        .text("TICKET DE COMPRA", { align: "center" })
        .moveDown(1);

    doc
        .fontSize(12)
        .text(`Fecha: ${compra.fecha}`)
        .text(`Usuario: ${compra.usuario}`)
        .moveDown(1);

    // SECCIÓN DE PRODUCTOS
    doc.fontSize(15).text("Productos:", { underline: true });
    doc.moveDown(0.5);

    productos.forEach(p => {
        doc.fontSize(12).text(
            `${p.nombre}  x${p.cantidad}  -  $${p.precio}  =  $${p.cantidad * p.precio}`
        );
    });

    doc.moveDown(1);

    // TOTAL
    doc.fontSize(16).text(`Total: $${compra.total}`, { align: "right" });

    doc.end();

    return filePath;
}

module.exports = generarTicketPDF;
