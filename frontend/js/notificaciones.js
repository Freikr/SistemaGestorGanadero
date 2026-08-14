const api = require('./api');

async function listarNotificaciones(leida = null) {
  const params = leida !== null ? `?leida=${leida}` : '';
  return api.get(`/notificaciones${params}`);
}

async function marcarComoLeida(id) {
  return api.patch(`/notificaciones/${id}/leida`);
}

async function marcarTodasComoLeidas() {
  return api.patch('/notificaciones/marcar-todas');
}

async function contarNoLeidas() {
  return api.get('/notificaciones/no-leidas/cantidad');
}

module.exports = {
  listarNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  contarNoLeidas,
};
