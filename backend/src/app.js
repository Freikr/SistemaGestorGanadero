const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (req, res) => {
    res.json({ success: true, mensaje: 'API funcionando correctamente' });
  });

  const rutasUsuario = require('./routes/usuarios.routes');
  const rutasAuth = require('./routes/auth.routes');
  const rutasVentas = require('./routes/ventas.routes');
  const rutasInventario = require('./routes/inventario.routes');
  const rutasReportes = require('./routes/reportes.routes');
  const rutasNotificaciones = require('./routes/notificaciones.routes');
  const rutasConfiguracion = require('./routes/configuracion.routes');

  app.use('/api/auth', rutasAuth);
  app.use('/api/usuarios', rutasUsuario);
  app.use('/api/ventas', rutasVentas);
  app.use('/api/inventario', rutasInventario);
  app.use('/api/reportes', rutasReportes);
  app.use('/api/notificaciones', rutasNotificaciones);
  app.use('/api/configuracion', rutasConfiguracion);

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
