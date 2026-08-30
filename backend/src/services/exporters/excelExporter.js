const ExcelJS = require('exceljs');

async function buildExcelStream(res, titulo, generarCuerpo) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(titulo);

  const nombreArchivo = `reporte_${Date.now()}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

  await generarCuerpo(worksheet);

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = {
  buildExcelStream,
};
