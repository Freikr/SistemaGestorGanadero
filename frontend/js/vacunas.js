const api = require('./api');

async function listarVacunas() {
  return api.get('/vacunas');
}

async function crearVacuna(datos) {
  return api.post('/vacunas', datos);
}

async function listarAplicaciones(animalId) {
  const params = animalId ? `?animal_id=${animalId}` : '';
  return api.get(`/vacunas/aplicaciones${params}`);
}

async function crearAplicacion(datos) {
  return api.post('/vacunas/aplicaciones', datos);
}

module.exports = {
  listarVacunas,
  crearVacuna,
  listarAplicaciones,
  crearAplicacion,
};
