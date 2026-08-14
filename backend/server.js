require('dotenv').config();
const config = require('./src/config/config');
const { testConnection } = require('./src/config/database');
const createApp = require('./src/app');

async function startServer() {
  await testConnection();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`Servidor corriendo en puerto ${config.port}`);
    console.log(`Ambiente: ${config.nodeEnv}`);
  });

  return server;
}

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
