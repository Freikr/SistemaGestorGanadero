const api = require('./api');
const reportes = require('./reportes');
const auth = require('./auth');

async function cargarDashboard() {
  try {
    const response = await reportes.obtenerDashboard();
    const data = response.data;

    if (typeof actualizarEstadisticas === 'function') {
      actualizarEstadisticas(data);
    }

    return data;
  } catch (error) {
    console.error('Error al cargar dashboard:', error);
    if (typeof mostrarError === 'function') {
      mostrarError('No se pudo cargar el dashboard');
    }
  }
}

async function cargarNotificaciones() {
  try {
    const response = await require('./notificaciones').contarNoLeidas();
    const cantidad = response.data.cantidad;

    if (typeof actualizarContadorNotificaciones === 'function') {
      actualizarContadorNotificaciones(cantidad);
    }

    return cantidad;
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
  }
}

async function inicializar() {
  const token = auth.obtenerToken();

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    await auth.obtenerUsuarioActual();
    await cargarDashboard();
    await cargarNotificaciones();
  } catch (error) {
    auth.removeToken();
    window.location.href = 'login.html';
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', inicializar);
}

module.exports = {
  cargarDashboard,
  cargarNotificaciones,
  inicializar,
};
