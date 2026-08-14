const api = require('./api');

async function listarPesajes(animalId) {
  const params = animalId ? `?animal_id=${animalId}` : '';
  return api.get(`/pesajes${params}`);
}

async function crearPesaje(datos) {
  return api.post('/pesajes', datos);
}

module.exports = {
  listarPesajes,
  crearPesaje,
};
