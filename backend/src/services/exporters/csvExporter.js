function buildCSVStream(res, titulo, generarCuerpo) {
  const nombreArchivo = `reporte_${Date.now()}.csv`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

  const csv = generarCuerpo();
  res.send(csv);
}

module.exports = {
  buildCSVStream,
};
