const api = require('./api');

async function listarInventario() {
  return api.get('/inventario');
}

async function obtenerProducto(id) {
  return api.get(`/inventario/${id}`);
}

async function crearProducto(datos) {
  return api.post('/inventario', datos);
}

async function actualizarProducto(id, datos) {
  return api.put(`/inventario/${id}`, datos);
}

async function registrarMovimiento(datosMovimiento) {
  return api.post('/inventario/movimiento', datosMovimiento);
}

async function eliminarProducto(id) {
  return api.delete(`/inventario/${id}`);
}

module.exports = {
  listarInventario,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  registrarMovimiento,
  eliminarProducto,
};
