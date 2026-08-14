const api = require('./api');

async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });

  if (response.data && response.data.token) {
    api.setToken(response.data.token);
  }

  return response;
}

async function register(datos) {
  const response = await api.post('/auth/register', datos);
  return response;
}

async function obtenerUsuarioActual() {
  const response = await api.get('/auth/me');
  return response;
}

async function logout() {
  const response = await api.post('/auth/logout');
  api.removeToken();
  return response;
}

function estaAutenticado() {
  return !!api.getToken();
}

function obtenerToken() {
  return api.getToken();
}

module.exports = {
  login,
  register,
  obtenerUsuarioActual,
  logout,
  estaAutenticado,
  obtenerToken,
};
