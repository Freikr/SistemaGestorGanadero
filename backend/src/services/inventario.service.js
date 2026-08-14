const { sequelize } = require('../../config/database');
const { Inventario, MovimientoInventario, Auditoria, Notificacion } = require('../models');

async function listarInventario(fincaId) {
  return await Inventario.findAll({
    where: { finca_id: fincaId },
    include: [{ model: MovimientoInventario, as: 'movimientos', limit: 5, order: [['fecha', 'DESC']] }],
    order: [['nombre', 'ASC']],
  });
}

async function obtenerInventario(id) {
  const producto = await Inventario.findByPk(id, {
    include: [{ model: MovimientoInventario, as: 'movimientos', order: [['fecha', 'DESC']] }],
  });

  if (!producto) {
    throw new Error('Producto de inventario no encontrado');
  }

  return producto;
}

async function crearProducto(datos, usuarioId, ip) {
  const producto = await Inventario.create(datos);

  await MovimientoInventario.create({
    producto_id: producto.id,
    tipo: 'ENTRADA',
    cantidad: producto.cantidad_actual,
    motivo: 'Creación inicial del producto',
    usuario_id: usuarioId,
  }, { transaction: null });

  await Auditoria.create({
    usuario_id: usuarioId,
    accion: 'CREACION',
    entidad: 'Inventario',
    entidad_id: producto.id,
    datos_nuevos: producto.toJSON(),
    ip,
  });

  return producto;
}

async function actualizarProducto(id, datos, usuarioId, ip) {
  const producto = await Inventario.findByPk(id);

  if (!producto) {
    throw new Error('Producto de inventario no encontrado');
  }

  const datosAnteriores = producto.toJSON();

  await producto.update(datos);

  await Auditoria.create({
    usuario_id: usuarioId,
    accion: 'MODIFICACION',
    entidad: 'Inventario',
    entidad_id: id,
    datos_anteriores: datosAnteriores,
    datos_nuevos: producto.toJSON(),
    ip,
  });

  return producto;
}

async function registrarMovimiento(productoId, tipo, cantidad, motivo, usuarioId, ip) {
  const producto = await Inventario.findByPk(productoId);

  if (!producto) {
    throw new Error('Producto de inventario no encontrado');
  }

  const transaction = await sequelize.transaction();

  try {
    let nuevaCantidad = parseFloat(producto.cantidad_actual);

    if (tipo === 'ENTRADA' || tipo === 'AJUSTE') {
      nuevaCantidad += parseFloat(cantidad);
    } else if (tipo === 'SALIDA' || tipo === 'CONSUMO' || tipo === 'VENCIMIENTO') {
      nuevaCantidad -= parseFloat(cantidad);
    }

    if (nuevaCantidad < 0) {
      throw new Error('Stock insuficiente para realizar esta operación');
    }

    await MovimientoInventario.create(
      {
        producto_id: productoId,
        tipo,
        cantidad,
        motivo,
        usuario_id: usuarioId,
      },
      { transaction }
    );

    await producto.update({ cantidad_actual: nuevaCantidad }, { transaction });

    if (producto.stock_minimo && nuevaCantidad <= producto.stock_minimo) {
      await Notificacion.create({
        usuario_id: usuarioId,
        tipo: 'STOCK_BAJO',
        titulo: 'Stock bajo',
        mensaje: `El producto ${producto.nombre} tiene stock bajo (${nuevaCantidad} ${producto.unidad_medida})`,
        referencia_tipo: 'Inventario',
        referencia_id: producto.id,
      });
    }

    await Auditoria.create(
      {
        usuario_id: usuarioId,
        accion: 'MODIFICACION',
        entidad: 'MovimientoInventario',
        entidad_id: producto.id,
        datos_nuevos: { producto_id: productoId, tipo, cantidad, cantidad_actual: nuevaCantidad },
        ip,
      },
      { transaction }
    );

    await transaction.commit();

    return await obtenerInventario(productoId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function eliminarProducto(id, usuarioId, ip) {
  const producto = await Inventario.findByPk(id);

  if (!producto) {
    throw new Error('Producto de inventario no encontrado');
  }

  const datosAnteriores = producto.toJSON();

  await producto.update({ estado: 'INACTIVO' });

  await Auditoria.create({
    usuario_id: usuarioId,
    accion: 'CAMBIO_ESTADO',
    entidad: 'Inventario',
    entidad_id: id,
    datos_anteriores: datosAnteriores,
    datos_nuevos: producto.toJSON(),
    ip,
  });

  return true;
}

module.exports = {
  listarInventario,
  obtenerInventario,
  crearProducto,
  actualizarProducto,
  registrarMovimiento,
  eliminarProducto,
};
