const api = require('./api');

async function obtenerConfiguracion() {
  return api.get('/configuracion');
}

async function actualizarConfiguracion(datos) {
  return api.put('/configuracion', datos);
}

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
};
