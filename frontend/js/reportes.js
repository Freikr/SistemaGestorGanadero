const api = require('./api');

async function obtenerDashboard() {
  return api.get('/reportes/dashboard');
}

async function reporteAnimales() {
  return api.get('/reportes/animales');
}

async function reporteVentas(fechaInicio, fechaFin) {
  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);
  return api.get(`/reportes/ventas?${params.toString()}`);
}

async function reporteInventario() {
  return api.get('/reportes/inventario');
}

module.exports = {
  obtenerDashboard,
  reporteAnimales,
  reporteVentas,
  reporteInventario,
};
