const api = require('./api');

async function listarVentas() {
  return api.get('/ventas');
}

async function obtenerVenta(id) {
  return api.get(`/ventas/${id}`);
}

async function crearVenta(datosVenta) {
  return api.post('/ventas', datosVenta);
}

async function actualizarVenta(id, datos) {
  return api.put(`/ventas/${id}`, datos);
}

async function cancelarVenta(id) {
  return api.delete(`/ventas/${id}`);
}

module.exports = {
  listarVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  cancelarVenta,
};
