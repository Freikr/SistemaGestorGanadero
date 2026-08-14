const { Sequelize } = require('sequelize');
const { sequelize } = require('../../config/database');
const { Venta, DetalleVenta, Animal, Inventario, MovimientoInventario, Auditoria, Notificacion } = require('../models');

async function listarVentas(fincaId) {
  return await Venta.findAll({
    where: { finca_id: fincaId },
    include: [
      { model: DetalleVenta, as: 'detalles', include: [{ model: Animal, as: 'animal' }] },
    ],
    order: [['fecha', 'DESC']],
  });
}

async function obtenerVenta(id) {
  const venta = await Venta.findByPk(id, {
    include: [
      { model: DetalleVenta, as: 'detalles', include: [{ model: Animal, as: 'animal' }] },
    ],
  });

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  return venta;
}

async function crearVenta(datosVenta, usuarioId, ip) {
  const transaction = await sequelize.transaction();

  try {
    const venta = await Venta.create(
      {
        ...datosVenta,
        usuario_id: usuarioId,
      },
      { transaction }
    );

    for (const detalle of datosVenta.detalles) {
      await DetalleVenta.create(
        {
          venta_id: venta.id,
          animal_id: detalle.animal_id,
          cantidad: detalle.cantidad || 1,
          peso: detalle.peso,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
        },
        { transaction }
      );

      await Animal.update(
        { estado: 'VENDIDO' },
        { where: { id: detalle.animal_id }, transaction }
      );
    }

    await Auditoria.create(
      {
        usuario_id: usuarioId,
        accion: 'CREACION',
        entidad: 'Venta',
        entidad_id: venta.id,
        datos_nuevos: venta.toJSON(),
        ip,
      },
      { transaction }
    );

    await transaction.commit();

    return await obtenerVenta(venta.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function actualizarVenta(id, datos, usuarioId, ip) {
  const venta = await Venta.findByPk(id);

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  const datosAnteriores = venta.toJSON();

  await venta.update(datos);

  await Auditoria.create({
    usuario_id: usuarioId,
    accion: 'MODIFICACION',
    entidad: 'Venta',
    entidad_id: id,
    datos_anteriores: datosAnteriores,
    datos_nuevos: venta.toJSON(),
    ip,
  });

  return await obtenerVenta(id);
}

async function eliminarVenta(id, usuarioId, ip) {
  const venta = await Venta.findByPk(id);

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  const datosAnteriores = venta.toJSON();

  await venta.update({ estado: 'CANCELADA' });

  await Auditoria.create({
    usuario_id: usuarioId,
    accion: 'CAMBIO_ESTADO',
    entidad: 'Venta',
    entidad_id: id,
    datos_anteriores: datosAnteriores,
    datos_nuevos: venta.toJSON(),
    ip,
  });

  return true;
}

module.exports = {
  listarVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
};
