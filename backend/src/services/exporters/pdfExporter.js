const PDFDocument = require('pdfkit');

function buildPDFStream(res, titulo, usuario, generarCuerpo) {
  const doc = new PDFDocument({ margin: 50 });
  const nombreArchivo = `reporte_${Date.now()}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
  doc.pipe(res);

  doc.fontSize(20).text('Sistema Gestor Ganadero', { align: 'center' });
  doc.fontSize(16).text(titulo, { align: 'center' });
  doc.fontSize(12).text(`Generado: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.text(`Usuario: ${usuario?.nombre || 'N/A'}`, { align: 'center' });
  doc.moveDown();

  generarCuerpo(doc);

  doc.end();
}

module.exports = {
  buildPDFStream,
};
