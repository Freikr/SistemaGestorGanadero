const { Configuracion } = require('../models');

async function obtenerConfiguracion(fincaId) {
  let configuracion = await Configuracion.findOne({ where: { finca_id: fincaId } });

  if (!configuracion) {
    configuracion = await Configuracion.create({ finca_id: fincaId });
  }

  return configuracion;
}

async function actualizarConfiguracion(fincaId, datos, usuarioId, ip) {
  let configuracion = await Configuracion.findOne({ where: { finca_id: fincaId } });

  if (!configuracion) {
    configuracion = await Configuracion.create({ finca_id: fincaId, ...datos });
  } else {
    const datosAnteriores = configuracion.toJSON();
    await configuracion.update(datos);

    const { Auditoria } = require('../models');
    await Auditoria.create({
      usuario_id: usuarioId,
      accion: 'MODIFICACION',
      entidad: 'Configuracion',
      entidad_id: configuracion.id,
      datos_anteriores: datosAnteriores,
      datos_nuevos: configuracion.toJSON(),
      ip,
    });
  }

  return configuracion;
}

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
};
