const api = require('./api');

async function listarAnimales() {
  return api.get('/animales');
}

async function obtenerAnimal(id) {
  return api.get(`/animales/${id}`);
}

async function crearAnimal(datos) {
  return api.post('/animales', datos);
}

async function actualizarAnimal(id, datos) {
  return api.put(`/animales/${id}`, datos);
}

module.exports = {
  listarAnimales,
  obtenerAnimal,
  crearAnimal,
  actualizarAnimal,
};
