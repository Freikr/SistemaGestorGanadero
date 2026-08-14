const api = require('./api');

async function listarUsuarios() {
  return api.get('/usuarios');
}

async function obtenerUsuario(id) {
  return api.get(`/usuarios/${id}`);
}

async function crearUsuario(datos) {
  return api.post('/usuarios', datos);
}

async function actualizarUsuario(id, datos) {
  return api.put(`/usuarios/${id}`, datos);
}

async function eliminarUsuario(id) {
  return api.delete(`/usuarios/${id}`);
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
